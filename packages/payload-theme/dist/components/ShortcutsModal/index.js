'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '@payloadcms/ui';
import React from 'react';
import { createPortal } from 'react-dom';
import { useThemeTranslation } from '../../translations/useThemeTranslation.js';
import { Icon } from '../Icon/index.js';
const isEditableTarget = (target)=>{
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
};
export const ShortcutsModal = ()=>{
    const { user } = useAuth();
    const { t } = useThemeTranslation();
    const [open, setOpen] = React.useState(false);
    const [isMac, setIsMac] = React.useState(true);
    React.useEffect(()=>{
        setIsMac(!/win|linux/i.test(typeof navigator === 'undefined' ? '' : navigator.platform));
    }, []);
    React.useEffect(()=>{
        const onKeyDown = (event)=>{
            if (event.key === '?' && !event.metaKey && !event.ctrlKey && !event.altKey) {
                if (isEditableTarget(event.target)) return;
                event.preventDefault();
                setOpen((current)=>!current);
            } else if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        const onOpenEvent = ()=>setOpen(true);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('pt:open-shortcuts', onOpenEvent);
        return ()=>{
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('pt:open-shortcuts', onOpenEvent);
        };
    }, []);
    if (!user || !open) return null;
    if (typeof document === 'undefined') return null;
    const mod = isMac ? '⌘' : 'Ctrl';
    const sections = [
        {
            rows: [
                {
                    keys: [
                        mod,
                        'K'
                    ],
                    label: t('payloadTheme:shortcutOpenPalette')
                },
                {
                    keys: [
                        '?'
                    ],
                    label: t('payloadTheme:keyboardShortcuts')
                },
                {
                    keys: [
                        'Esc'
                    ],
                    label: t('payloadTheme:shortcutCloseDialogs')
                }
            ],
            title: t('payloadTheme:shortcutsGlobal')
        },
        {
            rows: [
                {
                    keys: [
                        '↑',
                        '↓'
                    ],
                    label: t('payloadTheme:shortcutMoveResults')
                },
                {
                    keys: [
                        '↵'
                    ],
                    label: t('payloadTheme:shortcutOpenResult')
                },
                {
                    keys: [
                        mod,
                        'K'
                    ],
                    label: t('payloadTheme:shortcutClosePalette')
                }
            ],
            title: t('payloadTheme:shortcutsPalette')
        },
        {
            rows: [
                {
                    keys: [
                        mod,
                        'S'
                    ],
                    label: t('payloadTheme:shortcutSaveDocument')
                }
            ],
            title: t('payloadTheme:shortcutsEditView')
        }
    ];
    return /*#__PURE__*/ createPortal(/*#__PURE__*/ _jsxs("div", {
        className: "pt-shortcuts",
        role: "presentation",
        children: [
            /*#__PURE__*/ _jsx("div", {
                "aria-hidden": "true",
                className: "pt-shortcuts__backdrop",
                onClick: ()=>setOpen(false)
            }),
            /*#__PURE__*/ _jsxs("div", {
                "aria-label": t('payloadTheme:keyboardShortcuts'),
                "aria-modal": "true",
                className: "pt-shortcuts__panel",
                role: "dialog",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-shortcuts__head",
                        children: [
                            /*#__PURE__*/ _jsxs("span", {
                                className: "pt-shortcuts__title",
                                children: [
                                    /*#__PURE__*/ _jsx(Icon, {
                                        "aria-hidden": "true",
                                        name: "keyboard",
                                        strokeWidth: 1.9
                                    }),
                                    t('payloadTheme:keyboardShortcuts')
                                ]
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                "aria-label": t('general:close'),
                                className: "pt-shortcuts__close",
                                onClick: ()=>setOpen(false),
                                type: "button",
                                children: /*#__PURE__*/ _jsx(Icon, {
                                    "aria-hidden": "true",
                                    name: "x",
                                    strokeWidth: 2
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "pt-shortcuts__body",
                        children: sections.map((section)=>/*#__PURE__*/ _jsxs("div", {
                                className: "pt-shortcuts__section",
                                children: [
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "pt-shortcuts__section-title",
                                        children: section.title
                                    }),
                                    section.rows.map((row)=>/*#__PURE__*/ _jsxs("div", {
                                            className: "pt-shortcuts__row",
                                            children: [
                                                /*#__PURE__*/ _jsx("span", {
                                                    className: "pt-shortcuts__row-label",
                                                    children: row.label
                                                }),
                                                /*#__PURE__*/ _jsx("span", {
                                                    className: "pt-shortcuts__keys",
                                                    children: row.keys.map((key)=>/*#__PURE__*/ _jsx("kbd", {
                                                            children: key
                                                        }, key))
                                                })
                                            ]
                                        }, row.label))
                                ]
                            }, section.title))
                    })
                ]
            })
        ]
    }), document.body);
};
export default ShortcutsModal;
