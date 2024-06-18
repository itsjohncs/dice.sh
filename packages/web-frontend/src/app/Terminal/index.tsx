"use client";

import {ReactNode, useEffect} from "react";
import Prompt from "./Prompt";

import styles from "./index.module.css";
import {RollLogEntry} from "@dice-sh/engine";
import Contents from "./Contents";

interface Props {
    entries: RollLogEntry[];
    prompt: string;
    onSubmit: (value: string) => void;
    history: string[];
}

export default function Terminal(props: Props) {
    useEffect(
        function () {
            window.scrollTo(0, document.body.scrollHeight);
        },
        [props.entries],
    );

    return (
        <div className={styles.terminal}>
            <Contents
                className={styles.entries}
                entries={props.entries}
                prompt={props.prompt}
            />
            <Prompt
                className={styles.prompt}
                prompt={props.prompt}
                onSubmit={props.onSubmit}
                history={props.history}
            />
        </div>
    );
}
