/**
 * WCAG contrast utilities.
 *
 * Used to auto-pick the text color that sits on top of the accent
 * (`--pt-accent-contrast`): a yellow accent gets black text, a purple accent
 * gets white. The choice is driven by WCAG 2.x relative luminance so it tracks
 * actual perceived readability rather than a naive lightness threshold.
 */
import { type RGB } from './oklch.js';
/**
 * WCAG relative luminance of an sRGB color (channels 0..1), in 0..1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export declare function relativeLuminance({ r, g, b }: RGB): number;
/**
 * WCAG contrast ratio between two sRGB colors, from 1 (identical) to 21
 * (black on white). Order-independent.
 */
export declare function contrastRatio(a: RGB, b: RGB): number;
export interface ContrastChoice {
    /** The chosen foreground as a hex string: `#000000` or `#ffffff`. */
    color: '#000000' | '#ffffff';
    /** Contrast ratio of the chosen color against the background. */
    ratio: number;
    /** Whether the chosen color clears WCAG AA for normal text (4.5:1). */
    meetsAA: boolean;
}
/**
 * Pick black or white text for a given background, choosing whichever yields
 * the higher WCAG contrast (best effort — if neither clears AA, the better of
 * the two still wins and `meetsAA` reports false).
 */
export declare function pickContrastText(background: RGB): ContrastChoice;
/** Convenience overload of {@link pickContrastText} that accepts a hex string. */
export declare function pickContrastTextForHex(hex: string): ContrastChoice | null;
