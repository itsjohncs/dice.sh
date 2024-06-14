import parseArgs from "./parseArgs.js";
import runShell from "./runShell.js";

const program = parseArgs();
if (program.args.length > 0) {
    console.log("Would roll", program.args.join(" "))
} else {
    runShell();
}
