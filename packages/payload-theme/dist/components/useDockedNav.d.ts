import React from 'react';
/** SSR-safe layout effect: the fixes below must land before the browser paints,
 * but the Nav is server-rendered too and `useLayoutEffect` warns there. */
export declare const useIsomorphicLayoutEffect: typeof React.useEffect;
/** Record an explicit open/collapse (the header chip), so it is never undone. */
export declare const rememberSidebarWish: (open: boolean) => void;
/**
 * Keeps the sidebar docked and open in the `nav.dockedMinWidth` band.
 *
 * Payload's `NavProvider` closes the nav on mount and on every breakpoint
 * change at 1440px and below, whatever the saved preference says (it only
 * reads the preference above 1440px). Inside the band that close is undone as
 * soon as it lands, unless the user collapsed the sidebar themselves or saved
 * it closed. Because the undo runs in a layout effect, React re-renders before
 * the browser paints the closed state.
 *
 * Leaving the band downward hands the nav back to the drawer: closed, so it
 * does not pop up as an overlay when the window shrinks.
 */
export declare const useDockedNav: (dockedMinWidth: null | number) => void;
