"use client";

import {useCallback, useEffect, useState} from "react";
import Terminal from "#root/Terminal";
import {roll, RollLogEntry} from "@dice-sh/engine";
import {useLocalStorage, useSessionStorage} from "usehooks-ts";
import usePromptHistory from "#root/usePromptHistory";

const prompt = "$ ";

export default function ChannelTerminal() {
    const [history, setHistory] = usePromptHistory();
    const [entries, setEntries] = useState<RollLogEntry[]>([]);

    // This lets us hydrate correctly despite our use of browser storage
    const [loading, setLoading] = useState(true);
    useEffect(function () {
        setLoading(false);
    }, []);

    const handleSubmit = useCallback(
        function (value: string) {
            setEntries(function (prev) {
                const entry = roll(value);
                if (entry.type === "clear") {
                    return [];
                } else if (entry.type === "join") {
                    throw new Error("Not implemented.");
                } else {
                    return [...prev, entry];
                }
            });
            setHistory(function (prev) {
                if (value.trim() !== "" && value !== prev[prev.length - 1]) {
                    return [...prev, value];
                }

                return prev;
            });
        },
        [setEntries, setHistory],
    );

    return (
        <Terminal
            prompt={prompt}
            onSubmit={handleSubmit}
            history={history}
            entries={loading ? [] : entries}
        />
    );
}
