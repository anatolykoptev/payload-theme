/**
 * Built-in body-font choices for the panel. Payload sets every UI surface in
 * `var(--font-body)`, so swapping the panel typeface is one custom property.
 * `inter` and `geist` load from Google Fonts at runtime (one stylesheet
 * <link>); `helvetica` and `system` are pure font stacks with no network cost.
 * Any other non-empty string passes through verbatim as a CSS font-family
 * stack (self-hosted fonts: load the @font-face yourself, pass the family).
 */ /** Known font option keys; 'default' keeps Payload's own font. */ export const FONT_KEYS = [
    'default',
    'inter',
    'geist',
    'helvetica',
    'system'
];
export const FONT_PRESETS = {
    geist: {
        label: 'Geist',
        stack: "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Geist:wght@300..800&display=swap'
    },
    helvetica: {
        label: 'Helvetica',
        stack: "'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, sans-serif"
    },
    inter: {
        label: 'Inter',
        stack: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap'
    },
    system: {
        label: 'System',
        stack: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    }
};
/**
 * Resolve a font option to the `--font-body` stack and an optional webfont
 * stylesheet URL. `'default'` → both null (Payload's font stays). Unknown
 * strings are treated as a custom font-family stack.
 */ export function resolveFont(font) {
    if (font === 'default') return {
        stack: null,
        url: null
    };
    const preset = FONT_PRESETS[font];
    if (preset) return {
        stack: preset.stack,
        url: preset.url ?? null
    };
    return {
        stack: font,
        url: null
    };
}
