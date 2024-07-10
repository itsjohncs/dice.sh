import winston from "winston";
import createServer from "./createServer.js";

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});

createServer({
    logger,
    listen: {
        port: 45856,
    },
});
