import React from 'react';
/**
 * Replacement list-view cell for checkbox fields, registered per-field by the
 * plugin. Stock Payload prints a raw `true` / `false` code chip — the rawest
 * corner of the panel. This renders a small round chip instead: a green tick
 * for true, a muted X for false. Icon-only; the localized yes/no lives in the
 * accessible label.
 */
export declare const BoolCell: React.FC<{
    cellData?: unknown;
}>;
export default BoolCell;
