/**
 * English — the source of truth for the theme's own strings.
 *
 * Every other locale is a `ThemeTranslations` object typed against this one, so
 * a new key is a compile error in every language file until it is translated.
 * Keys Payload already ships (`general:close`, `authentication:logOut`,
 * `general:createNewLabel`, …) are reused directly in the components and
 * deliberately absent here — this namespace only holds strings the theme adds.
 */
export declare const en: {
    search: string;
    searchPlaceholder: string;
    commandPalette: string;
    searchingDocuments: string;
    noResultsFor: string;
    groupRecent: string;
    groupDocuments: string;
    groupNavigate: string;
    groupCreate: string;
    groupActions: string;
    hintCollection: string;
    hintGlobal: string;
    hintNew: string;
    hintAppearance: string;
    hintHelp: string;
    hintSession: string;
    switchToLightMode: string;
    switchToDarkMode: string;
    keyboardShortcuts: string;
    paletteNavigate: string;
    paletteOpen: string;
    paletteToggle: string;
    global: string;
    manageConfiguration: string;
    documentCount_one: string;
    documentCount_other: string;
    lastThirtyDays: string;
    trendTitle: string;
    trendAllNewTitle: string;
    trendNew: string;
    documentOutline: string;
    onThisPage: string;
    shortcutsGlobal: string;
    shortcutsPalette: string;
    shortcutsEditView: string;
    shortcutOpenPalette: string;
    shortcutCloseDialogs: string;
    shortcutMoveResults: string;
    shortcutOpenResult: string;
    shortcutClosePalette: string;
    shortcutSaveDocument: string;
    themeSettings: string;
    presets: string;
    accent: string;
    accentSwatch: string;
    customAccentHex: string;
    radius: string;
    font: string;
    fontDefault: string;
    colorMode: string;
    contentLayout: string;
    layoutCentered: string;
    layoutFull: string;
    neutral: string;
    density: string;
    densityComfortable: string;
    densityCompact: string;
    frame: string;
    frameInset: string;
    frameFlat: string;
    widgets: string;
    widgetsTop: string;
    widgetsBottom: string;
    darkDepth: string;
    darkDeep: string;
    darkDim: string;
    copyConfig: string;
    copyConfigTitle: string;
    copied: string;
    collapseSidebar: string;
    expandSidebar: string;
    lightMode: string;
    darkMode: string;
    gridView: string;
    listView: string;
    loginHeading: string;
    loginTagline: string;
};
/**
 * Payload's other plural forms (`getTranslationString` looks for `_zero`, `_two`,
 * `_few` and `_many` before falling back to `_other`). Optional: English only
 * needs `_one` / `_other`, languages with more plural forms add what they need.
 */
export type ThemePluralForms = Partial<Record<`documentCount_${'zero' | 'two' | 'few' | 'many'}`, string>>;
/** The shape every locale file must satisfy. */
export type ThemeTranslations = typeof en & ThemePluralForms;
/** `payloadTheme:<key>` — the fully-qualified keys the components pass to `t`. */
export type ThemeTranslationKey = `payloadTheme:${keyof ThemeTranslations extends infer K ? K extends `${infer Base}_one` | `${infer Base}_other` ? Base : K : never}`;
