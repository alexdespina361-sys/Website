import type { SVGProps } from "react";

type IconName =
  | "add"
  | "arrow-right"
  | "check-circle"
  | "close"
  | "delete"
  | "edit"
  | "globe"
  | "inventory"
  | "login"
  | "mail-check"
  | "minus"
  | "person"
  | "receipt"
  | "refresh"
  | "search"
  | "settings"
  | "share"
  | "shopping-bag"
  | "truck";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  name: IconName;
}

export default function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
}

const iconPaths: Record<IconName, JSX.Element> = {
  add: <path d="M12 5v14M5 12h14" />,
  "arrow-right": <path d="M5 12h14M13 5l7 7-7 7" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  delete: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M8 7v12m8-12v12M6 19h12" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="m12 6 4 4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  inventory: (
    <>
      <path d="M4 8h16l-2 11H6L4 8Z" />
      <path d="M8 8V6a4 4 0 1 1 8 0v2" />
    </>
  ),
  login: (
    <>
      <path d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" />
      <path d="M13 16l4-4-4-4" />
      <path d="M9 12h8" />
    </>
  ),
  "mail-check": (
    <>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.8-3.3 4.1-5 7-5s5.2 1.7 7 5" />
    </>
  ),
  receipt: (
    <>
      <path d="M7 4h10v16l-2-1.5L12 20l-3-1.5L7 20V4Z" />
      <path d="M9 9h6M9 13h6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M18 11a6.5 6.5 0 0 0-11-3L4 11" />
      <path d="M6 13a6.5 6.5 0 0 0 11 3l3-3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-1.7-1L14.5 3h-5L9.2 6a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1c.5.4 1.1.7 1.7 1l.3 3h5l.3-3c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="m8 11 8-5M8 13l8 5" />
    </>
  ),
  "shopping-bag": (
    <>
      <path d="M5 8h14l-1.2 11H6.2L5 8Z" />
      <path d="M9 8V7a3 3 0 1 1 6 0v1" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h3l3 3v2h-6" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
};
