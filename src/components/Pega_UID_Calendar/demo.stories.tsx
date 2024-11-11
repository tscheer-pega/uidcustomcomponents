import type { StoryObj } from '@storybook/react';
import PegaUidCalendar from './index';
import { getData } from './helpers';
import exampleData from './exampleData.json';

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
      getData: (dataViewName: string, props: { StartDate: string; EndDate: string }) => {
        // eslint-disable-next-line no-console
        console.log('Passed properties', props);
        return new Promise(resolve =>
          setTimeout(() => {
            const useGenericData = false;
            const data = getData(props);
            // eslint-disable-next-line no-console
            console.log(
              'useGenericData',
              useGenericData,
              'Generic Data',
              data,
              'Example Data',
              exampleData
            );
            return resolve({
              data: useGenericData ? data : exampleData
            });
          }, 500)
        );
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
    defaultViewMode: 'Monthly',
    nowIndicator: true,
    weekendIndicator: true,
    dataPage: ''
  }
};
