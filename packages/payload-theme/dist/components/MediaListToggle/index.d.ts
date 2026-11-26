import React from 'react';
/**
 * Grid/table switch rendered above upload-collection list views (the plugin
 * registers it via `admin.components.beforeListTable` on every collection with
 * `upload` enabled). The stylesheet keys the whole media-grid layout off
 * `.collection-list:has(.pt-media-toggle[data-view='grid'])`, so this
 * component's own state drives the view — no extra wiring, and the grid is
 * already applied in the server-rendered HTML (grid is the default).
 */
export declare const MediaListToggle: React.FC;
export default MediaListToggle;
