/**
 * Built-in body-font choices for the panel. Payload sets every UI surface in
 * `var(--font-body)`, so swapping the panel typeface is one custom property.
 * `inter` and `geist` load from Google Fonts at runtime (one stylesheet
 * <link>); `helvetica` and `system` are pure font stacks with no network cost.
 * Any other non-empty string passes through verbatim as a CSS font-family
 * stack (self-hosted fonts: load the @font-face yourself, pass the family).
 */
/** Known font option keys; 'default' keeps Payload's own font. */
export type ThemeFontKey = 'default' | 'geist' | 'helvetica' | 'inter' | 'system';
export declare const FONT_KEYS: ThemeFontKey[];
type FontPreset = {
    label: string;
    stack: string;
    /** Webfont stylesheet URL — only for faces that need loading. */
    url?: string;
};
export declare const FONT_PRESETS: Record<Exclude<ThemeFontKey, 'default'>, FontPreset>;
/**
 * Resolve a font option to the `--font-body` stack and an optional webfont
 * stylesheet URL. `'default'` → both null (Payload's font stays). Unknown
 * strings are treated as a custom font-family stack.
 */
export declare function resolveFont(font: string): {
    stack: null | string;
    url: null | string;
};
export {};
