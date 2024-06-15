import styles from "./index.module.css";
import {
    HexagonDice,
    DiceOne,
    DiceTwo,
    DiceThree,
    DiceFour,
    DiceFive,
    DiceSix,
} from "iconoir-react/regular";

function generateRandomASCIIString(numCharacters: number): string {
    const chars =
        "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    let result = "";
    for (let i = 0; i < numCharacters; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

export default function AnimatedLogo() {
    return (
        <div className={styles.container}>
            <div className={styles.bar}>
                <div className={styles.button} />
                <div className={styles.button} />
                <div className={styles.button} />
                <div className={styles.title}>dice.sh</div>
            </div>
            <div className={styles.contents}>
                <div className={styles.background}>
                    {generateRandomASCIIString(1000)}
                </div>
                <HexagonDice className={styles.d20} width={80} height={80} />
                <DiceTwo className={styles.d6} width={80} height={80} />
                <div className={styles.foreground}>&nbsp;DICE.SH&nbsp;</div>
            </div>
        </div>
    );
}
