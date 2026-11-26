'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { FLAGS } from './flags.js';
import { localeToRegion } from './regions.js';
export { localeToRegion } from './regions.js';
/**
 * A small rounded flag chip for a locale code, or nothing when the code maps
 * to no flag we draw — the caller pairs this with the locale code itself, so a
 * missing flag degrades to a plain `(xx)` badge rather than a hole in the row.
 *
 * The corners are clipped in SVG rather than with `border-radius` so the mark
 * is identical everywhere: `border-radius` on an inline `<svg>` is honoured by
 * browsers but is a paint-time clip, and a 20px chip has no pixels to spare if
 * one of them decides otherwise.
 */ export const Flag = ({ className, code, ...rest })=>{
    // `useId` runs unconditionally — the early return has to come after it.
    const rawId = React.useId();
    const region = localeToRegion(code);
    const draw = region ? FLAGS[region] : undefined;
    if (!draw) return null;
    // `useId` emits colons (`:r3:`); harmless in an id, but they have burned
    // enough `url(#…)` lookups over the years to be worth stripping.
    const clipId = `pt-flag-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    return /*#__PURE__*/ _jsxs("svg", {
        "aria-hidden": "true",
        className: [
            'pt-flag',
            className
        ].filter(Boolean).join(' '),
        viewBox: "0 0 24 18",
        ...rest,
        children: [
            /*#__PURE__*/ _jsx("defs", {
                children: /*#__PURE__*/ _jsx("clipPath", {
                    id: clipId,
                    children: /*#__PURE__*/ _jsx("rect", {
                        height: "18",
                        rx: "2.6",
                        ry: "2.6",
                        width: "24",
                        x: "0",
                        y: "0"
                    })
                })
            }),
            /*#__PURE__*/ _jsx("g", {
                clipPath: `url(#${clipId})`,
                children: draw()
            }),
            /*#__PURE__*/ _jsx("rect", {
                fill: "none",
                height: "17",
                rx: "2.1",
                ry: "2.1",
                stroke: "currentColor",
                strokeOpacity: "0.2",
                strokeWidth: "1",
                width: "23",
                x: "0.5",
                y: "0.5"
            })
        ]
    });
};
export default Flag;
