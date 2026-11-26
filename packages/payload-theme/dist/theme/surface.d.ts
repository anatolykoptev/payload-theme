/**
 * Surface options — everything about the panel's look that is NOT the accent:
 * the neutral gray family, the dark-mode depth, spacing density and the
 * content frame. Each one is a handful of CSS custom properties the static
 * stylesheet already reads with the default baked in, so the defaults emit
 * nothing and every other choice is a small override block.
 *
 * Pure and dependency-free, like the rest of the engine: the plugin renders
 * the result into the ThemeProvider's <style> on the server, and the header
 * customizer renders it again client-side for live overrides.
 */
/** The neutral gray family behind every surface, border and text rung. @default 'zinc' */
export type ThemeNeutral = 'gray' | 'neutral' | 'slate' | 'stone' | 'zinc';
/**
 * Dark-mode depth. `'deep'` puts the content card on near-black (zinc-950);
 * `'dim'` lifts every surface one rung for a softer, lower-contrast night
 * look. @default 'deep'
 */
export type ThemeDarkMode = 'deep' | 'dim';
/** Spacing density for controls, table rows and the form grid. @default 'comfortable' */
export type ThemeDensity = 'comfortable' | 'compact';
/**
 * Content frame. `'inset'` floats the content in a rounded, bordered card on
 * the gray field; `'flat'` runs it edge to edge with a single divider against
 * the sidebar. @default 'inset'
 */
export type ThemeFrame = 'flat' | 'inset';
/**
 * Where custom dashboard widgets sit relative to the built-in collection and
 * global cards. @default 'bottom'
 */
export type ThemeWidgetsPosition = 'bottom' | 'top';
export interface SurfaceOptions {
    dark: ThemeDarkMode;
    density: ThemeDensity;
    frame: ThemeFrame;
    neutral: ThemeNeutral;
    widgets: ThemeWidgetsPosition;
}
export declare const NEUTRALS: ThemeNeutral[];
export declare const DARK_MODES: ThemeDarkMode[];
export declare const DENSITIES: ThemeDensity[];
export declare const FRAMES: ThemeFrame[];
export declare const WIDGETS_POSITIONS: ThemeWidgetsPosition[];
export declare const SURFACE_DEFAULTS: SurfaceOptions;
type NeutralStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
/**
 * The Tailwind neutral families, 50–950. Payload's ladder needs 21 rungs; the
 * in-between steps (150, 250, …) are channel midpoints, the same way
 * `base/foundation.css` derives its zinc mid-steps.
 */
export declare const NEUTRAL_PALETTES: Record<ThemeNeutral, Record<NeutralStep, string>>;
/** The full 0–1000 ladder Payload derives `--theme-elevation-*` from. */
export declare function neutralLadder(neutral: ThemeNeutral): Record<number, string>;
/**
 * Spacing tokens per density. The comfortable values are the stylesheet's own
 * fallbacks (`var(--pt-ctl-h, 40px)` …), so only `compact` ever emits.
 */
export declare const DENSITY_TOKENS: Record<ThemeDensity, Record<string, string>>;
/** Frame tokens read by `layout/frame.css` (inset values are its fallbacks). */
export declare const FRAME_TOKENS: Record<ThemeFrame, Record<string, string>>;
/**
 * Flex `order` of `.pt-dash__widgets` against the card grid (order 0). The
 * bottom value is the stylesheet's own fallback, so only `top` ever emits.
 */
export declare const WIDGETS_TOKENS: Record<ThemeWidgetsPosition, Record<string, string>>;
/**
 * Dark elevation remaps. `deep` is what `base/foundation.css` ships; `dim`
 * moves the card one rung up the ladder (zinc-900 instead of 950) and the
 * field it floats on to 850, keeping borders a step above the card.
 */
export declare const DARK_TOKENS: Record<ThemeDarkMode, Record<string, string>>;
export interface SurfaceCssOptions {
    /** Selector for the mode-independent tokens. Default `:root`. */
    rootSelector?: string;
    /** Selector for the dark-mode tokens. Default `html[data-theme='dark']`. */
    darkSelector?: string;
    /**
     * Emit every token, defaults included. The server leaves defaults to the
     * stylesheet; the live customizer needs them spelled out so a runtime
     * "back to zinc" can beat a config that chose slate.
     */
    full?: boolean;
    /** Wrap in `@layer payload`. Default `true`. */
    layer?: boolean;
}
/** Render the surface options to CSS — `''` when nothing differs from the stylesheet. */
export declare function surfaceToCss(surface: SurfaceOptions, opts?: SurfaceCssOptions): string;
export {};
