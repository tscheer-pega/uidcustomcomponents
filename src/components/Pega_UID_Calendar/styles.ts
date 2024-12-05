import styled, { css } from 'styled-components';

// export const GlobalStyles = createGlobalStyle`
// html {
// --fc-button-active-bg-color: red !important; //${theme.base.palette['brand-primary']};
// }`;
import { type themeDefinition } from '@pega/cosmos-react-core';

export default styled.div(({ theme }: { theme: typeof themeDefinition }): any => {
  return css`
    .fc-event-main {
      cursor: pointer;
    }
    // Custom button styles
    .fc .fc-button {
      border-radius: ${theme.components.button['border-radius']}px;
      color: ${theme.base.palette['brand-primary']};
    }
    .fc-direction-ltr .fc-button-group > .fc-button:not(:last-child) {
      border-bottom-right-radius: 0px;
      border-top-right-radius: 0px;
    }
    .fc .fc-button-primary:hover {
      color: ${theme.base.palette['primary-background']};
    }
    .fc .fc-button-primary:disabled {
      opacity: 0.4;
    }
    .fc-timegrid-col-events .fc-event:hover {
      border-color: black;
      opacity: 0.6;
    }
    .fc-timegrid-col-events .fc-event:hover .event-content {
      opacity: 1;
    }
    .fc .fc-timegrid-axis-cushion {
      max-width: 80px;
    }
    // Custom event styles
    .event-label {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .event-content.availability {
      display: flex;
      width: 25%;
      height: 100%;
      position: relative;
    }
    .event-content {
      padding: 0.25rem;
    }
    .event-content.Sammel,
    .event-content.Verfügbar.Online,
    .event-content.Verfügbar.Telefon {
      color: #333;
    }
    .event-content.availability > span {
      display: block;
      margin: 0.25rem auto;
    }
    .event-content svg {
      height: 14px;
      width: 14px;
      margin-right: 0.25rem;
    }
    .event-content .event-subject {
      margin-top: 0.5rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: -webkit-fill-available;
      line-height: normal;
      font-size: max(0.6rem, 8px);
    }
    .event-content .event-label + svg {
      margin: 0 4px 0.25rem 0;
    }

    .event-popover .event-subject {
      width: max-content;
    }

    .event-popover .event-indicator {
      height: 15px;
      width: 15px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
    }

    .event-popover hr.solid {
      border-top: 0 solid ${theme.base.colors.gray.light};
    }
    .event-popover .icon {
      fill: ${theme.base.colors.gray.dark};
    }
    .loading-indicator {
      flex: 1;
      display: flex;
      position: absolute;
      height: 100%;
      width: 100%;
    }
    .loading-indicator > p {
      margin: 16rem auto;
    }
    .loading-indicator > p > span {
      background-color: white;
      border: 1px solid lightgrey;
      border-radius: 0.5rem;
      padding: 0.5rem;
      box-shadow: 2px 3px 6px lightgrey;
    }
    .public-holiday-text {
      max-width: 300px;
    }
    .card-header-action-container {
      display: flex;
    }
    .h-spacer {
      width: 8px;
    }
    .legend {
      margin: 4px auto;
    }
    .legend .legend-item {
      margin-left: 4px;
    }
    .event-indicator {
      height: 16px;
      width: 16px;
      background-color: #bbb;
      border-radius: 2px;
      border: 1px solid #bbb;
      display: inline-block;
    }
    .date-select {
      margin-right: 8px;
    }
    .date-select > div {
      margin-right: 4px;
    }
  `;
});
