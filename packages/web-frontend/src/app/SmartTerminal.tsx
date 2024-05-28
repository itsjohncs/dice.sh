"use client";

import {ReactElement, useCallback, useState} from "react";
import Terminal from "./Terminal";
import roll, {RollLogEntry} from "./roll";
import RollResult from "./Terminal/RollResult";
import Help from "./Help";

const prompt = "$ ";

export default function SmartTerminal() {
    const [lines, setLines] = useState<RollLogEntry[]>([]);

    const getHistoricalInput = useCallback(
        function (offset: number): string | undefined {
            const nonEmptyLines = lines.filter((i) => i.input.trim() !== "");
            if (offset < nonEmptyLines.length) {
                return nonEmptyLines[nonEmptyLines.length - offset - 1].input;
            }

            return undefined;
        },
        [lines],
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
        },
        [setLines],
    );

    const lineNodes: ReactElement[] = [];
    for (let idx = 0; idx < lines.length; ++idx) {
        const line = lines[idx];
        lineNodes.push(
            <div key={`${idx}-input`}>
                {prompt}
                {line.input}
            </div>,
        );

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
