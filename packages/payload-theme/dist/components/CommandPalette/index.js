'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getTranslation } from '@payloadcms/translations';
import { useAuth, useConfig, useEntityVisibility, useTheme } from '@payloadcms/ui';
import { usePathname, useRouter } from 'next/navigation.js';
import { formatAdminURL } from 'payload/shared';
import React from 'react';
import { createPortal } from 'react-dom';
import { useThemeTranslation } from '../../translations/useThemeTranslation.js';
import { Icon } from '../Icon/index.js';
import { resolveIconName } from '../navIcons.js';
const RECENTS_KEY = 'payload-theme-recents';
const MAX_RECENTS = 8;
const SHOWN_RECENTS = 5;
function readRecents() {
    try {
        const raw = window.localStorage.getItem(RECENTS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((entry)=>!!entry && typeof entry === 'object' && typeof entry.slug === 'string' && typeof entry.id === 'string').slice(0, MAX_RECENTS);
    } catch  {
        return [];
    }
}
function persistRecents(entries) {
    try {
        window.localStorage.setItem(RECENTS_KEY, JSON.stringify(entries.slice(0, MAX_RECENTS)));
    } catch  {
    // storage unavailable — recents just don't persist
    }
}
const SEARCH_DEBOUNCE_MS = 220;
const MAX_SEARCHED_COLLECTIONS = 8;
const RESULTS_PER_COLLECTION = 3;
const matches = (query, label)=>label.toLocaleLowerCase().includes(query.toLocaleLowerCase());
export const CommandPalette = ()=>{
    const { permissions, user } = useAuth();
    const { isEntityVisible } = useEntityVisibility();
    const { config } = useConfig();
    const { setTheme, theme: colorScheme } = useTheme();
    const { i18n, t } = useThemeTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [docResults, setDocResults] = React.useState([]);
    const [searching, setSearching] = React.useState(false);
    const [isMac, setIsMac] = React.useState(true);
    const [recents, setRecents] = React.useState([]);
    const inputRef = React.useRef(null);
    const listRef = React.useRef(null);
    const themeConfig = config.admin?.custom?.payloadTheme;
    const adminRoute = config.routes.admin;
    const apiRoute = config.routes.api;
    const serverURL = config.serverURL ?? '';
    React.useEffect(()=>{
        setIsMac(!/win|linux/i.test(typeof navigator === 'undefined' ? '' : navigator.platform));
        setRecents(readRecents());
    }, []);
    // Track visited document edit views → the palette's "Recent" group.
    // Parsed straight off the URL so it costs nothing; titles resolve lazily
    // when the palette opens.
    React.useEffect(()=>{
        if (!user) return;
        const prefix = `${adminRoute === '/' ? '' : adminRoute}/collections/`;
        if (!pathname.startsWith(prefix)) return;
        const [slug, id] = pathname.slice(prefix.length).split('/');
        if (!slug || !id || [
            'create',
            'trash',
            'versions'
        ].includes(id)) return;
        setRecents((current)=>{
            const existing = current.find((entry)=>entry.slug === slug && entry.id === id);
            const next = [
                {
                    id,
                    slug,
                    title: existing?.title,
                    ts: Date.now()
                },
                ...current.filter((entry)=>!(entry.slug === slug && entry.id === id))
            ].slice(0, MAX_RECENTS);
            persistRecents(next);
            return next;
        });
    }, [
        pathname,
        user,
        adminRoute
    ]);
    const close = React.useCallback(()=>{
        setOpen(false);
        setQuery('');
        setDocResults([]);
        setActiveIndex(0);
    }, []);
    const go = React.useCallback((href)=>{
        close();
        router.push(href);
    }, [
        close,
        router
    ]);
    // ---- static items (rebuilt per render — config and permissions are stable) --
    const { searchableCollections, staticItems } = React.useMemo(()=>{
        const items = [];
        const createItems = [];
        const searchable = [];
        // Unauthenticated views (login, forgot-password) render the provider tree
        // without the entity-visibility context — the palette is inert there.
        if (!user || typeof isEntityVisible !== 'function') {
            return {
                searchableCollections: searchable,
                staticItems: items
            };
        }
        items.push({
            group: t('payloadTheme:groupNavigate'),
            iconName: themeConfig?.nav?.icons?.dashboard ?? 'layout-dashboard',
            id: 'nav-dashboard',
            label: t('general:dashboard'),
            perform: ()=>go(adminRoute)
        });
        for (const collection of config.collections ?? []){
            const slug = collection.slug;
            if (!isEntityVisible({
                collectionSlug: slug
            }) || !permissions?.collections?.[slug]?.read) continue;
            const label = getTranslation(collection.labels?.plural, i18n);
            const iconName = resolveIconName(themeConfig, slug);
            const href = formatAdminURL({
                adminRoute,
                path: `/collections/${slug}`
            });
            items.push({
                group: t('payloadTheme:groupNavigate'),
                hint: t('payloadTheme:hintCollection'),
                iconName,
                id: `nav-${slug}`,
                label,
                perform: ()=>go(href)
            });
            if (permissions?.collections?.[slug]?.create) {
                createItems.push({
                    group: t('payloadTheme:groupCreate'),
                    hint: t('payloadTheme:hintNew'),
                    iconName,
                    id: `create-${slug}`,
                    label: t('general:createNewLabel', {
                        label: getTranslation(collection.labels?.singular, i18n)
                    }),
                    perform: ()=>go(formatAdminURL({
                            adminRoute,
                            path: `/collections/${slug}/create`
                        }))
                });
            }
            const titleField = collection.admin?.useAsTitle;
            if (typeof titleField === 'string' && titleField !== 'id') {
                searchable.push({
                    apiPath: `${serverURL}${apiRoute}/${slug}`,
                    editPathPrefix: `/collections/${slug}`,
                    iconName,
                    label,
                    slug,
                    titleField
                });
            }
        }
        for (const global of config.globals ?? []){
            const slug = global.slug;
            if (!isEntityVisible({
                globalSlug: slug
            }) || !permissions?.globals?.[slug]?.read) continue;
            items.push({
                group: t('payloadTheme:groupNavigate'),
                hint: t('payloadTheme:hintGlobal'),
                iconName: resolveIconName(themeConfig, slug),
                id: `nav-global-${slug}`,
                label: getTranslation(global.label, i18n),
                perform: ()=>go(formatAdminURL({
                        adminRoute,
                        path: `/globals/${slug}`
                    }))
            });
        }
        items.push(...createItems);
        items.push({
            group: t('payloadTheme:groupActions'),
            hint: t('payloadTheme:hintAppearance'),
            iconName: colorScheme === 'dark' ? 'sun' : 'moon',
            id: 'action-theme',
            label: colorScheme === 'dark' ? t('payloadTheme:switchToLightMode') : t('payloadTheme:switchToDarkMode'),
            perform: ()=>{
                setTheme(colorScheme === 'dark' ? 'light' : 'dark');
                close();
            }
        });
        items.push({
            group: t('payloadTheme:groupActions'),
            hint: t('payloadTheme:hintHelp'),
            iconName: 'keyboard',
            id: 'action-shortcuts',
            label: t('payloadTheme:keyboardShortcuts'),
            perform: ()=>{
                close();
                window.dispatchEvent(new CustomEvent('pt:open-shortcuts'));
            }
        });
        items.push({
            group: t('payloadTheme:groupActions'),
            hint: t('payloadTheme:hintSession'),
            iconName: 'log-out',
            id: 'action-logout',
            label: t('authentication:logOut'),
            perform: ()=>go(formatAdminURL({
                    adminRoute,
                    path: config.admin?.routes?.logout ?? '/logout'
                }))
        });
        return {
            searchableCollections: searchable,
            staticItems: items
        };
    }, [
        config,
        themeConfig,
        i18n,
        t,
        adminRoute,
        apiRoute,
        serverURL,
        colorScheme,
        go,
        setTheme,
        close,
        permissions,
        isEntityVisible,
        user
    ]);
    // ---- open/close wiring ------------------------------------------------------
    React.useEffect(()=>{
        const onKeyDown = (event)=>{
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen((current)=>!current);
            }
        };
        const onOpenEvent = ()=>setOpen(true);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('pt:open-palette', onOpenEvent);
        return ()=>{
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('pt:open-palette', onOpenEvent);
        };
    }, []);
    // Close when navigating (e.g. browser back) and lock body scroll while open.
    React.useEffect(()=>{
        if (!open) return;
        // Let the Nav close the mobile drawer before we layer the panel on top.
        window.dispatchEvent(new CustomEvent('pt:palette-open'));
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        inputRef.current?.focus();
        return ()=>{
            document.body.style.overflow = previous;
        };
    }, [
        open
    ]);
    React.useEffect(()=>{
        close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pathname
    ]);
    // ---- async document search ---------------------------------------------------
    React.useEffect(()=>{
        if (!open) return;
        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setDocResults([]);
            setSearching(false);
            return;
        }
        const controller = new AbortController();
        setSearching(true);
        const timer = window.setTimeout(async ()=>{
            try {
                const targets = searchableCollections.slice(0, MAX_SEARCHED_COLLECTIONS);
                const responses = await Promise.all(targets.map(async (target)=>{
                    const params = new URLSearchParams({
                        depth: '0',
                        limit: String(RESULTS_PER_COLLECTION),
                        [`where[${target.titleField}][like]`]: trimmed
                    });
                    const response = await fetch(`${target.apiPath}?${params.toString()}`, {
                        credentials: 'include',
                        signal: controller.signal
                    });
                    if (!response.ok) return [];
                    const data = await response.json();
                    return (data.docs ?? []).map((doc)=>{
                        const raw = doc[target.titleField];
                        const title = typeof raw === 'string' && raw.trim() ? raw : `#${String(doc.id)}`;
                        return {
                            group: t('payloadTheme:groupDocuments'),
                            hint: target.label,
                            iconName: target.iconName,
                            id: `doc-${target.slug}-${String(doc.id)}`,
                            label: title,
                            perform: ()=>go(formatAdminURL({
                                    adminRoute,
                                    path: `${target.editPathPrefix}/${String(doc.id)}`
                                }))
                        };
                    });
                }));
                setDocResults(responses.flat());
            } catch  {
            // aborted or offline — stale results are simply kept off the list
            } finally{
                if (!controller.signal.aborted) setSearching(false);
            }
        }, SEARCH_DEBOUNCE_MS);
        return ()=>{
            controller.abort();
            window.clearTimeout(timer);
        };
    }, [
        open,
        query,
        searchableCollections,
        adminRoute,
        go,
        t
    ]);
    // ---- recents: resolve missing titles when the palette opens -----------------
    // One GET per unresolved entry through the REST API — access control applies,
    // so deleted or forbidden documents drop out of the list instead of 404ing.
    React.useEffect(()=>{
        if (!open || !user) return;
        const missing = recents.filter((entry)=>!entry.title);
        if (missing.length === 0) return;
        const bySlug = new Map(searchableCollections.map((target)=>[
                target.slug,
                target
            ]));
        const controller = new AbortController();
        void (async ()=>{
            const results = await Promise.all(missing.map(async (entry)=>{
                const target = bySlug.get(entry.slug);
                // No text title field → label by id, nothing to fetch.
                if (!target) return {
                    entry,
                    ok: true,
                    title: `#${entry.id}`
                };
                try {
                    const response = await fetch(`${target.apiPath}/${entry.id}?depth=0`, {
                        credentials: 'include',
                        signal: controller.signal
                    });
                    if (!response.ok) return {
                        entry,
                        ok: false,
                        title: ''
                    };
                    const doc = await response.json();
                    const raw = doc[target.titleField];
                    const title = typeof raw === 'string' && raw.trim() ? raw : `#${entry.id}`;
                    return {
                        entry,
                        ok: true,
                        title
                    };
                } catch  {
                    return null // aborted/offline — leave the entry untouched
                    ;
                }
            }));
            if (controller.signal.aborted) return;
            setRecents((current)=>{
                let changed = false;
                let next = current;
                for (const result of results){
                    if (!result) continue;
                    changed = true;
                    next = result.ok ? next.map((entry)=>entry.slug === result.entry.slug && entry.id === result.entry.id ? {
                            ...entry,
                            title: result.title
                        } : entry) : next.filter((entry)=>!(entry.slug === result.entry.slug && entry.id === result.entry.id));
                }
                if (!changed) return current;
                persistRecents(next);
                return next;
            });
        })();
        return ()=>controller.abort();
    }, [
        open,
        user,
        recents,
        searchableCollections
    ]);
    // slug → label/icon for every collection (recents may span non-searchable ones)
    const collectionMeta = React.useMemo(()=>{
        const map = new Map();
        for (const collection of config.collections ?? []){
            map.set(collection.slug, {
                iconName: resolveIconName(themeConfig, collection.slug),
                label: getTranslation(collection.labels?.plural, i18n)
            });
        }
        return map;
    }, [
        config,
        themeConfig,
        i18n
    ]);
    const recentItems = React.useMemo(()=>{
        if (!user) return [];
        return recents.filter((entry)=>permissions?.collections?.[entry.slug]?.read).slice(0, SHOWN_RECENTS).map((entry)=>{
            const meta = collectionMeta.get(entry.slug);
            return {
                group: t('payloadTheme:groupRecent'),
                hint: meta?.label ?? entry.slug,
                iconName: meta?.iconName ?? 'file',
                id: `recent-${entry.slug}-${entry.id}`,
                label: entry.title ?? `#${entry.id}`,
                perform: ()=>go(formatAdminURL({
                        adminRoute,
                        path: `/collections/${entry.slug}/${entry.id}`
                    }))
            };
        });
    }, [
        recents,
        collectionMeta,
        user,
        permissions,
        adminRoute,
        go,
        t
    ]);
    // ---- filtering + grouping -----------------------------------------------------
    const trimmedQuery = query.trim();
    const visibleItems = React.useMemo(()=>{
        const filteredRecents = trimmedQuery ? recentItems.filter((item)=>matches(trimmedQuery, item.label)) : recentItems;
        // A searched doc that's already in Recent shows once (as the recent row).
        const recentKeys = new Set(filteredRecents.map((item)=>item.id.slice('recent-'.length)));
        const dedupedDocs = docResults.filter((item)=>!recentKeys.has(item.id.slice('doc-'.length)));
        const filteredStatic = trimmedQuery ? staticItems.filter((item)=>matches(trimmedQuery, item.label)) : staticItems;
        return [
            ...filteredRecents,
            ...dedupedDocs,
            ...filteredStatic
        ];
    }, [
        staticItems,
        docResults,
        recentItems,
        trimmedQuery
    ]);
    React.useEffect(()=>{
        setActiveIndex(0);
    }, [
        trimmedQuery,
        docResults.length
    ]);
    // Keep the active row in view while arrowing through the list.
    React.useEffect(()=>{
        listRef.current?.querySelector(`[data-pt-index="${activeIndex}"]`)?.scrollIntoView({
            block: 'nearest'
        });
    }, [
        activeIndex
    ]);
    if (!user) return null;
    if (!open) return null;
    if (typeof document === 'undefined') return null;
    const groups = [];
    visibleItems.forEach((item, index)=>{
        const last = groups[groups.length - 1];
        if (last && last.label === item.group) last.items.push({
            index,
            item
        });
        else groups.push({
            items: [
                {
                    index,
                    item
                }
            ],
            label: item.group
        });
    });
    const onInputKeyDown = (event)=>{
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((current)=>Math.min(current + 1, visibleItems.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((current)=>Math.max(current - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            visibleItems[activeIndex]?.perform();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            close();
        }
    };
    return /*#__PURE__*/ createPortal(/*#__PURE__*/ _jsxs("div", {
        className: "pt-palette",
        role: "presentation",
        children: [
            /*#__PURE__*/ _jsx("div", {
                "aria-hidden": "true",
                className: "pt-palette__backdrop",
                onClick: close
            }),
            /*#__PURE__*/ _jsxs("div", {
                "aria-label": t('payloadTheme:commandPalette'),
                "aria-modal": "true",
                className: "pt-palette__panel",
                role: "dialog",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-palette__search",
                        children: [
                            /*#__PURE__*/ _jsx(Icon, {
                                "aria-hidden": "true",
                                className: "pt-palette__search-icon",
                                name: "search",
                                strokeWidth: 2
                            }),
                            /*#__PURE__*/ _jsx("input", {
                                "aria-label": t('payloadTheme:search'),
                                className: "pt-palette__input",
                                onChange: (event)=>setQuery(event.target.value),
                                onKeyDown: onInputKeyDown,
                                placeholder: t('payloadTheme:searchPlaceholder'),
                                ref: inputRef,
                                type: "text",
                                value: query
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                className: "pt-palette__esc",
                                onClick: close,
                                type: "button",
                                children: "esc"
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-palette__list",
                        ref: listRef,
                        children: [
                            searching ? /*#__PURE__*/ _jsx("div", {
                                className: "pt-palette__status",
                                children: t('payloadTheme:searchingDocuments')
                            }) : null,
                            !searching && visibleItems.length === 0 ? /*#__PURE__*/ _jsx("div", {
                                className: "pt-palette__status",
                                children: t('payloadTheme:noResultsFor', {
                                    query: trimmedQuery
                                })
                            }) : null,
                            groups.map((group)=>/*#__PURE__*/ _jsxs("div", {
                                    className: "pt-palette__group",
                                    children: [
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "pt-palette__group-label",
                                            children: group.label
                                        }),
                                        group.items.map(({ index, item })=>/*#__PURE__*/ _jsxs("button", {
                                                className: [
                                                    'pt-palette__item',
                                                    index === activeIndex && 'pt-palette__item--active'
                                                ].filter(Boolean).join(' '),
                                                "data-pt-index": index,
                                                onClick: ()=>item.perform(),
                                                onMouseMove: ()=>setActiveIndex(index),
                                                type: "button",
                                                children: [
                                                    /*#__PURE__*/ _jsx("span", {
                                                        "aria-hidden": "true",
                                                        className: "pt-palette__item-icon",
                                                        children: /*#__PURE__*/ _jsx(Icon, {
                                                            "aria-hidden": "true",
                                                            name: item.iconName,
                                                            strokeWidth: 1.9
                                                        })
                                                    }),
                                                    /*#__PURE__*/ _jsx("span", {
                                                        className: "pt-palette__item-label",
                                                        children: item.label
                                                    }),
                                                    item.hint ? /*#__PURE__*/ _jsx("span", {
                                                        className: "pt-palette__item-hint",
                                                        children: item.hint
                                                    }) : null
                                                ]
                                            }, item.id))
                                    ]
                                }, group.label))
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-palette__footer",
                        children: [
                            /*#__PURE__*/ _jsxs("span", {
                                children: [
                                    /*#__PURE__*/ _jsx("kbd", {
                                        children: "↑"
                                    }),
                                    /*#__PURE__*/ _jsx("kbd", {
                                        children: "↓"
                                    }),
                                    " ",
                                    t('payloadTheme:paletteNavigate')
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("span", {
                                children: [
                                    /*#__PURE__*/ _jsx("kbd", {
                                        children: "↵"
                                    }),
                                    " ",
                                    t('payloadTheme:paletteOpen')
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("span", {
                                children: [
                                    /*#__PURE__*/ _jsx("kbd", {
                                        children: isMac ? '⌘' : 'Ctrl'
                                    }),
                                    /*#__PURE__*/ _jsx("kbd", {
                                        children: "K"
                                    }),
                                    " ",
                                    t('payloadTheme:paletteToggle')
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    }), document.body);
};
export default CommandPalette;
