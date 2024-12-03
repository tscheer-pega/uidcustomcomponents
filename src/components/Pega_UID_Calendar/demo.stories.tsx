import type { StoryObj } from '@storybook/react';
import PegaUidCalendar from './index';
import { getData } from './helpers';
import exampleData from './exampleData.stories.json';
import publicHolidays from './publicHolidays.stories.json';

export default {
  title: 'Widgets/Calendar',
  argTypes: {
    dataPage: {
      table: {
        disable: true
      }
    },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaUidCalendar
};

const setPCore = () => {
  (window as any).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local'
      };
    },
    getEvents: () => {
      return {
        getCaseEvent: () => {
          return {
            ASSIGNMENT_SUBMISSION: 'ASSIGNMENT_SUBMISSION'
          };
        }
      };
    },
    getPubSubUtils: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        }
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return undefined;
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle'
          };
        }
      };
    },
    getDataApiUtils: () => ({
      getData: (
        dataViewName: string,
        props: { dataViewParameters: { StartDate: string; EndDate: string } }
      ) => {
        // eslint-disable-next-line no-console
        console.log('Passed properties', props);
        return new Promise(resolve =>
          setTimeout(() => {
            const useGenericData = false;
            const data = getData(props.dataViewParameters);
            // eslint-disable-next-line no-console
            console.log(
              'useGenericData',
              useGenericData,
              'Data',
              useGenericData ? data : exampleData
            );
            const returnData = useGenericData ? data : exampleData;
            return resolve({
              data: { ...returnData, data: [...returnData.data, ...publicHolidays] }
            });
          }, 500)
        );
      }
    }),
    getRestClient: () => ({
      invokeRestApi: (
        action: string,
        props: {
          queryPayload: {
            data_view_ID: string;
          };
          body: {
            data: {
              StartTime: string;
              EndTime: string;
              pyGUID: string;
            };
          };
        }
      ) => {
        // eslint-disable-next-line no-console
        console.log('getRestClient->invokeRestApi', action, props);
        return new Promise(resolve => resolve({ success: true }));
      }
    })
  };
};

type Story = StoryObj<typeof PegaUidCalendar>;
export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              createWork: (className: string) => {
                // eslint-disable-next-line no-alert
                alert(`Create case type with className:${className}`);
              },
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              },
              showCasePreview: (eventId: string, options: { caseClassName: string }) => {
                const { caseClassName } = options;
                // eslint-disable-next-line no-alert
                alert(`Open Case (caseClassName: ${caseClassName}, eventId: ${eventId})`);
              }
            };
          },
          ignoreSuggestion: () => {
            /* nothing */
          },
          acceptSuggestion: () => {
            /* nothing */
          },
          setInheritedProps: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          }
        };
      }
    };
    return <PegaUidCalendar {...props} />;
  },
  args: {
    heading: 'Heading',
    createClassname: 'Work-Class1',
    createMassClassname: 'Work-Class2',
    interactionId: 'InteractionId',
    defaultViewMode: 'Monthly',
    nowIndicator: true,
    weekendIndicator: true,
    dataPage: ''
  }
};
