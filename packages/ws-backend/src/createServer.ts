import winston from "winston";
import {z, ZodError} from "zod";
import {Server} from "socket.io";

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
    state: undefined | "Initialized";
    channelId: string | undefined;
    username: string | undefined;
    lastSeenLog: number | undefined;
}

export default function createServer(config: ServerConfiguration): Server {
    const server = new Server<
        ClientToServerEvents,
        Record<string, never>,
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
            } catch (e: unknown) {
                let kind: ErrorMessage["data"]["kind"];
                if (e instanceof ZodError) {
                    kind = "ValidationError";
                } else {
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
