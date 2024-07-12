import {useLocalStorage} from "usehooks-ts";

export default function usePromptHistory() {
    return useLocalStorage<string[]>("prompt-history", []);
}
