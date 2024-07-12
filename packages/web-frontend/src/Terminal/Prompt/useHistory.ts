import {useCallback, useReducer} from "react";

/**
 * Increments/decrements the history offset.
 *
 * `NewInput` is the bottom of the history (equivalent to `-1`).
 */
function addOffset(
    current: typeof NewInput | number,
    delta: 1 | -1,
): typeof NewInput | number {
    if (current === NewInput) {
        if (delta === 1) {
            return 0;
        } else {
            return NewInput;
        }
    } else if (current === 0 && delta === -1) {
        return NewInput;
    } else {
        return current + delta;
    }
}

/**
 * Represents the unsubmitted/new input in the history.
 *
 * We use a `Symbol` to get a little extra runtime type safety (ex: you can't
 * add a `Symbol` and a number, but you can add a string and a number). It was
 * a quick decision though so don't be afraid to change how we represent this.
 */
const NewInput = Symbol("NewInput");

interface State {
    /**
     * The historical input we're currently displaying to the user.
     */
    offset: typeof NewInput | number;

    /**
     * @see NewInput
     */
    [NewInput]: string;

    /**
     * Past inputs the user has submitted.
     */
    [index: number]: string | undefined;

    /**
     * Whether we have the past inputs in state yet.
     *
     * When we reset the state, we don't immediately grab the past inputs the
     * user has submitted. It's not until they first navigate that we pull them
     * down. This let's us have the greatest opportunity to give the user their
     * most recent history.
     */
    synced: boolean;
}

type Action =
    | {type: "reset"}
    | {type: "navigate"; delta: 1 | -1; history: string[]}
    | {type: "update"; value: string};

const initialState: State = {
    offset: NewInput,
    [NewInput]: "",
    synced: false,
};

function reducer(state: State, action: Action): State {
    if (action.type === "reset") {
        return initialState;
    } else if (action.type === "navigate") {
        const newOffset = addOffset(state.offset, action.delta);
        if (newOffset !== state.offset) {
            let newState = state;
            if (!newState.synced) {
                const reversedHistory = [...action.history];
                reversedHistory.reverse();
                newState = {...newState, ...reversedHistory, synced: true};
            }

            if (newState[newOffset] !== undefined) {
                return {...newState, offset: newOffset};
            }
        }

        return state;
    } else if (action.type === "update") {
        return {
            ...state,
            [state.offset]: action.value,
        };
    }

    throw new Error(`Unknown action ${action}`);
}

export default function useHistory(history: string[]) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const resetHistory = useCallback(
        function () {
            dispatch({type: "reset"});
        },
        [dispatch],
    );
    const navigateHistory = useCallback(
        function (delta: 1 | -1) {
            dispatch({type: "navigate", delta, history});
        },
        [history, dispatch],
    );
    const updateHistory = useCallback(
        function (value: string) {
            dispatch({type: "update", value});
        },
        [dispatch],
    );

    return {
        currentInput: state[state.offset] ?? "",
        resetHistory,
        navigateHistory,
        updateHistory,
    };
}
