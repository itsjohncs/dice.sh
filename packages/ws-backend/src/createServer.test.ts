import {beforeEach, test} from "@jest/globals";
import {io, Socket} from "socket.io-client";
import createServer from "./createServer";
import winston from "winston";
import assert from "node:assert/strict";
import {Server} from "socket.io";

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

const clients: Socket[] = [];
afterEach(function () {
    for (const client of clients) {
        client.close();
    }

    server.close();
});

function connect(): Promise<Socket> {
    const client = io(`http://127.0.0.1:${testPort}`);
    clients.push(client);
    return new Promise(function (resolve) {
        client.once("connect", () => resolve(client));
    });
}

test("validates data", async function () {
    const client = await connect();
    assert.deepEqual(
        await client.emitWithAck("initialize", {a: "hello world"}),
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
