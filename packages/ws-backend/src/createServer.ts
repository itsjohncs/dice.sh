import {WebSocketServer} from "ws";
import winston from "winston";
import {z} from "zod";

export interface ServerConfiguration {
    logger: winston.Logger;
    listen: {
        host: string;
        port: number;
    };
}

const BaseRequest = z
    .object({
        type: z.string(),
        data: z.unknown(),
    })
    .strict();

function getChannelIdFromPath(pathname: string): string | undefined {
    const pathRe = /^\/channel\/([A-Za-z0-9-]+)$/.exec(pathname);
    if (pathRe) {
        return pathRe[1];
    }

    return undefined;
}

export default function createServer(
    config: ServerConfiguration,
): WebSocketServer {
    const wss = new WebSocketServer({
        port: config.listen.port,
        host: config.listen.host,
    });

    wss.on("connection", function connection(ws) {
        const {pathname} = new URL(ws.url, "ws://ws.dice.sh");
        const channelId = getChannelIdFromPath(pathname);

        ws.on("error", config.logger.error);

        ws.on("message", function message(data) {
            const request = BaseRequest.parse(data);
            config.logger.info("Got request", request);
        });

        ws.send(`Joined ${channelId}`);
        config.logger.info("Joined", channelId);
    });

    return wss;
}
