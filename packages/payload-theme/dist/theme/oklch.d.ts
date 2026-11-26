/**
 * Color-space conversions for the theme engine.
 *
 * Pipeline: hex <-> sRGB (0..1) <-> linear sRGB <-> OKLab <-> OKLCH.
 *
 * OKLCH is our working space because it separates perceptual lightness (L)
 * from chroma (C) and hue (H) on independent axes, so a lightness ramp reads
 * as visually even and hue stays stable as we lighten/darken. Math is Björn
 * Ottosson's OKLab (https://bottosson.github.io/posts/oklab/); zero runtime deps.
 */
/** sRGB channels, each normalized to 0..1. */
export interface RGB {
    r: number;
    g: number;
    b: number;
}
/** OKLCH: L in 0..1 (lightness), C >= 0 (chroma), H in 0..360 degrees (hue). */
export interface OKLCH {
    L: number;
    C: number;
    H: number;
}
/**
 * Parse a hex color into 0..1 sRGB channels. Accepts `#rgb`, `#rrggbb`,
 * with or without a leading `#`, case-insensitive. Returns `null` for any
 * input that is not one of those two shapes.
 */
export declare function hexToRgb(hex: string): RGB | null;
/** Serialize 0..1 sRGB channels to a lowercase `#rrggbb` string (clamped). */
export declare function rgbToHex({ r, g, b }: RGB): string;
/** sRGB gamma decode: one 0..1 channel to linear light. */
export declare function srgbToLinear(c: number): number;
/** sRGB gamma encode: one linear-light channel back to 0..1 sRGB. */
export declare function linearToSrgb(c: number): number;
/** Convert 0..1 sRGB to OKLCH. */
export declare function rgbToOklch({ r, g, b }: RGB): OKLCH;
/**
 * Convert OKLCH to 0..1 sRGB **without** gamut handling. Channels may fall
 * outside 0..1 when the color is not representable in sRGB; callers that need
 * a displayable color should use {@link oklchToRgbGamut} instead.
 */
export declare function oklchToRgbRaw({ L, C, H }: OKLCH): RGB;
/**
 * Convert OKLCH to displayable 0..1 sRGB, reducing chroma until the color fits
 * the sRGB gamut. Lightness and hue are preserved; only saturation is lowered
 * (via binary search), which avoids the hue shifts that naive RGB clamping
 * produces at the light and dark ends of a scale.
 */
export declare function oklchToRgbGamut(color: OKLCH): RGB;
/** Convenience: parse a hex string straight to OKLCH (null if invalid). */
export declare function hexToOklch(hex: string): OKLCH | null;
/** Convenience: OKLCH to a displayable `#rrggbb` hex (gamut-mapped). */
export declare function oklchToHex(color: OKLCH): string;
