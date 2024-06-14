"use client";

import {KeyboardEvent, useCallback, useRef, useState} from "react";

import useDocumentListener from "@/utils/useDocumentListener";
import EditableArea from "./EditableArea";

const NewInput = Symbol("newInput");

interface Props {
    prompt: string;
    onSubmit: (value: string) => void;
    getHistoricalInput: (offset: number) => string | undefined;
}

export interface HistoryState {
    offset: typeof NewInput | number;
    [NewInput]: string;
    [index: number]: string | undefined;
}

/**
 * Increments/decrements the history offset.
 * 
 * `NewInput` is the bottom of the history (equivalent to `-1`).
 */
function addOffset(
    current: typeof NewInput | number,
    delta: 1 | -1,
): typeof NewInput | number {
    if (current === NewInput) {
        if (delta === 1) {
            return 0;
        } else {
            return NewInput;
        }
    } else if (current === 0 && delta === -1) {
        return NewInput;
    } else {
        return current + delta;
    }
}

export default function Prompt(props: Props) {
    // We keep a local copy of the history because we want to remember
    // modifications users make to the history until they submit a command. This
    // matches the behavior of bash.
    const [history, setHistory] = useState<HistoryState>({
        offset: NewInput,
        // The "new input" is the value we display if the user hasn't navigated
        // the history at all.
        [NewInput]: "",
    });

    const {onSubmit, getHistoricalInput} = props;
    const handleKeyDown = function (event: KeyboardEvent<HTMLSpanElement>) {
        if (event.key === "Enter") {
            onSubmit(event.currentTarget.textContent ?? "");
            setHistory({
                offset: NewInput,
                [NewInput]: "",
            });
            event.preventDefault();
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            const newHistoryOffset = addOffset(
                history.offset,
                event.key === "ArrowUp" ? 1 : -1,
            );
            if (newHistoryOffset !== history.offset) {
                let foundValue = history[newHistoryOffset];
                if (foundValue === undefined) {
                    foundValue = getHistoricalInput(newHistoryOffset as number);
                }

                if (foundValue !== undefined) {
                    setHistory(function (prev) {
                        return {
                            ...prev,
                            offset: newHistoryOffset,
                            [newHistoryOffset]: foundValue,
                        };
                    });
                    event.preventDefault();
                }
            }
        }
    };

    const handleChange = useCallback(
        function (value: string) {
            setHistory(function (prev) {
                return {
                    ...prev,
                    [prev.offset]: value,
                };
            });
        },
        [setHistory],
    );

    const editableAreaRef = useRef<HTMLSpanElement>(null);
    useDocumentListener("click", function (event) {
        editableAreaRef.current?.focus();
    });

    return (
        <div>
            {props.prompt}
            <EditableArea
                ref={editableAreaRef}
                value={history[history.offset] ?? ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
