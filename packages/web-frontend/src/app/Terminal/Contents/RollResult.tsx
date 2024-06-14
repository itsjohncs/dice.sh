import type {ReactElement} from "react";

import styles from "./RollResult.module.css";

interface Props {
    rolls: string;
    total: string;
}

export default function RollResult(props: Props): ReactElement {
    return (
        <div className={styles.container}>
            <div>{props.rolls}</div>
            <div className={styles.total}>
                <span className={styles.divider}>=</span>
                {props.total}
            </div>
        </div>
    );
}
