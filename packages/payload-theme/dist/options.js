/**
 * Public options for {@link payloadTheme}, plus the runtime resolution that
 * validates them and fills defaults. Everything a component needs at runtime is
 * serializable (strings only) so it can cross Payload's server→client boundary
 * via `admin.custom`.
 */ import { DARK_MODES, DENSITIES, DOCKED_MIN_WIDTH_FLOOR, DRAWER_MAX_WIDTH, FRAMES, NEUTRALS, normalizeHex, resolveFont, SURFACE_DEFAULTS, WIDGETS_POSITIONS } from './theme/index.js';
/**
 * The six built-in looks, shared by the `preset` option and the header
 * customizer's preset row — one list, so a config-set preset and a clicked one
 * are always the same theme. Neutral names on purpose: each is a coherent
 * identity, not a brand.
 */ export const THEME_PRESETS = [
    {
        key: 'zinc',
        label: 'Zinc',
        accent: '#18181b',
        font: 'geist',
        neutral: 'zinc',
        radius: 'md'
    },
    {
        key: 'ocean',
        label: 'Ocean',
        accent: '#2563eb',
        font: 'inter',
        neutral: 'slate',
        radius: 'lg'
    },
    {
        key: 'forest',
        label: 'Forest',
        accent: '#059669',
        font: 'inter',
        neutral: 'stone',
        radius: 'md'
    },
    {
        key: 'sunset',
        label: 'Sunset',
        accent: '#ea580c',
        font: 'inter',
        neutral: 'stone',
        radius: 'full'
    },
    {
        key: 'berry',
        label: 'Berry',
        accent: '#db2777',
        font: 'geist',
        neutral: 'zinc',
        radius: 'lg'
    },
    {
        key: 'swiss',
        label: 'Swiss',
        accent: '#dc2626',
        font: 'helvetica',
        neutral: 'neutral',
        radius: 'none'
    }
];
const PRESETS = THEME_PRESETS.map((preset)=>preset.key);
const RADII = [
    'none',
    'sm',
    'md',
    'lg',
    'full'
];
/**
 * Radius option → the three `--pt-radius-*` tokens the stylesheet reads.
 * `ctl` = controls (buttons, inputs, pills, nav links), `card` = surfaces
 * (cards, tables, popovers, modals), `item` = small inner items (menu rows,
 * chips, paginator pages). `md` matches the reference shadcn geometry
 * (rounded-md controls, rounded-xl cards) and is the default.
 */ export const RADIUS_TOKENS = {
    full: {
        card: '14px',
        ctl: '999px',
        item: '9px'
    },
    lg: {
        card: '16px',
        ctl: '10px',
        item: '8px'
    },
    md: {
        card: '12px',
        ctl: '8px',
        item: '6px'
    },
    sm: {
        card: '8px',
        ctl: '6px',
        item: '4px'
    },
    none: {
        card: '0px',
        ctl: '0px',
        item: '0px'
    }
};
const DEFAULTS = {
    accent: '#4f4ece',
    radius: 'md',
    font: 'default',
    fallbackIconName: 'folder'
};
function assert(condition, message) {
    if (!condition) throw new Error(`[payload-theme] ${message}`);
}
const WIDGET_WIDTHS = [
    'full',
    'half',
    'third'
];
const DEFAULT_WIDGET_WIDTH = 'half';
/** True for a valid `PayloadComponent`: an import-map path string or a `{ path }` object. */ function isPayloadComponent(value) {
    if (typeof value === 'string') return value.trim() !== '';
    return typeof value === 'object' && value !== null && typeof value.path === 'string' && value.path.trim() !== '';
}
/** Validate `dashboard.widgets` and normalize each entry to `{ component, width }`. */ function normalizeWidgets(widgets) {
    if (widgets === undefined) return [];
    assert(Array.isArray(widgets), 'dashboard.widgets must be an array of widget definitions.');
    return widgets.map((widget, index)=>{
        const describe = `dashboard.widgets[${index}]`;
        if (isPayloadComponent(widget)) {
            return {
                component: widget,
                width: DEFAULT_WIDGET_WIDTH
            };
        }
        assert(widget && typeof widget === 'object' && 'component' in widget, `${describe} must be a component path string (e.g. '/components/MyWidget#MyWidget'), a { path, exportName } object, or a { component, width } object.`);
        assert(isPayloadComponent(widget.component), `${describe}.component must be a component path string or a { path, exportName } object.`);
        const width = widget.width ?? DEFAULT_WIDGET_WIDTH;
        assert(WIDGET_WIDTHS.includes(width), `${describe}.width must be one of ${WIDGET_WIDTHS.join(', ')}, got '${String(widget.width)}'.`);
        return {
            component: widget.component,
            width
        };
    });
}
/** Validate the `avatar` option and normalize it to a tagged object. */ function normalizeAvatar(value) {
    if (value === undefined) return null;
    if (typeof value === 'string') {
        assert(value === 'initials' || value === 'gravatar', `Invalid avatar: '${value}'. Expected 'initials', 'gravatar' or { field: 'avatar' }.`);
        return value === 'gravatar' ? {
            type: 'gravatar'
        } : {
            type: 'initials'
        };
    }
    assert(value && typeof value === 'object' && !Array.isArray(value), `avatar must be 'initials', 'gravatar' or an object like { field: 'avatar' }.`);
    assert(typeof value.field === 'string' && value.field.trim() !== '', `avatar.field must be the name of a field on your auth collection, e.g. { field: 'avatar' }.`);
    assert(value.size === undefined || typeof value.size === 'string' && value.size.trim() !== '', `avatar.size must be the name of an upload size, e.g. { field: 'avatar', size: 'thumbnail' }.`);
    return {
        type: 'field',
        name: value.field.trim(),
        size: value.size?.trim() ?? null
    };
}
/** Validate a logo/icon option and normalize it to a `{ light, dark }` pair. */ /** Validate the logo link option, trimming both parts; null when omitted. */ function normalizeLogoLink(value) {
    if (value === undefined) return null;
    assert(value && typeof value === 'object' && !Array.isArray(value), "logoLink must be an object like { href: '/', label: 'Website' }.");
    const href = typeof value.href === 'string' ? value.href.trim() : '';
    const label = typeof value.label === 'string' ? value.label.trim() : '';
    assert(href !== '', 'logoLink.href must be a non-empty URL or path.');
    assert(label !== '', 'logoLink.label must be a non-empty string: it names the link for screen readers.');
    return {
        href,
        label
    };
}
function normalizeAsset(value, name) {
    if (value === undefined) return undefined;
    if (typeof value === 'string') return {
        dark: value,
        light: value
    };
    assert(value && typeof value === 'object' && typeof value.light === 'string' && typeof value.dark === 'string', `${name} must be a URL string or an object like { light: '/logo.svg', dark: '/logo-dark.svg' }.`);
    return {
        dark: value.dark,
        light: value.light
    };
}
/** Assert `value` is one of `allowed`, naming the option in the error. */ function assertOneOf(value, allowed, name) {
    assert(allowed.includes(value), `Invalid ${name}: '${String(value)}'. Expected one of ${allowed.join(', ')}.`);
}
/** Validate user options (clear errors) and return everything needed downstream. */ export function resolveOptions(options) {
    // A preset only supplies defaults — every explicit option still wins, so
    // `preset: 'ocean', accent: '#e30613'` is Ocean's geometry in your red.
    const presetKey = options.preset ?? null;
    if (presetKey !== null) {
        assert(PRESETS.includes(presetKey), `Invalid preset: '${presetKey}'. Expected one of ${PRESETS.join(', ')}.`);
    }
    const preset = THEME_PRESETS.find((candidate)=>candidate.key === presetKey);
    const accent = options.accent ?? preset?.accent ?? DEFAULTS.accent;
    // normalizeHex throws a clear message like:
    // "Invalid accent color: 'mor'. Expected hex like #7c3aed"
    normalizeHex(accent);
    const radius = options.radius ?? preset?.radius ?? DEFAULTS.radius;
    assert(RADII.includes(radius), `Invalid radius: '${radius}'. Expected one of ${RADII.join(', ')}.`);
    const font = options.font ?? preset?.font ?? DEFAULTS.font;
    assert(typeof font === 'string' && font.trim() !== '', `font must be a non-empty string — a built-in key ('inter', 'geist', 'helvetica', 'system') or a CSS font-family stack.`);
    const resolvedFont = resolveFont(font);
    const surface = {
        neutral: options.neutral ?? preset?.neutral ?? SURFACE_DEFAULTS.neutral,
        dark: options.darkMode ?? SURFACE_DEFAULTS.dark,
        density: options.density ?? SURFACE_DEFAULTS.density,
        frame: options.frame ?? SURFACE_DEFAULTS.frame,
        widgets: options.dashboard?.widgetsPosition ?? SURFACE_DEFAULTS.widgets
    };
    assertOneOf(surface.neutral, NEUTRALS, 'neutral');
    assertOneOf(surface.dark, DARK_MODES, 'darkMode');
    assertOneOf(surface.density, DENSITIES, 'density');
    assertOneOf(surface.frame, FRAMES, 'frame');
    assertOneOf(surface.widgets, WIDGETS_POSITIONS, 'dashboard.widgetsPosition');
    const customizer = options.customizer ?? true;
    assert(typeof customizer === 'boolean', `customizer must be true or false, got '${String(customizer)}'.`);
    const icons = options.nav?.icons ?? {};
    assert(icons && typeof icons === 'object' && !Array.isArray(icons), 'nav.icons must be an object mapping slugs to lucide icon names.');
    for (const [slug, name] of Object.entries(icons)){
        assert(typeof name === 'string', `nav.icons['${slug}'] must be a string lucide icon name.`);
    }
    const dockedMinWidth = options.nav?.dockedMinWidth ?? null;
    assert(dockedMinWidth === null || Number.isInteger(dockedMinWidth) && dockedMinWidth >= DOCKED_MIN_WIDTH_FLOOR && dockedMinWidth <= DRAWER_MAX_WIDTH, `nav.dockedMinWidth must be a whole number of pixels from ${DOCKED_MIN_WIDTH_FLOOR} to ${DRAWER_MAX_WIDTH}, got '${String(dockedMinWidth)}'. Tablets (1024px and below) always keep the drawer, and above ${DRAWER_MAX_WIDTH}px the sidebar is docked already.`);
    const logo = normalizeAsset(options.logo, 'logo');
    const icon = normalizeAsset(options.icon, 'icon');
    const logoLink = normalizeLogoLink(options.logoLink);
    const avatar = normalizeAvatar(options.avatar);
    const widgets = normalizeWidgets(options.dashboard?.widgets);
    const loginHeading = options.login?.heading;
    const loginTagline = options.login?.tagline;
    assert(loginHeading === undefined || typeof loginHeading === 'string', 'login.heading must be a string.');
    assert(loginTagline === undefined || typeof loginTagline === 'string', 'login.tagline must be a string.');
    // Radius tokens first, then logoHeight, then the user's raw overrides —
    // later keys win, so cssVariables stays the ultimate escape hatch.
    const radiusTokens = RADIUS_TOKENS[radius];
    let cssVariables = {
        '--pt-radius-card': radiusTokens.card,
        '--pt-radius-ctl': radiusTokens.ctl,
        '--pt-radius-item': radiusTokens.item,
        ...options.cssVariables
    };
    if (options.logoHeight !== undefined) {
        const height = options.logoHeight;
        assert(typeof height === 'number' && Number.isFinite(height) && height > 0 || typeof height === 'string' && height.trim() !== '', `logoHeight must be a positive number (px) or a CSS length string, got '${String(height)}'.`);
        const value = typeof height === 'number' ? `${height}px` : height;
        cssVariables = {
            '--pt-logo-height': value,
            ...cssVariables
        };
    }
    return {
        accent,
        cssVariables,
        resolved: {
            css: '',
            accent: normalizeHex(accent),
            preset: presetKey,
            radius,
            surface,
            customizer,
            font,
            fontURL: resolvedFont.url,
            dashboard: {
                widgets
            },
            logo,
            icon,
            logoLink,
            avatar,
            nav: {
                dockedMinWidth,
                icons
            },
            login: {
                heading: loginHeading,
                tagline: loginTagline
            },
            fallbackIconName: DEFAULTS.fallbackIconName,
            iconNodes: {}
        }
    };
}
