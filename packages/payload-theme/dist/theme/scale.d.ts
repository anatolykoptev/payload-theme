/**
 * Accent -> 11-step scale (50..950).
 *
 * Strategy: identity-preserving. The seed sits at step 500 with its own hue,
 * chroma, and lightness; tints (50..400) interpolate its lightness toward white
 * and shades (600..950) toward near-black. This keeps the accent recognizable
 * across the whole scale — a yellow accent stays yellow (and so takes black
 * contrast text) instead of collapsing into a muddy brown, which a fixed
 * lightness ramp would force on high-luminance hues.
 *
 * A very light or very dark accent is nudged into a usable lightness band for
 * the 500 anchor so both the tint and shade sides keep enough room to breathe;
 * hue and chroma are always preserved. Hue is held constant across steps for
 * predictability, and chroma follows a curve that peaks at 500 and tapers
 * toward both ends so tints and shades read clean rather than neon or muddy.
 */
import { type OKLCH } from './oklch.js';
export declare const SCALE_STEPS: readonly [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
export type ScaleStep = (typeof SCALE_STEPS)[number];
/** A full 50..950 scale as `#rrggbb` hex strings. */
export type Scale = Record<ScaleStep, string>;
/**
 * Build the OKLCH color for each step from a seed. Returned in `SCALE_STEPS`
 * order (50 first). Lightness is strictly decreasing by construction.
 */
export declare function generateScaleOklch(seed: OKLCH): Record<ScaleStep, OKLCH>;
/** Build the 50..950 scale as gamut-mapped hex strings from a seed OKLCH. */
export declare function generateScale(seed: OKLCH): Scale;
