import {z} from "zod";
import {type Socket as SocketIOClientSocket} from "socket.io-client";

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

export interface ClientToServerEvents {
    initialize: (
        initializationData: InitializationData,
        callback: (data: EmptyAckMessage | ErrorMessage) => void,
    ) => void;
    append: (
        logEntry: LogEntry,
        callback: (data: EmptyAckMessage | ErrorMessage) => void,
    ) => void;
}

export interface ServerToClientEvents {
    history: (logEntries: LogEntry[]) => void;
    append: (logEntry: LogEntry) => void;
}

export type ClientSocket = SocketIOClientSocket<
    ServerToClientEvents,
    ClientToServerEvents
>;
