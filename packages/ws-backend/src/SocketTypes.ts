import {z} from "zod";
import {Server as SocketIOServer, Socket as SocketIOSocket} from "socket.io";

export type LogEntry = unknown;

export const InitializationData = z
    .object({
        username: z.string(),
        clientVersion: z.string(),
        lastSeenLog: z.number(),
        channelId: z.string(),
    })
    .required()
    .partial({lastSeenLog: true});
export type InitializationData = z.infer<typeof InitializationData>;

export interface ClientToServerEvents {
    initialize: (
        initializationData: InitializationData,
        callback: (data: EmptyAckMessage | ErrorMessage) => void,
    ) => void;
    append: (
        logEntry: LogEntry,
        callback: (data: AppendAck | ErrorMessage) => void,
    ) => void;
}

export interface ServerToClientEvents {
    history: (logEntries: LogEntry[]) => void;
    append: (logEntry: LogEntry) => void;
}

interface AckMessage {
    type: string;
    data?: unknown;
}

export interface EmptyAckMessage extends AckMessage {
    type: "Empty";
    data?: undefined;
}

export interface ErrorMessage extends AckMessage {
    type: "Error";
    data: {
        kind: "ValidationError" | "UnknownError";
    };
}

export interface AppendAck extends AckMessage {
    type: "Append";
    data: {
        lastSeenLog: number;
    };
}

interface SocketData {
    state: undefined | "Initialized" | "Ready";
    channelId: string | undefined;
    username: string | undefined;
    lastSeenLog: number | undefined;
}

export type Server = SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    Record<string, never>,
    SocketData
>;

export type Socket = SocketIOSocket<
    ClientToServerEvents,
    ServerToClientEvents,
    Record<string, never>,
    SocketData
>;
