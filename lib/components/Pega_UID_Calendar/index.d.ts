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
            openWorkByHandle: (pzInsKey: string, className: string) => Promise<any>;
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
    office = "Au\u00DFenstelle"
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
export interface ISammelDetails {
    Fulfillment: number;
    Completed: number;
    Intake: number;
    Cancelled: number;
    Removed: number;
}
export interface ITerminDetails {
    Fulfillment: number;
    Bewerbungsabgabe: number;
    Completed: number;
    Intake: number;
    Cancelled: number;
    Removed: number;
    Erstberatung: number;
    Folgeberatung: number;
}
export interface IRawEvent {
    pyGUID?: string;
    Address?: string;
    AuthorID?: string;
    Capacity?: string;
    City?: string;
    EndTime: string;
    OrganisationseinheitID?: string;
    BeratungsstelleID?: string;
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
    IOrganisationseinheit?: IOrganisationseinheit;
    ResourceId?: string;
    summary?: boolean;
    SammelDetails?: ISammelDetails;
    TerminDetails?: ITerminDetails;
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
    SammelDetails?: ISammelDetails;
    TerminDetails?: ITerminDetails;
}
export interface IRawResource {
    pyGUID: string;
    AddressID: string;
    OrganisationseinheitID: string;
    BeratungsstelleID: string;
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
    BeratungsstelleID?: string;
    OrganisationseinheitID?: string;
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
export interface IPegaError {
    message: string;
    response?: {
        data?: {
            errorDetails?: Array<{
                localizedValue: string;
            }>;
            message?: string;
        };
    };
}
/**
 * Pega UID Calendar
 * @param props {TCalendarProps}
 * @constructor
 */
export declare const PegaUidCalendar: (props: TCalendarProps) => JSX.Element;
declare const _default: (props: TCalendarProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map