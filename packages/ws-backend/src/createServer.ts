import winston from "winston";
import {ZodError} from "zod";
import {Server as SocketIOServer} from "socket.io";
import {Server, Socket} from "./ServerSocketTypes";
import {ErrorMessage, InitializationData} from "@dice-sh/engine";
import {appendLogEntry, fetchLogEntriesAfter} from "./db";

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
        socket.emit("history", logEntries);
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
    ) => Promise<void> | void,
) {
    return async function (
        ...args: [...Args, (data: ErrorMessage | AckMessage) => void]
    ) {
        const callback = args[args.length - 1] as (
            data: ErrorMessage | AckMessage,
        ) => void;
        try {
            if (typeof callback !== "function") {
                config.logger.error(
                    "emit called for event expecting emitWithAwk.",
                );
                socket.disconnect();
            } else {
                await handler(...args);
            }
        } catch (primaryError: unknown) {
            try {
                let kind: ErrorMessage["data"]["kind"];
                if (primaryError instanceof ZodError) {
                    config.logger.warn(
                        "Validation error",
                        primaryError.format(),
                    );
                    kind = "ValidationError";
                } else {
                    config.logger.error("Unknown error", primaryError);
                    kind = "UnknownError";
                }
                callback({
                    type: "Error",
                    data: {kind},
                });
            } catch (secondaryError: unknown) {
                config.logger.error(
                    "Got secondary error handling primary error",
                    primaryError,
                    secondaryError,
                );
            } finally {
                socket.disconnect();
            }
        }
    };
}

export default function createServer(config: ServerConfiguration): Server {
    const server = new SocketIOServer(config.listen.port, {
        cors: {
            origin: "http://localhost:16421",
        },
    }) as Server;

    server.on("connection", function (socket) {
        socket.on(
            "initialize",
            wrap(config, socket, function (rawData, callback) {
                if (socket.data.state !== undefined) {
                    throw new Error("Invalid state.");
                }

                const data = InitializationData.parse(rawData);
                socket.data.channelId = data.channelId;
                socket.data.lastSeenLog = data.lastSeenLog;
                socket.data.username = data.username;
                socket.data.state = "Initialized";

                socket.join(socket.data.channelId);

                callback({type: "Empty"});

                fetchAndSendLogEntries(config, socket);
            }),
        );

        socket.on(
            "append",
            wrap(config, socket, async function (rawData, callback) {
                if (socket.data.state !== "Ready") {
                    throw new Error("Invalid state.");
                }

                const lastSeenLog = await appendLogEntry(
                    socket.data.channelId,
                    rawData,
                );

                socket.to(socket.data.channelId).emit("append", rawData);

                callback({type: "Append", data: {lastSeenLog}});
            }),
        );
    });

    return server;
}
