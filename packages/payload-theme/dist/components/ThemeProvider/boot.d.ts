/**
 * Pre-paint replay of the header customizer's overrides.
 *
 * The customizer applies its overrides from an effect, i.e. only after the
 * page hydrates. On a full load that left the config's own look on screen
 * until then — in `next dev` long enough to read as "my settings reset".
 * Every time it applies, the customizer also stores the exact CSS it produced
 * (plus the webfont URL); this inline script, rendered by the BootScript
 * server component ahead of the page, re-injects that snapshot while the HTML
 * is still being parsed, so the first paint is already the customized one. Once the
 * customizer mounts, it takes over and drops the boot <style>.
 */
export declare const BOOT_STORAGE_KEY = "payload-theme-boot";
export declare const BOOT_STYLE_ID = "pt-boot-override";
export declare const FONT_LINK_ID = "pt-font-override";
/** What the customizer stores: one CSS string and an optional webfont URL. */
export interface BootSnapshot {
    css: string;
    font?: string;
}
/**
 * Plain ES5, no dependencies, every failure swallowed: storage may be blocked
 * and the snapshot may be stale or hand-edited — the panel must render anyway.
 */
export declare const BOOT_SCRIPT: string;
