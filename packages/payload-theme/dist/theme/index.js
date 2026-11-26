/**
 * Theme engine — public API.
 *
 * `buildTheme(accent)` is the one entry point the plugin needs: it validates a
 * single accent hex, derives the 50..950 OKLCH scale, and maps semantic accent
 * tokens for both light and dark. Everything here is pure and dependency-free;
 * turning these values into CSS custom properties happens in a later phase.
 */ import { pickContrastText } from './contrast.js';
import { hexToRgb, rgbToOklch } from './oklch.js';
import { generateScale } from './scale.js';
import { normalizeHex } from './validate.js';
/**
 * Which scale step backs each semantic token, per mode. The scale is never
 * inverted for dark; dark simply reads primaries off the brighter rungs so the
 * accent stays legible on a dark surface.
 */ export const TOKEN_STEPS = {
    light: {
        accent: 600,
        accentHover: 700,
        accentActive: 800,
        accentSubtle: 50,
        accentRing: 500
    },
    dark: {
        accent: 400,
        accentHover: 300,
        accentActive: 200,
        accentSubtle: 900,
        accentRing: 400
    }
};
function buildTokens(scale, mode) {
    const steps = TOKEN_STEPS[mode];
    const accent = scale[steps.accent];
    return {
        accent,
        accentHover: scale[steps.accentHover],
        accentActive: scale[steps.accentActive],
        accentSubtle: scale[steps.accentSubtle],
        accentRing: scale[steps.accentRing],
        accentContrast: pickContrastText(hexToRgb(accent)).color
    };
}
/**
 * Build the complete theme from a single accent hex.
 * @throws if `accent` is not a valid `#rgb` / `#rrggbb` hex.
 */ export function buildTheme(accent) {
    const normalized = normalizeHex(accent);
    const scale = generateScale(rgbToOklch(hexToRgb(normalized)));
    return {
        accent: normalized,
        scale,
        light: buildTokens(scale, 'light'),
        dark: buildTokens(scale, 'dark')
    };
}
export { hexToRgb, rgbToHex, rgbToOklch, oklchToHex, hexToOklch, oklchToRgbGamut } from './oklch.js';
export { relativeLuminance, contrastRatio, pickContrastText, pickContrastTextForHex } from './contrast.js';
export { generateScale, generateScaleOklch, SCALE_STEPS } from './scale.js';
export { isValidHex, normalizeHex } from './validate.js';
export { themeToCss } from './css.js';
export { FONT_KEYS, FONT_PRESETS, resolveFont } from './fonts.js';
export { DARK_MODES, DARK_TOKENS, DENSITIES, DENSITY_TOKENS, FRAMES, FRAME_TOKENS, NEUTRAL_PALETTES, NEUTRALS, neutralLadder, SURFACE_DEFAULTS, surfaceToCss, WIDGETS_POSITIONS, WIDGETS_TOKENS } from './surface.js';
