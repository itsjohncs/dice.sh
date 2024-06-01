"use client";

import {ReactElement, useCallback, useState} from "react";
import Terminal from "./Terminal";
import roll, {RollLogEntry} from "./roll";
import RollResult from "./Terminal/RollResult";
import Help from "./Help";
import {useLocalStorage, useSessionStorage} from "usehooks-ts";

const prompt = "$ ";

export default function SmartTerminal() {
    const [history, setHistory] = useLocalStorage<string[]>(
        "prompt-history",
        [],
    );
    const [lines, setLines] = useSessionStorage<RollLogEntry[]>("roll-log", [
        {type: "simple-info", subType: "help"},
    ]);

    const getHistoricalInput = useCallback(
        function (offset: number): string | undefined {
            if (offset < history.length) {
                return history[history.length - offset - 1];
            }

            return undefined;
        },
        [history],
    );

    const handleSubmit = useCallback(
        function (value: string) {
            setLines(function (prev) {
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
        [setLines, setHistory],
    );

    const lineNodes: ReactElement[] = [];
    for (let idx = 0; idx < lines.length; ++idx) {
        const line = lines[idx];
        if (line.input !== undefined) {
            lineNodes.push(
                <div key={`${idx}-input`}>
                    {prompt}
                    {line.input}
                </div>,
            );
        }

        if (line.type === "roll") {
            lineNodes.push(
                <RollResult
                    key={idx}
                    rolls={line.result.rolls}
                    total={line.result.total}
                />,
            );
        } else if (line.type === "error") {
            lineNodes.push(<div key={idx}>{line.error}</div>);
        } else if (line.type === "simple-info" && line.subType === "help") {
            lineNodes.push(<Help key={idx} />);
        }
    }

    return (
        <Terminal
            prompt={prompt}
            onSubmit={handleSubmit}
            getHistoricalInput={getHistoricalInput}
        >
            {lineNodes}
        </Terminal>
    );
}
