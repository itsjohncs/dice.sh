import winston from "winston";
import {ZodError} from "zod";
import {Server as SocketIOServer} from "socket.io";
import {ErrorMessage, InitializationData, Server, Socket} from "./SocketTypes";
import {fetchLogEntriesAfter} from "./db";

export interface ServerConfiguration {
    logger: winston.Logger;
    listen: {
        port: number;
    };
}

async function fetchAndSendLogEntries_(socket: Socket): Promise<void> {
    const logEntries = await fetchLogEntriesAfter(
        socket.data.channelId,
        socket.data.lastSeenLog,
    );
    if (logEntries.length > 0) {
        socket.emit("append", logEntries);
    }
    socket.data.state = "Ready";
}

function fetchAndSendLogEntries(
    config: ServerConfiguration,
    socket: Socket,
): void {
    fetchAndSendLogEntries_(socket).catch(function (e: unknown) {
        config.logger.error("Unknown error fetching log entries", e);
    });
}

function wrap<Args extends unknown[], AckMessage>(
    config: ServerConfiguration,
    socket: Socket,
    handler: (
        ...args: [...Args, (data: ErrorMessage | AckMessage) => void]
    ) => void,
) {
    return function (
        ...args: [...Args, (data: ErrorMessage | AckMessage) => void]
    ) {
        const callback = args[args.length - 1] as (
            data: ErrorMessage | AckMessage,
        ) => void;
        try {
            handler(...args);
        } catch (e: unknown) {
            let kind: ErrorMessage["data"]["kind"];
            if (e instanceof ZodError) {
                config.logger.warn("Validation error", e.format());
                kind = "ValidationError";
            } else {
                config.logger.error("Unknown error", e);
                kind = "UnknownError";
            }
            callback({
                type: "Error",
                data: {kind},
            });
            socket.disconnect();
        }
    };
}

export default function createServer(config: ServerConfiguration): Server {
    const server = new SocketIOServer(config.listen.port) as Server;

    server.on("connection", function (socket) {
        socket.on(
            "initialize",
            wrap(config, socket, function (rawData, callback) {
                if (socket.data.state !== undefined) {
                    throw new Error("Invalid state");
                }

                const data = InitializationData.parse(rawData);
                socket.data.channelId = data.channelId;
                socket.data.lastSeenLog = data.lastSeenLog;
                socket.data.username = data.username;
                socket.data.state = "Initialized";

                callback({type: "Empty"});

                fetchAndSendLogEntries(config, socket);
            }),
        );
    });

    return server;
}
