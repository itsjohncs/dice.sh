import parseArgs from "./parseArgs";
import runShell from "./runShell";

const program = parseArgs();
if (program.args.length > 0) {
    console.log("Would roll", program.args.join(" "))
} else {
    runShell();
}
