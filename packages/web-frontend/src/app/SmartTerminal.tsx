"use client";

import {ReactElement, useCallback, useState} from "react";
import Terminal from "./Terminal";
import {roll, RollLogEntry} from "@dice-sh/engine";
import RollResult from "./Terminal/Contents/RollResult";
import Help from "./Terminal/Contents/Help";
import {useLocalStorage, useSessionStorage} from "usehooks-ts";
import Contents from "./Terminal/Contents";

const prompt = "$ ";

export default function SmartTerminal() {
    const [history, setHistory] = useLocalStorage<string[]>(
        "prompt-history",
        [],
    );
    const [entries, setEntries] = useSessionStorage<RollLogEntry[]>(
        "roll-log",
        [{type: "simple-info", subType: "help"}],
    );

    const handleSubmit = useCallback(
        function (value: string) {
            setEntries(function (prev) {
                const entry = roll(value);
                if (entry.type === "clear") {
                    return [];
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
            entries={entries}
        />
    );
}
