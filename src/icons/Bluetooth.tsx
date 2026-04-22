import { SVGProps } from 'react';

export default function Bluetooth(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      role="img"
      color="rgb(74, 85, 101)"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.25 7.5l5.454 4.5m0 0l5.246 3.982a.65.65 0 0 1 0 1.036l-4.202 3.19a.65.65 0 0 1-1.043-.517V4.31a.65.65 0 0 1 1.043-.518l4.202 3.19a.65.65 0 0 1 0 1.036zm0 0L6.25 16.5"
      />
    </svg>
  );
}
