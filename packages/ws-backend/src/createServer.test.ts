import {beforeEach, test, jest} from "@jest/globals";
import {io, Socket as SocketIOClientSocket} from "socket.io-client";
import winston from "winston";
import assert from "node:assert/strict";
import {Server} from "./ServerSocketTypes";
import {
    type ClientToServerEvents,
    type InitializationData,
    type LogEntry,
    type ServerToClientEvents,
} from "@dice-sh/engine";

const actualDb = await import("./db");
const mockedDb = {
    appendLogEntry: jest.fn<typeof actualDb.appendLogEntry>(),
    fetchLogEntriesAfter: jest.fn<typeof actualDb.fetchLogEntriesAfter>(),
};
jest.unstable_mockModule("./db", async function () {
    return mockedDb;
});
const {appendLogEntry, fetchLogEntriesAfter} = mockedDb;

type ClientSocket = SocketIOClientSocket<
    ServerToClientEvents,
    ClientToServerEvents
>;

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [new winston.transports.Console({silent: true})],
});

const testPort = 24869;
let server: Server;
beforeEach(async function () {
    const {default: createServer} = await import("./createServer");
    jest.resetAllMocks();
    server = createServer({
        logger,
        listen: {
            port: testPort,
        },
    });
});

const clients: ClientSocket[] = [];
afterEach(function () {
    for (const client of clients) {
        client.close();
    }

    server.close();
});

function connect(): Promise<ClientSocket> {
    const client = io(`http://127.0.0.1:${testPort}`);
    clients.push(client);
    return new Promise(function (resolve) {
        client.once("connect", () => resolve(client));
    });
}

async function initialize(
    socket: ClientSocket,
    initializationData?: Partial<InitializationData>,
): Promise<void> {
    assert.deepEqual(
        await socket.emitWithAck("initialize", {
            channelId: "testchannel",
            clientVersion: "test-1",
            username: "testuser",
            lastSeenLog: undefined,
            ...initializationData,
        }),
        {type: "Empty"},
    );
}

test("validates data", async function () {
    const client = await connect();
    assert.deepEqual(
        await client.emitWithAck("initialize", {a: "hello world"} as unknown),
        {type: "Error", data: {kind: "ValidationError"}},
    );
});

test("accepts valid data", async function () {
    const client = await connect();
    await initialize(client);
});

test("error if initialized twice", async function () {
    const client = await connect();
    await initialize(client);

    assert.deepEqual(
        await client.emitWithAck("initialize", {
            channelId: "testchannel",
            clientVersion: "test-1",
            username: "testuser",
            lastSeenLog: undefined,
        }),
        {type: "Error", data: {kind: "UnknownError"}},
    );
});

test("sends initial entries to client", async function () {
    const expectedLogEntries = [{a: 1}, {b: 2}];
    fetchLogEntriesAfter.mockResolvedValue(expectedLogEntries);

    const client = await connect();
    const actualLogEntriesPromise = new Promise<unknown[]>(function (resolve) {
        client.once("history", function (logEntries) {
            resolve(logEntries);
        });
    });
    const [_, actualLogEntries] = await Promise.all([
        initialize(client),
        actualLogEntriesPromise,
    ]);
    assert.deepEqual(actualLogEntries, expectedLogEntries);
});

test("accepts entries from client", async function () {
    fetchLogEntriesAfter.mockImplementation(actualDb.fetchLogEntriesAfter);
    appendLogEntry.mockImplementation(actualDb.appendLogEntry);

    const client = await connect();
    await initialize(client, {channelId: "accept-entries-from-client-test"});

    const expectedEntries = [{d: 3}, {z: 5}];
    assert.deepEqual(await client.emitWithAck("append", expectedEntries[0]), {
        type: "Empty",
    });
    assert.deepEqual(await client.emitWithAck("append", expectedEntries[1]), {
        type: "Empty",
    });
});

test("broadcasts entries to other clients", async function () {
    fetchLogEntriesAfter.mockImplementation(actualDb.fetchLogEntriesAfter);
    appendLogEntry.mockImplementation(actualDb.appendLogEntry);

    const channelId = "broadcast-between-clients-test";

    const clientA = await connect();
    await initialize(clientA, {channelId, username: "a"});

    const expectedEntries = [{d: 3}, {z: 5}];

    const clientB = await connect();
    await initialize(clientB, {channelId, username: "b"});

    const [clientAEntries, clientBEntries] = await Promise.all([
        new Promise(function (resolve) {
            const entries: LogEntry[] = [];
            clientA.on("append", function (logEntry) {
                entries.push(logEntry);
                if (entries.length >= expectedEntries.length) {
                    resolve(entries);
                }
            });
        }),
        new Promise(function (resolve) {
            const entries: LogEntry[] = [];
            clientB.on("append", function (logEntry) {
                entries.push(logEntry);
                if (entries.length >= expectedEntries.length) {
                    resolve(entries);
                }
            });
        }),
        clientA.emitWithAck("append", expectedEntries[0]),
        clientA.emitWithAck("append", expectedEntries[1]),
    ]);

    assert.deepEqual(clientBEntries, expectedEntries);
    assert.deepEqual(clientAEntries, expectedEntries);
});
