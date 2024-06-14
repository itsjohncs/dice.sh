import {RollLogEntry} from "@dice-sh/engine";
import {ReactElement} from "react";
import RollResult from "./RollResult";
import Help from "./Help";

interface Props {
    prompt: string;
    entries: RollLogEntry[];
}

export default function Contents(props: Props) {
    const lineNodes: ReactElement[] = [];
    for (let idx = 0; idx < props.entries.length; ++idx) {
        const entry = props.entries[idx];
        if (entry.input !== undefined) {
            lineNodes.push(
                <div key={`${idx}-input`}>
                    {props.prompt}
                    {entry.input}
                </div>,
            );
        }

        if (entry.type === "roll") {
            lineNodes.push(
                <RollResult
                    key={idx}
                    rolls={entry.result.rolls}
                    total={entry.result.total}
                />,
            );
        } else if (entry.type === "error") {
            lineNodes.push(<div key={idx}>{entry.error}</div>);
        } else if (entry.type === "simple-info" && entry.subType === "help") {
            lineNodes.push(<Help key={idx} />);
        }
    }

    return lineNodes;
}
