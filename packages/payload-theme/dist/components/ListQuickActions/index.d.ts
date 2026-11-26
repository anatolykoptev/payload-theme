import React from 'react';
/**
 * Persistent row actions for list views: every table row gets an actions cell
 * pinned to the table's right edge with an Edit link and a two-step Delete
 * button (first click arms a red "Delete?", second click commits through
 * Payload's REST endpoint and refreshes the route).
 *
 * Registered as a provider (children pass through untouched) so ONE instance
 * serves every list view. The cells are appended to Payload's own table markup
 * via a MutationObserver: the decorator is idempotent (marker class), so the
 * observer settles immediately after each pass, and rows re-rendered by React
 * are simply re-decorated. The collection + id come from the row's own edit
 * link, so rows without a document link (or trash rows) get an empty spacer
 * cell and nothing else.
 */
export declare const ListQuickActions: React.FC<{
    children?: React.ReactNode;
}>;
export default ListQuickActions;
