import React, { JSX } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  Icon,
  Popover,
  Text
} from '@pega/cosmos-react-core';
import {
  EBeratungsTyp,
  EDateTimeType,
  EEventType,
  ETerminGoal,
  getDateTimeFromIsoString,
  getTypeIcon,
  IOrganisationseinheit,
  TEventImpl
} from './index';
import { BasePlacement as PopperBasePlacement } from '@popperjs/core';

export interface IPopoverEvent {
  eventEl: HTMLDivElement | null;
  eventInfo: TEventImpl | null;
  inPopover: boolean;
  inEl: boolean;
}

export interface IPopoverProps {
  eventInPopover: IPopoverEvent;
  isSummary?: boolean;
  handlePopoverMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
  handlePopoverMouseLeave: (event: React.MouseEvent<HTMLElement>) => void;
  renderBeratungsartBadge: (beratungsart: string) => JSX.Element;
  openPreviewEventOnClick: () => void;
}

export default (props: IPopoverProps) => {
  const {
    eventInPopover,
    isSummary,
    handlePopoverMouseEnter,
    handlePopoverMouseLeave,
    renderBeratungsartBadge,
    openPreviewEventOnClick
  } = props;

  if (!eventInPopover?.eventEl || !eventInPopover?.eventInfo) {
    // If there is no event element or event info, return null to avoid rendering the Popover
    // This prevents errors when trying to access properties of undefined
    return null;
  }

  const eventEl = eventInPopover.eventEl as HTMLDivElement;
  const eventInfo = eventInPopover.eventInfo;
  const item = eventInfo?._def.extendedProps.item || {
    pyGUID: '',
    Address: '',
    AuthorID: '',
    Capacity: '',
    City: '',
    EndTime: '',
    OrganisationseinheitID: '',
    BeratungsstelleID: '',
    StartTime: '',
    TerminID: '',
    Type: EEventType.PUBLIC_HOLIDAY,
    UtilizedCapacity: '',
    Beratungsart: ETerminGoal._TMP_,
    Beratungsstellentyp: EBeratungsTyp.office,
    CompleteDay: false,
    IsSerie: false,
    SerieEnd: '',
    SerieRepeat: '',
    Subject: '',
    IOrganisationseinheit: {} as IOrganisationseinheit,
    ResourceId: '',
    summary: false,
    SammelDetails: {
      Fulfillment: 0,
      Completed: 0,
      Intake: 0,
      Cancelled: 0,
      Removed: 0
    },
    TerminDetails: {
      Fulfillment: 0,
      Bewerbungsabgabe: 0,
      Completed: 0,
      Intake: 0,
      Cancelled: 0,
      Removed: 0,
      Erstberatung: 0,
      Folgeberatung: 0
    }
  };
  const type = item.Type || '';

  let placement = 'bottom' as PopperBasePlacement;
  if (
    eventEl.getBoundingClientRect().top + window.scrollY + eventEl.clientHeight + 250 >
    document.documentElement.clientHeight
  ) {
    placement = 'top';
  }

  return (
    <Popover
      show={!!eventInfo}
      target={eventEl}
      portal={false}
      arrow
      showDelay='short'
      placement={placement}
      onMouseEnter={handlePopoverMouseEnter}
      onMouseLeave={handlePopoverMouseLeave}
      className='event-popover'
    >
      {type === EEventType.PUBLIC_HOLIDAY ? (
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
                Dieser Eintrag dient zu Ihrer Information. Sofern Sie vom Feiertag betroffen sind,
                bitten wir Sie Ihre Abwesenheit eigenständig zu buchen.
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
                style={{ backgroundColor: eventInfo?._def.ui.backgroundColor }}
              ></span>
              <Text variant='h3'>{eventInfo?._def.title}</Text>
              {(type === EEventType.APPOINTMENT ||
                type === EEventType.MASS_EVENT ||
                type === EEventType.REVOKED ||
                type === EEventType.CANCELLED) && (
                <>
                  <div></div>
                  <Text variant='secondary'>{item.TerminID}</Text>
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
              {isSummary && type === EEventType.MASS_EVENT && item.SammelDetails?.Fulfillment > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Ausstehend Aufnahme
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.SammelDetails?.Fulfillment}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.MASS_EVENT && item.SammelDetails?.Completed > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Erfüllung
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.SammelDetails?.Completed}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.MASS_EVENT && item.SammelDetails?.Cancelled > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Abgebrochen
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.SammelDetails?.Cancelled}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.MASS_EVENT && item.SammelDetails?.Removed > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Entfernt
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.SammelDetails?.Removed}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.MASS_EVENT && item.SammelDetails?.Intake > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Eingabe Termindetails
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.SammelDetails?.Intake}
                  </Text>
                </>
              )}

              {isSummary &&
                type === EEventType.APPOINTMENT &&
                item.TerminDetails?.Erstberatung > 0 && (
                  <>
                    <Text variant='primary' className='event-label'>
                      Erstberatung
                    </Text>
                    <Text variant='primary' className='event-label'>
                      {item.TerminDetails?.Erstberatung}
                    </Text>
                  </>
                )}

              {isSummary &&
                type === EEventType.APPOINTMENT &&
                item.TerminDetails?.Folgeberatung > 0 && (
                  <>
                    <Text variant='primary' className='event-label'>
                      Folgeberatung
                    </Text>
                    <Text variant='primary' className='event-label'>
                      {item.TerminDetails?.Folgeberatung}
                    </Text>
                  </>
                )}

              {isSummary &&
                type === EEventType.APPOINTMENT &&
                item.TerminDetails?.Bewerbungsabgabe > 0 && (
                  <>
                    <Text variant='primary' className='event-label'>
                      Bewerbungsabgabe
                    </Text>
                    <Text variant='primary' className='event-label'>
                      {item.TerminDetails?.Bewerbungsabgabe}
                    </Text>
                  </>
                )}

              {isSummary &&
                type === EEventType.APPOINTMENT &&
                (item.TerminDetails?.Fulfillment > 0 ||
                  item.TerminDetails?.Intake > 0 ||
                  item.TerminDetails?.Completed > 0) && (
                  <>
                    <hr className='solid'></hr>
                    <hr className='solid'></hr>
                  </>
                )}

              {isSummary && type === EEventType.APPOINTMENT && item.TerminDetails?.Fulfillment > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Ausstehend Aufnahme
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.TerminDetails?.Fulfillment}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.APPOINTMENT && item.TerminDetails?.Intake > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Eingabe Termindetails
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.TerminDetails?.Intake}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.APPOINTMENT && item.TerminDetails?.Completed > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Erfüllung
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.TerminDetails?.Completed}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.APPOINTMENT && item.TerminDetails?.Cancelled > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Abgebrochen
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.TerminDetails?.Cancelled}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.APPOINTMENT && item.TerminDetails?.Removed > 0 && (
                <>
                  <Text variant='primary' className='event-label'>
                    Entfernt
                  </Text>
                  <Text variant='primary' className='event-label'>
                    {item.TerminDetails?.Removed}
                  </Text>
                </>
              )}

              {isSummary && type === EEventType.APPOINTMENT && item.TerminDetails?.Fulfillment > 0 && (
                <>
                  <hr className='solid'></hr>
                  <hr className='solid'></hr>
                </>
              )}

              <Icon
                name='calendar-empty-solid'
                role='img'
                aria-label='calendar icon'
                size='s'
                className='icon'
              />
              <Text variant='primary' className='event-label'>
                {getDateTimeFromIsoString(eventInfo?.startStr, EDateTimeType.date, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              <Icon
                name='clock-solid'
                role='img'
                aria-label='clock icon'
                size='s'
                className='icon'
              />
              {item.CompleteDay ? (
                <Text variant='primary' className='event-label'>
                  Ganzer Tag
                </Text>
              ) : (
                <Text variant='primary' className='event-label'>
                  {getDateTimeFromIsoString(eventInfo?.startStr, EDateTimeType.time)}
                  {' - '}
                  {getDateTimeFromIsoString(eventInfo?.endStr, EDateTimeType.time)}
                </Text>
              )}

              {(type === EEventType.APPOINTMENT ||
                type === EEventType.REVOKED ||
                type === EEventType.CANCELLED) &&
                item.Beratungsart && (
                  <>
                    <Icon
                      name='wizard-solid'
                      role='img'
                      aria-label='Beratungsart'
                      size='s'
                      className='icon'
                    />
                    {renderBeratungsartBadge(item.Beratungsart)}
                  </>
                )}
              {type === EEventType.MASS_EVENT &&
                item.Address &&
                item.UtilizedCapacity &&
                item.Capacity && (
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
                        {item.Address}
                      </Text>
                    </Flex>
                    <Icon name='users-solid' role='img' aria-label='group icon' size='s' />
                    <Flex container={{ direction: 'column', alignItems: 'start' }}>
                      <Text variant='primary' className='event-label'>
                        {item.UtilizedCapacity}/{item.Capacity} Kapazität
                      </Text>
                    </Flex>
                  </>
                )}
              {item.Beratungsstellentyp && (
                <>
                  {getTypeIcon(item.Beratungsstellentyp)}
                  <Text variant='primary' className='event-label'>
                    {item.Beratungsstellentyp}
                  </Text>
                </>
              )}
              {(type === EEventType.REVOKED || type === EEventType.CANCELLED) && (
                <>
                  {renderBeratungsartBadge(type)}
                  <span>&nbsp;</span>
                </>
              )}
            </Grid>
          </CardContent>
          {(type === EEventType.APPOINTMENT ||
            type === EEventType.MASS_EVENT ||
            type === EEventType.REVOKED ||
            type === EEventType.CANCELLED) && (
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
  );
};
