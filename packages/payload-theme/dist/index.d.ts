/**
 * payload-theme — a single-accent theme for the Payload
 * admin panel. Drop it into your `plugins` array, add one CSS import, and the
 * whole panel is restyled and recolored from one accent hex.
 *
 * @example
 * import { payloadTheme } from 'payload-theme'
 *
 * export default buildConfig({
 *   plugins: [
 *     payloadTheme({
 *       accent: '#e30613',
 *       logo: '/logo.svg',
 *       nav: { icons: { posts: 'newspaper', users: 'users' } },
 *     }),
 *   ],
 * })
 */
import type { Config } from 'payload';
import { type PayloadThemeOptions } from './options.js';
/**
 * The plugin factory. Returns an (async) Payload config transform that:
 * 1. validates options, computes the accent scale and loads the icon
 *    geometry the panel draws (once, at init),
 * 2. stashes the serializable theme config on `admin.custom.payloadTheme`,
 * 3. registers dashboard widgets in `admin.dependencies` so the import-map
 *    generator picks them up,
 * 4. registers the custom Nav, Dashboard, the accent-injecting provider and
 *    the server-side avatar resolver.
 */
export declare const payloadTheme: (options?: PayloadThemeOptions) => (incoming: Config) => Promise<Config>;
export default payloadTheme;
export { THEME_PRESETS } from './options.js';
export type { DashboardOptions, DashboardWidget, DashboardWidgetServerProps, DashboardWidgetWidth, NavOptions, PayloadThemeOptions, ThemeAvatarOption, ThemeDarkMode, ThemeDensity, ThemeFont, ThemeFrame, ThemeLogoLink, ThemeNeutral, ThemePreset, ThemePresetDefinition, ThemeRadius, ThemeWidgetsPosition, } from './options.js';
export { THEME_I18N_NAMESPACE, THEME_TRANSLATIONS } from './translations/index.js';
export type { ThemeTranslationKey, ThemeTranslations } from './translations/index.js';
