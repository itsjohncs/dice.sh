import Image from "next/image";
import styles from "./page.module.css";
import SessionStorageTerminal from "./SessionStorageTerminal";

export default function Home() {
    return (
        <main className={styles.main}>
            <SessionStorageTerminal />
        </main>
    );
}
