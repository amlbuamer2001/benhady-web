import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

// NOTE: placeholders – swap for the original Figma SVGs when exported.
export const EyeIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const EyeOffIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 3l18 18" /><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.3 6.4A17 17 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4.2-.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
);
export const CalendarIcon = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
);
export const ArrowIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 12h16M14 6l6 6-6 6" /></svg>
);
export const MailIcon = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
);
export const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const PhoneIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
);
export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={3} {...p}><path d="m5 12.5 4.5 4.5L19 7.500" /></svg>
);
export const SaudiFlag = (p: IconProps) => (
  <svg width="28" height="19" viewBox="0 0 28 19" aria-hidden {...p}>
    <rect width="28" height="19" rx="3" fill="#006C35" />
    <rect x="7" y="12" width="14" height="1.6" rx=".8" fill="#fff" />
    <rect x="9" y="6" width="10" height="2" rx="1" fill="#fff" opacity=".9" />
  </svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="m6 9 6 6 6-6" /></svg>
);
export const BellIcon = (p: IconProps) => (
  <svg {...base} width={20} height={20} {...p}><path d="M6 9a6 6 0 1 1 12 0c0 4.500 2 6 2 6H4s2-1.500 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>
);
export const GlobeIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.500" /></svg>
);
export const HomeIcon = (p: IconProps) => (
  <svg {...base} width={22} height={22} {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>
);
export const CarIcon = (p: IconProps) => (
  <svg {...base} width={22} height={22} {...p}><path d="M5 17H3v-5l2-5h14l2 5v5h-2" /><path d="M3 12h18" /><circle cx="7.500" cy="17" r="2" /><circle cx="16.500" cy="17" r="2" /><path d="M9.500 17h5" /></svg>
);
export const TicketIcon = (p: IconProps) => (
  <svg {...base} width={22} height={22} {...p}><path d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" transform="translate(0 1)" /><path d="M14 5v14" strokeDasharray="2 2" /></svg>
);
export const UserIcon = (p: IconProps) => (
  <svg {...base} width={22} height={22} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const GridIcon = (p: IconProps) => (
  <svg {...base} width={22} height={22} {...p}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>
);
export const InfoIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);
export const HelpIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M9.500 9a2.500 2.500 0 1 1 3.500 2.300c-.6.3-1 .9-1 1.600v.6M12 17h.01" /></svg>
);
export const ChatIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M21 12a8 8 0 0 1-11.600 7.100L4 20l1-4.600A8 8 0 1 1 21 12Z" /></svg>
);
export const LogoutIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h10" /></svg>
);
export const ChevronEndIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2.2} {...p} className={`rtl:-scale-x-100 ${p.className ?? ""}`}><path d="m9 6 6 6-6 6" /></svg>
);
export const IdCardIcon = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.500" /><circle cx="9" cy="11" r="2" /><path d="M6 16a3 3 0 0 1 6 0M15 10h3M15 13h3" /></svg>
);
export const LockIcon = (p: IconProps) => (
  <svg {...base} {...p}><rect x="4" y="10" width="16" height="11" rx="2.500" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
);
export const TrashIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
);
export const SteeringIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" /><path d="M3.500 10h6M14.500 10h6M12 14v7" /></svg>
);
