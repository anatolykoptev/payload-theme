/**
 * Client-side leaf of the (server) Dashboard: the animated stat-card counter.
 * Renders the final value on the server and only animates after mount, so
 * there is no hydration mismatch.
 */
import React from 'react';
/** Animated count-up for the stat cards. Renders the final value immediately
 * when the user prefers reduced motion (and on the server). */
export declare const CountUp: React.FC<{
    value: number;
}>;
