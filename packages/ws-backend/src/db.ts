export type LogEntry = unknown;

const data = new Map<string, LogEntry[]>();

export async function fetchLogEntriesAfter(
    channelId: string,
    lastSeenLog: number | undefined,
): Promise<LogEntry[]> {
    const entries = data.get(channelId) ?? [];

    if (entries.length === 0 && lastSeenLog !== undefined) {
        throw new Error(
            `Expected lastSeenLog to be undefined, got ${lastSeenLog}.`,
        );
    }

    if (entries.length <= lastSeenLog) {
        throw new Error(
            `lastSeenLog (${lastSeenLog}) out of bounds (must be less than ${entries.length}).`,
        );
    }

    if (lastSeenLog !== undefined) {
        return entries.slice(lastSeenLog + 1);
    } else {
        return entries;
    }
}

export async function appendLogEntry(
    channelId: string,
    logEntry: LogEntry,
): Promise<void> {
    data.get(channelId)?.push(logEntry);
}
