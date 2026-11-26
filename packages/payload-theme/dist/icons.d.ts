/**
 * Icon geometry, resolved once on the server at plugin init.
 *
 * The client `Icon` lazy-loads every lucide icon as its own chunk. That keeps
 * the bundle small, but the server-rendered HTML can only hold an empty box
 * per icon, so on every full page load (a refresh, a fresh tab) the header
 * buttons, sidebar and dashboard cards stayed blank until each chunk arrived —
 * long enough to notice in `next dev`. Every name the panel can draw is known
 * up front (the theme's own chrome + the configured entity icons), so the
 * plugin loads their nodes here and ships them on `admin.custom`; the
 * ThemeProvider seeds the Icon cache before anything renders, and the very
 * first paint already has real icons.
 */
import { type IconNode } from './components/Icon/iconNode.js';
export type { IconNode };
/** Every icon the theme's own UI draws by literal name. */
export declare const THEME_UI_ICONS: string[];
/**
 * Load the nodes for `names` (deduplicated). Unknown names are skipped — the
 * client falls back to its lazy load, which renders the empty box for them
 * exactly as before.
 */
export declare function loadIconNodes(names: string[]): Promise<Record<string, IconNode>>;
