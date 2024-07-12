import {beforeEach, test, jest} from "@jest/globals";
import {io, Socket as SocketIOClientSocket} from "socket.io-client";
import createServer from "./createServer";
import winston from "winston";
import assert from "node:assert/strict";
import {
    ClientToServerEvents,
    Server,
    ServerToClientEvents,
} from "./SocketTypes";
import * as db from "./db";

const {fetchLogEntriesAfter} = db as typeof import("./__mocks__/db");

jest.mock("./db");

type ClientSocket = SocketIOClientSocket<
    ServerToClientEvents,
    ClientToServerEvents
>;

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});

const testPort = 24869;
let server: Server;
beforeEach(function () {
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

test("validates data", async function () {
    const client = await connect();
    assert.deepEqual(
        await client.emitWithAck("initialize", {a: "hello world"} as unknown),
        {type: "Error", data: {kind: "ValidationError"}},
    );
});

test("accepts valid data", async function () {
    const client = await connect();
    assert.deepEqual(
        await client.emitWithAck("initialize", {
            channelId: "testchannel",
            clientVersion: "test-1",
            username: "testuser",
            lastSeenLog: undefined,
        }),
        {type: "Empty"},
    );
});

test("error if initialized twice", async function () {
    const client = await connect();
    assert.deepEqual(
        await client.emitWithAck("initialize", {
            channelId: "testchannel",
            clientVersion: "test-1",
            username: "testuser",
            lastSeenLog: undefined,
        }),
        {type: "Empty"},
    );

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

test("sends messages", async function () {
    const expectedLogEntries = [{a: 1}, {b: 2}];
    fetchLogEntriesAfter.mockResolvedValue(expectedLogEntries);

    const client = await connect();
    assert.deepEqual(
        await client.emitWithAck("initialize", {
            channelId: "testchannel",
            clientVersion: "test-1",
            username: "testuser",
            lastSeenLog: undefined,
        }),
        {type: "Empty"},
    );
    const actualLogEntries = await new Promise<unknown[]>(function (resolve) {
        client.once("append", function (logEntries) {
            resolve(logEntries);
        });
    });
    assert.deepEqual(actualLogEntries, expectedLogEntries);
});
