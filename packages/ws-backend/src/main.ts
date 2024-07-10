import {WebSocketServer} from "ws";
import winston from "winston";
import {z} from "zod";

const BaseRequest = z
    .object({
        type: z.string(),
        data: z.unknown(),
    })
    .strict();

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});

function getChannelIdFromPath(pathname: string): string | undefined {
    const pathRe = /^\/channel\/([A-Za-z0-9-]+)$/.exec(pathname);
    if (pathRe) {
        return pathRe[1];
    }

    return undefined;
}

const wss = new WebSocketServer({port: 45856});

wss.on("connection", function connection(ws) {
    const {pathname} = new URL(ws.url, "wss://ws.dice.sh");
    const channelId = getChannelIdFromPath(pathname);

    ws.on("error", logger.error);

    ws.on("message", function message(data) {
        const request = BaseRequest.parse(data);
        logger.info("Got request", request);
    });

    ws.send(`Joined ${channelId}`);
    logger.info("Joined", channelId);
});
