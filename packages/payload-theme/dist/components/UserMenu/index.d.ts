import React from 'react';
/**
 * The shared user block: an avatar + name/email trigger opening a
 * shadcn-style dropdown with Account, the content-locale switcher (when
 * localization is enabled) and Log out.
 *
 * Two placements share this component:
 *  - `sidebar` — the full-width block pinned to the bottom of the nav
 *    (classes `pt-nav__user*`, menu opens upward)
 *  - `header`  — the compact chip at the right end of the app header
 *    (classes `pt-header-user*`, menu opens downward)
 *
 * The class PREFIX differs so each placement styles independently AND so
 * selectors like `.pt-nav__user-trigger` keep matching exactly one node.
 */
export declare const UserMenu: React.FC<{
    variant?: 'header' | 'sidebar';
}>;
export default UserMenu;
