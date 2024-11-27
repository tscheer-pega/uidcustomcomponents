import { CalendarApi } from '@fullcalendar/core';
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
    createMassClassname?: string;
    interactionId?: string;
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
    ApplicationSubmission = "Bewerbungsabgabe",
    _TMP_ = "Tempor\u00E4r"
}
export declare enum EEventType {
    ABSENCE = "Abwesend",
    AVAILABILITY = "Verf\u00FCgbar",
    APPOINTMENT = "Termin",
    MASS_EVENT = "Sammel",
    PUBLIC_HOLIDAY = "Feiertag"
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
export interface IAdresse {
    Ort: string;
    PLZ: string;
    Strasse: string;
    Hausnummer: string;
}
export interface IOrganisationseinheit {
    Addresse: IAdresse;
    Name: string;
    pzInsKey: string;
}
export interface IRawEvent {
    pyGUID?: string;
    Address?: string;
    AuthorID?: string;
    Capacity?: string;
    City?: string;
    EndTime: string;
    OrganisationseinheitID?: string;
    StartTime: string;
    TerminID?: string;
    Type: EEventType;
    UtilizedCapacity?: string;
    Beratungsart?: ETerminGoal;
    Beratungsstellentyp?: EBeratungsTyp;
    CompleteDay?: boolean;
    IsSerie?: boolean;
    SerieEnd?: string;
    SerieRepeat?: string;
    Subject: string;
    Beratungsstelle?: IBeratungsstelle;
    IOrganisationseinheit?: IOrganisationseinheit;
}
export declare type TDateInfo = {
    view: {
        type: EViewType;
    };
    startStr?: string;
    start?: string;
    end?: string;
};
export declare const publicHolidayEvents: Array<IRawEvent>;
export declare const PegaUidCalendar: (props: TCalendarProps) => JSX.Element;
declare const _default: (props: TCalendarProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map