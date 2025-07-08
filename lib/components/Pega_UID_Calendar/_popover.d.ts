import React, { JSX } from 'react';
import { TEventImpl } from './index';
export interface IPopoverEvent {
    eventEl: HTMLDivElement | null;
    eventInfo: TEventImpl | null;
    inPopover: boolean;
    inEl: boolean;
}
export interface IPopoverProps {
    eventInPopover: IPopoverEvent;
    isSummary?: boolean;
    handlePopoverMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
    handlePopoverMouseLeave: (event: React.MouseEvent<HTMLElement>) => void;
    renderBeratungsartBadge: (beratungsart: string) => JSX.Element;
    openPreviewEventOnClick: () => void;
}
declare const _default: (props: IPopoverProps) => globalThis.JSX.Element | null;
export default _default;
//# sourceMappingURL=_popover.d.ts.map