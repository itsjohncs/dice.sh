import styles from "./page.module.css";
import ChannelTerminal from "./ChannelTerminal";

export default function Channel({params}: {params: {id: string}}) {
    return (
        <main className={styles.main}>
            <ChannelTerminal channelId={params.id} />
        </main>
    );
}
