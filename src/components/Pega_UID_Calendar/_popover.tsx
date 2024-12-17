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
  EDateTimeType,
  EEventType,
  TEventImpl,
  getDateTimeFromIsoString,
  getTypeIcon
} from './index';

export interface IPopoverEvent {
  eventEl: HTMLDivElement | null;
  eventInfo: TEventImpl | null;
  inPopover: boolean;
  inEl: boolean;
}

export interface IPopoverProps {
  eventInPopover: IPopoverEvent;
  handlePopoverMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
  handlePopoverMouseLeave: (event: React.MouseEvent<HTMLElement>) => void;
  renderBeratungsartBadge: (beratungsart: string) => JSX.Element;
  openPreviewEventOnClick: () => void;
}

export default (props: IPopoverProps) => {
  const {
    eventInPopover,
    handlePopoverMouseEnter,
    handlePopoverMouseLeave,
    renderBeratungsartBadge,
    openPreviewEventOnClick
  } = props;

  return (
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
                style={{ backgroundColor: eventInPopover.eventInfo?._def.ui.backgroundColor }}
              ></span>
              <Text variant='h3'>{eventInPopover.eventInfo?._def.title}</Text>
              {(eventInPopover.eventInfo?._def.extendedProps.item.Type === EEventType.APPOINTMENT ||
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
                {getDateTimeFromIsoString(eventInPopover.eventInfo?.startStr, EDateTimeType.date, {
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
              {eventInPopover.eventInfo?._def.extendedProps.item.CompleteDay ? (
                <Text variant='primary' className='event-label'>
                  Ganzer Tag
                </Text>
              ) : (
                <Text variant='primary' className='event-label'>
                  {getDateTimeFromIsoString(eventInPopover.eventInfo?.startStr, EDateTimeType.time)}
                  {' - '}
                  {getDateTimeFromIsoString(eventInPopover.eventInfo?.endStr, EDateTimeType.time)}
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
              {eventInPopover.eventInfo?._def.extendedProps.item.Type === EEventType.MASS_EVENT && (
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
            eventInPopover.eventInfo?._def.extendedProps.item.Type === EEventType.MASS_EVENT) && (
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
