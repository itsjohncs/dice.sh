import {Hat, MagicWand, QuoteMessageSolid} from "iconoir-react";
import AnimatedLogo from "./AnimatedLogo";

import styles from "./Help.module.css";
import Image from "next/image";

export default function Help() {
    return (
        <div className={styles.container}>
            <AnimatedLogo className={styles.logo} />
            <p>The terminal in your browser that rolls dice.</p>
            <div className={styles.tip}>
                <MagicWand className={styles.tipIcon} /> Want a terminal in your
                terminal? Try <code>ssh dice.sh</code> or{" "}
                <code>npx @dice-sh/cli</code>.
            </div>
            <h1>Rolling Dice</h1>
            <div>
                Enter dice notation to roll dice. For example:
                <dl className={styles.exampleRolls}>
                    <dt>2d20+5</dt>
                    <dd>Roll 2 20-sided dice and add 5 to the result.</dd>
                    <dt>5d10!k2</dt>
                    <dd>
                        Roll 5 10-sided dice but only{" "}
                        <a href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html#keep">
                            keep the highest 2 rolls
                        </a>
                        .
                    </dd>
                    <dt>4d6!</dt>
                    <dd>
                        Roll 4 6-sided dice, re-rolling any 6's and adding the
                        new rolls to the result (this is called{" "}
                        <a href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html#exploding">
                            "exploding dice"
                        </a>
                        ).
                    </dd>
                </dl>
                dice.sh uses{" "}
                <a href="https://github.com/dice-roller/rpg-dice-roller">
                    @dice-roller/rpg-dice-roller
                </a>{" "}
                to understand dice rolls so it understands a ton of notation!{" "}
                <a href="https://dice-roller.github.io/documentation/guide/notation/">
                    Check out the full dice notation docs
                </a>
                .
            </div>
            <h1>Commands</h1>
            <div>
                <dl className={styles.exampleRolls}>
                    <dt>/join [channel]</dt>
                    <dd>
                        Joins/creates a channel. If no channel is provided, a
                        random channel name will be generated.
                    </dd>
                    <dt>/name {"<name>"}</dt>
                    <dd>Change your display name.</dd>
                    <dt>/leave</dt>
                    <dd>
                        Leaves the current channel and returns to offline mode.
                    </dd>
                    <dt>/clear</dt>
                    <dd>Clears the screen.</dd>
                    <dt>/help</dt>
                    <dd>Show this message.</dd>
                </dl>
            </div>
            <h1>Found a Bug?</h1>
            <div>
                Come help make dice.sh better on{" "}
                <a href="https://github.com/itsjohncs/dice.sh">GitHub</a>!
            </div>
        </div>
    );
}
