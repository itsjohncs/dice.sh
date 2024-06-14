export default function Help() {
    return (
        <div>
            dice.sh | <a href="https://github.com/itsjohncs/dice.sh">GitHub</a>{" "}
            | <a href="https://x.com/itsjohncs">@itsjohncs</a>
            <br />
            <br />
            Enter dice notation to roll dice. For example:
            <br />
            - 2d20+5
            <br />
            - 5d10!k2
            <br />(
            <a href="https://dice-roller.github.io/documentation/guide/notation/">
                Full dice notation documentation
            </a>
            )<br />
            <br />
            You can also use these special commands:
            <br />- /help: Show this message.
            <br />- /clear: Clear the screen.
        </div>
    );
}
