/**
 * The typed `t` the theme's components use. Kept in its own module (no
 * `'use client'`, no runtime imports beyond the type) so server components can
 * pull `themeT` without dragging the locale dictionaries or a client boundary
 * along.
 */ /**
 * Widen an `i18n.t` from a server component (Dashboard, LoginHero). Both
 * contexts resolve `payloadTheme:*`: Payload filters its own dictionary
 * against `clientTranslationKeys`, then merges `config.i18n.translations` on
 * top without filtering custom namespaces.
 */ export const themeT = (i18n)=>i18n.t;
/**
 * A plural-aware `payloadTheme:<key>`. Payload's own resolver picks the suffix
 * with fixed thresholds (`_few` for 3-5, `_many` above 5), which is wrong for
 * languages whose rules differ: Russian says «5 документов» but «22 документа».
 * When the locale ships any extra plural form (`_zero`, `_two`, `_few`, `_many`)
 * for `key`, pick the CLDR form for `count` (`Intl.PluralRules`). Otherwise
 * (en, de, fr, es, it, nl, pt, tr: `_one` / `_other` only) defer to Payload, so
 * those languages resolve exactly as before.
 */ export const themePlural = (i18n, key, count)=>{
    const namespace = i18n.translations.payloadTheme;
    const hasExtraForms = [
        'zero',
        'two',
        'few',
        'many'
    ].some((form)=>typeof namespace?.[`${key}_${form}`] === 'string');
    if (hasExtraForms) {
        const value = namespace?.[`${key}_${new Intl.PluralRules(i18n.language).select(count)}`];
        if (typeof value === 'string') return value;
    }
    return themeT(i18n)(`payloadTheme:${key}`, {
        count
    });
};
