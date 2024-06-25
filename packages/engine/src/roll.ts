import {DiceRoll} from "@dice-roller/rpg-dice-roller";

type Roll = {
    type: "roll";
    input: string;
    result: {
        rolls: string;
        total: string;
    };
    error?: undefined;
};

type Error = {
    type: "error";
    input: string;
    result?: undefined;
    error: string;
};

type SimpleInfo = {
    type: "simple-info";
    input?: string;
    subType: "help";
};

type ClearScreenCommand = {
    type: "clear";
};

type JoinCommand = {
    type: "join";
    input: string;
    channel?: string;
};

export type RollLogEntry = Roll | Error | SimpleInfo;
type Command = JoinCommand | ClearScreenCommand;

function matchJoin(input: string): JoinCommand | Error | undefined {
    const trimmed = input.trim();
    if (trimmed.startsWith("/join")) {
        const match = /^\/join(?: ([^ ]+))?$/.exec(trimmed);
        if (match) {
            return {
                type: "join",
                input,
                channel: match[1],
            };
        } else {
            return {
                type: "error",
                input,
                error: "Invalid join command.",
            };
        }
    }

    return undefined;
}

export function roll(input: string): RollLogEntry | Command {
    if (input.trim() === "") {
        return {
            type: "error",
            input,
            error: "Error: No input. Try /help.",
        };
    }

    const trimmed = input.trim();
    if (trimmed.startsWith("/")) {
        const join = matchJoin(input);
        if (join) {
            return join;
        } else if (trimmed === "/help") {
            return {
                type: "simple-info",
                input,
                subType: "help",
            };
        } else if (trimmed === "/clear") {
            return {
                type: "clear",
            };
        } else {
            return {
                type: "error",
                input,
                error: "Error: Unknown command. Try /help.",
            };
        }
    }

    try {
        const diceRoll = new DiceRoll(input);
        return {
            type: "roll",
            input,
            result: {
                rolls: diceRoll.rolls.join(""),
                total: diceRoll.total + "",
            },
        };
    } catch (e) {
        return {
            type: "error",
            input,
            error: e + "",
        };
    }
}
