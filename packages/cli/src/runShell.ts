import {createInterface} from "node:readline/promises";

export default function runShell(): void {
    const shell = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "$ ",
        tabSize: 4,
    });

    shell.prompt();

    shell.on("line", (line) => {
        console.log(`Would roll ${line}`);
        shell.prompt();
    });

    shell.on("close", () => {
        console.log("exiting...");
        process.exit(0);
    });
}
