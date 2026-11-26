import type { IconName } from 'lucide-react/dynamic.mjs';
import React from 'react';
export type { IconName };
/**
 * Seed the cache with geometry the server already resolved (the plugin ships
 * it on `admin.custom.payloadTheme.iconNodes`). Called by the ThemeProvider
 * during render, before any icon below it renders — on the server and on the
 * client alike — so those icons paint on the first frame and hydrate as-is.
 */
export declare const seedIcons: (nodes: Record<string, unknown> | undefined) => void;
export type IconProps = {
    name: IconName | string;
} & Omit<React.SVGProps<SVGSVGElement>, 'name'>;
/**
 * Drop-in replacement for lucide's `DynamicIcon`: same props, same per-icon
 * lazy chunk, but loaded icons are cached across mounts and the pending state
 * is an empty box of the right size instead of nothing, so labels beside an
 * icon never shift while it loads.
 */
export declare const Icon: React.FC<IconProps>;
export default Icon;
