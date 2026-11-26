'use client';
import { useTranslation } from '@payloadcms/ui';
/**
 * Payload's `useTranslation`, with the theme's `payloadTheme:*` keys allowed.
 * The underlying `t` already resolves them: Payload deep-merges
 * `config.i18n.translations` into the client dictionary without filtering
 * custom namespaces, so nothing extra ships to the browser.
 */ export const useThemeTranslation = ()=>{
    const { i18n } = useTranslation();
    const typed = i18n;
    return {
        i18n: typed,
        t: typed.t
    };
};
