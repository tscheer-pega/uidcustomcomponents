import React, { JSX } from 'react';
import { EViewType, TEventImpl } from './index';
export declare type TEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    item: any;
    display: string;
    allDay?: boolean;
    startTime?: string;
    endTime?: string;
    startRecur?: string;
    endRecur?: string;
    daysOfWeek?: Array<string>;
    color: string;
    rrule?: object;
    extendedProps?: {
        [key: string]: any;
    };
    duration?: string;
};
export interface ICalendarProps {
    nowIndicator: boolean;
    weekendIndicator: boolean;
    calendarRef: any;
    showPublicHolidays: boolean;
    renderBeratungsartBadge: (beratungsart: string) => JSX.Element;
    theme: any;
    dataPage: string;
    fillEvents: () => void;
    setSelectedStartDate: (date: string) => void;
    loadEvents: (date: string) => void;
    events: Array<TEvent>;
    setEvents: React.Dispatch<React.SetStateAction<Array<TEvent>>>;
    currentViewType: EViewType;
    setCurrentViewType: React.Dispatch<React.SetStateAction<EViewType>>;
    eventInPopover: {
        eventEl: HTMLDivElement | null;
        eventInfo: TEventImpl | null;
        inPopover: boolean;
        inEl: boolean;
    };
    setEventInPopover: React.Dispatch<React.SetStateAction<{
        eventEl: HTMLDivElement | null;
        eventInfo: TEventImpl | null;
        inPopover: boolean;
        inEl: boolean;
    }>>;
}
declare const _default: (props: ICalendarProps) => globalThis.JSX.Element;
export default _default;
//# sourceMappingURL=_calendar.d.ts.map