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
import { DateSelectArg, DateSpanApi, EventContentArg, EventHoveringArg } from '@fullcalendar/core';
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
  EDateTimeType,
  EEventType,
  ETerminGoal,
  EViewType,
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
};

export type TResource = {
  id: string;
  title: string;
  children?: Array<TResource>;
};

export interface ICalendarProps {
  showTimeline: boolean;
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
  currentViewType: EViewType;
  setCurrentViewType: React.Dispatch<React.SetStateAction<EViewType>>;
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
}

export default (props: ICalendarProps) => {
  const {
    showTimeline,
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
    setEventInPopover
  } = props;

  const onViewButtonClick = (viewType: EViewType) => {
    if (calendarRef) {
      const cal: any = calendarRef.current;
      const calendarAPI = cal.getApi();
      const view = viewType === EViewType.WorkWeek ? EViewType.Week : viewType;
      setCurrentViewType(viewType);
      calendarAPI.changeView(view);
    }
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
      !currentViewType.includes('Month') &&
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

  const handleDateChange = (objInfo: any) => {
    const calendar = objInfo.view.calendar;
    if (objInfo.view.type === EViewType.Week && currentViewType === EViewType.WorkWeek) {
      calendar.setOption('weekends', false);
    } else {
      calendar.setOption('weekends', weekendIndicator);
    }
    document.querySelector('.fc-button-active')?.classList.remove('fc-button-active');
    switch (currentViewType) {
      case EViewType.Day:
        setCurrentViewType(EViewType.Day);
        document
          .getElementsByClassName('fc-dailyView-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case EViewType.Week:
        setCurrentViewType(EViewType.Week);
        document
          .getElementsByClassName('fc-weeklyView-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case EViewType.WorkWeek:
        setCurrentViewType(EViewType.WorkWeek);
        document
          .getElementsByClassName('fc-workingWeekView-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case EViewType.ResourceTimelineDay:
        setCurrentViewType(EViewType.ResourceTimelineDay);
        document
          .getElementsByClassName('fc-resourceTimelineDay-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      case EViewType.ResourceTimelineWeek:
        setCurrentViewType(EViewType.ResourceTimelineWeek);
        document
          .getElementsByClassName('fc-resourceTimelineWeek-button')[0]
          ?.classList.add('fc-button-active');
        calendar.setOption('dayHeaderFormat', { weekday: 'long', month: 'long', day: 'numeric' });
        break;
      default:
      case EViewType.Month:
        setCurrentViewType(EViewType.Month);
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
    // TODO: Clarify functionality and enable when ready
    const enableFeature = false;
    if (enableFeature) {
      create(CreateModal, { info, dataPage }, { alert: true });
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

  const handleEventClick = () => {};
  const handleEventAllow = (span: DateSpanApi, movingEvent: EventImpl | null) => {
    return (
      !showTimeline ||
      (!!span.resource?._resource.parentId &&
        movingEvent?._def.extendedProps.item.Type === 'Termin')
    );
  };

  return (
    <FullCalendar
      ref={calendarRef}
      height={currentViewType.includes('Month') || showTimeline ? 'auto' : 1600}
      contentHeight={currentViewType.includes('Month') || showTimeline ? 'auto' : 1600}
      schedulerLicenseKey='0873473011-fcs-1733922476'
      slotMinWidth={showTimeline ? 96 : 0}
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
        },
        resourceTimelineDay: {
          text: 'Tag',
          click: () => onViewButtonClick(EViewType.ResourceTimelineDay)
        },
        resourceTimelineWeek: {
          text: 'Woche',
          click: () => onViewButtonClick(EViewType.ResourceTimelineWeek)
        }
      }}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: showTimeline
          ? 'resourceTimelineDay' // 'resourceTimelineDay resourceTimelineWeek'
          : 'MonthlyView weeklyView workingWeekView dailyView'
      }}
      plugins={[
        rrulePlugin,
        dayGridPlugin,
        timeGridPlugin,
        momentPlugin,
        interactionPlugin,
        resourceTimelinePlugin
      ]}
      initialView={currentViewType}
      selectable
      droppable
      nowIndicator={nowIndicator}
      weekends={weekendIndicator}
      weekNumbers
      expandRows
      allDayText='Ganztags'
      slotMinTime='06:00:00'
      slotMaxTime='21:00:00'
      slotEventOverlap={false}
      events={events.filter(event =>
        showPublicHolidays ? true : event.item.Type !== EEventType.PUBLIC_HOLIDAY
      )}
      resourcesInitiallyExpanded
      resourceAreaHeaderContent='Ressourcen'
      resourceAreaWidth='250px'
      resources={resources}
      eventAllow={handleEventAllow}
      eventContent={renderEventContent}
      eventClick={handleEventClick}
      eventMouseEnter={handleEventMouseEnter}
      eventMouseLeave={handleEventMouseLeave}
      eventDragStart={handleEventUpdateStart}
      eventResizeStart={handleEventUpdateStart}
      eventDrop={handleEventUpdate}
      eventResize={handleEventUpdate}
      eventResourceEditable
      datesSet={handleDateChange}
      select={handleSelect}
      eventTextColor='#fff'
      firstDay={1}
      businessHours={{
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '06:00', // a start time
        endTime: '21:00' // an end time
      }}
      selectConstraint='businessHours'
      locale={deLocale}
      buttonText={{ today: 'Heute', month: 'Monat', week: 'Woche', day: 'Tag' }}
      dateClick={onDateClick}
    />
  );
};
