"use client";

import {useCallback, useEffect, useReducer, useRef, useState} from "react";
import Terminal from "#root/Terminal";
import {roll, RollLogEntry, ClientSocket, LogEntry} from "@dice-sh/engine";
import {useLocalStorage, useSessionStorage} from "usehooks-ts";
import usePromptHistory from "#root/usePromptHistory";
import {io} from "socket.io-client";
import {useParams} from "next/navigation";

function useSocket(): ClientSocket {
    const ref = useRef<ClientSocket>();
    if (!ref.current) {
        ref.current = io("http://localhost:45856");
    }
    return ref.current;
}

function useChannelConnection(channelId: string) {
    const socket = useSocket();

    const [isConnected, setIsConnected] = useState(false);
    const [pastEntries, setPastEntries] = useState<LogEntry[]>([]);
    const [entries, setEntries] = useState<LogEntry[]>([]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);

            if (!socket.recovered) {
                socket.emitWithAck("initialize", {
                    channelId,
                    clientVersion: "test-1",
                    username: "testuser",
                    lastSeenLog: undefined,
                });
            }
        }

        function onDisconnect() {
            setIsConnected(true);
        }

        function onHistory(value: LogEntry[]) {
            setPastEntries(value);
        }

        function onAppend(value: LogEntry) {
            setEntries((previous) => [...previous, value]);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("history", onHistory);
        socket.on("append", onAppend);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("history", onHistory);
            socket.off("append", onAppend);
        };
    }, []);

    const append = useCallback(function (entry: LogEntry) {
        return socket.emitWithAck("append", entry);
    }, []);

    return {
        isConnected,
        append,
        entries: [...pastEntries, ...entries],
    };
}

interface ChannelTerminalProps {
    channelId: string;
}

export default function ChannelTerminal({channelId}: ChannelTerminalProps) {
    const [history, appendHistory] = usePromptHistory();
    const {isConnected, append, entries} = useChannelConnection(channelId);

    // This lets us hydrate correctly despite our use of browser storage
    const [loading, setLoading] = useState(true);
    useEffect(function () {
        setLoading(false);
    }, []);

    const handleSubmit = useCallback(
        function (value: string) {
            const entry = roll(value);
            if (entry.type === "clear") {
                throw new Error("Not implemented.");
            } else if (entry.type === "join") {
                throw new Error("Not implemented.");
            } else {
                append(entry);
            }
            appendHistory(value);
        },
        [append, appendHistory],
    );

    return (
        <Terminal
            prompt="$ "
            onSubmit={handleSubmit}
            history={history}
            entries={loading ? [] : (entries as RollLogEntry[])}
        />
    );
}
