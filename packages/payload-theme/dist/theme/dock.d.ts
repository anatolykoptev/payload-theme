/**
 * Docked sidebar on laptop widths — the `nav.dockedMinWidth` option.
 *
 * Payload hard-codes its `l` breakpoint at 1440px (`WindowInfoProvider` in
 * `@payloadcms/ui`) and its `NavProvider` force-closes the nav at or below it,
 * and the stylesheet turns the same range into an overlay drawer. The option
 * lowers the drawer's ceiling: from `dockedMinWidth` up to 1440px the sidebar
 * is docked like it is above 1440px, below it the drawer stays.
 *
 * Pure and dependency-free, like `surface.ts`: the plugin renders the CSS into
 * the ThemeProvider's <style> on the server (so the first paint is already
 * docked) and the Nav reads the same media queries on the client.
 */
/** Payload's `l` breakpoint: at or below it Payload treats the nav as a drawer. */
export declare const DRAWER_MAX_WIDTH = 1440;
/** Payload's `m` breakpoint is 1024px: tablets and below always keep the drawer. */
export declare const DOCKED_MIN_WIDTH_FLOOR = 1025;
/** The widths where the option docks the sidebar, e.g. `(min-width: 1280px) and (max-width: 1440px)`. */
export declare const dockedBandQuery: (minWidth: number) => string;
/** The widths where the sidebar is still an overlay drawer. */
export declare const drawerQuery: (dockedMinWidth: null | number) => string;
/** Render the docked-band CSS — `''` when the option is off, so nothing changes by default. */
export declare function dockedNavToCss(dockedMinWidth: null | number): string;
