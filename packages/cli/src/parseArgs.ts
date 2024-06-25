import {Command, program} from "commander";

export default function parseArgs(): Command {
    program
        .name("npx @dice-sh/cli")
        .description("Dice.sh command line interface.")
        .argument(
            "[dice...]",
            "Dice rolls. If provided, will roll and then exit immediately.",
        );

    program.parse();

    return program;
}
