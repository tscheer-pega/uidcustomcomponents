import { CalendarApi } from '@fullcalendar/core';
import './create-nonce';

export declare type TEventImpl = Parameters<CalendarApi['addEvent']>[0];
export declare enum ECalendarViewType {
    Day = "timeGridDay",
    Week = "timeGridWeek",
    WorkWeek = "workingWeek",
    Month = "dayGridMonth"
}
export declare enum ETimelineViewType {
    Day = "resourceTimelineDay",
    Week = "resourceTimelineWeek",
    Month = "resourceTimelineMonth"
}
export declare enum ERoles {
    ADVISOR = "KommC:Karriereberater",
    AGENT = "KommC:Agent",
    ADMIN = "KommC:AppAdmin"
}
export declare type TCalendarProps = {
    heading?: string;
    dataPage?: string;
    dataPageResources?: string;
    createClassname?: string;
    createMassClassname?: string;
    interactionId?: string;
    defaultViewMode?: 'Monthly' | 'Weekly' | 'Daily';
    nowIndicator?: boolean;
    weekendIndicator?: boolean;
    showTimeline?: boolean;
    readOnlyAccess?: boolean;
    getPConnect: () => {
        getActionsApi: () => {
            createWork: (className: string, params: {
                openCaseViewAfterCreate?: boolean;
                interactionId?: string;
                containerName?: string;
                flowType?: string;
                skipBrowserSemanticUrlUpdate?: boolean;
                viewType?: string;
                caseTypeID?: string;
                startingFields?: {
                    cxContextType?: string;
                    InteractionId?: string;
                    InteractionKey?: string;
                    CalStartTime?: string;
                    CalEndTime?: string;
                    CalOrganisationseinheitID?: string;
                    CalAuthorID?: string;
                    FromCalendar?: boolean;
                };
                processID?: string;
            }) => Promise<{
                errorDetails?: Array<{
                    message: string;
                }>;
                data?: {
                    caseInfo: {
                        ID: string;
                    };
                };
            }>;
            showCasePreview: (caseId: string) => void;
        };
    };
    beraterInfo?: {
        parentId: string;
        resourceId: string;
    };
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
    PUBLIC_HOLIDAY = "Feiertag",
    CANCELLED = "Storniert",
    REVOKED = "Abgesagt",
    SUMMARY = "Zusammenfassung"
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
    ResourceId?: string;
    summary?: boolean;
}
export declare type TDateInfo = {
    view: {
        type: ECalendarViewType | ETimelineViewType;
    };
    startStr?: string;
    start?: string;
    end?: string;
};
export interface ISummary {
    Day: string;
    Sammel: string;
    Termin: string;
}
export interface IRawResource {
    pyGUID: string;
    AddressId: string;
    Region: string;
    Name: string;
    Summary?: Array<ISummary>;
    BeraterList?: Array<{
        pyUserIdentifier: string;
        pyUserName: string;
    }>;
}
export interface IBerater {
    id: string;
    title: string;
    pyUserIdentifier: string;
}
export interface IResource {
    id: string;
    title: string;
    region: string;
    children?: Array<IBerater>;
    Summary?: Array<ISummary>;
}
export declare const getDateTimeFromIsoString: (isoString: string, dateOrTime: EDateTimeType, options?: any, locale?: string) => string;
export declare const getTypeIcon: (appointmentType: string) => JSX.Element;
export declare const renderBeratungsartBadge: (beratungsart: string) => JSX.Element;
/**
 * Pega UID Calendar
 * @param props {TCalendarProps}
 * @constructor
 */
export declare const PegaUidCalendar: (props: TCalendarProps) => JSX.Element;
declare const _default: (props: TCalendarProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map