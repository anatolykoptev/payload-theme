/**
 * The theme's own translation namespace (`payloadTheme:*`).
 *
 * Payload merges anything under `config.i18n.translations[language]` on top of
 * its built-in dictionary at request time, and — unlike the built-ins — custom
 * keys are NOT filtered against `clientTranslationKeys`, so the same namespace
 * reaches server components and the browser alike. `i18n` is a server-only
 * config property (Payload strips it from the client config), so registering
 * every language costs nothing in the client bundle.
 *
 * Strings Payload already ships are reused straight from its namespaces
 * (`general:close`, `general:locale`, `authentication:logOut`, …); this file
 * only covers what the theme adds.
 */
import type { AcceptedLanguages } from '@payloadcms/translations';
import type { Config } from 'payload';
import type { ThemeTranslations } from './en.js';
/** The namespace key every theme string lives under. */
export declare const THEME_I18N_NAMESPACE = "payloadTheme";
/**
 * Shipped locales. Anything Payload accepts but this map does not cover falls
 * back to English rather than rendering raw `payloadTheme:*` keys — new
 * translations are one file plus one line here.
 */
export declare const THEME_TRANSLATIONS: Partial<Record<AcceptedLanguages, ThemeTranslations>>;
/**
 * Merge the theme namespace into `config.i18n.translations` for every language
 * Payload accepts, preserving anything already there.
 *
 * Precedence per language: English base → that language's file → whatever the
 * project already defined. The user's own `payloadTheme:*` overrides therefore
 * always win, which makes this the supported way to reword the theme's copy
 * without touching a component.
 */
export declare function withThemeTranslations(i18n: Config['i18n']): Config['i18n'];
export { en } from './en.js';
export type { ThemeTranslationKey, ThemeTranslations } from './en.js';
