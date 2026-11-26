/**
 * Hand-written input validation (no schema library).
 *
 * The public surface takes a single accent hex; invalid input must fail early
 * with a message that tells the user exactly what shape is expected.
 */
/** Type guard: true when `value` is a `#rgb` or `#rrggbb` hex string. */
export declare function isValidHex(value: unknown): value is string;
/**
 * Validate and normalize an accent hex to canonical lowercase `#rrggbb`.
 * Throws a descriptive Error on anything that is not a 3- or 6-digit hex.
 */
export declare function normalizeHex(value: unknown, label?: string): string;
