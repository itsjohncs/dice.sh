import {useCallback} from "react";
import {useLocalStorage} from "usehooks-ts";

export default function usePromptHistory(): [
    string[],
    (prompt: string) => void,
] {
    const [history, setHistory] = useLocalStorage<string[]>(
        "prompt-history",
        [],
    );

    const appendHistory = useCallback(function (prompt: string): void {
        setHistory(function (prev) {
            if (prompt.trim() !== "" && prompt !== prev[prev.length - 1]) {
                return [...prev, prompt];
            }

            return prev;
        });
    }, []);

    return [history, appendHistory];
}
