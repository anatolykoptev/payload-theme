/**
 * Pure avatar-resolution helpers, split out of the provider so they can be
 * unit-tested without a React tree or a live Payload instance.
 */
import type { Payload, TypedUser } from 'payload';
import type { ResolvedAvatar } from '../../options.js';
/** Loose field shape — enough to walk containers without fighting the union. */
export type AnyField = {
    fields?: AnyField[];
    name?: string;
    relationTo?: string | string[];
    tabs?: {
        fields: AnyField[];
        name?: string;
    }[];
    type?: string;
};
/** Walk a dot path on a plain object, tolerating anything non-object midway. */
export declare const valueAtPath: (source: unknown, path: string) => unknown;
/**
 * Find a field config by dot path. Presentational containers (row,
 * collapsible, unnamed tabs) don't add a path segment, so they're searched
 * with the same segments; named groups and tabs consume one.
 */
export declare function findField(fields: AnyField[] | undefined, segments: string[]): AnyField | null;
/** True for something usable as an `<img src>` — absolute, root-relative or data. */
export declare const isImageURL: (value: string) => boolean;
/**
 * A URL out of whatever the field holds: a plain string URL, or a populated
 * upload doc — preferring the named `size` when one is configured, since an
 * avatar has no business loading the original file.
 */
export declare function toImageURL(value: unknown, size: null | string): null | string;
/**
 * Gravatar URL for an email. Hashed with SHA-256 — Gravatar's current
 * recommendation, and reachable through Web Crypto everywhere Payload runs,
 * so this needs no md5 dependency. `d=mp` serves the neutral silhouette when
 * the address has no Gravatar.
 */
export declare function gravatarURL(email: string): Promise<string>;
/** Resolve `avatar: { field }` against the logged-in user's document. */
export declare function resolveFieldAvatar(payload: Payload, user: TypedUser, source: Extract<ResolvedAvatar, {
    type: 'field';
}>): Promise<null | string>;
