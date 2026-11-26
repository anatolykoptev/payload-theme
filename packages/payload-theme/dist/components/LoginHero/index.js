import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PayloadLogo } from '@payloadcms/ui/graphics/Logo';
import React from 'react';
import { themeT } from '../../translations/types.js';
/**
 * Login branding injected via `admin.components.beforeLogin`. Renders three
 * things:
 *
 * 1. the `--pt-*` accent tokens as a <style> — a SERVER concern on purpose:
 *    Payload strips `admin.custom` from the client config on unauthenticated
 *    pages (`createUnauthenticatedClientConfig`), so the ThemeProvider can't
 *    inject them here. This component reads the theme straight off the live
 *    `payload` instance it receives as a beforeLogin server prop.
 * 2. the always-dark brand panel (`.pt-login-hero`) — glow + grid + copy,
 *    no logo.
 * 3. the logo, centered above the login form and sized by
 *    `--pt-logo-height`: the user's own when a logo/icon option is
 *    configured, Payload's otherwise.
 *
 * The stylesheet switches the card to the split layout only when
 * `.pt-login-hero` exists, so forgot-password / reset keep the plain card.
 */ export const LoginHero = ({ i18n, payload })=>{
    const theme = payload?.config?.admin?.custom?.payloadTheme;
    const t = themeT(i18n);
    // Config copy wins; otherwise the localized default for the viewer's panel
    // language, so an untouched install still reads correctly in every locale.
    const heading = theme?.login?.heading ?? t('payloadTheme:loginHeading');
    const tagline = theme?.login?.tagline ?? t('payloadTheme:loginTagline');
    // The form column follows the viewer's color scheme, so keep the pair and
    // let CSS show the matching variant (same mechanism as the nav logo).
    const logo = theme?.logo ?? theme?.icon;
    const logoIsPair = logo ? logo.dark !== logo.light : false;
    return /*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            theme?.css ? /*#__PURE__*/ _jsx("style", {
                "data-payload-theme": "accent-login",
                dangerouslySetInnerHTML: {
                    __html: theme.css
                }
            }) : null,
            theme?.fontURL ? /*#__PURE__*/ _jsx("link", {
                "data-payload-theme": "font-login",
                href: theme.fontURL,
                rel: "stylesheet"
            }) : null,
            /*#__PURE__*/ _jsxs("div", {
                "aria-hidden": "true",
                className: "pt-login-hero",
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "pt-login-hero__glow"
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "pt-login-hero__grid"
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "pt-login-hero__copy",
                        children: [
                            /*#__PURE__*/ _jsx("h2", {
                                className: "pt-login-hero__heading",
                                children: heading
                            }),
                            /*#__PURE__*/ _jsx("p", {
                                className: "pt-login-hero__tagline",
                                children: tagline
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "pt-login__logo",
                children: logo ? logoIsPair ? /*#__PURE__*/ _jsxs(React.Fragment, {
                    children: [
                        /*#__PURE__*/ _jsx("img", {
                            alt: "",
                            className: "pt-login__logo-img pt-login__logo-img--light",
                            src: logo.light
                        }),
                        /*#__PURE__*/ _jsx("img", {
                            alt: "",
                            className: "pt-login__logo-img pt-login__logo-img--dark",
                            src: logo.dark
                        })
                    ]
                }) : /*#__PURE__*/ _jsx("img", {
                    alt: "",
                    className: "pt-login__logo-img",
                    src: logo.light
                }) : // No logo configured — Payload's own mark (follows the color scheme).
                /*#__PURE__*/ _jsx(PayloadLogo, {})
            })
        ]
    });
};
export default LoginHero;
