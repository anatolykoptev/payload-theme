'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useConfig } from '@payloadcms/ui';
import React from 'react';
import { seedIcons } from '../Icon/index.js';
/**
 * Injects the computed accent scale (`--pt-*` custom properties) that the
 * static stylesheet reads. Registered in `admin.components.providers`, it sits
 * inside Payload's ConfigProvider, so it reads the precomputed CSS string off
 * `admin.custom.payloadTheme` and renders it into a <style> — server-rendered
 * in the initial HTML, so there's no flash of unthemed color.
 */ export const ThemeProvider = ({ children })=>{
    const { config } = useConfig();
    const theme = config.admin?.custom?.payloadTheme;
    // before any child renders: every Icon below draws from a warm cache
    seedIcons(theme?.iconNodes);
    return /*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            theme?.css ? /*#__PURE__*/ _jsx("style", {
                "data-payload-theme": "accent",
                dangerouslySetInnerHTML: {
                    __html: theme.css
                }
            }) : null,
            theme?.fontURL ? /*#__PURE__*/ _jsx("link", {
                "data-payload-theme": "font",
                href: theme.fontURL,
                rel: "stylesheet"
            }) : null,
            children
        ]
    });
};
export default ThemeProvider;
