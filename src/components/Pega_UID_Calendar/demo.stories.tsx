import type { ComponentMeta, ComponentStory } from '@storybook/react';
import PegaUidCalendar from './index';
import exampleData from './exampleData.stories.json';
import exampleTimelineResources from './exampleTimelineResources.stories.json';
import exampleTimelineData from './exampleTimelineData.stories.json';
import publicHolidays from './publicHolidays.stories.json';

const defaultProps = {
  getPConnect: () => {
    return {
      getActionsApi: () => {
        return {
          openWorkByHandle: () => {
            /* nothing */
          },
          createWork: (className: string, params: object) => {
            // eslint-disable-next-line no-alert
            alert(`Create case type with className: ${className} (${JSON.stringify(params)})`);
            // eslint-disable-next-line no-console
            console.log(className, params);
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
            // eslint-disable-next-line no-console
            console.log(eventId, options);
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

export default {
  title: 'Widgets/Calendar',
  args: {
    heading: 'Heading',
    createClassname: 'Work-Class1',
    createMassClassname: 'Work-Class2',
    defaultViewMode: 'Monthly',
    nowIndicator: true,
    weekendIndicator: true,
    showTimeline: false,
    dataPage: '',
    dataPageResources: '',
    getPConnect: defaultProps.getPConnect
  },
  argTypes: {
    dataPage: {
      table: {
        disable: true
      }
    },
    dataPageResources: {
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
} as ComponentMeta<typeof PegaUidCalendar>;

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
        props: {
          dataViewParameters: {
            StartDate: string;
            EndDate: string;
            ShowTimeline: boolean;
            BeraterID: string;
            OrgID: string;
          };
        }
      ) => {
        // eslint-disable-next-line no-console
        console.log('Passed properties', dataViewName, props);
        return new Promise(resolve =>
          setTimeout(() => {
            let returnData;

            switch (dataViewName) {
              // Timeline: Resources
              case 'D_OrganisationeinheitListForCurrentOperator': {
                returnData = exampleTimelineResources;
                break;
              }
              case 'D_TimeSlotListForOrg': {
                returnData = exampleTimelineData;
                break;
              }
              // Timeline: Data
              // Usual Calendar
              case '':
              default: {
                returnData = { ...exampleData, data: [...exampleData.data, ...publicHolidays] };
              }
            }
            if (
              dataViewName === 'D_TimeSlotListForOrg' &&
              (props.dataViewParameters.BeraterID !== 'Tobias.Scheer.ext@bwi.de' ||
                props.dataViewParameters.OrgID !== 'Karlsruhe')
            ) {
              return resolve({
                data: {
                  fetchDateTime: '2025-02-24T13:42:16.433Z',
                  pxObjClass: 'Pega-API-DataExploration-Data',
                  resultCount: 0,
                  data: null
                }
              });
            }
            return resolve({
              data: {
                ...returnData
              }
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

const Template: ComponentStory<typeof PegaUidCalendar> = args => {
  setPCore();
  return <PegaUidCalendar {...args} />;
};

export const baseCalendar = Template.bind({});
baseCalendar.args = {
  ...Template.args,
  interactionId: 'InteractionId',
  showTimeline: false,
  readOnlyAccess: false,
  defaultViewMode: 'Monthly'
};

export const timelineCalendar = Template.bind({});
timelineCalendar.args = {
  ...Template.args,
  interactionId: 'InteractionId',
  showTimeline: true,
  readOnlyAccess: false,
  dataPage: 'D_TimeSlotListForOrg',
  dataPageResources: 'D_OrganisationeinheitListForCurrentOperator',
  defaultViewMode: 'Weekly'
};
