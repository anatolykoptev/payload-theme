'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { Icon as LucideIcon } from 'lucide-react';
import { dynamicIconImports } from 'lucide-react/dynamic.mjs';
import React from 'react';
import { iconNodeOf } from './iconNode.js';
/**
 * Icon geometry already pulled off the network, kept at MODULE scope so it
 * outlives the component tree.
 *
 * Payload renders the nav (and the whole view) inside `DefaultTemplate`, which
 * belongs to the page — not the layout — so every admin navigation remounts
 * it. lucide's own `DynamicIcon` re-resolves its icon in an effect and renders
 * `null` until that promise settles, which blanked every icon for a frame on
 * each navigation: the sidebar visibly flickered and its labels jumped left.
 * Cached here, the second and later mounts render synchronously — the first
 * paint after a navigation is already correct.
 */ const loaded = new Map();
/**
 * Seed the cache with geometry the server already resolved (the plugin ships
 * it on `admin.custom.payloadTheme.iconNodes`). Called by the ThemeProvider
 * during render, before any icon below it renders — on the server and on the
 * client alike — so those icons paint on the first frame and hydrate as-is.
 */ export const seedIcons = (nodes)=>{
    if (!nodes) return;
    for (const [name, node] of Object.entries(nodes)){
        if (!loaded.has(name)) loaded.set(name, node);
    }
};
/** In-flight (or settled) imports, so N icons of one name share a single load. */ const loading = new Map();
const load = (name)=>{
    const existing = loading.get(name);
    if (existing) return existing;
    const importer = dynamicIconImports[name];
    const promise = importer ? importer().then((mod)=>{
        // both lucide module shapes (see iconNode.ts); a module without
        // geometry stays out of the cache, so it isn't treated as loaded
        const node = iconNodeOf(mod);
        if (node) loaded.set(name, node);
    }).catch(()=>{
    // Chunk failed to load: keep the placeholder rather than taking the
    // whole panel down over an icon.
    }) : Promise.resolve();
    loading.set(name, promise);
    return promise;
};
/**
 * Drop-in replacement for lucide's `DynamicIcon`: same props, same per-icon
 * lazy chunk, but loaded icons are cached across mounts and the pending state
 * is an empty box of the right size instead of nothing, so labels beside an
 * icon never shift while it loads.
 */ export const Icon = ({ name, ...rest })=>{
    const iconNode = loaded.get(name);
    const [, rerender] = React.useReducer((count)=>count + 1, 0);
    React.useEffect(()=>{
        if (loaded.has(name)) {
            // Loaded between this render and its effect — another instance's import
            // settled meanwhile (navigations leave a gap). This render still drew
            // the placeholder, so draw again; returning silently left it blank.
            if (!iconNode) rerender();
            return;
        }
        let active = true;
        void load(name).then(()=>{
            if (active) rerender();
        });
        return ()=>{
            active = false;
        };
    }, [
        iconNode,
        name
    ]);
    if (iconNode) return /*#__PURE__*/ _jsx(LucideIcon, {
        ...rest,
        iconNode: iconNode
    });
    // Same geometry as a rendered lucide icon (24×24 viewBox, 24px default box),
    // so any CSS sizing the `svg` applies to the placeholder identically.
    return /*#__PURE__*/ _jsx("svg", {
        ...rest,
        "aria-hidden": "true",
        fill: "none",
        height: rest.height ?? 24,
        viewBox: "0 0 24 24",
        width: rest.width ?? 24,
        xmlns: "http://www.w3.org/2000/svg"
    });
};
export default Icon;
