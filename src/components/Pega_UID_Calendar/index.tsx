import { useEffect, useRef, useState } from 'react';
import { CalendarApi, DateSelectArg, EventContentArg, EventHoveringArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import momentPlugin from '@fullcalendar/moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import interactionPlugin from '@fullcalendar/interaction';
import deLocale from '@fullcalendar/core/locales/de';
import moment from 'moment';
import {
  withConfiguration,
  Icon,
  Text,
  Status,
  Card,
  CardHeader,
  CardContent,
  Button,
  useTheme,
  StatusProps,
  Popover,
  Modal,
  useModalContext,
  useModalManager,
  Flex,
  Grid,
  CardFooter,
  registerIcon,
  Switch,
  MenuButton,
  useToaster,
  ExpandCollapse,
  DateInput,
  Configuration
} from '@pega/cosmos-react-core';
import StyledCalendarWrapper from './styles';
import './create-nonce';
import GlobalStyles from './global-styles';
import * as LocationSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/locations-solid.icon';
import * as Plus from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
import * as CalendarEmptySolid from '@pega/cosmos-react-core/lib/components/Icon/icons/calendar-empty-solid.icon';
import * as ClockSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/clock-solid.icon';
import * as WizardSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/wizard-solid.icon';
import * as UserGroupSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/users-solid.icon';
import * as UserSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/user-solid.icon';
import * as WebcamSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/webcam-solid.icon';
import * as PhoneSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/phone-solid.icon';
import * as Building2Solid from '@pega/cosmos-react-core/lib/components/Icon/icons/building-2-solid.icon';
import PublicHolidays from './publicHolidays.json';
import { DateTimeCallbackParameter } from '@pega/cosmos-react-core/lib/components/DateTime/DateTime.types';

registerIcon(
  LocationSolid,
  Plus,
  CalendarEmptySolid,
  ClockSolid,
  WizardSolid,
  UserGroupSolid,
  UserSolid,
  WebcamSolid,
  PhoneSolid,
  Building2Solid
);

export type TEventImpl = Parameters<CalendarApi['addEvent']>[0];

export enum EViewType {
  Day = 'timeGridDay',
  Week = 'timeGridWeek',
  WorkWeek = 'workingWeek',
  Month = 'dayGridMonth'
}

export type TCalendarProps = {
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

export type TEvent = {
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
  extendedProps?: { [key: string]: any };
  duration?: string;
};

export enum EDateTimeType {
  date = 'date',
  time = 'time'
}

export enum ETerminGoal {
  FirstContact = 'Erstberatung',
  FollowUp = 'Folgeberatung',
  ApplicationSubmission = 'Bewerbungsabgabe',
  _TMP_ = 'Temporär'
}

export enum EEventType {
  ABSENCE = 'Abwesend',
  AVAILABILITY = 'Verfügbar',
  APPOINTMENT = 'Termin',
  MASS_EVENT = 'Sammel',
  PUBLIC_HOLIDAY = 'Feiertag'
}

export enum EBeratungsTyp {
  presence = 'Präsenzberatung',
  online = 'Online',
  phone = 'Telefon',
  office = 'Außendienststelle'
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
  Name: string; // Berlin Mitte
  pzInsKey: string;
}

export interface IRawEvent {
  pyGUID?: string; // UID
  Address?: string; // Address of Appointment
  AuthorID?: string; // Reference ID of BuchbareRessource
  Capacity?: string; // only Sammel
  City?: string; // City of Appointment
  EndTime: string; // End time of Appointment
  OrganisationseinheitID?: string; // Reference ID of Organisationseinheit
  StartTime: string; // Start time of Appointment YYYY-MM-DDTHH:mm:ss.uuuZ
  TerminID?: string; // Reference ID of Appointment
  Type: EEventType; // Appointment type
  UtilizedCapacity?: string; // only Sammel
  Beratungsart?: ETerminGoal; // only Termin
  Beratungsstellentyp?: EBeratungsTyp; // only Termin
  CompleteDay?: boolean; // Marking of full day
  IsSerie?: boolean; // Marking of repeating
  SerieEnd?: string; // End date of series
  SerieRepeat?: string; // Defines interval of repeating
  Subject: string; // Title
  Beratungsstelle?: IBeratungsstelle;
  IOrganisationseinheit?: IOrganisationseinheit;
}

export type TDateInfo = {
  view: { type: EViewType };
  startStr?: string;
  start?: string;
  end?: string;
};

export const publicHolidayEvents: Array<IRawEvent> = PublicHolidays as unknown as Array<IRawEvent>;

export const PegaUidCalendar = (props: TCalendarProps) => {
  const {
    heading = '',
    dataPage = '',
    createClassname = '',
    createMassClassname = '',
    interactionId = '',
    defaultViewMode = 'Monthly',
    nowIndicator = true,
    weekendIndicator = true,
    getPConnect
  } = props;

  const [events, setEvents] = useState<Array<TEvent>>([]);
  const [showPublicHolidays, setShowPublicHolidays] = useState(true);
  // const [workingWeek, setWorkingWeek] = useState<boolean>(false);
  const calendarRef = useRef<any | null>(null);
  const theme = useTheme();
  let dateInfo: TDateInfo = { view: { type: EViewType.Month } };
  const dateInfoStr = localStorage.getItem('fullcalendar');
  if (dateInfoStr) {
    dateInfo = JSON.parse(dateInfoStr);
    if (dateInfo.view.type === EViewType.Month && dateInfo.end && dateInfo.start) {
      /* If showing Month - find the date in the middle to get the Month */
      const endDate = new Date(dateInfo.end).valueOf();
      const startDate = new Date(dateInfo.start).valueOf();
      const middle = new Date(endDate - (endDate - startDate) / 2);
      dateInfo.startStr = `${middle.toISOString().substring(0, 7)}-01`;
    }
  }

  const [eventInPopover, setEventInPopover] = useState<{
    eventEl: HTMLDivElement | null;
    eventInfo: TEventImpl | null;
    inPopover: boolean;
    inEl: boolean;
  }>({ eventEl: null, eventInfo: null, inPopover: false, inEl: false });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { create } = useModalManager();

  const getDefaultView = (): EViewType => {
    if (dateInfo?.view?.type) {
      /* If the context is persisted in session storage - then used this info as default view */
      return dateInfo.view.type;
    }
    let defaultView: EViewType;
    switch (defaultViewMode) {
      case 'Weekly':
        defaultView = EViewType.Week;
        break;
      case 'Daily':
        defaultView = EViewType.Day;
        break;
      default:
      case 'Monthly':
        defaultView = EViewType.Month;
        break;
    }
    return defaultView;
  };

  const [currentViewType, setCurrentViewType] = useState<EViewType>(getDefaultView());
  const [rawData, setRawData] = useState<Array<IRawEvent>>([]);
  const [legendExpanded, setLegendExpanded] = useState<boolean>(false);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(moment().toISOString());

  const toaster = useToaster();
  const pushToaster = (message: string) => {
    toaster.push({
      content: message
    });
  };

  const ConfirmationModal = (modalProps: any) => {
    const { dismiss } = useModalContext();
    const confirmationModalActions = (
      <>
        <Button
          onClick={() => {
            modalProps.revert();
            dismiss();
          }}
        >
          Nein
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            // Handle API call to update event
            const data = {
              StartTime: modalProps.event.start.toISOString(),
              EndTime: modalProps.event.end.toISOString(),
              pyGUID: modalProps.event._def.extendedProps.item.pyGUID
            };

            (window as any).PCore.getRestClient()
              .invokeRestApi('updateDataObject', {
                queryPayload: {
                  data_view_ID: 'D_TimeslotMoveSavable'
                },
                body: {
                  data
                }
              })
              .then(() => {
                pushToaster('Termin erfolgreich verschoben');
              })
              .catch(() => {
                modalProps.revert();
                pushToaster('Fehler beim Verschieben des Termins');
              });
            dismiss();
          }}
        >
          Ja
        </Button>
      </>
    );

    return (
      <Modal
        heading='Verschiebung eines bestehenden Kalendereintrags'
        actions={confirmationModalActions}
        dismissible={false}
        autoWidth
        stretch
      >
        <Text>
          Sie sind dabei einen bestehenden Kalendereintrag zu verschieben.
          <br />
          Dies löst Folgeprozesse wie das Senden einer E-Mail an den Interessenten aus. Möchten Sie
          fortfahren?
        </Text>
      </Modal>
    );
  };

  const CreateModal = (modalProps: any) => {
    const { dismiss } = useModalContext();
    const {
      info: { start, end }
    } = modalProps;
    const tmpItem = {
      id: `${Math.random()}`,
      color: theme.base.colors.gray.dark,
      display: 'block',
      start: start.toISOString(),
      end: end.toISOString(),
      title: 'Neuer Termin',
      editable: false,
      item: {
        Type: EEventType.APPOINTMENT,
        Beratungsart: ETerminGoal._TMP_
      }
    };
    const createModalActions = (
      <>
        <Button
          onClick={() => {
            dismiss();
          }}
        >
          Nein
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            setEvents([...events, tmpItem]);
            // TODO: Update API call to create new event
            /*
            getPConnect().getActionsApi().createWork(createClassname, {
              openCaseViewAfterCreate: true,
              interactionId,
              start: start.toISOString(),
              end: end.toISOString()
            });
             */
            dismiss();
          }}
        >
          Ja
        </Button>
      </>
    );

    return (
      <Modal
        heading='Neuen Termin erstellen'
        actions={createModalActions}
        dismissible={false}
        autoWidth
        stretch
      >
        <Text>
          Termin am {moment(start).format('DD.MM.YYYY')} von {moment(start).format('H:mm')} Uhr bis{' '}
          {moment(end).format('H:mm')} Uhr erstellen?
        </Text>
      </Modal>
    );
  };

  const fillEvents = (data: Array<IRawEvent> = rawData) => {
    setEvents([]);
    const tmpevents: Array<TEvent> = [];
    (data || rawData).forEach((item: IRawEvent) => {
      let color: string;
      let display = 'block';
      let editable = false;
      let dragScroll = false;
      let title = item.Subject;
      switch (item.Type) {
        case EEventType.AVAILABILITY: {
          color = theme.base.colors.green.dark;
          if (item.Beratungsstellentyp === 'Online' || item.Beratungsstellentyp === 'Telefon') {
            color = theme.base.colors.green.light;
          }
          if (currentViewType.indexOf('Week') > 0) {
            color = 'transparent';
            display = 'background';
          }
          title = item.Type;
          break;
        }
        case EEventType.APPOINTMENT:
          color = theme.base.colors.blue.dark;
          editable = true;
          dragScroll = true;
          break;
        case EEventType.ABSENCE:
          color = theme.base.colors.orange.dark;
          break;
        case EEventType.PUBLIC_HOLIDAY:
          color = theme.base.colors.purple.dark;
          break;
        default:
        case EEventType.MASS_EVENT:
          color = theme.base.colors.yellow.light;
          editable = true;
          dragScroll = true;
          break;
      }
      const startDate = moment(item.StartTime);
      const endDate = moment(item.EndTime);
      const duration = moment
        // @ts-ignore
        .utc(Math.abs(moment.duration(endDate - startDate).asMilliseconds()))
        .format('HH:mm:ss');
      const until = item.IsSerie ? item.SerieEnd || '2099-12-31T23:59:59Z' : endDate;
      let freq;
      switch (item.SerieRepeat?.toLowerCase()) {
        case 'wöchentlich':
          freq = 'weekly';
          break;
        case 'täglich':
          freq = 'daily';
          break;
        case 'monatlich':
          freq = 'monthly';
          break;
        case 'jährlich':
        default:
          freq = 'yearly';
      }
      const tmpEvent = {
        id: item.TerminID || '',
        title,
        rrule: {
          freq,
          dtstart: item.StartTime,
          until
        },
        duration: item.CompleteDay ? undefined : duration,
        start: item.StartTime,
        end: item.EndTime,
        display,
        color,
        editable,
        dragScroll,
        allDay: item.CompleteDay,
        item
      };
      if (item.IsSerie && !!item.SerieRepeat) {
        tmpevents.push(tmpEvent);
      } else {
        tmpevents.push({
          ...tmpEvent,
          rrule: {
            ...tmpEvent.rrule,
            count: 1
          }
        });
      }
    });
    setEvents(tmpevents);
  };

  const { activeStart = '', activeEnd = '' } =
    calendarRef?.current?.calendar?.currentData?.viewApi || {};
  const StartDate = moment(activeStart).toISOString();
  const EndDate = moment(activeEnd).toISOString();
  let lastStartDate = '';
  let lastEndDate = '';

  const loadEvents = (startDate = StartDate) => {
    setIsLoading(true);
    (window as any).PCore.getDataApiUtils()
      .getData(dataPage, {
        dataViewParameters: {
          StartDate: startDate,
          EndDate
        }
      })
      .then((response: any) => {
        if (response.data.data !== null) {
          setRawData([...response.data.data, ...(showPublicHolidays ? publicHolidayEvents : [])]);
          fillEvents([...response.data.data, ...(showPublicHolidays ? publicHolidayEvents : [])]);
        }
      })
      .finally(() => setIsLoading(false));
  };

  /* Subscribe to changes to the assignment case */
  useEffect(() => {
    (window as any).PCore.getPubSubUtils().subscribe(
      (window as any).PCore.getEvents().getCaseEvent().ASSIGNMENT_SUBMISSION,
      () => {
        /* If an assignment is updated - force a reload of the events */
        loadEvents();
      },
      'ASSIGNMENT_SUBMISSION'
    );
    return () => {
      (window as any).PCore.getPubSubUtils().unsubscribe(
        (window as any).PCore.getEvents().getCaseEvent().ASSIGNMENT_SUBMISSION,
        'ASSIGNMENT_SUBMISSION'
      );
    };
  }, []);

  useEffect(() => {
    if (StartDate !== lastStartDate || EndDate !== lastEndDate) {
      lastStartDate = StartDate;
      lastEndDate = EndDate;
      loadEvents();
    }
  }, [StartDate, EndDate, lastStartDate, lastEndDate]);

  const getTypeIcon = (appointmentType: string) => {
    switch (appointmentType) {
      case 'Präsenzberatung':
        return <Icon name='user-solid' />;
      case 'Online':
        return <Icon name='webcam-solid' />;
      case 'Telefon':
        return <Icon name='phone-solid' />;
      case 'Außendienststelle':
      default:
        return <Icon name='building-2-solid' />;
    }
  };

  const getDateTimeFromIsoString = (
    isoString: string,
    dateOrTime: EDateTimeType,
    options: any = {},
    locale: string = 'de-DE'
  ) => {
    const dateTime = new Date(isoString);
    return dateOrTime === EDateTimeType.date
      ? dateTime.toLocaleDateString(locale, options)
      : dateTime.toLocaleTimeString(locale, { ...options, hour: '2-digit', minute: '2-digit' });
  };

  const addNewEvent = (className: string) =>
    getPConnect()
      .getActionsApi()
      .createWork(className, {
        openCaseViewAfterCreate: className === createMassClassname,
        interactionId,
        containerName: 'workarea',
        flowType: 'pyStartCase',
        skipBrowserSemanticUrlUpdate: true,
        startingFields: {
          InteractionId: interactionId,
          InteractionKey: `BW-KOMMC-WORK-GRP2 ${interactionId}`,
          cxContextType: 'Case'
        },
        viewType: 'form'
      });

  const renderBeratungsartBadge = (beratungsart: string) => {
    let statusVariant: StatusProps['variant'] = 'info';
    switch (beratungsart) {
      case ETerminGoal.ApplicationSubmission:
        statusVariant = 'success';
        break;
      case ETerminGoal.FollowUp:
        statusVariant = 'pending';
        break;
      default:
      case ETerminGoal.FirstContact:
        statusVariant = 'info';
        break;
    }
    return (
      <Status className='event-subject' variant={statusVariant}>
        {beratungsart}
      </Status>
    );
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const def = eventInfo.event._def;
    const obj = def.extendedProps.item;
    const isMonthlyView = currentViewType === EViewType.Month;
    let eventDateStr = `${getDateTimeFromIsoString(eventInfo.event.startStr, EDateTimeType.time)}`;
    eventDateStr += `-${getDateTimeFromIsoString(eventInfo.event.endStr, EDateTimeType.time)}`;
    const eventLabel =
      isMonthlyView && !obj.CompleteDay
        ? `${eventDateStr} ${eventInfo.event.title}`
        : eventInfo.event.title;
    if (
      obj.Type === 'Verfügbar' &&
      currentViewType.indexOf('Week') > 0 &&
      !!obj.Beratungsstellentyp
    ) {
      const bTyp = obj.Beratungsstellentyp || '';
      let left;
      switch (bTyp) {
        case 'Präsenzberatung':
          left = '75%';
          break;
        case 'Online':
          left = '50%';
          break;
        case 'Telefon':
          left = '25%';
          break;
        case 'Außendienststelle':
        default:
          left = '0%';
      }
      return (
        <div
          className={`event-content availability ${obj.Type} ${obj.Beratungsstellentyp}`}
          style={{
            backgroundColor: theme.base.colors.green.light,
            left
          }}
        >
          <span>{getTypeIcon(obj.Beratungsstellentyp)}</span>
        </div>
      );
    }
    return (
      <div className={`event-content ${obj.Type} ${obj.Beratungsstellentyp}`}>
        <Text variant='h5' className='event-label'>
          {obj.Type !== EEventType.ABSENCE && (obj.Beratungsstellentyp || obj.Termintyp) && (
            <span>{getTypeIcon(obj.Beratungsstellentyp || obj.Termintyp)}</span>
          )}
          {eventLabel}
        </Text>
        {obj.Type === EEventType.APPOINTMENT && renderBeratungsartBadge(obj.Beratungsart)}
        {obj.Type === EEventType.MASS_EVENT && (
          <>
            <Icon name='location-solid' role='img' aria-label='location icon' size='s' />
            <Text variant='primary' className='event-label'>
              {obj.City}
            </Text>
          </>
        )}
      </div>
    );
  };

  const handleEventClick = () => {};

  const handleEventMouseEnter = (mouseEnterInfo: EventHoveringArg) => {
    const eventEl = eventInPopover.inPopover
      ? eventInPopover.eventEl
      : (mouseEnterInfo.el as HTMLDivElement);
    const eventInfo = eventInPopover.inPopover
      ? eventInPopover.eventInfo
      : (mouseEnterInfo.event as TEventImpl);

    if (eventInfo?._def.extendedProps.item.Type !== 'Verfügbar') {
      setTimeout(
        () =>
          setEventInPopover({
            eventEl,
            eventInfo,
            inPopover: false,
            inEl: true
          }),
        100
      );
    }
  };

  const handleEventMouseLeave = () => {
    setTimeout(
      () =>
        setEventInPopover({
          eventEl: eventInPopover.inPopover ? eventInPopover.eventEl : null,
          eventInfo: eventInPopover.eventInfo,
          inPopover: eventInPopover.inPopover,
          inEl: false
        }),
      100
    );
  };

  const handlePopoverMouseEnter = () => {
    setEventInPopover({
      eventEl: eventInPopover.eventEl,
      eventInfo: eventInPopover.eventInfo,
      inPopover: true,
      inEl: false
    });
  };

  const handlePopoverMouseLeave = () => {
    setTimeout(
      () =>
        setEventInPopover({
          eventEl: eventInPopover.inEl ? eventInPopover.eventEl : null,
          eventInfo: eventInPopover.eventInfo,
          inPopover: false,
          inEl: eventInPopover.inEl
        }),
      100
    );
  };

  const handleEventUpdateStart = () => {
    // Remove popover
    setEventInPopover({
      eventEl: null,
      eventInfo: null,
      inPopover: false,
      inEl: false
    });
  };

  const handleEventUpdate = (eventUpdateInfo: any) => {
    create(
      ConfirmationModal,
      { revert: eventUpdateInfo.revert, event: eventUpdateInfo.event, dataPage },
      { alert: true }
    );
  };

  const handleDateChange = (objInfo: any) => {
    const calendar = objInfo.view.calendar;
    setTimeout(() => fillEvents(), 250);
    if (objInfo.view.type === EViewType.Week && currentViewType === EViewType.WorkWeek) {
      calendar.setOption('weekends', false);
    } else {
      calendar.setOption('weekends', weekendIndicator);
    }
    document.querySelector('.fc-button-active')?.classList.remove('fc-button-active');
    switch (currentViewType) {
      case EViewType.Day:
        setCurrentViewType(EViewType.Day);
        document.getElementsByClassName('fc-dailyView-button')[0].classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', Month: 'long', day: 'numeric' });
        break;
      case EViewType.Week:
        setCurrentViewType(EViewType.Week);
        document
          .getElementsByClassName('fc-weeklyView-button')[0]
          .classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', Month: 'long', day: 'numeric' });
        break;
      case EViewType.WorkWeek:
        setCurrentViewType(EViewType.WorkWeek);
        document
          .getElementsByClassName('fc-workingWeekView-button')[0]
          .classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', Month: 'long', day: 'numeric' });
        break;
      default:
      case EViewType.Month:
        setCurrentViewType(EViewType.Month);
        document
          .getElementsByClassName('fc-MonthlyView-button')[0]
          .classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long' });
        break;
    }
    localStorage.setItem('fullcalendar', JSON.stringify(objInfo));
  };

  const onViewButtonClick = (viewType: EViewType) => {
    if (calendarRef) {
      const cal: any = calendarRef.current;
      const calendarAPI = cal.getApi();
      const view = viewType === EViewType.WorkWeek ? EViewType.Week : viewType;
      setCurrentViewType(viewType);
      calendarAPI.changeView(view);
    }
  };

  const openPreviewEventOnClick = () => {
    const eventInfoObj = eventInPopover.eventInfo?._def.extendedProps.item;
    getPConnect().getActionsApi().showCasePreview(eventInfoObj.TerminID);
  };

  const handleSelect = (info: DateSelectArg) => {
    // TODO: Clarify functionality and enable when ready
    const enableFeature = false;
    if (enableFeature) {
      create(CreateModal, { info, dataPage }, { alert: true });
    }
  };

  const onDateSelect = (e: DateTimeCallbackParameter) => {
    const date = e.valueAsISOString;
    if (date) {
      const calendar = calendarRef.current?.calendar;
      setSelectedStartDate(date);
      loadEvents(date);
      calendar.gotoDate(date);
    }
  };

  const onDateClick = (info: { dateStr: string }) => {
    const date = info.dateStr;
    if (date && currentViewType !== EViewType.Day) {
      const calendar = calendarRef.current?.calendar;
      onViewButtonClick(EViewType.Day);
      setSelectedStartDate(date);
      loadEvents(date);
      calendar.gotoDate(date);
    }
  };

  const calTable = document.body.querySelector('.fc');
  if (calTable) {
    (calTable as HTMLElement).style.setProperty('opacity', isLoading ? '0.25' : '1');
  }

  const menuActionItems = [];

  if (createClassname) {
    menuActionItems.push({ id: createClassname, primary: 'Neuer Termin' });
  }
  if (createMassClassname) {
    menuActionItems.push({ id: createMassClassname, primary: 'Neuer Sammeltermin' });
  }

  return (
    <Configuration locale='de-DE'>
      <StyledCalendarWrapper theme={theme}>
        <GlobalStyles theme={theme} />
        <Flex container={{ direction: 'column' }}>
          <Card style={{ flex: 1 }}>
            <CardHeader
              actions={
                <div className='card-header-action-container'>
                  <Switch
                    className='public-holidays-switch'
                    on={showPublicHolidays}
                    onChange={() => {
                      setShowPublicHolidays(!showPublicHolidays);
                      fillEvents([
                        ...(!showPublicHolidays
                          ? rawData
                          : rawData.filter(event => event.Type !== EEventType.PUBLIC_HOLIDAY))
                      ]);
                    }}
                    label='Feiertage anzeigen'
                  />
                  <span className='h-spacer'>&nbsp;</span>
                  <DateInput
                    className='date-select'
                    mode='date'
                    onChange={onDateSelect}
                    showWeekNumber
                    value={selectedStartDate}
                    disabled={isLoading}
                  />
                  <span className='h-spacer'>&nbsp;</span>
                  <Button
                    text=''
                    variant='secondary'
                    label='Reload'
                    compact={false}
                    disabled={isLoading}
                    onClick={() => loadEvents()}
                  >
                    <Icon name='reset' />
                  </Button>
                  {menuActionItems.length > 0 && (
                    <>
                      <span className='h-spacer'>&nbsp;</span>
                      <MenuButton
                        text=''
                        variant='secondary'
                        icon='plus'
                        iconOnly
                        showArrow={false}
                        menu={{
                          mode: 'action',
                          items: menuActionItems,
                          onItemClick: a => addNewEvent(a)
                        }}
                      />
                    </>
                  )}
                </div>
              }
            >
              <Text variant='h2'>{heading}</Text>
            </CardHeader>
            <CardContent>
              <FullCalendar
                ref={calendarRef}
                customButtons={{
                  dailyView: {
                    text: 'Tag',
                    click: () => onViewButtonClick(EViewType.Day)
                  },
                  weeklyView: {
                    text: 'Woche',
                    click: () => onViewButtonClick(EViewType.Week)
                  },
                  workingWeekView: {
                    text: 'Arbeitswoche',
                    click: () => onViewButtonClick(EViewType.WorkWeek)
                  },
                  MonthlyView: {
                    text: 'Monat',
                    click: () => onViewButtonClick(EViewType.Month)
                  }
                }}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: `MonthlyView weeklyView workingWeekView dailyView`
                }}
                plugins={[
                  rrulePlugin,
                  dayGridPlugin,
                  timeGridPlugin,
                  momentPlugin,
                  interactionPlugin
                ]}
                initialView={currentViewType}
                selectable
                droppable
                nowIndicator={nowIndicator}
                weekends={weekendIndicator}
                expandRows
                allDayText='Ganztags'
                slotMinTime='06:00:00'
                slotMaxTime='21:00:00'
                height={currentViewType.indexOf('Week') > 0 ? 1600 : 'auto'}
                contentHeight={currentViewType.indexOf('Week') > 0 ? 1600 : 'auto'}
                slotEventOverlap={false}
                events={events}
                eventContent={renderEventContent}
                eventClick={handleEventClick}
                eventMouseEnter={handleEventMouseEnter}
                eventMouseLeave={handleEventMouseLeave}
                eventDragStart={handleEventUpdateStart}
                eventResizeStart={handleEventUpdateStart}
                eventDrop={handleEventUpdate}
                eventResizeStop={handleEventUpdate}
                datesSet={handleDateChange}
                select={handleSelect}
                eventTextColor='#fff'
                eventTimeFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  meridiem: false
                }}
                eventDisplay='block'
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                firstDay={1}
                businessHours={{
                  // days of week. an array of zero-based day of week integers (0=Sunday)
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: '06:00', // a start time
                  endTime: '21:00' // an end time
                }}
                selectConstraint='businessHours'
                // titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
                titleFormat={
                  currentViewType === EViewType.Day
                    ? 'dddd, DD. MMMM YYYY'
                    : { year: 'numeric', month: 'long', day: 'numeric' }
                }
                locale={deLocale}
                dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
                buttonText={{ today: 'Heute', month: 'Monat', week: 'Woche', day: 'Tag' }}
                dateClick={onDateClick}
              />
              {isLoading && (
                <div className='loading-indicator'>
                  <p>
                    <span>Lade Daten, bitte warten...</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <CardFooter className='legend'>
            <Flex container={{ alignItems: 'center', direction: 'column' }}>
              <Button
                style={{ width: '12rem' }}
                variant={legendExpanded ? 'primary' : 'secondary'}
                onClick={() => setLegendExpanded(curState => !curState)}
              >
                {legendExpanded ? 'Legende ausblenden' : 'Legende einblenden'}
              </Button>
              <ExpandCollapse dimension='height' collapsed={!legendExpanded}>
                <Card>
                  <CardContent>
                    <Grid
                      container={{
                        cols: 'repeat(4, 12rem)',
                        colGap: 1,
                        rowGap: 1
                      }}
                    >
                      <span>&nbsp;</span>
                      <Flex container={{ alignItems: 'center' }}>
                        <span
                          className='event-indicator'
                          style={{ backgroundColor: theme.base.colors.green.light }}
                        ></span>
                        <Text variant='primary' className='legend-item'>
                          Verfügbarkeit (Fern)
                        </Text>
                      </Flex>
                      <Flex container={{ alignItems: 'center' }}>
                        <span
                          className='event-indicator'
                          style={{ backgroundColor: theme.base.colors.green.dark }}
                        ></span>
                        <Text variant='primary' className='legend-item'>
                          Verfügbarkeit (Präsenz)
                        </Text>
                      </Flex>
                      <span>&nbsp;</span>
                      <Flex container={{ alignItems: 'center' }}>
                        <span
                          className='event-indicator'
                          style={{ backgroundColor: theme.base.colors.yellow.light }}
                        ></span>
                        <Text variant='primary' className='legend-item'>
                          Sammeltermin
                        </Text>
                      </Flex>
                      <Flex container={{ alignItems: 'center' }}>
                        <span
                          className='event-indicator'
                          style={{ backgroundColor: theme.base.colors.blue.dark }}
                        ></span>
                        <Text variant='primary' className='legend-item'>
                          Termin
                        </Text>
                      </Flex>
                      <Flex container={{ alignItems: 'center' }}>
                        <span
                          className='event-indicator'
                          style={{ backgroundColor: theme.base.colors.purple.dark }}
                        ></span>
                        <Text variant='primary' className='legend-item'>
                          Feiertag
                        </Text>
                      </Flex>
                      <Flex container={{ alignItems: 'center' }}>
                        <span
                          className='event-indicator'
                          style={{ backgroundColor: theme.base.colors.orange.dark }}
                        ></span>
                        <Text variant='primary' className='legend-item'>
                          Abwesenheit
                        </Text>
                      </Flex>
                      <Flex container={{ alignItems: 'center' }}>
                        <Icon name='user-solid' />
                        <Text variant='primary' className='legend-item'>
                          Präsenzberatung
                        </Text>
                      </Flex>
                      <Flex container={{ alignItems: 'center' }}>
                        <Icon name='webcam-solid' />
                        <Text variant='primary' className='legend-item'>
                          Online
                        </Text>
                      </Flex>
                      <Flex container={{ alignItems: 'center' }}>
                        <Icon name='phone-solid' />
                        <Text variant='primary' className='legend-item'>
                          Telefon
                        </Text>
                      </Flex>
                      <Flex container={{ alignItems: 'center' }}>
                        <Icon name='building-2-solid' />
                        <Text variant='primary' className='legend-item'>
                          Außendienststelle
                        </Text>
                      </Flex>
                    </Grid>
                  </CardContent>
                </Card>
              </ExpandCollapse>
            </Flex>
          </CardFooter>
        </Flex>

        <Popover
          show={!!eventInPopover?.eventEl && !!eventInPopover?.eventInfo}
          target={eventInPopover.eventEl}
          portal={false}
          arrow
          showDelay='short'
          placement='auto'
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          className='event-popover'
        >
          {eventInPopover.eventInfo?._def.extendedProps.item.Type === EEventType.PUBLIC_HOLIDAY ? (
            <Card>
              <CardContent>
                <Grid
                  container={{
                    alignItems: 'center',
                    cols: 'auto auto',
                    colGap: 1,
                    rowGap: 1
                  }}
                >
                  <Text variant='primary' className='public-holiday-text'>
                    Dieser Eintrag dient zu Ihrer Information. Sofern Sie vom Feiertag betroffen
                    sind, bitten wir Sie Ihre Abwesenheit eigenständig zu buchen.
                  </Text>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <Grid
                  container={{
                    alignItems: 'center',
                    cols: 'auto auto',
                    colGap: 1
                  }}
                >
                  <span
                    className='event-indicator'
                    style={{ backgroundColor: eventInPopover.eventInfo?._def.ui.backgroundColor }}
                  ></span>
                  <Text variant='h3'>{eventInPopover.eventInfo?._def.title}</Text>
                  {(eventInPopover.eventInfo?._def.extendedProps.item.Type ===
                    EEventType.APPOINTMENT ||
                    eventInPopover.eventInfo?._def.extendedProps.item.Type ===
                      EEventType.MASS_EVENT) && (
                    <>
                      <div></div>
                      <Text variant='secondary'>
                        {eventInPopover.eventInfo?._def.extendedProps.item.TerminID}
                      </Text>
                    </>
                  )}
                </Grid>
              </CardHeader>
              <hr className='solid'></hr>
              <CardContent>
                <Grid
                  container={{
                    alignItems: 'center',
                    cols: 'auto auto',
                    colGap: 1,
                    rowGap: 1
                  }}
                >
                  <Icon
                    name='calendar-empty-solid'
                    role='img'
                    aria-label='calendar icon'
                    size='s'
                    className='icon'
                  />
                  <Text variant='primary' className='event-label'>
                    {getDateTimeFromIsoString(
                      eventInPopover.eventInfo?.startStr,
                      EDateTimeType.date,
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }
                    )}
                  </Text>
                  <Icon
                    name='clock-solid'
                    role='img'
                    aria-label='clock icon'
                    size='s'
                    className='icon'
                  />
                  {eventInPopover.eventInfo?._def.extendedProps.item.CompleteDay ? (
                    <Text variant='primary' className='event-label'>
                      Ganzer Tag
                    </Text>
                  ) : (
                    <Text variant='primary' className='event-label'>
                      {getDateTimeFromIsoString(
                        eventInPopover.eventInfo?.startStr,
                        EDateTimeType.time
                      )}
                      {' - '}
                      {getDateTimeFromIsoString(
                        eventInPopover.eventInfo?.endStr,
                        EDateTimeType.time
                      )}
                    </Text>
                  )}

                  {eventInPopover.eventInfo?._def.extendedProps.item.Type ===
                    EEventType.APPOINTMENT && (
                    <>
                      <Icon
                        name='wizard-solid'
                        role='img'
                        aria-label='Beratungsart'
                        size='s'
                        className='icon'
                      />
                      {renderBeratungsartBadge(
                        eventInPopover.eventInfo?._def.extendedProps.item.Beratungsart
                      )}
                    </>
                  )}
                  {eventInPopover.eventInfo?._def.extendedProps.item.Type ===
                    EEventType.MASS_EVENT && (
                    <>
                      <Icon
                        name='location-solid'
                        role='img'
                        aria-label='location icon'
                        size='s'
                        className='icon'
                      />
                      <Flex container={{ direction: 'column', alignItems: 'start' }}>
                        <Text variant='primary' className='event-label'>
                          {eventInPopover.eventInfo._def.extendedProps.item.Address}
                        </Text>
                      </Flex>
                      <Icon name='users-solid' role='img' aria-label='group icon' size='s' />
                      <Flex container={{ direction: 'column', alignItems: 'start' }}>
                        <Text variant='primary' className='event-label'>
                          {eventInPopover.eventInfo._def.extendedProps.item.UtilizedCapacity}/
                          {eventInPopover.eventInfo._def.extendedProps.item.Capacity} Kapazität
                        </Text>
                      </Flex>
                    </>
                  )}
                  {eventInPopover.eventInfo?._def.extendedProps.item.Beratungsstellentyp && (
                    <>
                      {getTypeIcon(
                        eventInPopover.eventInfo._def.extendedProps.item.Beratungsstellentyp
                      )}
                      <Text variant='primary' className='event-label'>
                        {eventInPopover.eventInfo?._def.extendedProps.item.Beratungsstellentyp}
                      </Text>
                    </>
                  )}
                </Grid>
              </CardContent>
              {(eventInPopover.eventInfo?._def.extendedProps.item.Type === EEventType.APPOINTMENT ||
                eventInPopover.eventInfo?._def.extendedProps.item.Type ===
                  EEventType.MASS_EVENT) && (
                <>
                  <hr className='solid'></hr>
                  <CardFooter justify='center'>
                    <Button variant='primary' compact onClick={openPreviewEventOnClick}>
                      Öffnen
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          )}
        </Popover>
      </StyledCalendarWrapper>
    </Configuration>
  );
};

export default withConfiguration(PegaUidCalendar);
