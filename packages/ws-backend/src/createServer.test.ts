import {test} from "@jest/globals";
import {io} from "socket.io-client";
import createServer from "./createServer";
import winston from "winston";
import assert from "node:assert/strict";

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});

test("validates data", async function () {
    const testPort = 24869;
    const server = createServer({
        logger,
        listen: {
            port: testPort,
        },
    });

    const client = io(`http://127.0.0.1:${testPort}`);
    await new Promise<void>(function (resolve) {
        client.once("connect", resolve);
    });
    assert.deepEqual(
        await client.emitWithAck("initialize", {a: "hello world"}),
        {type: "Error", data: {kind: "ValidationError"}},
    );
    client.close();
    server.close();
});
