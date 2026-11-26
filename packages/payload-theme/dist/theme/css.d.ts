/**
 * Turn a computed {@link Theme} into CSS custom properties.
 *
 * This is the exact string the plugin will inject at runtime in Phase 4; for
 * now a small generator writes its output into `custom.scss`. The scale is
 * mode-independent so it is emitted once on the root selector; only the
 * semantic accent tokens are re-declared under the dark selector.
 */
import type { Theme } from './index.js';
export interface ThemeCssOptions {
    /** Selector the base (light) tokens are declared on. Default `:root`. */
    rootSelector?: string;
    /** Selector that scopes the dark-mode token overrides. Default `html[data-theme='dark']`. */
    darkSelector?: string;
    /** Wrap the output in `@layer payload { ... }` so it wins over Payload's defaults. Default `true`. */
    layer?: boolean;
    /** Indent string for nested declarations. Default two spaces. */
    indent?: string;
    /**
     * Escape hatch: raw token overrides applied last, inside the root selector.
     * Keys may be given with or without the leading `--`.
     */
    cssVariables?: Record<string, string>;
}
/**
 * Render a {@link Theme} to a CSS string of `--pt-*` custom properties for both
 * light and dark, ready to drop into a stylesheet.
 */
export declare function themeToCss(theme: Theme, opts?: ThemeCssOptions): string;
