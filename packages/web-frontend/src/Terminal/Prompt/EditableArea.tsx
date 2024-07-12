import type {
    ChangeEvent,
    ForwardedRef,
    KeyboardEventHandler,
    ReactElement,
} from "react";
import {forwardRef, useCallback, useLayoutEffect, useRef} from "react";

import styles from "./EditableArea.module.css";
import splitRef from "#root/utils/splitRef";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: KeyboardEventHandler<HTMLSpanElement>;
}

function getSoleTextNode(parent: Node): Text | undefined {
    if (
        parent.childNodes.length === 1 &&
        parent.childNodes[0] instanceof Text
    ) {
        return parent.childNodes[0];
    }

    return undefined;
}

function createCollapsedRangeAtEndOfText(target: Text): Range {
    const range = document.createRange();
    const length = (target.textContent ?? "").length;
    range.setStart(target, length);
    range.setEnd(target, length);
    return range;
}

function EditableArea_(
    props: Props,
    forwardedRef: ForwardedRef<HTMLSpanElement>,
): ReactElement {
    const {value, onChange} = props;

    const handleInput = useCallback(
        function (event: ChangeEvent<HTMLSpanElement>) {
            onChange(event.currentTarget.textContent ?? "");
        },
        [onChange],
    );

    const innerRef = useRef<HTMLSpanElement>(null);
    useLayoutEffect(function () {
        if (innerRef.current && innerRef.current.textContent !== value) {
            innerRef.current.textContent = value;

            const selection = window.getSelection();
            if (!selection) {
                return;
            }
            const textNode = getSoleTextNode(innerRef.current);
            if (textNode) {
                try {
                    selection.removeAllRanges();
                    selection.addRange(
                        createCollapsedRangeAtEndOfText(textNode),
                    );
                } catch (e) {
                    console.log("Failed to place cursor at end of prompt", e);
                }
            }
        }
    });

    return (
        <span
            className={styles.editableArea}
            ref={splitRef(forwardedRef, innerRef)}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={handleInput}
            onKeyDown={props.onKeyDown}
            spellCheck={false}
            autoFocus={true}
            {...{enterKeyHint: "done"}}
        />
    );
}

const EditableArea = forwardRef(EditableArea_);
export default EditableArea;
