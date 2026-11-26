import React from 'react';
export { localeToRegion } from './regions.js';
export type FlagProps = {
    /** A Payload locale code — `tr`, `en-GB`, `pt_BR`, `zh-Hant-TW`. */
    code: string;
} & Omit<React.SVGProps<SVGSVGElement>, 'children' | 'viewBox'>;
/**
 * A small rounded flag chip for a locale code, or nothing when the code maps
 * to no flag we draw — the caller pairs this with the locale code itself, so a
 * missing flag degrades to a plain `(xx)` badge rather than a hole in the row.
 *
 * The corners are clipped in SVG rather than with `border-radius` so the mark
 * is identical everywhere: `border-radius` on an inline `<svg>` is honoured by
 * browsers but is a paint-time clip, and a 20px chip has no pixels to spare if
 * one of them decides otherwise.
 */
export declare const Flag: React.FC<FlagProps>;
export default Flag;
