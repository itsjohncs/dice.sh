import winston from "winston";
import {z} from "zod";
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
        lastSeenLog: z.number().optional(),
        channelId: z.string(),
    })
    .required();
type InitializationData = z.infer<typeof InitializationData>;

interface ClientToServerEvents {
    initialize: (
        initializationData: InitializationData,
        callback: (data: unknown) => void,
    ) => void;
}

interface SocketData {
    channelId: string;
    username: string;
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
                const data = InitializationData.parse(rawData);
                socket.data.channelId = data.channelId;
                socket.data.lastSeenLog = data.lastSeenLog;
                socket.data.username = data.username;

                callback({error: "no"});
            } catch {
                callback({error: "yes"});
            }
        });
    });

    return server;
}
