import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getTranslation } from '@payloadcms/translations';
import { Gutter } from '@payloadcms/ui';
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent';
import NextLinkImport from 'next/link.js';
import { formatAdminURL } from 'payload/shared';
import React from 'react';
import { themePlural, themeT } from '../../translations/types.js';
import { Icon } from '../Icon/index.js';
import { resolveIconName } from '../navIcons.js';
import { CountUp } from './client.js';
// next/link is CommonJS without an `exports` map: under plain Node ESM the
// default import is the whole module object (same interop Payload's own Link uses)
const Link = 'default' in NextLinkImport ? NextLinkImport.default : NextLinkImport;
/**
 * Themed dashboard — replaces Payload's default dashboard view.
 *
 * A SERVER component: Payload passes custom dashboard views the full server
 * props (a live `payload` instance and the current `user`), so doc counts and
 * 30-day sparkline buckets come straight from the local API —
 * access-controlled, no client fetch, no loading flash. Only the animated
 * count-up is a client component. Icons come from the plugin's `nav.icons`
 * map via `admin.custom`. Custom widgets from the `dashboard.widgets` option
 * render below all built-in content.
 */ const SPARK_DAYS = 30;
/** Cap per-collection createdAt scans; sparklines sample the most recent docs. */ const SPARK_DOC_LIMIT = 400;
// ---- built-in cells ---------------------------------------------------------
/** Tiny area sparkline. Pure server-rendered SVG — no client JS, recolors via
 * currentColor so it follows the accent token. */ const Sparkline = ({ id, points })=>{
    const W = 100;
    const H = 28;
    const max = Math.max(...points, 1);
    const step = W / Math.max(points.length - 1, 1);
    const coords = points.map((value, i)=>({
            x: i * step,
            y: H - 2 - value / max * (H - 6)
        }));
    const line = coords.map(({ x, y }, i)=>`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
    const area = `${line} L${W} ${H} L0 ${H} Z`;
    const gradientId = `pt-spark-${id}`;
    return /*#__PURE__*/ _jsxs("svg", {
        "aria-hidden": "true",
        className: "pt-dash__spark",
        preserveAspectRatio: "none",
        viewBox: `0 0 ${W} ${H}`,
        children: [
            /*#__PURE__*/ _jsx("defs", {
                children: /*#__PURE__*/ _jsxs("linearGradient", {
                    id: gradientId,
                    x1: "0",
                    x2: "0",
                    y1: "0",
                    y2: "1",
                    children: [
                        /*#__PURE__*/ _jsx("stop", {
                            offset: "0%",
                            stopColor: "currentColor",
                            stopOpacity: "0.28"
                        }),
                        /*#__PURE__*/ _jsx("stop", {
                            offset: "100%",
                            stopColor: "currentColor",
                            stopOpacity: "0"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ _jsx("path", {
                d: area,
                fill: `url(#${gradientId})`,
                stroke: "none"
            }),
            /*#__PURE__*/ _jsx("path", {
                d: line,
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.6",
                vectorEffect: "non-scaling-stroke"
            })
        ]
    });
};
const CollectionCard = ({ card, t })=>{
    const { count, countNoun, createHref, delta, href, iconName, label, slug, spark } = card;
    return /*#__PURE__*/ _jsxs("article", {
        className: "pt-dash__card",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "pt-dash__card-head",
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        className: "pt-dash__card-label",
                        children: label
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        "aria-hidden": "true",
                        className: "pt-dash__card-icon",
                        children: /*#__PURE__*/ _jsx(Icon, {
                            "aria-hidden": "true",
                            name: iconName,
                            strokeWidth: 1.9
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "pt-dash__card-body",
                children: [
                    /*#__PURE__*/ _jsxs("span", {
                        className: "pt-dash__card-count-row",
                        children: [
                            /*#__PURE__*/ _jsx("span", {
                                className: "pt-dash__card-count",
                                children: count === null ? '—' : /*#__PURE__*/ _jsx(CountUp, {
                                    value: count
                                })
                            }),
                            delta ? /*#__PURE__*/ _jsxs("span", {
                                className: "pt-dash__card-delta",
                                "data-trend": delta.trend,
                                title: delta.trend === 'new' ? t('payloadTheme:trendAllNewTitle') : t('payloadTheme:trendTitle'),
                                children: [
                                    delta.trend === 'up' ? /*#__PURE__*/ _jsx(Icon, {
                                        "aria-hidden": "true",
                                        name: "trending-up",
                                        strokeWidth: 2
                                    }) : null,
                                    delta.trend === 'down' ? /*#__PURE__*/ _jsx(Icon, {
                                        "aria-hidden": "true",
                                        name: "trending-down",
                                        strokeWidth: 2
                                    }) : null,
                                    delta.label
                                ]
                            }) : null
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("span", {
                        className: "pt-dash__card-caption",
                        children: [
                            countNoun,
                            spark ? ` · ${t('payloadTheme:lastThirtyDays')}` : ''
                        ]
                    })
                ]
            }),
            spark ? /*#__PURE__*/ _jsx(Sparkline, {
                id: slug,
                points: spark
            }) : null,
            /*#__PURE__*/ _jsx(Link, {
                "aria-label": label,
                className: "pt-dash__card-link",
                href: href,
                prefetch: false
            }),
            createHref ? /*#__PURE__*/ _jsx(Link, {
                "aria-label": t('general:createNewLabel', {
                    label
                }),
                className: "pt-dash__card-create",
                href: createHref,
                prefetch: false,
                children: /*#__PURE__*/ _jsx(Icon, {
                    "aria-hidden": "true",
                    name: "plus",
                    strokeWidth: 2
                })
            }) : null
        ]
    });
};
const GlobalCard = ({ card, t })=>{
    const { href, iconName, label } = card;
    return /*#__PURE__*/ _jsxs("article", {
        className: "pt-dash__card pt-dash__card--global",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "pt-dash__card-head",
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        className: "pt-dash__card-label",
                        children: t('payloadTheme:global')
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        "aria-hidden": "true",
                        className: "pt-dash__card-icon",
                        children: /*#__PURE__*/ _jsx(Icon, {
                            "aria-hidden": "true",
                            name: iconName,
                            strokeWidth: 1.9
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "pt-dash__card-body",
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        className: "pt-dash__card-title",
                        children: label
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        className: "pt-dash__card-caption",
                        children: t('payloadTheme:manageConfiguration')
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(Link, {
                "aria-label": label,
                className: "pt-dash__card-link",
                href: href,
                prefetch: false
            })
        ]
    });
};
// ---- data helpers ----------------------------------------------------------
/** Midnight (server time) SPARK_DAYS-1 days ago — the left edge of the sparkline. */ function sparkWindowStart() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (SPARK_DAYS - 1));
    return start;
}
/** Turn current/previous 30-day creation counts into a trend chip, or null.
 * No baseline (empty previous window) is the common case — most real projects
 * are younger than 60 days, or import all their content at once — so it gets a
 * neutral "New" chip instead of a meaningless percentage. Only a collection
 * with no activity in either window stays chip-less. */ function computeDelta(current, previous, t) {
    if (previous === 0) return current > 0 ? {
        label: t('payloadTheme:trendNew'),
        trend: 'new'
    } : null;
    const pct = Math.round((current - previous) / previous * 100);
    if (pct === 0) return {
        label: '±0%',
        trend: 'flat'
    };
    return pct > 0 ? {
        label: `+${pct}%`,
        trend: 'up'
    } : {
        label: `${pct}%`,
        trend: 'down'
    };
}
/** Bucket createdAt timestamps into one count per day, oldest day first. */ function bucketByDay(timestamps, since) {
    const buckets = new Array(SPARK_DAYS).fill(0);
    const dayMs = 24 * 60 * 60 * 1000;
    for (const iso of timestamps){
        const t = new Date(iso).getTime();
        if (Number.isNaN(t)) continue;
        const index = Math.floor((t - since.getTime()) / dayMs);
        if (index >= 0 && index < SPARK_DAYS) buckets[index] += 1;
    }
    return buckets;
}
// ---- view ------------------------------------------------------------------
export async function Dashboard(props) {
    const { initPageResult: { locale, permissions, req: { i18n, payload, user }, visibleEntities } } = props;
    const { config: { admin, collections, globals, routes: { admin: adminRoute } } } = payload;
    const theme = admin?.custom?.payloadTheme;
    const t = themeT(i18n);
    const since = sparkWindowStart();
    // ---- collection cards (same visibility + read filtering as the Nav) ------
    const collectionCards = [];
    for (const collection of collections){
        const slug = collection.slug;
        if (!visibleEntities.collections.includes(slug) || !permissions?.collections?.[slug]?.read) continue;
        const label = getTranslation(collection.labels?.plural, i18n);
        const iconName = resolveIconName(theme, slug);
        const href = formatAdminURL({
            adminRoute,
            path: `/collections/${slug}`
        });
        let count = null;
        try {
            const result = await payload.count({
                collection: slug,
                overrideAccess: false,
                user
            });
            count = result.totalDocs;
        } catch  {
        // keep the em-dash placeholder — a failed count must never break the page
        }
        // ---- 30-day trend chip (only for timestamped collections) ----------------
        // Two cheap counts: docs created in the sparkline window vs the 30 days
        // before it. `payload.count` is exact (the sparkline scan is capped).
        let delta = null;
        if (collection.timestamps !== false) {
            try {
                const prevSince = new Date(since);
                prevSince.setDate(prevSince.getDate() - SPARK_DAYS);
                const [currentWindow, previousWindow] = await Promise.all([
                    payload.count({
                        collection: slug,
                        overrideAccess: false,
                        user,
                        where: {
                            createdAt: {
                                greater_than_equal: since.toISOString()
                            }
                        }
                    }),
                    payload.count({
                        collection: slug,
                        overrideAccess: false,
                        user,
                        where: {
                            and: [
                                {
                                    createdAt: {
                                        greater_than_equal: prevSince.toISOString()
                                    }
                                },
                                {
                                    createdAt: {
                                        less_than: since.toISOString()
                                    }
                                }
                            ]
                        }
                    })
                ]);
                delta = computeDelta(currentWindow.totalDocs, previousWindow.totalDocs, t);
            } catch  {
            // no chip is fine — the card still renders
            }
        }
        // ---- sparkline (only for timestamped collections) -----------------------
        let spark = null;
        if (collection.timestamps !== false) {
            try {
                const created = await payload.find({
                    collection: slug,
                    depth: 0,
                    limit: SPARK_DOC_LIMIT,
                    overrideAccess: false,
                    select: {
                        createdAt: true
                    },
                    sort: '-createdAt',
                    user,
                    where: {
                        createdAt: {
                            greater_than_equal: since.toISOString()
                        }
                    }
                });
                const buckets = bucketByDay(created.docs.map((doc)=>String(doc.createdAt ?? '')), since);
                if (buckets.some((value)=>value > 0)) spark = buckets;
            } catch  {
            // no sparkline is fine — the card still renders
            }
        }
        collectionCards.push({
            count,
            countNoun: themePlural(i18n, 'documentCount', count ?? 0),
            createHref: permissions?.collections?.[slug]?.create ? formatAdminURL({
                adminRoute,
                path: `/collections/${slug}/create`
            }) : null,
            delta,
            href,
            iconName,
            label,
            slug,
            spark
        });
    }
    // ---- global cards ---------------------------------------------------------
    const globalCards = [];
    for (const global of globals){
        const slug = global.slug;
        if (!visibleEntities.globals.includes(slug) || !permissions?.globals?.[slug]?.read) continue;
        globalCards.push({
            href: formatAdminURL({
                adminRoute,
                path: `/globals/${slug}`
            }),
            iconName: resolveIconName(theme, slug),
            label: getTranslation(global.label, i18n),
            slug
        });
    }
    // ---- built-in cells ---------------------------------------------------------
    const cells = [
        ...collectionCards.map((card)=>({
                Component: ()=>/*#__PURE__*/ _jsx(CollectionCard, {
                        card: card,
                        t: t
                    }),
                key: `collection-${card.slug}`
            })),
        ...globalCards.map((card)=>({
                Component: ()=>/*#__PURE__*/ _jsx(GlobalCard, {
                        card: card,
                        t: t
                    }),
                key: `global-${card.slug}`
            }))
    ];
    // ---- custom widgets (plugin option `dashboard.widgets`) -------------------
    // Rendered after everything built-in in the DOM, resolved through the import
    // map like any Payload custom component. Whether they show below or above the
    // cards is CSS only (--pt-widgets-order, the `widgets` surface option), so
    // the header customizer can flip it before first paint. No widgets
    // configured → nothing renders.
    const customWidgets = theme?.dashboard?.widgets ?? [];
    // Keep Payload's `gutter dashboard` classes so the layout rules in the
    // stylesheet target this view exactly like the default dashboard.
    return /*#__PURE__*/ _jsxs(Gutter, {
        className: "dashboard pt-dash",
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: "pt-dash__grid",
                children: cells.map(({ Component, key, span })=>/*#__PURE__*/ _jsx("div", {
                        className: [
                            'pt-dash__cell',
                            span === 'full' && 'pt-dash__cell--full'
                        ].filter(Boolean).join(' '),
                        children: /*#__PURE__*/ _jsx(Component, {})
                    }, key))
            }),
            customWidgets.length > 0 ? /*#__PURE__*/ _jsx("div", {
                className: "pt-dash__widgets",
                children: customWidgets.map((widget, index)=>/*#__PURE__*/ _jsx("div", {
                        className: `pt-dash__widget pt-dash__widget--${widget.width}`,
                        children: RenderServerComponent({
                            Component: widget.component,
                            importMap: payload.importMap,
                            serverProps: {
                                i18n,
                                locale,
                                payload,
                                user
                            }
                        })
                    }, `pt-widget-${index}`))
            }) : null
        ]
    });
}
export default Dashboard;
