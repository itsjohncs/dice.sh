"use client";

import {KeyboardEvent, useCallback, useRef, useState} from "react";

import useDocumentListener from "#root/utils/useDocumentListener";
import EditableArea from "../EditableArea";
import useHistory from "./useHistory";

interface Props {
    prompt: string;
    onSubmit: (value: string) => void;
    history: string[];
}

export default function Prompt(props: Props) {
    // The history contains our current prompt and past prompts. We can edit
    // any of the prompts, navigating through them with the arrow keys, and
    // then once we submit they're reset to their original values (and the
    // newly submitted prompt is added to it).
    const {currentInput, resetHistory, navigateHistory, updateHistory} =
        useHistory(props.history);

    const {onSubmit} = props;
    const handleKeyDown = function (event: KeyboardEvent<HTMLSpanElement>) {
        if (event.key === "Enter") {
            onSubmit(event.currentTarget.textContent ?? "");
            resetHistory();
            event.preventDefault();
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            navigateHistory(event.key === "ArrowUp" ? 1 : -1);
        }
    };

    const handleChange = useCallback(
        function (value: string) {
            updateHistory(value);
        },
        [updateHistory],
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
                value={currentInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
