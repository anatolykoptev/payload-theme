'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getTranslation } from '@payloadcms/translations';
import { Link, useAuth, useConfig, useLocale, useRouteTransition } from '@payloadcms/ui';
import { useLocaleLoading } from '@payloadcms/ui/providers/Locale';
import { usePathname, useRouter } from 'next/navigation.js';
import { formatAdminURL } from 'payload/shared';
import React from 'react';
import { useThemeTranslation } from '../../translations/useThemeTranslation.js';
import { useThemeAvatar } from '../AvatarProvider/client.js';
import { Flag } from '../Flag/index.js';
import { Icon } from '../Icon/index.js';
/**
 * The shared user block: an avatar + name/email trigger opening a
 * shadcn-style dropdown with Account, the content-locale switcher (when
 * localization is enabled) and Log out.
 *
 * Two placements share this component:
 *  - `sidebar` — the full-width block pinned to the bottom of the nav
 *    (classes `pt-nav__user*`, menu opens upward)
 *  - `header`  — the compact chip at the right end of the app header
 *    (classes `pt-header-user*`, menu opens downward)
 *
 * The class PREFIX differs so each placement styles independently AND so
 * selectors like `.pt-nav__user-trigger` keep matching exactly one node.
 */ export const UserMenu = ({ variant = 'sidebar' })=>{
    const { user } = useAuth();
    const { config } = useConfig();
    const { node: avatarNode, src: avatarSrc } = useThemeAvatar();
    const { i18n, t } = useThemeTranslation();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const { startRouteTransition } = useRouteTransition();
    const { setLocaleIsLoading } = useLocaleLoading();
    const [open, setOpen] = React.useState(false);
    const rootRef = React.useRef(null);
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
    // Close when navigating away (e.g. after following a menu link).
    React.useEffect(()=>{
        setOpen(false);
    }, [
        pathname
    ]);
    if (!user) return null;
    const prefix = variant === 'header' ? 'pt-header-user' : 'pt-nav__user';
    const cls = (suffix)=>`${prefix}${suffix}`;
    const { localization, routes: { admin: adminRoute } } = config;
    const email = typeof user.email === 'string' ? user.email : '';
    const rawName = user.name;
    const name = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : email.split('@')[0] || t('general:user');
    const initials = name.split(/\s+/).slice(0, 2).map((word)=>word.charAt(0)).join('').toUpperCase() || '?';
    // Resolved server-side by the AvatarProvider: an image URL (gravatar or the
    // configured user field), a rendered `admin.avatar.Component`, or neither —
    // in which case the accent initials circle stands, as it always has.
    const avatarInner = avatarSrc ? /*#__PURE__*/ _jsx("img", {
        alt: "",
        className: cls('-avatar-img'),
        src: avatarSrc
    }) : avatarNode ?? initials;
    // The modifier drops the accent fill so artwork isn't framed by a colored
    // disc, and clips whatever the custom component renders to the circle.
    const avatar = /*#__PURE__*/ _jsx("span", {
        "aria-hidden": "true",
        className: `${cls('-avatar')}${avatarSrc || avatarNode ? ` ${cls('-avatar--image')}` : ''}`,
        children: avatarInner
    });
    const accountHref = formatAdminURL({
        adminRoute,
        path: config.admin?.routes?.account ?? '/account'
    });
    const logoutHref = formatAdminURL({
        adminRoute,
        path: config.admin?.routes?.logout ?? '/logout'
    });
    // Same mechanism as Payload's own header Localizer: set the `locale` query
    // param and navigate — Payload handles the rest (incl. remembering it).
    //
    // The two wrappers are not decoration. A locale switch is a server round
    // trip, and a bare `router.push` spends all of it looking like a dead click:
    // the menu closes and NOTHING else happens — no progress bar, no spinner,
    // same URL, same field values — until the RSC payload lands. On anything
    // slower than localhost that reads as "the switcher is broken", which is
    // exactly how it was reported. `startRouteTransition` drives Payload's own
    // top progress bar; `setLocaleIsLoading` feeds `DocumentInfoProvider`'s
    // `isInitializing`, so the document view knows it is showing stale content.
    //
    // The pushed URL is relative — just the query — so it can't disagree with
    // the address bar the way a rebuilt `${pathname}?…` can under a Next
    // `basePath`, a rewrite or `trailingSlash`.
    const switchLocale = (code)=>{
        setOpen(false);
        setLocaleIsLoading(true);
        const params = new URLSearchParams(window.location.search);
        params.set('locale', code);
        startRouteTransition(()=>{
            router.push(`?${params.toString()}`);
        });
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: cls(''),
        ref: rootRef,
        children: [
            open ? /*#__PURE__*/ _jsxs("div", {
                className: cls('-menu'),
                role: "menu",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: cls('-menu-header'),
                        children: [
                            avatar,
                            /*#__PURE__*/ _jsxs("span", {
                                className: cls('-info'),
                                children: [
                                    /*#__PURE__*/ _jsx("span", {
                                        className: cls('-name'),
                                        children: name
                                    }),
                                    email ? /*#__PURE__*/ _jsx("span", {
                                        className: cls('-email'),
                                        children: email
                                    }) : null
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        "aria-hidden": "true",
                        className: cls('-menu-sep')
                    }),
                    /*#__PURE__*/ _jsxs(Link, {
                        className: cls('-menu-item'),
                        href: accountHref,
                        onClick: ()=>setOpen(false),
                        prefetch: false,
                        role: "menuitem",
                        children: [
                            /*#__PURE__*/ _jsx(Icon, {
                                "aria-hidden": "true",
                                name: "circle-user",
                                strokeWidth: 1.9
                            }),
                            t('authentication:account')
                        ]
                    }),
                    localization ? /*#__PURE__*/ _jsxs(React.Fragment, {
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                "aria-hidden": "true",
                                className: cls('-menu-sep')
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: cls('-menu-label'),
                                children: t('general:locale')
                            }),
                            localization.locales.map((localeOption)=>{
                                const isActive = locale?.code === localeOption.code;
                                const label = getTranslation(localeOption.label, i18n);
                                return /*#__PURE__*/ _jsxs("button", {
                                    "aria-checked": isActive,
                                    className: `${cls('-menu-item')} ${cls('-menu-item--locale')}`,
                                    disabled: isActive,
                                    onClick: ()=>switchLocale(localeOption.code),
                                    role: "menuitemradio",
                                    type: "button",
                                    children: [
                                        /*#__PURE__*/ _jsx("span", {
                                            "aria-hidden": "true",
                                            className: cls('-menu-check'),
                                            children: isActive ? /*#__PURE__*/ _jsx(Icon, {
                                                "aria-hidden": "true",
                                                name: "check",
                                                strokeWidth: 2.2
                                            }) : null
                                        }),
                                        /*#__PURE__*/ _jsx(Flag, {
                                            className: cls('-menu-flag'),
                                            code: localeOption.code
                                        }),
                                        /*#__PURE__*/ _jsxs("span", {
                                            className: cls('-menu-locale'),
                                            children: [
                                                /*#__PURE__*/ _jsx("span", {
                                                    className: cls('-menu-name'),
                                                    children: label
                                                }),
                                                label !== localeOption.code ? /*#__PURE__*/ _jsxs("span", {
                                                    className: cls('-menu-code'),
                                                    children: [
                                                        "(",
                                                        localeOption.code,
                                                        ")"
                                                    ]
                                                }) : null
                                            ]
                                        })
                                    ]
                                }, localeOption.code);
                            })
                        ]
                    }) : null,
                    /*#__PURE__*/ _jsx("div", {
                        "aria-hidden": "true",
                        className: cls('-menu-sep')
                    }),
                    /*#__PURE__*/ _jsxs(Link, {
                        className: `${cls('-menu-item')} ${cls('-menu-item--logout')}`,
                        href: logoutHref,
                        onClick: ()=>setOpen(false),
                        prefetch: false,
                        role: "menuitem",
                        children: [
                            /*#__PURE__*/ _jsx(Icon, {
                                "aria-hidden": "true",
                                name: "log-out",
                                strokeWidth: 1.9
                            }),
                            t('authentication:logOut')
                        ]
                    })
                ]
            }) : null,
            /*#__PURE__*/ _jsxs("button", {
                "aria-expanded": open,
                "aria-haspopup": "menu",
                className: cls('-trigger'),
                onClick: ()=>setOpen((current)=>!current),
                type: "button",
                children: [
                    avatar,
                    /*#__PURE__*/ _jsxs("span", {
                        className: cls('-info'),
                        children: [
                            /*#__PURE__*/ _jsx("span", {
                                className: cls('-name'),
                                children: name
                            }),
                            email ? /*#__PURE__*/ _jsx("span", {
                                className: cls('-email'),
                                children: email
                            }) : null
                        ]
                    }),
                    /*#__PURE__*/ _jsx(Icon, {
                        "aria-hidden": "true",
                        className: cls('-chevron'),
                        name: "chevrons-up-down",
                        strokeWidth: 2
                    })
                ]
            })
        ]
    });
};
export default UserMenu;
