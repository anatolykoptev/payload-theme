'use client';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Client-side leaf of the (server) Dashboard: the animated stat-card counter.
 * Renders the final value on the server and only animates after mount, so
 * there is no hydration mismatch.
 */ import React from 'react';
const reducedMotion = ()=>typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Animated count-up for the stat cards. Renders the final value immediately
 * when the user prefers reduced motion (and on the server). */ export const CountUp = ({ value })=>{
    const [display, setDisplay] = React.useState(value);
    // No "ran once" ref: StrictMode mounts effects twice, and a ref guard would
    // let the first (cancelled) run block the real one — freezing the count at 0.
    React.useEffect(()=>{
        if (value === 0 || reducedMotion()) {
            setDisplay(value);
            return;
        }
        const duration = 650;
        let raf = 0;
        const start = performance.now();
        const tick = (now)=>{
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(value * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        setDisplay(0);
        raf = requestAnimationFrame(tick);
        return ()=>cancelAnimationFrame(raf);
    }, [
        value
    ]);
    return /*#__PURE__*/ _jsx("span", {
        suppressHydrationWarning: true,
        children: display.toLocaleString('en-US')
    });
};
