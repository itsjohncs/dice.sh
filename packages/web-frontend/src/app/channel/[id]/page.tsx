import styles from "./page.module.css";
import ChannelTerminal from "./ChannelTerminal";

export default function Channel() {
    return (
        <main className={styles.main}>
            <ChannelTerminal />
        </main>
    );
}
