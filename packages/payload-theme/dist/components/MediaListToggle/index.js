'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useThemeTranslation } from '../../translations/useThemeTranslation.js';
const STORAGE_KEY = 'payload-theme-media-view';
/**
 * Grid/table switch rendered above upload-collection list views (the plugin
 * registers it via `admin.components.beforeListTable` on every collection with
 * `upload` enabled). The stylesheet keys the whole media-grid layout off
 * `.collection-list:has(.pt-media-toggle[data-view='grid'])`, so this
 * component's own state drives the view — no extra wiring, and the grid is
 * already applied in the server-rendered HTML (grid is the default).
 */ export const MediaListToggle = ()=>{
    const { t } = useThemeTranslation();
    const [view, setView] = React.useState('grid');
    // localStorage is read after mount so server and client render the same
    // default; a stored "table" preference swaps the layout one paint later.
    React.useEffect(()=>{
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === 'grid' || stored === 'table') setView(stored);
        } catch  {
        /* storage unavailable (private mode) — keep the default */ }
    }, []);
    const select = (next)=>{
        setView(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch  {
        /* non-persistent is fine */ }
    };
    const buttonClass = (target)=>[
            'pt-media-toggle__btn',
            view === target && 'pt-media-toggle__btn--active'
        ].filter(Boolean).join(' ');
    return /*#__PURE__*/ _jsxs("div", {
        className: "pt-media-toggle",
        "data-view": view,
        role: "group",
        children: [
            /*#__PURE__*/ _jsx("button", {
                "aria-label": t('payloadTheme:gridView'),
                "aria-pressed": view === 'grid',
                className: buttonClass('grid'),
                onClick: ()=>select('grid'),
                type: "button",
                children: /*#__PURE__*/ _jsxs("svg", {
                    "aria-hidden": "true",
                    fill: "none",
                    stroke: "currentColor",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ _jsx("rect", {
                            height: "7",
                            rx: "1",
                            width: "7",
                            x: "3",
                            y: "3"
                        }),
                        /*#__PURE__*/ _jsx("rect", {
                            height: "7",
                            rx: "1",
                            width: "7",
                            x: "14",
                            y: "3"
                        }),
                        /*#__PURE__*/ _jsx("rect", {
                            height: "7",
                            rx: "1",
                            width: "7",
                            x: "14",
                            y: "14"
                        }),
                        /*#__PURE__*/ _jsx("rect", {
                            height: "7",
                            rx: "1",
                            width: "7",
                            x: "3",
                            y: "14"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ _jsx("button", {
                "aria-label": t('payloadTheme:listView'),
                "aria-pressed": view === 'table',
                className: buttonClass('table'),
                onClick: ()=>select('table'),
                type: "button",
                children: /*#__PURE__*/ _jsxs("svg", {
                    "aria-hidden": "true",
                    fill: "none",
                    stroke: "currentColor",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ _jsx("path", {
                            d: "M3 6h18"
                        }),
                        /*#__PURE__*/ _jsx("path", {
                            d: "M3 12h18"
                        }),
                        /*#__PURE__*/ _jsx("path", {
                            d: "M3 18h18"
                        })
                    ]
                })
            })
        ]
    });
};
export default MediaListToggle;
