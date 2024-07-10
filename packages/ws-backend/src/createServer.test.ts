import {test} from "@jest/globals";
import {WebSocket} from "ws";
import createServer from "./createServer";
import winston from "winston";

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});

test("accepts a connection", async function () {
    const testPort = 24869;
    const server = createServer({
        logger,
        listen: {
            host: "127.0.0.1",
            port: testPort,
        },
    });

    const client = new WebSocket(`ws://127.0.0.1:${testPort}`);
    await new Promise((resolve) => {
        client.once("open", resolve);
    });
    client.close();
    server.close();
});
