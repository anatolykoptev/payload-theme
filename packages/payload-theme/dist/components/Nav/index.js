'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getTranslation } from '@payloadcms/translations';
import { Link, useAuth, useConfig, useEntityVisibility, useNav, useTranslation } from '@payloadcms/ui';
import { PayloadLogo } from '@payloadcms/ui/graphics/Logo';
import { usePathname } from 'next/navigation.js';
import { formatAdminURL } from 'payload/shared';
import React from 'react';
import { useThemeTranslation } from '../../translations/useThemeTranslation.js';
import { CommandPalette } from '../CommandPalette/index.js';
import { DocOutline } from '../DocOutline/index.js';
import { Icon } from '../Icon/index.js';
import { ShortcutsModal } from '../ShortcutsModal/index.js';
import { UserMenu } from '../UserMenu/index.js';
import { resolveIconName } from '../navIcons.js';
const NavItemLink = ({ exact, item, pathname })=>{
    const { href, iconName, id, label } = item;
    // Same active check as Payload's DefaultNav: the link is active on its own
    // route and on any sub-route (e.g. a document edit view). `exact` restricts
    // it to the route itself (used by Dashboard, whose href prefixes everything).
    const isActive = exact ? pathname === href || pathname === `${href}/` : pathname.startsWith(href) && [
        '/',
        undefined
    ].includes(pathname[href.length]);
    const className = [
        'pt-nav__link',
        isActive && 'pt-nav__link--active'
    ].filter(Boolean).join(' ');
    const content = /*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            /*#__PURE__*/ _jsx(Icon, {
                "aria-hidden": "true",
                className: "pt-nav__icon",
                name: iconName,
                strokeWidth: 1.9
            }),
            /*#__PURE__*/ _jsx("span", {
                className: "pt-nav__label",
                children: label
            })
        ]
    });
    // Exactly like the default nav: the link for the page you are already on is
    // rendered as a plain div so it is not a self-navigating anchor.
    if (pathname === href) {
        return /*#__PURE__*/ _jsx("div", {
            "aria-current": "page",
            className: className,
            id: id,
            children: content
        });
    }
    return /*#__PURE__*/ _jsx(Link, {
        className: className,
        href: href,
        id: id,
        prefetch: false,
        children: content
    });
};
/** True for a Payload import-map component path (e.g. `/components/X#X`). */ const isComponentPath = (value)=>value.includes('#');
/** Last resolved shortcut label. Module scope, so the Nav's remount on every
 * navigation starts from the platform's label instead of replaying the ⌘K →
 * Ctrl K swap (see the icon cache in ../Icon for the same reason). */ let shortcutLabel = '⌘K';
/** Search pill under the logo — opens the ⌘K palette. The shortcut label is
 * resolved after mount so server HTML never guesses the platform. */ const NavSearch = ()=>{
    const { t } = useThemeTranslation();
    const [shortcut, setShortcut] = React.useState(shortcutLabel);
    React.useEffect(()=>{
        shortcutLabel = /win|linux/i.test(navigator.platform) ? 'Ctrl K' : '⌘K';
        setShortcut(shortcutLabel);
    }, []);
    return /*#__PURE__*/ _jsxs("button", {
        className: "pt-nav__search",
        onClick: ()=>window.dispatchEvent(new CustomEvent('pt:open-palette')),
        type: "button",
        children: [
            /*#__PURE__*/ _jsx(Icon, {
                "aria-hidden": "true",
                className: "pt-nav__search-icon",
                name: "search",
                strokeWidth: 2
            }),
            /*#__PURE__*/ _jsx("span", {
                className: "pt-nav__search-label",
                children: t('payloadTheme:search')
            }),
            /*#__PURE__*/ _jsx("kbd", {
                className: "pt-nav__search-kbd",
                suppressHydrationWarning: true,
                children: shortcut
            })
        ]
    });
};
/** How far the entity list was scrolled, kept at module scope for the same
 * reason as the icon cache: Payload renders the Nav inside `DefaultTemplate`,
 * which belongs to the page rather than the layout, so every navigation
 * remounts the sidebar and throws its scrolled `<nav>` node away. */ let navScrollTop = 0;
/** SSR-safe layout effect: restoring the offset must happen before the browser
 * paints, but the Nav is server-rendered too and `useLayoutEffect` warns there. */ const useIsomorphicLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
/**
 * Keeps the menu's scroll offset across navigations: remembers it while the
 * user scrolls and puts it back on the next mount, so clicking a collection
 * you had to scroll down to no longer snaps the sidebar back to the top.
 */ const useNavScrollMemory = ()=>{
    const ref = React.useRef(null);
    useIsomorphicLayoutEffect(()=>{
        const element = ref.current;
        if (!element) return;
        // Clamped by the browser, so a shorter menu (fewer permitted entities)
        // simply lands at its own bottom instead of an impossible offset.
        if (navScrollTop > 0) element.scrollTop = navScrollTop;
        const onScroll = ()=>{
            navScrollTop = element.scrollTop;
        };
        element.addEventListener('scroll', onScroll, {
            passive: true
        });
        return ()=>element.removeEventListener('scroll', onScroll);
    }, []);
    return ref;
};
export const Nav = ()=>{
    const pathname = usePathname();
    const { config } = useConfig();
    const { i18n } = useTranslation();
    const { permissions } = useAuth();
    const { isEntityVisible } = useEntityVisibility();
    const { hydrated, navOpen, navRef, setNavOpen, shouldAnimate } = useNav();
    const menuRef = useNavScrollMemory();
    // Close the mobile drawer when the command palette opens (from ⌘K OR the
    // search pill), so the palette never layers over/beside the open drawer.
    // Desktop (>1440px) keeps its always-on nav — hence the media-query gate.
    React.useEffect(()=>{
        const onPaletteOpen = ()=>{
            if (window.matchMedia('(max-width: 1440px)').matches) setNavOpen(false);
        };
        // Esc also closes the mobile drawer (it has no X — backdrop tap or Esc).
        const onKeyDown = (event)=>{
            if (event.key === 'Escape' && window.matchMedia('(max-width: 1440px)').matches) setNavOpen(false);
        };
        window.addEventListener('pt:palette-open', onPaletteOpen);
        window.addEventListener('keydown', onKeyDown);
        return ()=>{
            window.removeEventListener('pt:palette-open', onPaletteOpen);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [
        setNavOpen
    ]);
    const theme = config.admin?.custom?.payloadTheme;
    const { collections, globals, routes: { admin: adminRoute } } = config;
    // ---- build nav groups (mirrors @payloadcms/ui's groupNavItems) ----------
    const defaultCollectionsGroup = {
        entities: [],
        label: i18n.t('general:collections')
    };
    const defaultGlobalsGroup = {
        entities: [],
        label: i18n.t('general:globals')
    };
    const groups = [
        defaultCollectionsGroup,
        defaultGlobalsGroup
    ];
    const addEntity = ({ defaultGroup, group, item })=>{
        if (group === false) return;
        if (group) {
            const translated = getTranslation(group, i18n);
            let matched = groups.find((existing)=>existing.label === translated);
            if (!matched) {
                matched = {
                    entities: [],
                    label: translated
                };
                groups.push(matched);
            }
            matched.entities.push(item);
        } else {
            defaultGroup.entities.push(item);
        }
    };
    for (const collection of collections){
        const { slug } = collection;
        if (!isEntityVisible({
            collectionSlug: slug
        }) || !permissions?.collections?.[slug]?.read) continue;
        addEntity({
            defaultGroup: defaultCollectionsGroup,
            group: collection.admin?.group,
            item: {
                href: formatAdminURL({
                    adminRoute,
                    path: `/collections/${slug}`
                }),
                iconName: resolveIconName(theme, slug),
                id: `nav-${slug}`,
                label: getTranslation(collection.labels?.plural, i18n)
            }
        });
    }
    for (const global of globals){
        const { slug } = global;
        if (!isEntityVisible({
            globalSlug: slug
        }) || !permissions?.globals?.[slug]?.read) continue;
        addEntity({
            defaultGroup: defaultGlobalsGroup,
            group: global.admin?.group,
            item: {
                href: formatAdminURL({
                    adminRoute,
                    path: `/globals/${slug}`
                }),
                iconName: resolveIconName(theme, slug),
                id: `nav-global-${slug}`,
                label: getTranslation(global.label, i18n)
            }
        });
    }
    const visibleGroups = groups.filter((group)=>group.entities.length > 0);
    const dashboardItem = {
        href: adminRoute,
        iconName: theme?.nav?.icons?.dashboard ?? 'layout-dashboard',
        id: 'nav-dashboard',
        label: i18n.t('general:dashboard')
    };
    // A plain image URL renders as the logo; a component-path or missing value
    // falls back to Payload's own logo (adapts to light/dark automatically).
    // When light/dark URLs differ, both render and CSS shows the right one.
    const logo = theme?.logo;
    const logoIsImage = logo && !isComponentPath(logo.light);
    const logoIsPair = logoIsImage && logo.dark !== logo.light;
    const asideClasses = [
        'nav',
        'pt-nav',
        navOpen && 'nav--nav-open',
        shouldAnimate && 'nav--nav-animate',
        hydrated && 'nav--nav-hydrated'
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ _jsxs("aside", {
        className: asideClasses,
        inert: !navOpen,
        children: [
            /*#__PURE__*/ _jsx("div", {
                "aria-hidden": "true",
                className: "pt-nav__backdrop",
                onClick: ()=>setNavOpen(false)
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "nav__scroll",
                ref: navRef,
                children: [
                    /*#__PURE__*/ _jsx(Link, {
                        "aria-label": theme?.logoLink?.label ?? i18n.t('general:dashboard'),
                        className: "pt-nav__logo",
                        href: theme?.logoLink?.href ?? adminRoute,
                        prefetch: false,
                        children: logoIsImage ? logoIsPair ? /*#__PURE__*/ _jsxs(React.Fragment, {
                            children: [
                                /*#__PURE__*/ _jsx("img", {
                                    alt: "",
                                    className: "pt-nav__logo-img pt-nav__logo-img--light",
                                    src: logo.light
                                }),
                                /*#__PURE__*/ _jsx("img", {
                                    alt: "",
                                    className: "pt-nav__logo-img pt-nav__logo-img--dark",
                                    src: logo.dark
                                })
                            ]
                        }) : /*#__PURE__*/ _jsx("img", {
                            alt: "",
                            className: "pt-nav__logo-img",
                            src: logo.light
                        }) : /*#__PURE__*/ _jsx(PayloadLogo, {})
                    }),
                    /*#__PURE__*/ _jsx(NavSearch, {}),
                    /*#__PURE__*/ _jsxs("nav", {
                        className: "nav__wrap pt-nav__wrap",
                        ref: menuRef,
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "pt-nav__group",
                                children: /*#__PURE__*/ _jsx(NavItemLink, {
                                    item: dashboardItem,
                                    exact: true,
                                    pathname: pathname
                                })
                            }),
                            visibleGroups.map((group)=>/*#__PURE__*/ _jsxs("div", {
                                    className: "pt-nav__group",
                                    children: [
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "pt-nav__group-label",
                                            children: group.label
                                        }),
                                        group.entities.map((item)=>/*#__PURE__*/ _jsx(NavItemLink, {
                                                item: item,
                                                pathname: pathname
                                            }, item.id))
                                    ]
                                }, group.label))
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "nav__controls pt-nav__controls",
                        children: /*#__PURE__*/ _jsx(UserMenu, {
                            variant: "sidebar"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(CommandPalette, {}),
            /*#__PURE__*/ _jsx(ShortcutsModal, {}),
            /*#__PURE__*/ _jsx(DocOutline, {})
        ]
    });
};
export default Nav;
