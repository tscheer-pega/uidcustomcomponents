import moment from 'moment';

export const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const eventTypes = ['Abwesend', 'Verfügbar', 'Termin', 'Sammel'];
const getConsultationType = () =>
  ['Präsenzberatung', 'Online', 'Außendienststelle', 'Telefon'][Math.round(Math.random() * 3)];
const dateToday = moment().toISOString();
const getContact = () =>
  [
    {
      FirstName: 'Klara',
      FullName: 'Klara Fall',
      LastName: 'Fall',
      Salutation: 'Frau'
    },
    {
      FirstName: 'Reiner',
      FullName: 'Reiner Zufall',
      LastName: 'Zufall',
      Salutation: 'Herr'
    }
  ][Math.round(Math.random())];
const getDataItem = (props: { StartDate: string; EndDate: string }) => {
  const eventType = eventTypes[Math.round(Math.random() * 4)];
  const eventSourceDate = moment
    .utc(randomDate(moment(props.StartDate).toDate(), moment(props.EndDate).toDate()))
    .set('seconds', 0)
    .set('milliseconds', 0)
    .toISOString();
  const eventDates = [
    moment(eventSourceDate)
      .set('hour', Math.round(Math.random() * 12) + 6)
      .set('minute', Math.round(Math.random() * 10) > 7 ? 30 : 0)
      .utc()
      .toISOString(),
    moment(eventSourceDate)
      .set('hour', Math.round(Math.random() * 12) + 6)
      .set('minute', Math.round(Math.random() * 10) > 7 ? 30 : 0)
      .utc()
      .toISOString()
  ].sort();
  const endDate = moment
    .utc(
      randomDate(
        moment(eventSourceDate).add(3, 'days').toDate(),
        moment(eventSourceDate).add(120, 'days').toDate()
      )
    )
    .toISOString();
  const title =
    eventTypes.indexOf(eventType) === 0 ? 'Abwesend' : `KommC-${Math.round(Math.random() * 1000)}`;
  const consultationType = getConsultationType();
  return {
    Beratungsstelle: {
      Typ: consultationType
    },
    CompleteDay: Math.random() * 10 > 7, //
    EndTime: eventDates[1],
    IsSerie: Math.random() * 10 > 9, //
    Sammeltermin:
      eventTypes.indexOf(eventType) === 3
        ? {
            pxObjClass: 'Object Class',
            Bezeichnung: 'Sammeltermin A-1005',
            Ort: 'München',
            Kapazitaet: 500,
            GenutzteKapazitat: 412,
            Ortsadresse: 'Max-Joseph-Platz 2, 80539 München'
          }
        : null,
    SerieEndDate: endDate, //
    SerieRepeat:
      Math.random() * 10 > 9
        ? 'Täglich'
        : ['wöchentlich', 'monatlich', 'jährlich'][Math.round(Math.random() * 2)], //
    StartTime: eventDates[0],
    Subject: title,
    Termin:
      eventTypes.indexOf(eventType) === 2
        ? {
            pxObjClass: 'BW-KommC-Work-Grp1-Termin',
            TerminTyp: [
              {
                Order: 1,
                Typ: consultationType
              }
            ],
            Beratungsart: Math.random() * 10 > 9 ? 'Erstberatung' : 'Folgeberatung',
            Contact: getContact()
          }
        : {
            pxObjClass: 'BW-KommC-Work-Grp1-Termin'
          },
    TerminID: 'BW-KOMMC-WORK-GRP1 TER-5017',
    Type: eventType,
    Weekday: moment(eventDates[0]).get('weekday')
  };
};

export const getData = (props: { StartDate: string; EndDate: string }) => {
  const diff = moment(props.EndDate).diff(props.StartDate, 'days');
  const count = diff * Math.min(Math.abs(Math.random() * 5), 1);
  const data = [];
  for (let i = 0; i < count; i += 1) {
    data.push(getDataItem(props));
  }
  return {
    fetchDateTime: dateToday,
    pxObjClass: 'Pega-API-DataExploration-Data',
    resultCount: data.length,
    data: data.sort((a, b) => (a.StartTime > b.StartTime ? 1 : -1))
  };
};
