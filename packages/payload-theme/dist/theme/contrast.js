/**
 * WCAG contrast utilities.
 *
 * Used to auto-pick the text color that sits on top of the accent
 * (`--pt-accent-contrast`): a yellow accent gets black text, a purple accent
 * gets white. The choice is driven by WCAG 2.x relative luminance so it tracks
 * actual perceived readability rather than a naive lightness threshold.
 */ import { hexToRgb, srgbToLinear } from './oklch.js';
/**
 * WCAG relative luminance of an sRGB color (channels 0..1), in 0..1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */ export function relativeLuminance({ r, g, b }) {
    return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}
/**
 * WCAG contrast ratio between two sRGB colors, from 1 (identical) to 21
 * (black on white). Order-independent.
 */ export function contrastRatio(a, b) {
    const la = relativeLuminance(a);
    const lb = relativeLuminance(b);
    const lighter = Math.max(la, lb);
    const darker = Math.min(la, lb);
    return (lighter + 0.05) / (darker + 0.05);
}
const BLACK = {
    r: 0,
    g: 0,
    b: 0
};
const WHITE = {
    r: 1,
    g: 1,
    b: 1
};
/**
 * Pick black or white text for a given background, choosing whichever yields
 * the higher WCAG contrast (best effort — if neither clears AA, the better of
 * the two still wins and `meetsAA` reports false).
 */ export function pickContrastText(background) {
    const onBlack = contrastRatio(background, BLACK);
    const onWhite = contrastRatio(background, WHITE);
    const useBlack = onBlack >= onWhite;
    const ratio = useBlack ? onBlack : onWhite;
    return {
        color: useBlack ? '#000000' : '#ffffff',
        ratio,
        meetsAA: ratio >= 4.5
    };
}
/** Convenience overload of {@link pickContrastText} that accepts a hex string. */ export function pickContrastTextForHex(hex) {
    const rgb = hexToRgb(hex);
    return rgb ? pickContrastText(rgb) : null;
}
