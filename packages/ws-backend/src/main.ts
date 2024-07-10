import winston from "winston";
import createServer from "./createServer.js";

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});

createServer({
    logger,
    listen: {
        host: "127.0.0.1",
        port: 45856,
    },
});
