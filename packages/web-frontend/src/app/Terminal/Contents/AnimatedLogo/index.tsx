import {AnimationEvent, useCallback, useEffect, useRef, useState} from "react";

import styles from "./index.module.css";
import {useInterval} from "usehooks-ts";
import classNames from "classnames";

function movePathTo(toMove: SVGPathElement, moveTo: SVGPathElement): void {
    const targetBBox = toMove.getBBox();
    const referenceBBox = moveTo.getBBox();

    const deltaX = referenceBBox.x - targetBBox.x;

    const transform =
        toMove.transform.baseVal.consolidate() ??
        toMove.ownerSVGElement?.createSVGTransform();
    if (transform) {
        transform.setTranslate(deltaX, 0);
        toMove.transform.baseVal.initialize(transform);
    }
}

export default function AnimatedLogo(props: {className?: string}) {
    const refContainer = useRef<SVGSVGElement>(null);
    const refD = useRef<SVGPathElement>(null);
    const refI = useRef<SVGPathElement>(null);
    const refC = useRef<SVGPathElement>(null);
    const refE = useRef<SVGPathElement>(null);
    const refDot = useRef<SVGPathElement>(null);
    const refS = useRef<SVGPathElement>(null);
    const refH = useRef<SVGPathElement>(null);
    const refUnderscore = useRef<SVGPathElement>(null);

    const characters = [refD, refI, refC, refE, refDot, refS, refH];
    const [numVisibleCharacters, setNumVisibleCharacters] = useState(0);
    useInterval(
        function () {
            setNumVisibleCharacters((x) => x + 1);
        },
        numVisibleCharacters < characters.length ? 100 : null,
    );

    useEffect(
        function () {
            const underscore = refUnderscore.current;
            if (!underscore) {
                return;
            }

            if (numVisibleCharacters >= characters.length) {
                underscore.transform.baseVal.clear();
            } else {
                const nextInvisible = characters[numVisibleCharacters].current;
                if (nextInvisible) {
                    movePathTo(underscore, nextInvisible);
                }
            }
        },
        [numVisibleCharacters],
    );

    return (
        <div className={styles.container}>
            <svg
                ref={refContainer}
                version="1.1"
                viewBox="0 0 86.228 11.413"
                xmlns="http://www.w3.org/2000/svg"
                className={classNames(props.className, styles.svg)}
                fill="currentColor"
            >
                <path d="m6.6379 4.6059-6.6379-4.2333v2.6077l4.2672 2.5739v0.06773l-4.2672 2.5739v2.6077l6.6379-4.2333z" />
                <path
                    className={classNames({
                        [styles.hidden]: numVisibleCharacters <= 0,
                    })}
                    ref={refD}
                    d="m9.2249 11.21h3.2681c2.9803 0 5.1985-1.6595 5.1985-5.5541 0-3.8947-2.2183-5.4525-5.3679-5.4525h-3.0988zm2.9125-2.3368v-6.3331h0.03387c1.4055 0 2.54 0.54187 2.54 3.1157 0 2.5739-1.1345 3.2173-2.54 3.2173z"
                />
                <path
                    className={classNames({
                        [styles.hidden]: numVisibleCharacters <= 1,
                    })}
                    ref={refI}
                    d="m19.195 11.21h7.9248v-2.4384h-2.5061v-6.1299h2.5061v-2.4384h-7.9248v2.4384h2.5061v6.1299h-2.5061z"
                />
                <path
                    className={classNames({
                        [styles.hidden]: numVisibleCharacters <= 2,
                    })}
                    ref={refC}
                    d="m28.775 5.7912c0 3.7592 2.4723 5.6219 5.3509 5.6219 1.3547 0 2.5908-0.54186 3.5221-1.6256l-1.5917-1.7611c-0.47413 0.508-1.0499 0.88053-1.7611 0.88053-1.4901 0-2.54-1.1515-2.54-3.2173 0-1.9981 1.0499-3.1835 2.4045-3.1835 0.74506 0 1.2531 0.27093 1.7611 0.7112l1.5917-1.7949c-0.77893-0.74507-1.9304-1.4224-3.3528-1.4224-2.9803 0-5.3848 2.0997-5.3848 5.7912z"
                />
                <path
                    className={classNames({
                        [styles.hidden]: numVisibleCharacters <= 3,
                    })}
                    ref={refE}
                    d="m39.203 11.21h7.62v-2.4384h-4.7075v-1.9643h3.8608v-2.4384h-3.8608v-1.7272h4.5381v-2.4384h-7.4507z"
                />
                <path
                    className={classNames({
                        [styles.hidden]: numVisibleCharacters <= 4,
                    })}
                    ref={refDot}
                    d="m50.46 9.2117c0 1.2192 0.88053 2.2013 2.2013 2.2013 1.3208 0 2.2013-0.98213 2.2013-2.2013 0-1.2023-0.88053-2.2013-2.2013-2.2013-1.3208 0-2.2013 0.99906-2.2013 2.2013z"
                />
                <path
                    className={classNames({
                        [styles.hidden]: numVisibleCharacters <= 5,
                    })}
                    ref={refS}
                    d="m58.16 9.8382c1.2361 1.0668 2.8279 1.5748 4.2672 1.5748 2.8448 0 4.4027-1.6595 4.4027-3.5221 0-1.524-0.84666-2.4723-2.3199-3.0141l-1.27-0.52493c-1.1007-0.4064-1.7272-0.57573-1.7272-1.1007 0-0.49107 0.44026-0.74506 1.2531-0.74506 0.88053 0 1.5071 0.27093 2.3029 0.79586l1.4563-1.8288c-1.0668-0.99906-2.4553-1.4732-3.7592-1.4732-2.5061 0-4.1995 1.5409-4.1995 3.4205 0 1.5917 1.0499 2.5908 2.3199 3.0649l1.3716 0.57573c1.0329 0.37253 1.5917 0.54187 1.5917 1.0668 0 0.49107-0.3556 0.77893-1.3547 0.77893-0.8636 0-1.8457-0.44027-2.6755-1.0668z"
                />
                <path
                    className={classNames({
                        [styles.hidden]: numVisibleCharacters <= 6,
                    })}
                    ref={refH}
                    d="m68.232 11.21h2.9125v-4.3688h2.3707v4.3688h2.9125v-11.007h-2.9125v4.0979h-2.3707v-4.0979h-2.9125z"
                />
                <path
                    className={classNames({
                        [styles.hidden]: numVisibleCharacters <= 0,
                        [styles.underscore]: true,
                    })}
                    ref={refUnderscore}
                    d="m78.1 9.0762v2.1336h8.128v-2.1336z"
                />
            </svg>
        </div>
    );
}
