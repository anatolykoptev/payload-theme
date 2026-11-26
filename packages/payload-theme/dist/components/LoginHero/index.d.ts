import type { ServerProps } from 'payload';
import React from 'react';
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
 */
export declare const LoginHero: React.FC<ServerProps>;
export default LoginHero;
