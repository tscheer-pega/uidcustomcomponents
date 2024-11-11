export declare const randomDate: (start: Date, end: Date) => Date;
export declare const getData: (props: {
    StartDate: string;
    EndDate: string;
}) => {
    fetchDateTime: string;
    pxObjClass: string;
    resultCount: number;
    data: {
        Beratungsstelle: {
            Typ: string;
        };
        CompleteDay: boolean;
        EndTime: string;
        IsSerie: boolean;
        Sammeltermin: {
            pxObjClass: string;
            Bezeichnung: string;
            Ort: string;
            Kapazitaet: number;
            GenutzteKapazitat: number;
            Ortsadresse: string;
        } | null;
        SerieEndDate: string;
        SerieRepeat: string;
        StartTime: string;
        Subject: string;
        Termin: {
            pxObjClass: string;
            TerminTyp: {
                Order: number;
                Typ: string;
            }[];
            Beratungsart: string;
            Contact: {
                FirstName: string;
                FullName: string;
                LastName: string;
                Salutation: string;
            };
        } | {
            pxObjClass: string;
            TerminTyp?: undefined;
            Beratungsart?: undefined;
            Contact?: undefined;
        };
        TerminID: string;
        Type: string;
        Weekday: number;
    }[];
};
//# sourceMappingURL=helpers.d.ts.map