import React, { JSX } from 'react';
import moment from 'moment/moment';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import deLocale from '@fullcalendar/core/locales/de';
import {
  CalendarOptions,
  DateSelectArg,
  DateSpanApi,
  EventContentArg,
  EventHoveringArg
} from '@fullcalendar/core';
import { EventImpl } from '@fullcalendar/core/internal';
import {
  Button,
  Icon,
  Modal,
  Text,
  useModalContext,
  useModalManager,
  useToaster
} from '@pega/cosmos-react-core';
import {
  ECalendarViewType,
  EDateTimeType,
  EEventType,
  ETerminGoal,
  ETimelineViewType,
  getDateTimeFromIsoString,
  getTypeIcon,
  TEventImpl
} from './index';

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
  resourceId?: string;
  groupId?: string;
  constraint?: string;
  editable?: boolean;
  dragScroll?: boolean;
};

export type TResource = {
  id: string;
  title: string;
  children?: Array<TResource>;
};

export interface ICalendarProps {
  createEvent: (
    start: string,
    end: string,
    resourceInfo?: [OrgID: string, ResourceId: string]
  ) => void;
  isInteraction: boolean;
  showTimeline: boolean;
  readOnlyAccess: boolean;
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
  resources: Array<TResource>;
  setEvents: React.Dispatch<React.SetStateAction<Array<TEvent>>>;
  currentViewType: ECalendarViewType | ETimelineViewType;
  setCurrentViewType: React.Dispatch<React.SetStateAction<ECalendarViewType | ETimelineViewType>>;
  eventInPopover: {
    eventEl: HTMLDivElement | null;
    eventInfo: TEventImpl | null;
    inPopover: boolean;
    inEl: boolean;
  };
  setEventInPopover: React.Dispatch<
    React.SetStateAction<{
      eventEl: HTMLDivElement | null;
      eventInfo: TEventImpl | null;
      inPopover: boolean;
      inEl: boolean;
    }>
  >;
  setModalInfo: (modalInfo: {
    open: boolean;
    title: string;
    content: { parentId: string; resourceId: string };
  }) => void;
}

export default (props: ICalendarProps) => {
  const {
    createEvent,
    isInteraction,
    showTimeline,
    readOnlyAccess,
    nowIndicator,
    weekendIndicator,
    calendarRef,
    showPublicHolidays,
    renderBeratungsartBadge,
    theme,
    dataPage,
    fillEvents,
    setSelectedStartDate,
    loadEvents,
    events,
    setEvents,
    resources,
    currentViewType,
    setCurrentViewType,
    eventInPopover,
    setEventInPopover,
    setModalInfo
  } = props;

  const onViewButtonClick = (viewType: ECalendarViewType | ETimelineViewType) => {
    if (calendarRef) {
      const cal: any = calendarRef.current;
      const calendarAPI = cal.getApi();
      let view;
      switch (viewType) {
        case ECalendarViewType.WorkWeek:
          view = ECalendarViewType.Week;
          break;
        case ETimelineViewType.WorkWeek:
          view = ETimelineViewType.Week;
          break;
        default:
          view = viewType;
      }
      setCurrentViewType(viewType);
      calendarAPI.changeView(view);
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const def = eventInfo.event._def;
    const obj = def.extendedProps.item;
    const isMonthlyView = currentViewType === ECalendarViewType.Month;
    let eventDateStr = `${getDateTimeFromIsoString(eventInfo.event.startStr, EDateTimeType.time)}`;
    eventDateStr += `-${getDateTimeFromIsoString(eventInfo.event.endStr, EDateTimeType.time)}`;
    const eventLabel =
      isMonthlyView && !obj.CompleteDay
        ? `${eventDateStr} ${eventInfo.event.title}`
        : eventInfo.event.title;
    if (
      obj.Type === 'Verfügbar' &&
      !currentViewType.includes('Month') &&
      !!obj.Beratungsstellentyp
    ) {
      const bTyp = obj.Beratungsstellentyp || '';
      let left;
      switch (bTyp) {
        case 'Präsenzberatung': {
          left = showTimeline ? '48px' : '75%';
          break;
        }
        case 'Online':
          left = showTimeline ? '32px' : '50%';
          break;
        case 'Telefon':
          left = showTimeline ? '16px' : '25%';
          break;
        case 'Außendienststelle':
        default:
          left = showTimeline ? '0px' : '0%';
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
        {(obj.Type === EEventType.APPOINTMENT ||
          obj.Type === EEventType.CANCELLED ||
          obj.Type === EEventType.REVOKED) &&
          renderBeratungsartBadge(obj.Beratungsart)}
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

  const { create } = useModalManager();

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
            if (modalProps.revert) {
              modalProps.revert();
            }
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

    if (readOnlyAccess) {
      return (
        <Modal
          heading='Verschieben eines bestehenden Kalendereintrags'
          actions={
            <Button
              variant='primary'
              onClick={() => {
                if (modalProps.revert) {
                  modalProps.revert();
                }
                dismiss();
              }}
            >
              Okay
            </Button>
          }
          dismissible={false}
          autoWidth
          stretch
        >
          <Text>Sie haben keine Berechtigung, diesen Termin zu verschieben.</Text>
        </Modal>
      );
    }

    return (
      <Modal
        heading='Verschieben eines bestehenden Kalendereintrags'
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
      info: { start, end, resource: { _context = { dateSelection: {} }, _resource = {} } = {} }
    } = modalProps;
    const {
      dateSelection: { resourceId = '' },
      resourceStore = []
    } = _context;
    const { parentId = '', title = '' } = _resource;
    const resourceParentTitle = resourceStore[parentId]?.title || '';
    const [orgId, resourceMail] = resourceId.split('___') || ['', ''];

    const startDate = moment(start).format('DD.MM.YYYY');
    const startTime = moment(start).format('H:mm');
    const endTime = moment(end).format('H:mm');

    let modalText = `Termin am ${startDate} von ${startTime} Uhr bis ${endTime} Uhr erstellen?`;

    if (showTimeline) {
      modalText = `Termin für ${title} (${resourceParentTitle}) am ${startDate} von ${startTime} Uhr bis ${endTime} Uhr erstellen?`;
    }

    const tmpItem = {
      id: `${Math.random()}`,
      color: theme.base.colors.gray.dark,
      display: 'block',
      start: start.toISOString(),
      end: end.toISOString(),
      title: 'Neuer Termin',
      editable: false,
      resourceId: showTimeline ? resourceId : null,
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
            createEvent(start.toISOString(), end.toISOString(), [orgId, resourceMail]);
            dismiss();
          }}
        >
          Ja
        </Button>
      </>
    );

    return (
      <Modal
        heading='Neuer Termin'
        actions={createModalActions}
        dismissible={false}
        autoWidth
        stretch
      >
        <Text>{modalText}</Text>
      </Modal>
    );
  };

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

  const handleEventOverlap = (stillEvent: any) =>
    !(
      stillEvent._def.extendedProps.item.Type === 'Termin' ||
      stillEvent._def.extendedProps.item.Type === 'Sammel'
    );

  const handleDateChange = (objInfo: any) => {
    const calendar = objInfo.view.calendar;
    if (
      (objInfo.view.type === ECalendarViewType.Week &&
        currentViewType === ECalendarViewType.WorkWeek) ||
      (objInfo.view.type === ETimelineViewType.Week &&
        currentViewType === ETimelineViewType.WorkWeek)
    ) {
      calendar.setOption('weekends', false);
    } else {
      calendar.setOption('weekends', weekendIndicator);
    }
    document
      .querySelectorAll('.fc-button-active')
      .forEach(el => el.classList.remove('fc-button-active'));
    switch (currentViewType) {
      case ECalendarViewType.Day:
        setCurrentViewType(ECalendarViewType.Day);
        document
          .getElementsByClassName('fc-dailyView-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case ECalendarViewType.Week:
        setCurrentViewType(ECalendarViewType.Week);
        document
          .getElementsByClassName('fc-weeklyView-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case ECalendarViewType.WorkWeek:
        setCurrentViewType(ECalendarViewType.WorkWeek);
        document
          .getElementsByClassName('fc-workingWeekView-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case ETimelineViewType.Day:
        setCurrentViewType(ETimelineViewType.Day);
        document
          .getElementsByClassName('fc-resourceTimelineDay-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case ETimelineViewType.Week:
        setCurrentViewType(ETimelineViewType.Week);
        document
          .getElementsByClassName('fc-resourceTimelineWeek-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case ETimelineViewType.WorkWeek:
        setCurrentViewType(ETimelineViewType.WorkWeek);
        document
          .getElementsByClassName('fc-resourceTimelineWorkingWeek-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      default:
      case ECalendarViewType.Month:
        setCurrentViewType(ECalendarViewType.Month);
        document
          .getElementsByClassName('fc-MonthlyView-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long' });
        break;
    }
    localStorage.setItem('fullcalendar', JSON.stringify(objInfo));
    fillEvents();
  };

  const handleSelect = (info: DateSelectArg) => {
    const enableFeature = !readOnlyAccess && isInteraction;
    if (enableFeature) {
      create(CreateModal, { info, dataPage }, { alert: true });
    }
  };

  const onDateClick = (info: { dateStr: string }) => {
    const date = info.dateStr;
    if (date && currentViewType !== ECalendarViewType.Day && !showTimeline) {
      const calendar = calendarRef.current?.calendar;
      onViewButtonClick(ECalendarViewType.Day);
      setSelectedStartDate(date);
      loadEvents(date);
      calendar.gotoDate(date);
    }
  };

  const handleEventClick = () => {};
  const handleEventAllow = (span: DateSpanApi, movingEvent: EventImpl | null) => {
    return (
      !showTimeline ||
      (!!span.resource?._resource.parentId &&
        movingEvent?._def.extendedProps.item.Type === 'Termin')
    );
  };

  const height = currentViewType.includes('Month') || showTimeline ? 'auto' : 1600;

  const customButtons = {
    dailyView: {
      text: 'Tag',
      click: () => onViewButtonClick(ECalendarViewType.Day)
    },
    weeklyView: {
      text: 'Woche',
      click: () => onViewButtonClick(ECalendarViewType.Week)
    },
    workingWeekView: {
      text: 'Arbeitswoche',
      click: () => onViewButtonClick(ECalendarViewType.WorkWeek)
    },
    MonthlyView: {
      text: 'Monat',
      click: () => onViewButtonClick(ECalendarViewType.Month)
    },
    resourceTimelineDay: {
      text: 'Tag',
      click: () => onViewButtonClick(ETimelineViewType.Day)
    },
    resourceTimelineWeek: {
      text: 'Woche',
      click: () => onViewButtonClick(ETimelineViewType.Week)
    },
    resourceTimelineWorkingWeek: {
      text: 'Arbeitswoche',
      click: () => onViewButtonClick(ETimelineViewType.WorkWeek)
    }
  };
  const headerToolbar = {
    left: 'prev,next today',
    center: 'title',
    right: showTimeline
      ? 'resourceTimelineDay resourceTimelineWeek resourceTimelineWorkingWeek'
      : 'MonthlyView weeklyView workingWeekView dailyView'
  };
  const filteredEvents = events.filter(event =>
    showPublicHolidays ? true : event.item.Type !== EEventType.PUBLIC_HOLIDAY
  );
  const businessHours = {
    // days of week. an array of zero-based day of week integers (0=Sunday)
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '06:00', // a start time
    endTime: '21:00' // an end time
  };
  const resourceLabelDidMount = (arg: any) => {
    const parentId = arg.resource.getParent()?.id || '';
    const [, resourceId] = arg.resource.id.split('___');
    const resourceEl = arg.el;
    if (parentId) {
      const title: HTMLSpanElement | null = resourceEl.querySelector('.fc-datagrid-cell-main');
      resourceEl.classList.add('enable-drilldown');
      resourceEl.title = 'Klicken Sie, um den Kalender für diesen Berater zu öffnen';
      if (title) {
        title.onclick = () => {
          setModalInfo({
            open: true,
            title: title.innerText,
            content: {
              parentId,
              resourceId
            }
          });
        };
      }
    }
  };

  const buttonText = { today: 'Heute', month: 'Monat', week: 'Woche', day: 'Tag' };

  const plugins = [rrulePlugin, dayGridPlugin, timeGridPlugin, momentPlugin];
  const componentProps = {} as CalendarOptions;
  const selectConstraint = showTimeline ? 'Verfügbar' : 'businessHours';

  let slotMinWidth = 0;
  let snapDuration = null;

  if (!readOnlyAccess) {
    plugins.push(interactionPlugin);
    componentProps['eventDrop'] = handleEventUpdate;
    componentProps['eventResize'] = handleEventUpdate;
    componentProps['dateClick'] = onDateClick;
    componentProps['eventResizeStart'] = handleEventUpdateStart;
    componentProps['eventDragStart'] = handleEventUpdateStart;
  }

  if (showTimeline) {
    plugins.push(resourceTimelinePlugin);
    componentProps['eventResourceEditable'] = !readOnlyAccess;
    componentProps['schedulerLicenseKey'] = '0873473011-fcs-1733922476';
    componentProps['resourcesInitiallyExpanded'] = true;
    componentProps['resourceAreaHeaderContent'] = 'Ressourcen';
    componentProps['resourceAreaWidth'] = '250px';
    componentProps['resources'] = resources;
    componentProps['resourceLabelDidMount'] = resourceLabelDidMount;
    componentProps['allDaySlot'] = true;
    slotMinWidth = 256;
    snapDuration = '00:30:00';
  }

  return (
    <FullCalendar
      ref={calendarRef}
      height={height}
      contentHeight={height}
      slotMinWidth={slotMinWidth}
      customButtons={customButtons}
      headerToolbar={headerToolbar}
      plugins={plugins}
      initialView={currentViewType}
      selectable={!readOnlyAccess}
      droppable={!readOnlyAccess}
      nowIndicator={nowIndicator}
      weekends={weekendIndicator}
      weekNumbers
      expandRows
      snapDuration={snapDuration}
      allDayText='Ganztags'
      slotMinTime='06:00:00'
      slotMaxTime='21:00:00'
      events={filteredEvents}
      eventAllow={readOnlyAccess ? () => false : handleEventAllow}
      eventContent={renderEventContent}
      eventClick={handleEventClick}
      eventMouseEnter={handleEventMouseEnter}
      eventMouseLeave={handleEventMouseLeave}
      slotEventOverlap={false}
      eventOverlap={handleEventOverlap}
      datesSet={handleDateChange}
      select={handleSelect}
      eventTextColor='#fff'
      firstDay={1}
      businessHours={businessHours}
      selectConstraint={isInteraction ? selectConstraint : '_NA_'}
      locale={deLocale}
      buttonText={buttonText}
      {...componentProps}
    />
  );
};
