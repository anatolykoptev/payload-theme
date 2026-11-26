import React from 'react';
/**
 * Injects the computed accent scale (`--pt-*` custom properties) that the
 * static stylesheet reads. Registered in `admin.components.providers`, it sits
 * inside Payload's ConfigProvider, so it reads the precomputed CSS string off
 * `admin.custom.payloadTheme` and renders it into a <style> — server-rendered
 * in the initial HTML, so there's no flash of unthemed color.
 */
export declare const ThemeProvider: React.FC<{
    children?: React.ReactNode;
}>;
export default ThemeProvider;
