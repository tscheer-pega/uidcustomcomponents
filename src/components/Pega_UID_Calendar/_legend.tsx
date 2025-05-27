import React from 'react';
import {
  Button,
  Card,
  CardContent,
  ExpandCollapse,
  Flex,
  Grid,
  Icon,
  Text
} from '@pega/cosmos-react-core';
import { DefaultTheme } from 'styled-components';

export interface ILegendProps {
  legendExpanded: boolean;
  setLegendExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isMonth: boolean;
  theme: DefaultTheme;
}

interface ICalendarLegendProps {
  theme: DefaultTheme;
  legendExpanded: boolean;
  isMonth: boolean;
}

const CalendarLegend = (props: ICalendarLegendProps) => (
  <ExpandCollapse dimension='height' collapsed={!props.legendExpanded} transitionSpeed='fast'>
    <Card>
      <CardContent>
        <Grid
          container={{
            cols: `repeat(${props.isMonth ? '4' : '5'}, ${props.isMonth ? '11' : '8.5'}rem)`,
            colGap: 1,
            rowGap: 1
          }}
        >
          {props.isMonth ? (
            <>
              <span>&nbsp;</span>
              <Flex container={{ alignItems: 'center' }}>
                <span
                  className='event-indicator'
                  style={{ backgroundColor: props.theme.base.colors.green.light }}
                ></span>
                <Text variant='primary' className='legend-item'>
                  Verfügbarkeit (Fern)
                </Text>
              </Flex>
              <Flex container={{ alignItems: 'center' }}>
                <span
                  className='event-indicator'
                  style={{ backgroundColor: props.theme.base.colors.green.dark }}
                ></span>
                <Text variant='primary' className='legend-item'>
                  Verfügbarkeit (Präsenz)
                </Text>
              </Flex>
              <span>&nbsp;</span>
            </>
          ) : (
            <Flex container={{ alignItems: 'center' }}>
              <span
                className='event-indicator'
                style={{ backgroundColor: props.theme.base.colors.green.light }}
              ></span>
              <Text variant='primary' className='legend-item'>
                Verfügbarkeit
              </Text>
            </Flex>
          )}
          <Flex container={{ alignItems: 'center' }}>
            <span
              className='event-indicator'
              style={{ backgroundColor: props.theme.base.colors.yellow.light }}
            ></span>
            <Text variant='primary' className='legend-item'>
              Sammeltermin
            </Text>
          </Flex>
          <Flex container={{ alignItems: 'center' }}>
            <span
              className='event-indicator'
              style={{ backgroundColor: props.theme.base.colors.blue.dark }}
            ></span>
            <Text variant='primary' className='legend-item'>
              Termin
            </Text>
          </Flex>
          <Flex container={{ alignItems: 'center' }}>
            <span
              className='event-indicator'
              style={{ backgroundColor: props.theme.base.colors.purple.dark }}
            ></span>
            <Text variant='primary' className='legend-item'>
              Feiertag
            </Text>
          </Flex>
          <Flex container={{ alignItems: 'center' }}>
            <span
              className='event-indicator'
              style={{ backgroundColor: props.theme.base.colors.orange.dark }}
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
);

export default (props: ILegendProps) => {
  const { legendExpanded, setLegendExpanded, theme } = props;

  return (
    <Flex
      container={{ alignItems: 'center', direction: 'column' }}
      className={`legend ${legendExpanded ? ' expanded' : ''}`}
    >
      <Button
        style={{ width: '12rem', marginBottom: '0.5rem' }}
        variant={legendExpanded ? 'primary' : 'secondary'}
        onClick={() => setLegendExpanded((curState: boolean) => !curState)}
      >
        {legendExpanded ? 'Legende ausblenden' : 'Legende einblenden'}
      </Button>
      <CalendarLegend theme={theme} legendExpanded={legendExpanded} isMonth={props.isMonth} />
    </Flex>
  );
};
