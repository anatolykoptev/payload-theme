'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useConfig } from '@payloadcms/ui';
import { usePathname } from 'next/navigation.js';
import React from 'react';
import { createPortal } from 'react-dom';
import { useThemeTranslation } from '../../translations/useThemeTranslation.js';
/** Top-level field wrappers that read as document "sections". */ const SECTION_SELECTOR = [
    '.group-field--top-level',
    '.collapsible-field',
    '.blocks-field',
    '.array-field',
    '.tabs-field'
].join(', ');
/** Best-effort label for a section element, in specificity order. */ function sectionLabel(el) {
    const candidates = [
        '.group-field__title',
        ':scope > .collapsible__toggle-wrap .row-label',
        ':scope .field-label',
        ':scope header h3'
    ];
    for (const selector of candidates){
        const text = el.querySelector(selector)?.textContent?.trim();
        if (text) return text.replace(/\s*\*\s*$/, '') // strip required-field mark
        ;
    }
    return null;
}
const SCROLL_OFFSET = 110 // clears the sticky app header + doc controls bar
;
export const DocOutline = ()=>{
    const { config } = useConfig();
    const { t } = useThemeTranslation();
    const pathname = usePathname();
    const [sections, setSections] = React.useState([]);
    const [activeId, setActiveId] = React.useState(null);
    const adminRoute = config.routes.admin;
    const base = adminRoute === '/' ? '' : adminRoute;
    // Only on document edit views (collection docs incl. create, and globals).
    const isEditView = React.useMemo(()=>{
        const rel = pathname.startsWith(base) ? pathname.slice(base.length) : null;
        if (!rel) return false;
        return /^\/collections\/[^/]+\/[^/]+\/?$/.test(rel) || /^\/globals\/[^/]+\/?$/.test(rel);
    }, [
        pathname,
        base
    ]);
    // ---- scan the rendered form for sections ----------------------------------
    React.useEffect(()=>{
        if (!isEditView) {
            setSections([]);
            return;
        }
        let timer;
        const scan = ()=>{
            const container = document.querySelector('.document-fields__fields');
            if (!container) {
                setSections([]);
                return;
            }
            const found = [];
            const seen = new Set();
            container.querySelectorAll(SECTION_SELECTOR).forEach((el, index)=>{
                // Only top-level sections: skip anything nested inside another section.
                if (el.parentElement?.closest(SECTION_SELECTOR)) return;
                // Tabs expand into one entry per tab — clicking switches the tab.
                if (el.classList.contains('tabs-field')) {
                    const buttons = el.querySelector(':scope > .tabs-field__tabs-wrap')?.querySelectorAll('.tabs-field__tab-button');
                    buttons?.forEach((button, tabIndex)=>{
                        const label = button.textContent?.trim();
                        if (!label) return;
                        let id = `tab-${label}-${index}-${tabIndex}`;
                        while(seen.has(id))id += '_';
                        seen.add(id);
                        found.push({
                            el,
                            id,
                            label,
                            tabButton: button
                        });
                    });
                    return;
                }
                const label = sectionLabel(el);
                if (!label) return;
                let id = `${label}-${index}`;
                while(seen.has(id))id += '_';
                seen.add(id);
                found.push({
                    el,
                    id,
                    label
                });
            });
            setSections((current)=>{
                // Keep referential stability when nothing changed (avoids re-renders).
                if (current.length === found.length && current.every((s, i)=>s.el === found[i].el && s.label === found[i].label && s.tabButton === found[i].tabButton)) return current;
                return found;
            });
        };
        const debouncedScan = ()=>{
            window.clearTimeout(timer);
            timer = window.setTimeout(scan, 250);
        };
        // First scan after paint; the form streams in, so retry once shortly after.
        scan();
        timer = window.setTimeout(scan, 600);
        const observer = new MutationObserver(debouncedScan);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        return ()=>{
            window.clearTimeout(timer);
            observer.disconnect();
        };
    }, [
        isEditView,
        pathname
    ]);
    // ---- active-section tracking ----------------------------------------------
    React.useEffect(()=>{
        if (sections.length === 0) return;
        let raf = 0;
        const onScroll = ()=>{
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(()=>{
                // Only the selected tab may claim the active state from scrolling —
                // inactive tabs sit at the same position as the tabs field.
                const eligible = sections.filter((section)=>!section.tabButton || section.tabButton.className.includes('--active'));
                // Pinned to the page bottom → the last section is active even if it
                // never reaches the top of the viewport.
                const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
                let current = eligible[0]?.id ?? null;
                if (atBottom) {
                    current = eligible[eligible.length - 1]?.id ?? current;
                } else {
                    for (const section of eligible){
                        if (section.el.getBoundingClientRect().top <= SCROLL_OFFSET + 40) current = section.id;
                        else break;
                    }
                }
                setActiveId(current);
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, {
            passive: true
        });
        return ()=>{
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
        };
    }, [
        sections
    ]);
    if (!isEditView || sections.length < 3) return null;
    if (typeof document === 'undefined') return null;
    const jump = (section)=>{
        if (section.tabButton && !section.tabButton.className.includes('--active')) section.tabButton.click();
        const top = section.el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({
            behavior: reduceMotion ? 'auto' : 'smooth',
            top
        });
        setActiveId(section.id);
    };
    return /*#__PURE__*/ createPortal(/*#__PURE__*/ _jsxs("nav", {
        "aria-label": t('payloadTheme:documentOutline'),
        className: "pt-toc",
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: "pt-toc__rail",
                "aria-hidden": "true",
                children: sections.map((section)=>/*#__PURE__*/ _jsx("span", {
                        className: [
                            'pt-toc__tick',
                            section.id === activeId && 'pt-toc__tick--active'
                        ].filter(Boolean).join(' ')
                    }, section.id))
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "pt-toc__panel",
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "pt-toc__panel-title",
                        children: t('payloadTheme:onThisPage')
                    }),
                    sections.map((section)=>/*#__PURE__*/ _jsx("button", {
                            className: [
                                'pt-toc__item',
                                section.id === activeId && 'pt-toc__item--active'
                            ].filter(Boolean).join(' '),
                            onClick: ()=>jump(section),
                            type: "button",
                            children: section.label
                        }, section.id))
                ]
            })
        ]
    }), document.body);
};
export default DocOutline;
