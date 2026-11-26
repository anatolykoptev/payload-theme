/**
 * Theme engine — public API.
 *
 * `buildTheme(accent)` is the one entry point the plugin needs: it validates a
 * single accent hex, derives the 50..950 OKLCH scale, and maps semantic accent
 * tokens for both light and dark. Everything here is pure and dependency-free;
 * turning these values into CSS custom properties happens in a later phase.
 */
import { type Scale, type ScaleStep } from './scale.js';
/** Semantic accent tokens for a single color mode. */
export interface AccentTokens {
    /** Primary accent (buttons, active nav, links). */
    accent: string;
    /** Accent on hover. */
    accentHover: string;
    /** Accent while pressed/active. */
    accentActive: string;
    /** Faint accent wash for subtle backgrounds (selected rows, hover fills). */
    accentSubtle: string;
    /** Auto-picked black or white text that sits on `accent`. */
    accentContrast: string;
    /** Base color for focus rings (used with alpha in CSS). */
    accentRing: string;
}
/** The full computed theme for one accent. */
export interface Theme {
    /** The normalized input accent as canonical `#rrggbb`. */
    accent: string;
    /** The 50..950 scale. */
    scale: Scale;
    /** Semantic tokens for light mode. */
    light: AccentTokens;
    /** Semantic tokens for dark mode. */
    dark: AccentTokens;
}
/**
 * Which scale step backs each semantic token, per mode. The scale is never
 * inverted for dark; dark simply reads primaries off the brighter rungs so the
 * accent stays legible on a dark surface.
 */
export declare const TOKEN_STEPS: Record<'light' | 'dark', Record<keyof Omit<AccentTokens, 'accentContrast'>, ScaleStep>>;
/**
 * Build the complete theme from a single accent hex.
 * @throws if `accent` is not a valid `#rgb` / `#rrggbb` hex.
 */
export declare function buildTheme(accent: string): Theme;
export { hexToRgb, rgbToHex, rgbToOklch, oklchToHex, hexToOklch, oklchToRgbGamut, type RGB, type OKLCH, } from './oklch.js';
export { relativeLuminance, contrastRatio, pickContrastText, pickContrastTextForHex, } from './contrast.js';
export { generateScale, generateScaleOklch, SCALE_STEPS, type Scale, type ScaleStep, } from './scale.js';
export { isValidHex, normalizeHex } from './validate.js';
export { themeToCss, type ThemeCssOptions } from './css.js';
export { FONT_KEYS, FONT_PRESETS, resolveFont, type ThemeFontKey } from './fonts.js';
export { DARK_MODES, DARK_TOKENS, DENSITIES, DENSITY_TOKENS, FRAMES, FRAME_TOKENS, NEUTRAL_PALETTES, NEUTRALS, neutralLadder, SURFACE_DEFAULTS, surfaceToCss, WIDGETS_POSITIONS, WIDGETS_TOKENS, type SurfaceCssOptions, type SurfaceOptions, type ThemeDarkMode, type ThemeDensity, type ThemeFrame, type ThemeNeutral, type ThemeWidgetsPosition, } from './surface.js';
