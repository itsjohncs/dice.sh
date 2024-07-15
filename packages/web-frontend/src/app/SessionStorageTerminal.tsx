"use client";

import {useCallback, useEffect, useState} from "react";
import Terminal from "#root/Terminal";
import {roll, RollLogEntry} from "@dice-sh/engine";
import { useSessionStorage} from "usehooks-ts";
import usePromptHistory from "#root/usePromptHistory";

const prompt = "$ ";

const defaultEntries: RollLogEntry[] = [{type: "simple-info", subType: "help"}];

/**
 * Smart component storing log entries in session storage.
 */
export default function SessionStorageTerminal() {
    const [history, appendHistory] = usePromptHistory();
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
            appendHistory(value);
        },
        [setEntries, appendHistory],
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
