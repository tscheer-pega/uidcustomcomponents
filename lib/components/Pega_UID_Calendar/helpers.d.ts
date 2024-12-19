export declare const randomDate: (start: Date, end: Date) => Date;
export declare const getData: (props: {
    StartDate: string;
    EndDate: string;
    ShowTimeline: boolean;
}) => {
    fetchDateTime: string;
    pxObjClass: string;
    resultCount: number;
    data: {
        Beratungsstellentyp: string | null;
        CompleteDay: boolean;
        EndTime: string;
        IsSerie: boolean;
        Capacity: number | null;
        UtilizedCapacity: number | null;
        Address: string | null;
        City: string | null;
        SerieEnd: string | null;
        SerieRepeat: string;
        StartTime: string;
        Subject: string;
        Beratungsart: string | null;
        TerminID: string;
        Type: string;
    }[];
};
//# sourceMappingURL=helpers.d.ts.map