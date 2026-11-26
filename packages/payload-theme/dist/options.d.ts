/**
 * Public options for {@link payloadTheme}, plus the runtime resolution that
 * validates them and fills defaults. Everything a component needs at runtime is
 * serializable (strings only) so it can cross Payload's server→client boundary
 * via `admin.custom`.
 */
import type { I18n } from '@payloadcms/translations';
import type { Locale, Payload, PayloadComponent, TypedUser } from 'payload';
import type { IconNode } from './icons.js';
import type { SurfaceOptions, ThemeDarkMode, ThemeDensity, ThemeFontKey, ThemeFrame, ThemeNeutral, ThemeWidgetsPosition } from './theme/index.js';
export type { ThemeDarkMode, ThemeDensity, ThemeFrame, ThemeNeutral, ThemeWidgetsPosition, } from './theme/index.js';
/**
 * A one-word starting point: each preset is a coherent accent + radius +
 * typeface + neutral identity, the same six the header customizer offers. Any option you
 * also pass explicitly wins over the preset, so `preset` is a set of defaults,
 * never a lock.
 */
export type ThemePreset = 'berry' | 'forest' | 'ocean' | 'sunset' | 'swiss' | 'zinc';
/**
 * Panel typeface. `'inter'` and `'geist'` load from Google Fonts at runtime;
 * `'helvetica'` and `'system'` are pure font stacks (no network). Any other
 * string is used verbatim as a CSS font-family stack — self-host the face
 * with your own `@font-face` and pass the family here.
 * @default 'default' (Payload's own font)
 */
export type ThemeFont = 'default' | 'geist' | 'helvetica' | 'inter' | 'system' | (string & {});
/**
 * Global corner-rounding scale. Applied to every surface: `md` is the default
 * shadcn geometry (8px controls, 12px cards), `full` gives pill
 * buttons/inputs, `none` squares everything off, the rest sit in between.
 */
export type ThemeRadius = 'full' | 'lg' | 'md' | 'none' | 'sm';
/**
 * An image URL (`'/logo.svg'`), or a pair of URLs when light and dark mode
 * need different artwork.
 */
export type ThemeAsset = string | {
    dark: string;
    light: string;
};
/**
 * Where the user avatar in the sidebar/header user block comes from.
 *
 * - `'initials'` — the accent circle with the user's initials (the default
 *   look, and the explicit way to opt OUT of Payload's `admin.avatar`).
 * - `'gravatar'` — the Gravatar registered to the user's email.
 * - `{ field }` — a field on the authenticated user's document: an `upload`
 *   or `relationship` to an upload collection, or a plain text/URL field.
 *   Dot paths reach into groups (`'profile.photo'`). `size` picks a named
 *   upload size (`'thumbnail'`) instead of the original file.
 *
 * When this option is omitted the theme honors Payload's own
 * `admin.avatar` — `'gravatar'` and `{ Component }` both render inside the
 * theme's avatar circle — and falls back to initials.
 */
export type ThemeAvatarOption = 'gravatar' | 'initials' | {
    field: string;
    size?: string;
};
/** Target and accessible name of the sidebar logo link. */
export interface ThemeLogoLink {
    href: string;
    label: string;
}
export interface NavOptions {
    /**
     * Per-entity sidebar icons, keyed by collection/global slug. Values are
     * lucide icon names in kebab-case (e.g. `'newspaper'`, `'shopping-cart'`) —
     * any icon from https://lucide.dev works. Unmapped entities fall back to a
     * folder icon.
     */
    icons?: Record<string, string>;
    /**
     * Dock the sidebar from this viewport width up, instead of only above
     * 1440px. Payload force-closes its nav at 1440px and below, and the theme
     * shows it as an overlay drawer there, so a 1440px laptop starts with no
     * visible sidebar. Set this (e.g. `1280`) and from that width to 1440px the
     * sidebar is docked, open by default and collapsible with the header chip,
     * exactly as above 1440px; below it the drawer stays. A whole number from
     * 1025 (Payload's tablet breakpoint is 1024) to 1440.
     * @default undefined — the drawer covers everything up to 1440px
     */
    dockedMinWidth?: number;
}
/** Grid width of one dashboard widget. @default 'half' */
export type DashboardWidgetWidth = 'full' | 'half' | 'third';
/**
 * One dashboard widget: any React component of your own, referenced by its
 * import-map path — the same convention Payload uses for every custom
 * component (`'/components/MyWidget#MyWidget'` or
 * `{ path: '/components/MyWidget', exportName: 'MyWidget' }`). Server and
 * client components both work; server components receive `{ payload, user,
 * i18n, locale }` as props. Wrap in an object with `width` to control how
 * much of the row the widget spans.
 */
export type DashboardWidget = PayloadComponent | {
    component: PayloadComponent;
    width?: DashboardWidgetWidth;
};
/**
 * Props the Dashboard passes to every *server* widget component (client
 * widgets receive no props — they can use Payload's hooks instead).
 */
export interface DashboardWidgetServerProps {
    i18n: I18n;
    locale?: Locale;
    payload: Payload;
    user: null | TypedUser;
}
export interface DashboardOptions {
    /**
     * Widgets rendered below the built-in dashboard content (collections,
     * globals, recent activity). Empty or omitted → nothing extra renders and
     * the dashboard looks exactly as before.
     */
    widgets?: DashboardWidget[];
    /**
     * Where the widgets sit: `'bottom'` renders them below the built-in
     * collection and global cards, `'top'` puts them above. This is the default
     * the header customizer starts from; a user can still switch it there.
     * @default 'bottom'
     */
    widgetsPosition?: ThemeWidgetsPosition;
}
export interface LoginOptions {
    /** Big heading on the login brand panel. @default 'Welcome back' */
    heading?: string;
    /** Supporting line under the heading. @default 'Sign in to manage your content.' */
    tagline?: string;
}
export interface PayloadThemeOptions {
    /**
     * A whole look in one word — `'zinc'`, `'ocean'`, `'forest'`, `'sunset'`,
     * `'berry'` or `'swiss'`. Sets the accent, radius, typeface and neutral
     * together; pass any of those explicitly to override just that part.
     */
    preset?: ThemePreset;
    /** The single accent color as a hex string. Drives the whole 50–950 scale. */
    accent?: string;
    /** Global corner rounding. @default 'md' */
    radius?: ThemeRadius;
    /** Panel typeface — a built-in key or a custom CSS font-family stack. @default 'default' */
    font?: ThemeFont;
    /**
     * The gray family behind every surface, border and text rung — `'zinc'`,
     * `'slate'` (cool blue-gray), `'gray'`, `'neutral'` (pure gray) or
     * `'stone'` (warm). @default 'zinc'
     */
    neutral?: ThemeNeutral;
    /**
     * Dark-mode depth: `'deep'` sets the content on near-black, `'dim'` lifts
     * every surface a rung for a softer night look. @default 'deep'
     */
    darkMode?: ThemeDarkMode;
    /**
     * Spacing density: `'compact'` tightens inputs, buttons, table rows and the
     * form grid for data-heavy panels. @default 'comfortable'
     */
    density?: ThemeDensity;
    /**
     * Content frame: `'inset'` floats the content in a rounded card on the gray
     * field; `'flat'` runs it edge to edge with one divider against the
     * sidebar. @default 'inset'
     */
    frame?: ThemeFrame;
    /**
     * Show the live theme customizer (the palette button in the header). Set to
     * `false` to fix the look to your config for every user: the button is
     * gone and overrides a browser saved earlier are no longer applied.
     * @default true
     */
    customizer?: boolean;
    /**
     * Sidebar logo, rendered as `<img>` at the top of the nav. A URL
     * (`'/logo.svg'`) or `{ light, dark }` URLs to swap artwork per color
     * scheme. Falls back to Payload's own logo when omitted.
     */
    logo?: ThemeAsset;
    /**
     * Rendered height of the sidebar logo. A number is treated as pixels
     * (`32` → `32px`); a string is used as-is (`'2.5rem'`). @default 26px
     */
    logoHeight?: number | string;
    /**
     * Where the sidebar logo links, and the accessible name of that link — for
     * example the public site: `{ href: '/', label: 'Website' }`. `href` is any
     * URL or path. Omit to link to the admin dashboard, as before.
     */
    logoLink?: ThemeLogoLink;
    /** Small mark/favicon for collapsed nav and login. Same shape as `logo`. */
    icon?: ThemeAsset;
    /**
     * Source of the user avatar in the sidebar and header user blocks.
     * Omit to honor Payload's `admin.avatar` (gravatar or a custom
     * `Component`), falling back to the accent initials circle.
     */
    avatar?: ThemeAvatarOption;
    /** Sidebar navigation options. */
    nav?: NavOptions;
    /** Dashboard widget area (below the built-in dashboard content unless `widgetsPosition` says otherwise). */
    dashboard?: DashboardOptions;
    /** Copy shown on the login screen's brand panel. */
    login?: LoginOptions;
    /** Escape hatch: raw `--pt-*` token overrides applied after the computed scale. */
    cssVariables?: Record<string, string>;
}
/**
 * The serializable slice stored on `config.admin.custom.payloadTheme` and read
 * by the client Nav / ThemeProvider and the server Dashboard.
 */
/** A widget normalized to object form, with the width default applied. */
export interface ResolvedDashboardWidget {
    component: PayloadComponent;
    width: DashboardWidgetWidth;
}
/**
 * The avatar option normalized for the server→client trip: a plain tagged
 * object, never a bare string, so the `AvatarProvider` can switch on `type`.
 * `null` means "not configured" — Payload's own `admin.avatar` decides.
 */
export type ResolvedAvatar = {
    name: string;
    size: null | string;
    type: 'field';
} | {
    type: 'gravatar';
} | {
    type: 'initials';
};
export interface ResolvedThemeConfig {
    /** Precomputed `--pt-*` CSS custom properties (light + dark), injected at runtime. */
    css: string;
    /** The configured accent as canonical hex — read by the header customizer. */
    accent: string;
    /** The preset the config named, or null when the options stand alone. */
    preset: null | ThemePreset;
    radius: ThemeRadius;
    /** Neutral family, dark depth, density, frame and widgets position — read by the header customizer. */
    surface: SurfaceOptions;
    /** Whether the header customizer renders and its saved overrides apply. */
    customizer: boolean;
    /** The configured font option as given ('default' when omitted). */
    font: string;
    /** Webfont stylesheet URL when the font needs loading (inter/geist), else null. */
    fontURL: null | string;
    /** Normalized widget list; empty when the option is omitted. */
    dashboard: {
        widgets: ResolvedDashboardWidget[];
    };
    /** Normalized to a pair: a plain-string option is used for both schemes. */
    logo?: {
        dark: string;
        light: string;
    };
    icon?: {
        dark: string;
        light: string;
    };
    /** Where the sidebar logo links; null links to the admin dashboard. */
    logoLink: null | ThemeLogoLink;
    /** Avatar source, or null when the `avatar` option is omitted. */
    avatar: null | ResolvedAvatar;
    nav: {
        /** Viewport width the docked sidebar starts at, or null for Payload's 1440px. */
        dockedMinWidth: null | number;
        icons: Record<string, string>;
    };
    /** Unset fields fall back to the defaults at render time. */
    login: {
        heading?: string;
        tagline?: string;
    };
    /** lucide icon name used when an entity has no mapping. */
    fallbackIconName: string;
    /**
     * Geometry of every icon the panel can draw, loaded by the plugin at init
     * so the first server render already has real icons (see `icons.ts`).
     */
    iconNodes: Record<string, IconNode>;
}
/** One preset's full identity. `label` is the customizer's button text. */
export interface ThemePresetDefinition {
    accent: string;
    font: ThemeFontKey;
    key: ThemePreset;
    label: string;
    neutral: ThemeNeutral;
    radius: ThemeRadius;
}
/**
 * The six built-in looks, shared by the `preset` option and the header
 * customizer's preset row — one list, so a config-set preset and a clicked one
 * are always the same theme. Neutral names on purpose: each is a coherent
 * identity, not a brand.
 */
export declare const THEME_PRESETS: ThemePresetDefinition[];
/**
 * Radius option → the three `--pt-radius-*` tokens the stylesheet reads.
 * `ctl` = controls (buttons, inputs, pills, nav links), `card` = surfaces
 * (cards, tables, popovers, modals), `item` = small inner items (menu rows,
 * chips, paginator pages). `md` matches the reference shadcn geometry
 * (rounded-md controls, rounded-xl cards) and is the default.
 */
export declare const RADIUS_TOKENS: Record<ThemeRadius, {
    card: string;
    ctl: string;
    item: string;
}>;
/** Validate user options (clear errors) and return everything needed downstream. */
export declare function resolveOptions(options: PayloadThemeOptions): {
    accent: string;
    cssVariables?: Record<string, string>;
    resolved: ResolvedThemeConfig;
};
