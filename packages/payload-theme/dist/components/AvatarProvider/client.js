'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const EMPTY = {
    node: null,
    src: null
};
const AvatarContext = /*#__PURE__*/ React.createContext(EMPTY);
/**
 * Client half of the avatar plumbing. Resolving the avatar needs the server
 * (a DB lookup for upload fields, `RenderServerComponent` for a custom
 * component), but the user block that shows it is a client component — so the
 * server provider hands the result down through this context.
 */ export const ThemeAvatarProvider = ({ children, value })=>/*#__PURE__*/ _jsx(AvatarContext.Provider, {
        value: value,
        children: children
    });
/**
 * The resolved avatar for the logged-in user. Returns `{ node: null, src:
 * null }` when nothing is configured — or when the provider isn't registered
 * yet (an import map generated before this version), so the user block keeps
 * rendering initials instead of breaking.
 */ export const useThemeAvatar = ()=>React.useContext(AvatarContext);
