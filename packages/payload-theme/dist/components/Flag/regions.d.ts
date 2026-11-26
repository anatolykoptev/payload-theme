/**
 * Locale code → flag region, split out of the component so the mapping can be
 * unit-tested without a React tree.
 *
 * Payload locale codes are whatever the project configured: a bare language
 * (`tr`), a language+region tag (`pt-BR`, `en_US`), or something with a script
 * in the middle (`zh-Hant-TW`). A flag is a REGION, not a language, so an
 * explicit region subtag always wins; only when there is none do we fall back
 * to the country conventionally associated with the language.
 *
 * That fallback is a convention, not a fact — `en` is not the United Kingdom
 * and `ar` is not Saudi Arabia. It exists so the common single-language setup
 * gets a flag at all; projects that care about the distinction should spell the
 * region out (`en-US`), which this respects.
 */
/**
 * Resolve a locale code to a two-letter region code, or `undefined` when
 * nothing sensible maps (the caller then shows the code badge alone).
 */
export declare const localeToRegion: (code: string) => string | undefined;
