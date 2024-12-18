import moment from 'moment';

export const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const eventTypes = ['Abwesend', 'Verfügbar', 'Termin', 'Sammel'];
const getConsultationType = () =>
  ['Präsenzberatung', 'Online', 'Außendienststelle', 'Telefon'][Math.round(Math.random() * 3)];
const dateToday = moment().toISOString();
const getDataItem = (props: { StartDate: string; EndDate: string }) => {
  const eventType = eventTypes[Math.round(Math.random() * 3)];
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
  const id = Math.round(Math.random() * 1000);
  const consultationType = getConsultationType();
  const capacity = Math.round(Math.random() * 1000);

  let title = '';
  switch (eventType) {
    case 'Abwesend':
      title = ['Urlaub', 'Arzttermin'][Math.round(Math.random())];
      break;
    case 'Verfügbar':
      title = 'Verfügbar';
      break;
    case 'Sammel':
      title = `KommC-${id}`;
      break;
    case 'Termin':
    default:
      title = ['Klara Fall', 'Reiner Zufall'][Math.round(Math.random())];
  }

  return {
    Beratungsstellentyp:
      eventType === 'Termin' || eventType === 'Verfügbar' ? consultationType : null,
    CompleteDay: Math.random() * 10 > 7, //
    EndTime: eventDates[1],
    IsSerie: eventType !== 'Termin' ? Math.random() * 10 > 9 : false, //
    Capacity: eventType === 'Sammel' ? capacity : null,
    UtilizedCapacity:
      eventType === 'Sammel' ? Math.min(Math.round(Math.random() * 1000), capacity) : null,
    Address: eventType === 'Sammel' ? 'Max-Joseph-Platz 2, 80539 München' : null,
    City: eventType === 'Sammel' ? 'München' : null,
    SerieEnd: Math.random() > 0.9 ? null : endDate,
    SerieRepeat:
      Math.random() * 10 > 9
        ? 'Täglich'
        : ['Wöchentlich', 'Monatlich', 'Jährlich'][Math.round(Math.random() * 2)], //
    StartTime: eventDates[0],
    Subject: title,
    Beratungsart:
      eventType === 'Termin'
        ? ['Erstberatung', 'Folgeberatung', 'Bewerbungsabgabe'][Math.round(Math.random() * 2)]
        : null,
    TerminID: `BW-KOMMC-WORK-GRP1 TER-${id}`,
    Type: eventType
  };
};

export const getData = (props: { StartDate: string; EndDate: string; ShowTimeline: boolean }) => {
  const diff = moment(props.EndDate).diff(props.StartDate, 'days');
  const count = diff * Math.max(Math.round(Math.random() * 5), 1);
  let data = [];
  if (props.ShowTimeline) {
    data = [];
  } else {
    for (let i = 0; i < count; i += 1) {
      data.push(getDataItem(props));
    }
  }
  return {
    fetchDateTime: dateToday,
    pxObjClass: 'Pega-API-DataExploration-Data',
    resultCount: data.length,
    data: data.sort((a, b) => (a.StartTime > b.StartTime ? 1 : -1))
  };
};
