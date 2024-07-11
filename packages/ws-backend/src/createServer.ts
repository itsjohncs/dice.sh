import winston from "winston";
import {z, ZodError} from "zod";
import {Server, Socket} from "socket.io";
import {fetchLogEntriesAfter} from "./db";

export interface ServerConfiguration {
    logger: winston.Logger;
    listen: {
        port: number;
    };
}

const InitializationData = z
    .object({
        username: z.string(),
        clientVersion: z.string(),
        lastSeenLog: z.number(),
        channelId: z.string(),
    })
    .required()
    .partial({lastSeenLog: true});
type InitializationData = z.infer<typeof InitializationData>;

interface ClientToServerEvents {
    initialize: (
        initializationData: InitializationData,
        callback: (data: EmptyAckMessage | ErrorMessage) => void,
    ) => void;
}

interface ServerToClientEvents {
    append: (logEntries: unknown[]) => void;
}

interface AckMessage {
    type: string;
    data?: unknown;
}

interface EmptyAckMessage extends AckMessage {
    type: "Empty";
    data?: undefined;
}

interface ErrorMessage extends AckMessage {
    type: "Error";
    data: {
        kind: "ValidationError" | "UnknownError";
    };
}

interface SocketData {
    state: undefined | "Initialized" | "Ready";
    channelId: string | undefined;
    username: string | undefined;
    lastSeenLog: number | undefined;
}

async function fetchAndSendLogEntries_(
    socket: Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        Record<string, never>,
        SocketData
    >,
): Promise<void> {
    const logEntries = await fetchLogEntriesAfter(socket.data.lastSeenLog);
    if (logEntries.length > 0) {
        socket.emit("append", logEntries);
    }
    socket.data.state = "Ready";
}

function fetchAndSendLogEntries(
    config: ServerConfiguration,
    socket: Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        Record<string, never>,
        SocketData
    >,
): void {
    fetchAndSendLogEntries_(socket).catch(function (e: unknown) {
        config.logger.error("Unknown error fetching log entries", e);
    });
}

export default function createServer(config: ServerConfiguration): Server {
    const server = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        Record<string, never>,
        SocketData
    >(config.listen.port);

    server.on("connection", function (socket) {
        socket.on("initialize", function (rawData, callback) {
            try {
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
        });
    });

    return server;
}
