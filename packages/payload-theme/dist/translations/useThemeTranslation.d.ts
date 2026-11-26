import type { I18n } from '@payloadcms/translations';
import type { ThemeTFunction } from './types.js';
/**
 * Payload's `useTranslation`, with the theme's `payloadTheme:*` keys allowed.
 * The underlying `t` already resolves them: Payload deep-merges
 * `config.i18n.translations` into the client dictionary without filtering
 * custom namespaces, so nothing extra ships to the browser.
 */
export declare const useThemeTranslation: () => {
    i18n: I18n;
    t: ThemeTFunction;
};
