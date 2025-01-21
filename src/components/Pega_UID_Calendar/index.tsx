import { useEffect, useRef, useState } from 'react';
import { CalendarApi } from '@fullcalendar/core';
import moment from 'moment';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Configuration,
  DateInput,
  Flex,
  Icon,
  MenuButton,
  registerIcon,
  Status,
  StatusProps,
  Switch,
  Text,
  useTheme,
  withConfiguration
} from '@pega/cosmos-react-core';
import Legend from './_legend';
import Calendar, { TEvent } from './_calendar';
import Popover, { IPopoverEvent } from './_popover';

import StyledCalendarWrapper from './styles';
import './create-nonce';
import GlobalStyles from './global-styles';
import * as LocationSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/location-solid.icon';
import * as Plus from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
import * as CalendarEmptySolid from '@pega/cosmos-react-core/lib/components/Icon/icons/calendar-empty-solid.icon';
import * as ClockSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/clock-solid.icon';
import * as WizardSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/wizard-solid.icon';
import * as UserGroupSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/users-solid.icon';
import * as UserSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/user-solid.icon';
import * as WebcamSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/webcam-solid.icon';
import * as PhoneSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/phone-solid.icon';
import * as Building2Solid from '@pega/cosmos-react-core/lib/components/Icon/icons/building-2-solid.icon';
import * as Reset from '@pega/cosmos-react-core/lib/components/Icon/icons/reset.icon';
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
  Building2Solid,
  Reset
);

export type TEventImpl = Parameters<CalendarApi['addEvent']>[0];

export enum ECalendarViewType {
  Day = 'timeGridDay',
  Week = 'timeGridWeek',
  WorkWeek = 'workingWeek',
  Month = 'dayGridMonth'
}

export enum ETimelineViewType {
  Day = 'resourceTimelineDay',
  Week = 'resourceTimelineWeek',
  WorkWeek = 'resourceTimelineWorkWeek'
}

export type TCalendarProps = {
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
  getPConnect: any;
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
  PUBLIC_HOLIDAY = 'Feiertag',
  CANCELLED = 'Storniert',
  REVOKED = 'Abgesagt'
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
  ResourceId?: string;
}

export type TDateInfo = {
  view: { type: ECalendarViewType | ETimelineViewType };
  startStr?: string;
  start?: string;
  end?: string;
};

export interface IRawResource {
  pyGUID: string;
  Name: string;
  BeraterList?: Array<{
    pyUserIdentifier: string;
    pyUserName: string;
  }>;
}

export interface IBerater {
  id: string;
  title: string;
}

export interface IResource {
  id: string;
  title: string;
  children?: Array<IBerater>;
}

export const getDateTimeFromIsoString = (
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

const defaultEventInPopover = {
  eventEl: null,
  eventInfo: null,
  inPopover: false,
  inEl: false
};

const getDefaultView = (
  dateInfo: TDateInfo,
  showTimeline: boolean,
  defaultViewMode: string
): ECalendarViewType | ETimelineViewType => {
  if (
    dateInfo?.view?.type &&
    ((showTimeline &&
      Object.values(ETimelineViewType).includes(dateInfo.view.type as ETimelineViewType)) ||
      (!showTimeline &&
        Object.values(ECalendarViewType).includes(dateInfo.view.type as ECalendarViewType)))
  ) {
    /* If the context is persisted in session storage - then used this info as default view */
    return dateInfo.view.type;
  }
  let defaultView: ETimelineViewType | ECalendarViewType;
  switch (defaultViewMode) {
    case 'Weekly':
      defaultView = showTimeline ? ETimelineViewType.Week : ECalendarViewType.Week;
      break;
    case 'Daily':
      defaultView = showTimeline ? ETimelineViewType.Day : ECalendarViewType.Day;
      break;
    default:
    case 'Monthly':
      defaultView = showTimeline ? ETimelineViewType.WorkWeek : ECalendarViewType.Month;
      break;
  }
  return defaultView;
};

const getDateInfo = (): TDateInfo => {
  let dateInfo: TDateInfo = { view: { type: ECalendarViewType.Month } };
  const dateInfoStr = localStorage.getItem('fullcalendar');
  if (dateInfoStr) {
    dateInfo = JSON.parse(dateInfoStr);
    if (dateInfo.view.type === ECalendarViewType.Month && dateInfo.end && dateInfo.start) {
      /* If showing Month - find the date in the middle to get the Month */
      const endDate = new Date(dateInfo.end).valueOf();
      const startDate = new Date(dateInfo.start).valueOf();
      const middle = new Date(endDate - (endDate - startDate) / 2);
      dateInfo.startStr = `${middle.toISOString().substring(0, 7)}-01`;
    }
  }
  return dateInfo;
};

export const getTypeIcon = (appointmentType: string) => {
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

export const renderBeratungsartBadge = (beratungsart: string) => {
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

/**
 * Pega UID Calendar
 * @param props {TCalendarProps}
 * @constructor
 */
export const PegaUidCalendar = (props: TCalendarProps) => {
  const {
    heading = '',
    dataPage = '',
    dataPageResources = '',
    createClassname = '',
    createMassClassname = '',
    interactionId = '',
    defaultViewMode = 'Monthly',
    nowIndicator = true,
    weekendIndicator = true,
    showTimeline = false,
    getPConnect
  } = props;
  const actionsApi = getPConnect().getActionsApi();
  const dataApiUtils = (window as any).PCore.getDataApiUtils();

  const theme = useTheme();
  const calendarRef = useRef<any | null>(null);
  const [events, setEvents] = useState<Array<TEvent>>([]);
  const [showPublicHolidays, setShowPublicHolidays] = useState(true);
  const [eventInPopover, setEventInPopover] = useState<IPopoverEvent>(defaultEventInPopover);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentViewType, setCurrentViewType] = useState<ECalendarViewType | ETimelineViewType>(
    getDefaultView(getDateInfo(), showTimeline, defaultViewMode)
  );
  const [rawData, setRawData] = useState<Array<IRawEvent>>([]);
  const [resources, setResources] = useState<Array<IResource>>([]);
  const [legendExpanded, setLegendExpanded] = useState<boolean>(false);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(moment().toISOString());

  const fillEvents = (data: Array<IRawEvent> = rawData) => {
    setEvents([]);
    const tmpevents: Array<TEvent> = [];
    (data || rawData).forEach((item: IRawEvent) => {
      let color: string;
      let groupId: string | undefined;
      let constraint: string | undefined;
      let display = 'block';
      let editable = false;
      let dragScroll = false;
      let title = item.Subject;
      switch (item.Type) {
        case EEventType.AVAILABILITY: {
          color = theme.base.colors.green.dark;
          if (
            item.Beratungsstellentyp === 'Online' ||
            item.Beratungsstellentyp === 'Telefon' ||
            showTimeline
          ) {
            color = theme.base.colors.green.light;
          }
          if (!currentViewType.includes('Month') || showTimeline) {
            display = 'background';
            if (!showTimeline) {
              color = 'transparent';
            }
          }
          title = showTimeline ? '' : item.Type;
          groupId = EEventType.AVAILABILITY;
          break;
        }
        case EEventType.CANCELLED:
          color = theme.base.colors.yellow.dark;
          break;
        case EEventType.REVOKED:
          color = theme.base.colors.blue.light;
          break;
        case EEventType.APPOINTMENT:
          color = theme.base.colors.blue.dark;
          editable = true;
          dragScroll = true;
          constraint = EEventType.AVAILABILITY;
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
          constraint = EEventType.AVAILABILITY;
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
      const tmpEvent: TEvent = {
        id: item.TerminID || `generic-${Math.random() * 1e9}`,
        resourceId: item.ResourceId || `generic-${Math.random() * 1e9}`,
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
      if (constraint) {
        tmpEvent.constraint = constraint;
      }
      if (groupId) {
        tmpEvent.groupId = groupId;
      }
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

  const mapResources = (rawResources: Array<IRawResource>): Array<IResource> => {
    return rawResources.map(rawResource => {
      const children = [] as Array<IBerater>;
      rawResource.BeraterList?.forEach(berater => {
        children.push({
          id: berater.pyUserIdentifier,
          title: berater.pyUserName
        });
      });
      return {
        id: rawResource.pyGUID,
        title: rawResource.Name,
        children
      };
    });
  };

  const loadEvents = (startDate = StartDate) => {
    const enableFeature = true;
    if (showTimeline && startDate && enableFeature) {
      setIsLoading(true);
      dataApiUtils
        .getData(dataPageResources, {
          dataViewParameters: {
            StartDate: moment(startDate).format('YYYY-MM-DD'),
            EndDate: moment(EndDate).format('YYYY-MM-DD'),
            ShowTimeline: showTimeline
          }
        })
        .then(async (response: any) => {
          const resourceResponse = response.data;
          const rawResource = resourceResponse.data as Array<IRawResource>;
          const promises = [] as Array<Promise<any>>;
          if (rawResource) {
            setResources(mapResources(rawResource));
            rawResource.forEach(singleOrganisation => {
              singleOrganisation.BeraterList?.forEach(singleAgent => {
                promises.push(
                  new Promise(resolve => {
                    dataApiUtils
                      .getData(dataPage, {
                        dataViewParameters: {
                          StartDate: moment(startDate).format('YYYY-MM-DD'),
                          EndDate: moment(EndDate).format('YYYY-MM-DD'),
                          // Organisationseinheit ID (Agency ID)
                          OrgID: singleOrganisation.pyGUID,
                          // Berater ID (Consultant ID)
                          BeraterID: singleAgent.pyUserIdentifier
                        }
                      })
                      .then((resp: any) => {
                        const eventData = resp.data;
                        if (eventData.data !== null) {
                          resolve(eventData.data);
                        }
                      });
                  })
                );
              });
            });
          }
          const [resolvedEvents] = await Promise.all(promises);
          setRawData(resolvedEvents);
          fillEvents(resolvedEvents);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (startDate) {
      setIsLoading(true);
      dataApiUtils
        .getData(dataPage, {
          dataViewParameters: {
            StartDate: moment(startDate).format('YYYY-MM-DD'),
            EndDate: moment(EndDate).format('YYYY-MM-DD')
          }
        })
        .then((response: any) => {
          const data = response.data;
          if (data.data !== null) {
            setRawData(data.data);
            fillEvents(data.data);
          }
        })
        .finally(() => setIsLoading(false));
    }
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

  const addNewEvent = (className: string) =>
    actionsApi.createWork(className, {
      openCaseViewAfterCreate: true,
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

  const openPreviewEventOnClick = () => {
    const eventInfoObj = eventInPopover.eventInfo?._def.extendedProps.item;
    actionsApi.showCasePreview(eventInfoObj.TerminID);
  };

  const onDateSelect = (e: DateTimeCallbackParameter) => {
    const date = e.valueAsISOString;
    if (date && selectedStartDate !== date) {
      const calendar = calendarRef.current?.calendar;
      setSelectedStartDate(date);
      loadEvents(date);
      setCurrentViewType(ECalendarViewType.Day);
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

  // Add an event listener to the document to listen for the expand/collapse of the timeline categories
  if (showTimeline) {
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'complete') {
        // good luck!
        /*
        setTimeout(() => {
          expanders = document.querySelectorAll(
            '.fc-datagrid-expander:not(.fc-datagrid-expander-placeholder)'
          );
          expanders.forEach(
            expander =>
              (expander.children[0].onclick = e => {
                console.log(e);
                debugger;
                // using the fullcalendar dispatcher to toggle
                calendarRef.current.getApi().currentDataManager.dispatch({
                  type: 'SET_RESOURCE_ENTITY_EXPANDED',
                  id: '0',
                  isExpanded: true
                });
              })
          );
        }, 1000);
         */
      }
    });
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
                    }}
                    label='Feiertage anzeigen'
                  />
                  <span className='h-spacer'>&nbsp;</span>
                  <DateInput
                    className='date-select'
                    mode='date'
                    onBlur={() => {}}
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
              <Calendar
                showTimeline={showTimeline}
                calendarRef={calendarRef}
                currentViewType={currentViewType}
                setEvents={setEvents}
                weekendIndicator={weekendIndicator}
                nowIndicator={nowIndicator}
                eventInPopover={eventInPopover}
                events={isLoading ? [] : events}
                resources={isLoading ? [] : resources}
                setEventInPopover={setEventInPopover}
                setCurrentViewType={setCurrentViewType}
                fillEvents={fillEvents}
                loadEvents={loadEvents}
                dataPage={dataPage}
                renderBeratungsartBadge={renderBeratungsartBadge}
                setSelectedStartDate={setSelectedStartDate}
                showPublicHolidays={showPublicHolidays}
                theme={theme}
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
            <Legend
              legendExpanded={legendExpanded}
              setLegendExpanded={setLegendExpanded}
              showTimeline={showTimeline}
              theme={theme}
            />
          </CardFooter>
        </Flex>
        <Popover
          eventInPopover={eventInPopover}
          renderBeratungsartBadge={renderBeratungsartBadge}
          handlePopoverMouseEnter={handlePopoverMouseEnter}
          handlePopoverMouseLeave={handlePopoverMouseLeave}
          openPreviewEventOnClick={openPreviewEventOnClick}
        />
      </StyledCalendarWrapper>
    </Configuration>
  );
};

export default withConfiguration(PegaUidCalendar);
