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
  theme: DefaultTheme;
}

export default (props: ILegendProps) => {
  const { legendExpanded, setLegendExpanded, theme } = props;

  return (
    <Flex container={{ alignItems: 'center', direction: 'column' }}>
      <Button
        style={{ width: '12rem', marginBottom: '1rem' }}
        variant={legendExpanded ? 'primary' : 'secondary'}
        onClick={() => setLegendExpanded((curState: boolean) => !curState)}
      >
        {legendExpanded ? 'Legende ausblenden' : 'Legende einblenden'}
      </Button>
      <ExpandCollapse dimension='height' collapsed={!legendExpanded}>
        <Card>
          <CardContent>
            <Grid
              container={{
                cols: 'repeat(4, 11rem)',
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
  );
};
