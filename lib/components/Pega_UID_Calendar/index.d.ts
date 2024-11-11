import type { CalendarApi } from '@fullcalendar/core';
import './create-nonce';
export declare type TEventImpl = Parameters<CalendarApi['addEvent']>[0];
export declare enum EViewType {
    Day = "timeGridDay",
    Week = "timeGridWeek",
    WorkWeek = "workingWeek",
    Month = "dayGridMonth"
}
export declare type TCalendarProps = {
    heading?: string;
    dataPage?: string;
    createClassname?: string;
    defaultViewMode?: 'Monthly' | 'Weekly' | 'Daily';
    nowIndicator?: boolean;
    weekendIndicator?: boolean;
    getPConnect: any;
};
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
export declare enum EDateTimeType {
    date = "date",
    time = "time"
}
export declare enum ETerminGoal {
    FirstContact = "Erstberatung",
    FollowUp = "Folgeberatung",
    ApplicationSubmission = "Bewerbungsabgabe"
}
export declare enum EEventType {
    Absence = "Abwesend",
    Availability = "Verf\u00FCgbar",
    Appointment = "Termin",
    MassEvent = "Sammel"
}
export declare enum EBeratungsTyp {
    presence = "Pr\u00E4senzberatung",
    online = "Online",
    phone = "Telefon",
    office = "Au\u00DFendienststelle"
}
export interface IBeratungsstelle {
    Typ: EBeratungsTyp;
}
export interface ITerminTyp {
    Order: 1;
    Typ: 'Präsenzberatung';
}
export interface IContact {
    FirstName: string;
    FullName: string;
    LastName: string;
    Salutation: string;
}
export interface ITermin {
    pxObjClass: string;
    TerminTyp: Array<ITerminTyp>;
    Beratungsart: ETerminGoal;
    Contact: IContact;
}
export interface ISammeltermin {
    pxObjClass: string;
    Bezeichnung: string;
    Ortsadresse: string;
    Kapazitaet: number;
    GenutzteKapazitat: number;
}
export interface IRawEvent {
    Beratungsstelle: IBeratungsstelle;
    CompleteDay: boolean;
    EndTime: string;
    IsSerie: boolean;
    Sammeltermin: ISammeltermin | null;
    SerieEndDate: string;
    SerieRepeat: string;
    StartTime: string;
    Subject: string;
    Termin: ITermin | null;
    TerminID: string;
    Type: EEventType;
    Weekday: string;
}
export declare type TDateInfo = {
    view: {
        type: EViewType;
    };
    startStr?: string;
    start?: string;
    end?: string;
};
export declare const PegaUidCalendar: (props: TCalendarProps) => JSX.Element;
declare const _default: (props: TCalendarProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map