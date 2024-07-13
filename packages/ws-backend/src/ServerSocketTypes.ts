import {ClientToServerEvents, ServerToClientEvents} from "@dice-sh/engine";
import {Server as SocketIOServer, Socket as SocketIOSocket} from "socket.io";

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
