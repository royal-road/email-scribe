import React from "react";

export const RRLogo = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    className="rrLogo"
    ref={ref}
    id="Layer_2"
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300.95 316.58"
    fill="currentColor" // Add this line
    {...props}
  >
    <g id="Layer_1-2" data-name="Layer 1">
      <path d="m300.95,314.95c-15.83,2.01-33.65,2-49.59.9-7.71-.53-10.3-5.09-14.23-11.28-4.67-7.35-9.33-14.72-14.12-21.99-16.73-25.37-36.1-47.19-61.32-64.42-26.88-18.36-57.35-30.8-84.33-49.09-24.7-16.74-44.99-39.52-57.67-66.62-7.02-15-11.46-31.19-12.35-47.75-.5-9.19.38-18.18,2.11-27.2.89-4.63,1.95-9.23,2.97-13.84.88-3.98,1.08-10.51,3.63-13.66,8.9,24.34,19.68,47.08,36.38,67.17,17.37,20.89,39.54,34.05,61.76,49.05,24.95,16.84,49.24,34.8,72.57,53.83,21.45,17.5,39.19,38.61,55.28,61.03,19.75,27.51,41.7,54.71,58.92,83.88Z" />
      <path d="m213.72,177.84c.7-.59,1.14-1.15,1.71-1.42,19.1-8.84,25-25.85,26.94-44.79,1.57-15.36-.05-30.39-9.85-43.32-12.05-15.91-27.65-25.36-48.02-25.49-24.3-.16-48.6.05-72.9-.09-14.43-.08-28.86-1.18-41.56-8.82-11.75-7.07-19.55-17.46-21.95-31.3-.89-5.15.4-6.62,5.82-6.69,30.15-.38,60.31-1.36,90.44-.83,27.97.49,55.98,2.19,83.04,10.47,13.48,4.13,26.14,9.85,36.94,19.26,13.48,11.75,22.14,26.62,27.66,43.27,9.49,28.59,8.37,56.84-5.21,83.99-8.91,17.81-23.97,29.6-41.11,38.88-1.43.78-4.76.42-5.73-.69-8.77-10.02-17.21-20.33-25.71-30.57-.28-.34-.26-.94-.49-1.85Z" />
      <path d="m204.74,280.16c-12.76-4.57-25.14-10.16-38.33-13.45-12.45-3.1-25.13-5.35-37.74-7.68-23.67-4.37-51.52-6.12-72.83-18.07C15.77,218.49,2.76,167.84,0,125.57c12.98,16.39,24.72,32.69,40.89,46.25,16.05,13.46,34.1,24.22,52.96,33.24,21.87,10.46,45.36,18.72,66.35,30.88,16.97,9.82,35.74,26.45,44.54,44.23Z" />
      <path d="m63.06,255.94c29.78,7.33,60.05,12.53,89.69,20.48,27.17,7.29,57.4,14.74,76.94,36.05-15.29,2.14-32.28-1.54-47.69-2.51-16.41-1.04-32.96-.39-49.02-4.41-27.34-6.85-55.41-24.89-70.95-48.53.34-.36.69-.72,1.03-1.08Z" />
    </g>
  </svg>
));
