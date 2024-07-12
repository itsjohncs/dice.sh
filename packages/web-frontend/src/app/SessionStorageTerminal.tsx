"use client";

import {useCallback, useEffect, useState} from "react";
import Terminal from "#root/Terminal";
import {roll, RollLogEntry} from "@dice-sh/engine";
import {useLocalStorage, useSessionStorage} from "usehooks-ts";

const prompt = "$ ";

const defaultEntries: RollLogEntry[] = [{type: "simple-info", subType: "help"}];

/**
 * Smart component storing log entries in session storage.
 */
export default function SessionStorageTerminal() {
    const [history, setHistory] = useLocalStorage<string[]>(
        "prompt-history",
        [],
    );
    const [entries, setEntries] = useSessionStorage<RollLogEntry[]>(
        "roll-log",
        defaultEntries,
    );

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
            entries={loading ? defaultEntries : entries}
        />
    );
}
