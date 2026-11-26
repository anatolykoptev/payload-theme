'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useConfig, useNav, usePreferences, useTheme } from '@payloadcms/ui';
import React from 'react';
import { RADIUS_TOKENS, THEME_PRESETS } from '../../options.js';
import { buildTheme, DARK_MODES, DENSITIES, FONT_KEYS, FONT_PRESETS, FRAMES, isValidHex, NEUTRAL_PALETTES, NEUTRALS, normalizeHex, resolveFont, SURFACE_DEFAULTS, surfaceToCss, themeToCss, WIDGETS_POSITIONS } from '../../theme/index.js';
import { useThemeTranslation } from '../../translations/useThemeTranslation.js';
import { Icon } from '../Icon/index.js';
import { BOOT_STORAGE_KEY, BOOT_STYLE_ID, FONT_LINK_ID } from '../ThemeProvider/boot.js';
import { UserMenu } from '../UserMenu/index.js';
import { rememberSidebarWish } from '../useDockedNav.js';
/**
 * Right side of the app header: the theme customizer (palette icon, unless
 * the `customizer` option is false), a light/dark toggle and the compact
 * user menu. Registered through
 * `admin.components.actions`, so it renders on every authed admin page.
 *
 * The customizer applies RUNTIME overrides on top of the plugin config —
 * one-click theme presets, accent (10 presets + any hex), corner radius,
 * typeface, neutral family, density, frame, dark depth and content layout —
 * and persists them in localStorage so they
 * survive reloads. "Copy config" turns whatever is on screen into a
 * ready-to-paste `payloadTheme({ ... })` snippet; "Reset to Default" clears
 * everything back to the `payloadTheme({ ... })` options.
 */ const STORAGE_KEY = 'payload-theme-overrides';
const OVERRIDE_STYLE_ID = 'pt-theme-override';
const SURFACE_STYLE_ID = 'pt-surface-override';
/** 10 curated accents (the swatch row); any custom hex works via the input. */ const PRESET_ACCENTS = [
    '#18181b',
    '#4f4ece',
    '#2563eb',
    '#0284c7',
    '#0d9488',
    '#059669',
    '#ea580c',
    '#dc2626',
    '#db2777',
    '#7c3aed'
];
const RADIUS_OPTIONS = [
    'none',
    'sm',
    'md',
    'lg',
    'full'
];
/** Runtime-selectable fonts: 'default' keeps the config/Payload font. */ const FONT_OPTIONS = FONT_KEYS;
const SURFACE_KEYS = [
    'neutral',
    'dark',
    'density',
    'frame',
    'widgets'
];
function readOverrides() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        const out = {};
        if (typeof parsed.accent === 'string' && isValidHex(parsed.accent)) out.accent = parsed.accent;
        if (parsed.radius && RADIUS_OPTIONS.includes(parsed.radius)) out.radius = parsed.radius;
        if (parsed.layout === 'full' || parsed.layout === 'centered') out.layout = parsed.layout;
        if (parsed.neutral && NEUTRALS.includes(parsed.neutral)) out.neutral = parsed.neutral;
        if (parsed.dark && DARK_MODES.includes(parsed.dark)) out.dark = parsed.dark;
        if (parsed.density && DENSITIES.includes(parsed.density)) out.density = parsed.density;
        if (parsed.frame && FRAMES.includes(parsed.frame)) out.frame = parsed.frame;
        if (parsed.widgets && WIDGETS_POSITIONS.includes(parsed.widgets)) out.widgets = parsed.widgets;
        if (typeof parsed.font === 'string' && parsed.font !== 'default' && FONT_OPTIONS.includes(parsed.font)) out.font = parsed.font;
        return out;
    } catch  {
        return {};
    }
}
/** Apply (or clear) every override on the live document. Pure DOM — the
 * injected <style> comes after the ThemeProvider's, so it wins in-layer.
 * `base` is the plugin config's surface, which surface overrides sit on. */ function applyOverrides(overrides, base = SURFACE_DEFAULTS) {
    const root = document.documentElement;
    // everything applied below, mirrored as plain CSS for the next page load
    const boot = {
        css: [],
        vars: {}
    };
    // accent → recompute the full scale client-side (same engine as the server).
    // Doubled selectors out-rank the ThemeProvider's :root block (which sits
    // later in document order, inside <body>) at equal cascade layer.
    const existing = document.getElementById(OVERRIDE_STYLE_ID);
    if (overrides.accent) {
        let css = null;
        try {
            css = themeToCss(buildTheme(overrides.accent), {
                darkSelector: "html[data-theme='dark']:root",
                rootSelector: ':root:root'
            });
        } catch  {
        // an unparsable hex must never break the panel — just skip applying
        }
        if (css) {
            boot.css.push(css);
            if (existing) {
                existing.textContent = css;
            } else {
                const el = document.createElement('style');
                el.id = OVERRIDE_STYLE_ID;
                el.textContent = css;
                document.head.appendChild(el);
            }
        }
    } else {
        existing?.remove();
    }
    // radius → the three tokens the whole stylesheet reads
    if (overrides.radius) {
        const tokens = RADIUS_TOKENS[overrides.radius];
        root.style.setProperty('--pt-radius-card', tokens.card);
        root.style.setProperty('--pt-radius-ctl', tokens.ctl);
        root.style.setProperty('--pt-radius-item', tokens.item);
        boot.vars['--pt-radius-card'] = tokens.card;
        boot.vars['--pt-radius-ctl'] = tokens.ctl;
        boot.vars['--pt-radius-item'] = tokens.item;
    } else {
        root.style.removeProperty('--pt-radius-card');
        root.style.removeProperty('--pt-radius-ctl');
        root.style.removeProperty('--pt-radius-item');
    }
    // font → --font-body inline (beats every stylesheet) + webfont <link>
    const fontLink = document.getElementById(FONT_LINK_ID);
    if (overrides.font) {
        const { stack, url } = resolveFont(overrides.font);
        if (stack) {
            root.style.setProperty('--font-body', stack);
            boot.vars['--font-body'] = stack;
        }
        if (url) {
            boot.font = url;
            if (fontLink) {
                if (fontLink.href !== url) fontLink.href = url;
            } else {
                const el = document.createElement('link');
                el.id = FONT_LINK_ID;
                el.rel = 'stylesheet';
                el.href = url;
                document.head.appendChild(el);
            }
        } else {
            fontLink?.remove();
        }
    } else {
        root.style.removeProperty('--font-body');
        fontLink?.remove();
    }
    // neutral / dark depth / density / frame / widgets position → one token block, spelled out in
    // full (defaults included) with doubled selectors, so a runtime choice beats
    // whatever the config emitted — including a switch back to the defaults
    const surfaceStyle = document.getElementById(SURFACE_STYLE_ID);
    if (SURFACE_KEYS.some((key)=>overrides[key] !== undefined)) {
        const css = surfaceToCss({
            dark: overrides.dark ?? base.dark,
            density: overrides.density ?? base.density,
            frame: overrides.frame ?? base.frame,
            neutral: overrides.neutral ?? base.neutral,
            widgets: overrides.widgets ?? base.widgets
        }, {
            darkSelector: "html[data-theme='dark']:root",
            full: true,
            rootSelector: ':root:root'
        });
        boot.css.push(css);
        if (surfaceStyle) {
            surfaceStyle.textContent = css;
        } else {
            const el = document.createElement('style');
            el.id = SURFACE_STYLE_ID;
            el.textContent = css;
            document.head.appendChild(el);
        }
    } else {
        surfaceStyle?.remove();
    }
    // content layout → the container cap variable
    if (overrides.layout === 'full') {
        root.style.setProperty('--pt-content-width', '100%');
        boot.vars['--pt-content-width'] = '100%';
    } else {
        root.style.removeProperty('--pt-content-width');
    }
    // The live elements above now carry everything: retire the boot copy and
    // store the fresh snapshot for the next full page load.
    document.getElementById(BOOT_STYLE_ID)?.remove();
    const vars = Object.entries(boot.vars);
    if (vars.length > 0) {
        // unlayered, like the inline styles they stand in for (--font-body is
        // declared outside any layer by Payload, so a layered copy would lose)
        boot.css.push(`:root:root { ${vars.map(([name, value])=>`${name}: ${value};`).join(' ')} }`);
    }
    persistBoot(boot.css.length > 0 || boot.font ? {
        css: boot.css.join('\n'),
        font: boot.font
    } : null);
}
function persistBoot(snapshot) {
    try {
        if (snapshot) window.localStorage.setItem(BOOT_STORAGE_KEY, JSON.stringify(snapshot));
        else window.localStorage.removeItem(BOOT_STORAGE_KEY);
    } catch  {
    // storage unavailable — the overrides still apply after hydration
    }
}
function persistOverrides(overrides) {
    try {
        if (Object.keys(overrides).length === 0) window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch  {
    // storage may be unavailable (private mode) — overrides still apply live
    }
}
/** Copy with the async clipboard API, falling back to a hidden textarea. */ async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch  {
    // fall through to execCommand
    }
    try {
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        const ok = document.execCommand('copy');
        el.remove();
        return ok;
    } catch  {
        return false;
    }
}
/** Desktop sidebar collapse chip, pinned to the app header's LEFT edge via
 * CSS (the .pt-header-actions container sits on the right). Living inside
 * the header row keeps it perfectly aligned with the right-side buttons in
 * every scroll state — Payload's own toggler renders outside the content
 * card and could never line up. Hidden while the sidebar is a drawer (≤1440px,
 * or below `nav.dockedMinWidth`): the drawer has its own toggler. `useNav` is
 * Payload's context, so the grid animates as usual.
 *
 * The choice is saved the way Payload's own toggler saves it: Payload reads the
 * user's `nav` preference on every page load to decide whether the sidebar
 * starts open, and on desktop this chip replaces the only control that wrote
 * it. Merged, so the stored nav group states survive. */ const NavCollapse = ()=>{
    const { navOpen, setNavOpen } = useNav();
    const { setPreference } = usePreferences();
    const { t } = useThemeTranslation();
    const label = navOpen ? t('payloadTheme:collapseSidebar') : t('payloadTheme:expandSidebar');
    const toggle = ()=>{
        const open = !navOpen;
        setNavOpen(open);
        rememberSidebarWish(open);
        // Payload's PREFERENCE_KEYS.NAV, spelled out: that constant only exists in
        // later 3.x releases, and the peer range starts at 3.0.
        void setPreference('nav', {
            open
        }, true);
    };
    return /*#__PURE__*/ _jsx("button", {
        "aria-expanded": navOpen,
        "aria-label": label,
        className: "pt-header-btn pt-nav-collapse",
        onClick: toggle,
        title: label,
        type: "button",
        children: /*#__PURE__*/ _jsx(Icon, {
            "aria-hidden": "true",
            name: navOpen ? 'panel-left-close' : 'panel-left-open',
            strokeWidth: 1.9
        })
    });
};
/** Sun/moon toggle. `useTheme` is Payload's own hook, so the choice lands in
 * the same preference store as the Account page's "Admin Theme" radios. */ const ThemeToggle = ()=>{
    const { setTheme, theme } = useTheme();
    const { t } = useThemeTranslation();
    const isDark = theme === 'dark';
    return /*#__PURE__*/ _jsx("button", {
        "aria-label": isDark ? t('payloadTheme:switchToLightMode') : t('payloadTheme:switchToDarkMode'),
        className: "pt-header-btn",
        onClick: ()=>setTheme(isDark ? 'light' : 'dark'),
        title: isDark ? t('payloadTheme:lightMode') : t('payloadTheme:darkMode'),
        type: "button",
        children: /*#__PURE__*/ _jsx(Icon, {
            "aria-hidden": "true",
            name: isDark ? 'sun' : 'moon',
            strokeWidth: 1.9
        })
    });
};
const Customizer = ()=>{
    const { config } = useConfig();
    const { setTheme, theme } = useTheme();
    const { t } = useThemeTranslation();
    const themeConfig = config.admin?.custom?.payloadTheme;
    const [open, setOpen] = React.useState(false);
    const [overrides, setOverrides] = React.useState({});
    const [hexDraft, setHexDraft] = React.useState('');
    const [copied, setCopied] = React.useState(false);
    const copyTimer = React.useRef(undefined);
    const rootRef = React.useRef(null);
    const configSurface = themeConfig?.surface ?? SURFACE_DEFAULTS;
    // Load persisted overrides once and apply them (covers full page loads).
    React.useEffect(()=>{
        const stored = readOverrides();
        setOverrides(stored);
        applyOverrides(stored, configSurface);
    // configSurface comes from the static config — it never changes at runtime
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(()=>{
        return ()=>window.clearTimeout(copyTimer.current);
    }, []);
    // Close on outside click / ESC while open.
    React.useEffect(()=>{
        if (!open) return;
        const onPointerDown = (event)=>{
            if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        const onKeyDown = (event)=>{
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return ()=>{
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [
        open
    ]);
    const update = (next)=>{
        setOverrides(next);
        applyOverrides(next, configSurface);
        persistOverrides(next);
    };
    const configAccent = themeConfig?.accent ?? '#4f4ece';
    const configRadius = themeConfig?.radius ?? 'md';
    const configFont = themeConfig?.font ?? 'default';
    const activeAccent = overrides.accent ?? configAccent;
    const activeRadius = overrides.radius ?? configRadius;
    const activeFont = overrides.font ?? configFont;
    const activeLayout = overrides.layout ?? 'centered';
    const activeSurface = {
        dark: overrides.dark ?? configSurface.dark,
        density: overrides.density ?? configSurface.density,
        frame: overrides.frame ?? configSurface.frame,
        neutral: overrides.neutral ?? configSurface.neutral,
        widgets: overrides.widgets ?? configSurface.widgets
    };
    // the widgets control is only worth showing when there is something to move
    const hasWidgets = (themeConfig?.dashboard?.widgets?.length ?? 0) > 0;
    /** Set one surface option; picking the config's own value drops the override. */ const pickSurface = (key, value)=>{
        const next = {
            ...overrides
        };
        if (value === configSurface[key]) delete next[key];
        else next[key] = value;
        update(next);
    };
    const pickAccent = (hex)=>{
        const normalized = normalizeHex(hex);
        setHexDraft('');
        if (normalized === configAccent) {
            const { accent: _accent, ...rest } = overrides;
            update(rest);
        } else {
            update({
                ...overrides,
                accent: normalized
            });
        }
    };
    const onHexInput = (raw)=>{
        const value = raw.startsWith('#') || raw === '' ? raw : `#${raw}`;
        setHexDraft(value);
        if (isValidHex(value)) pickAccent(value);
    };
    const pickFont = (font)=>{
        if (font === configFont) {
            const { font: _font, ...rest } = overrides;
            update(rest);
        } else {
            update({
                ...overrides,
                font
            });
        }
    };
    const applyPreset = (preset)=>{
        setHexDraft('');
        const next = {
            ...overrides
        };
        if (normalizeHex(preset.accent) === configAccent) delete next.accent;
        else next.accent = normalizeHex(preset.accent);
        if (preset.radius === configRadius) delete next.radius;
        else next.radius = preset.radius;
        if (preset.font === configFont) delete next.font;
        else next.font = preset.font;
        if (preset.neutral === configSurface.neutral) delete next.neutral;
        else next.neutral = preset.neutral;
        update(next);
    };
    const isPresetActive = (preset)=>activeAccent.toLowerCase() === preset.accent.toLowerCase() && activeRadius === preset.radius && activeFont === preset.font && activeSurface.neutral === preset.neutral;
    /** The current on-screen look as a paste-ready plugin config. An exact
   * preset match copies as the one-word `preset:` form — the same six looks
   * back the option and this row, so the snippet stays as short as the config
   * that produced it. */ const copyConfig = async ()=>{
        const matched = THEME_PRESETS.find(isPresetActive);
        const lines = matched ? [
            `  preset: '${matched.key}',`
        ] : [
            `  accent: '${activeAccent}',`,
            `  radius: '${activeRadius}',`
        ];
        if (!matched && activeFont !== 'default') lines.push(`  font: '${activeFont}',`);
        if (!matched && activeSurface.neutral !== SURFACE_DEFAULTS.neutral) {
            lines.push(`  neutral: '${activeSurface.neutral}',`);
        }
        if (activeSurface.density !== SURFACE_DEFAULTS.density) {
            lines.push(`  density: '${activeSurface.density}',`);
        }
        if (activeSurface.frame !== SURFACE_DEFAULTS.frame) {
            lines.push(`  frame: '${activeSurface.frame}',`);
        }
        if (activeSurface.dark !== SURFACE_DEFAULTS.dark) {
            lines.push(`  darkMode: '${activeSurface.dark}',`);
        }
        if (hasWidgets && activeSurface.widgets !== SURFACE_DEFAULTS.widgets) {
            lines.push(`  dashboard: { widgetsPosition: '${activeSurface.widgets}' },`);
        }
        const snippet = `payloadTheme({\n${lines.join('\n')}\n})`;
        const ok = await copyText(snippet);
        if (ok) {
            setCopied(true);
            window.clearTimeout(copyTimer.current);
            copyTimer.current = window.setTimeout(()=>setCopied(false), 1600);
        }
    };
    const reset = ()=>{
        update({});
        setHexDraft('');
    };
    // The panel-configured accent leads the swatch row; the curated presets
    // follow (minus a duplicate of the configured color).
    const swatches = React.useMemo(()=>{
        const rest = PRESET_ACCENTS.filter((hex)=>hex.toLowerCase() !== configAccent.toLowerCase());
        return [
            configAccent,
            ...rest
        ].slice(0, PRESET_ACCENTS.length);
    }, [
        configAccent
    ]);
    return /*#__PURE__*/ _jsxs("div", {
        className: "pt-custom",
        ref: rootRef,
        children: [
            /*#__PURE__*/ _jsx("button", {
                "aria-expanded": open,
                "aria-haspopup": "dialog",
                "aria-label": t('payloadTheme:themeSettings'),
                className: "pt-header-btn",
                onClick: ()=>setOpen((current)=>!current),
                title: t('payloadTheme:themeSettings'),
                type: "button",
                children: /*#__PURE__*/ _jsx(Icon, {
                    "aria-hidden": "true",
                    name: "palette",
                    strokeWidth: 1.9
                })
            }),
            open ? /*#__PURE__*/ _jsxs("div", {
                "aria-label": t('payloadTheme:themeSettings'),
                className: "pt-custom__panel",
                role: "dialog",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:presets')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__presets",
                                children: THEME_PRESETS.map((preset)=>/*#__PURE__*/ _jsxs("button", {
                                        "aria-pressed": isPresetActive(preset),
                                        className: [
                                            'pt-custom__preset',
                                            isPresetActive(preset) && 'pt-custom__preset--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>applyPreset(preset),
                                        title: `${preset.label} — ${preset.accent}, ${preset.radius}, ${FONT_PRESETS[preset.font]?.label ?? 'default'}`,
                                        type: "button",
                                        children: [
                                            /*#__PURE__*/ _jsx("span", {
                                                "aria-hidden": "true",
                                                className: "pt-custom__preset-dot",
                                                style: {
                                                    backgroundColor: preset.accent
                                                }
                                            }),
                                            preset.label
                                        ]
                                    }, preset.key))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:accent')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__swatches",
                                children: swatches.map((hex)=>/*#__PURE__*/ _jsx("button", {
                                        "aria-label": t('payloadTheme:accentSwatch', {
                                            hex
                                        }),
                                        "aria-pressed": activeAccent.toLowerCase() === hex.toLowerCase(),
                                        className: [
                                            'pt-custom__swatch',
                                            activeAccent.toLowerCase() === hex.toLowerCase() && 'pt-custom__swatch--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>pickAccent(hex),
                                        style: {
                                            backgroundColor: hex
                                        },
                                        title: hex,
                                        type: "button"
                                    }, hex))
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "pt-custom__hex",
                                children: [
                                    /*#__PURE__*/ _jsx("span", {
                                        "aria-hidden": "true",
                                        className: "pt-custom__hex-preview",
                                        style: {
                                            backgroundColor: activeAccent
                                        }
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        "aria-label": t('payloadTheme:customAccentHex'),
                                        className: "pt-custom__hex-input",
                                        maxLength: 7,
                                        onChange: (event)=>onHexInput(event.target.value),
                                        placeholder: activeAccent,
                                        spellCheck: false,
                                        type: "text",
                                        value: hexDraft
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:neutral')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__presets",
                                children: NEUTRALS.map((neutral)=>/*#__PURE__*/ _jsxs("button", {
                                        "aria-pressed": activeSurface.neutral === neutral,
                                        className: [
                                            'pt-custom__preset',
                                            activeSurface.neutral === neutral && 'pt-custom__preset--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>pickSurface('neutral', neutral),
                                        title: neutral,
                                        type: "button",
                                        children: [
                                            /*#__PURE__*/ _jsx("span", {
                                                "aria-hidden": "true",
                                                className: "pt-custom__preset-dot",
                                                style: {
                                                    background: `linear-gradient(135deg, ${NEUTRAL_PALETTES[neutral][200]} 50%, ${NEUTRAL_PALETTES[neutral][700]} 50%)`
                                                }
                                            }),
                                            neutral.charAt(0).toUpperCase() + neutral.slice(1)
                                        ]
                                    }, neutral))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:radius')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__segments",
                                children: RADIUS_OPTIONS.map((option)=>/*#__PURE__*/ _jsx("button", {
                                        "aria-pressed": activeRadius === option,
                                        className: [
                                            'pt-custom__segment',
                                            activeRadius === option && 'pt-custom__segment--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>{
                                            if (option === configRadius) {
                                                const { radius: _radius, ...rest } = overrides;
                                                update(rest);
                                            } else {
                                                update({
                                                    ...overrides,
                                                    radius: option
                                                });
                                            }
                                        },
                                        type: "button",
                                        children: option === 'none' ? /*#__PURE__*/ _jsx(Icon, {
                                            "aria-hidden": "true",
                                            name: "ban",
                                            strokeWidth: 1.9
                                        }) : option.toUpperCase()
                                    }, option))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:font')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__fonts",
                                children: FONT_OPTIONS.map((option)=>{
                                    const preset = option === 'default' ? null : FONT_PRESETS[option];
                                    return /*#__PURE__*/ _jsx("button", {
                                        "aria-pressed": activeFont === option,
                                        className: [
                                            'pt-custom__font',
                                            activeFont === option && 'pt-custom__font--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>pickFont(option),
                                        style: preset ? {
                                            fontFamily: preset.stack
                                        } : undefined,
                                        type: "button",
                                        children: preset?.label ?? t('payloadTheme:fontDefault')
                                    }, option);
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:density')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__segments",
                                children: DENSITIES.map((density)=>/*#__PURE__*/ _jsx("button", {
                                        "aria-pressed": activeSurface.density === density,
                                        className: [
                                            'pt-custom__segment',
                                            activeSurface.density === density && 'pt-custom__segment--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>pickSurface('density', density),
                                        type: "button",
                                        children: density === 'comfortable' ? t('payloadTheme:densityComfortable') : t('payloadTheme:densityCompact')
                                    }, density))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:frame')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__segments",
                                children: FRAMES.map((frame)=>/*#__PURE__*/ _jsx("button", {
                                        "aria-pressed": activeSurface.frame === frame,
                                        className: [
                                            'pt-custom__segment',
                                            activeSurface.frame === frame && 'pt-custom__segment--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>pickSurface('frame', frame),
                                        type: "button",
                                        children: frame === 'inset' ? t('payloadTheme:frameInset') : t('payloadTheme:frameFlat')
                                    }, frame))
                            })
                        ]
                    }),
                    hasWidgets ? /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:widgets')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__segments",
                                children: WIDGETS_POSITIONS.map((position)=>/*#__PURE__*/ _jsx("button", {
                                        "aria-pressed": activeSurface.widgets === position,
                                        className: [
                                            'pt-custom__segment',
                                            activeSurface.widgets === position && 'pt-custom__segment--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>pickSurface('widgets', position),
                                        type: "button",
                                        children: position === 'top' ? t('payloadTheme:widgetsTop') : t('payloadTheme:widgetsBottom')
                                    }, position))
                            })
                        ]
                    }) : null,
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:colorMode')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__segments",
                                children: [
                                    'light',
                                    'dark'
                                ].map((mode)=>/*#__PURE__*/ _jsx("button", {
                                        "aria-pressed": theme === mode,
                                        className: [
                                            'pt-custom__segment',
                                            theme === mode && 'pt-custom__segment--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>setTheme(mode),
                                        type: "button",
                                        children: mode === 'light' ? t('general:light') : t('general:dark')
                                    }, mode))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:darkDepth')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__segments",
                                children: DARK_MODES.map((dark)=>/*#__PURE__*/ _jsx("button", {
                                        "aria-pressed": activeSurface.dark === dark,
                                        className: [
                                            'pt-custom__segment',
                                            activeSurface.dark === dark && 'pt-custom__segment--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>pickSurface('dark', dark),
                                        type: "button",
                                        children: dark === 'deep' ? t('payloadTheme:darkDeep') : t('payloadTheme:darkDim')
                                    }, dark))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__section",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__label",
                                children: t('payloadTheme:contentLayout')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-custom__segments",
                                children: [
                                    'centered',
                                    'full'
                                ].map((mode)=>/*#__PURE__*/ _jsx("button", {
                                        "aria-pressed": activeLayout === mode,
                                        className: [
                                            'pt-custom__segment',
                                            activeLayout === mode && 'pt-custom__segment--active'
                                        ].filter(Boolean).join(' '),
                                        onClick: ()=>{
                                            if (mode === 'centered') {
                                                const { layout: _layout, ...rest } = overrides;
                                                update(rest);
                                            } else {
                                                update({
                                                    ...overrides,
                                                    layout: mode
                                                });
                                            }
                                        },
                                        type: "button",
                                        children: mode === 'centered' ? t('payloadTheme:layoutCentered') : t('payloadTheme:layoutFull')
                                    }, mode))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-custom__footer",
                        children: [
                            /*#__PURE__*/ _jsxs("button", {
                                className: [
                                    'pt-custom__copy',
                                    copied && 'pt-custom__copy--done'
                                ].filter(Boolean).join(' '),
                                onClick: ()=>void copyConfig(),
                                title: t('payloadTheme:copyConfigTitle'),
                                type: "button",
                                children: [
                                    /*#__PURE__*/ _jsx(Icon, {
                                        "aria-hidden": "true",
                                        name: copied ? 'check' : 'clipboard',
                                        strokeWidth: 1.9
                                    }),
                                    copied ? t('payloadTheme:copied') : t('payloadTheme:copyConfig')
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("button", {
                                className: "pt-custom__reset",
                                onClick: reset,
                                type: "button",
                                children: [
                                    /*#__PURE__*/ _jsx(Icon, {
                                        "aria-hidden": "true",
                                        name: "rotate-ccw",
                                        strokeWidth: 1.9
                                    }),
                                    t('general:reset')
                                ]
                            })
                        ]
                    })
                ]
            }) : null
        ]
    });
};
export const HeaderActions = ()=>{
    const { config } = useConfig();
    const themeConfig = config.admin?.custom?.payloadTheme;
    // `customizer: false` — no button, and so no saved overrides re-applied
    const showCustomizer = themeConfig?.customizer !== false;
    return /*#__PURE__*/ _jsxs("div", {
        className: "pt-header-actions",
        children: [
            /*#__PURE__*/ _jsx(NavCollapse, {}),
            showCustomizer ? /*#__PURE__*/ _jsx(Customizer, {}) : null,
            /*#__PURE__*/ _jsx(ThemeToggle, {}),
            /*#__PURE__*/ _jsx(UserMenu, {
                variant: "header"
            })
        ]
    });
};
export default HeaderActions;
