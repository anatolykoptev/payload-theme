import type { ServerProps } from 'payload';
import React from 'react';
/**
 * Resolves the user avatar once per request and hands it to the client user
 * blocks (sidebar + header) through context.
 *
 * A SERVER component on purpose — every source needs the server:
 *  - `avatar: { field }` may point at an upload relationship that arrives on
 *    `req.user` as a bare ID (Payload's auth depth is 0 by default), so the
 *    related doc has to be fetched — access-controlled — for its URL.
 *  - Payload's own `admin.avatar: { Component }` is a `PayloadComponent`
 *    path only `RenderServerComponent` + the import map can resolve.
 *
 * Registered in `admin.components.providers`, where Payload hands providers
 * the full server props (`payload`, `user`, `i18n`, `permissions`).
 *
 * With nothing configured this does no work at all — no fetch, no render —
 * and the user block draws its accent initials circle as before.
 */
export declare const AvatarProvider: ({ children, i18n, payload, permissions, user, }: {
    children?: React.ReactNode;
} & ServerProps) => Promise<import("react/jsx-runtime").JSX.Element>;
export default AvatarProvider;
