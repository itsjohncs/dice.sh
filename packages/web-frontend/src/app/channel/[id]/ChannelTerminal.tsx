"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import Terminal from "#root/Terminal";
import {roll, RollLogEntry} from "@dice-sh/engine";
import {useLocalStorage, useSessionStorage} from "usehooks-ts";
import usePromptHistory from "#root/usePromptHistory";
import {io} from "socket.io-client";

function useSocket(): ReturnType<typeof io> {
    const ref = useRef<ReturnType<typeof io>>();
    if (!ref.current) {
        ref.current = io("http://localhost:45856");
    }
    return ref.current;
}

function useChannelConnection() {
    const socket = useSocket();

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [pastEntries, setPastEntries] = useState<unknown[]>([]);
    const [entries, setEntries] = useState<unknown[]>([]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onHistory(value: unknown[]) {
            setPastEntries(value);
        }

        function onAppend(value: unknown) {
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

    const append = useCallback(function (entry: unknown) {
        socket.emit("append", entry);
    }, []);

    return {
        isConnected,
        append,
        entries: [...pastEntries, ...entries],
    };
}

export default function ChannelTerminal() {
    const [history, appendHistory] = usePromptHistory();
    const {isConnected, append, entries} = useChannelConnection();

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
