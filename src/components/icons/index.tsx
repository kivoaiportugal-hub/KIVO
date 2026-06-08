interface IconProps {
  active?: boolean;
  className?: string;
  size?: number;
}

const ACTIVE = "#2CDF0C";
const INACTIVE = "#9CA3AF";

export function AssistantIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {active && (
        <rect x="1" y="1" width="22" height="22" rx="6" fill={ACTIVE} />
      )}
      <path
        d="M12 6C8.7 6 6 8.7 6 12s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 2c.8 0 1.5.2 2.1.5l-1 1.5c-.3-.1-.7-.2-1.1-.2s-.8.1-1.1.2l-1-1.5c.6-.3 1.3-.5 2.1-.5zm-3 3.5l1.5.8c-.1.3-.1.6-.1.9s0 .6.1.9l-1.5.8c-.5-.7-.8-1.5-.8-2.5s.3-1.8.8-2.5zm6 0c.5.7.8 1.5.8 2.5s-.3 1.8-.8 2.5l-1.5-.8c.1-.3.1-.6.1-.9s0-.6-.1-.9l1.5-.8zM12 16c-.8 0-1.5-.2-2.1-.5l1-1.5c.3.1.7.2 1.1.2s.8-.1 1.1-.2l1 1.5c-.6.3-1.3.5-2.1.5z"
        fill={active ? "#FFFFFF" : color}
      />
      {active && (
        <>
          <circle cx="8" cy="8" r="1" fill="#FFFFFF" opacity="0.6" />
          <circle cx="16" cy="8" r="1" fill="#FFFFFF" opacity="0.6" />
          <circle cx="18" cy="12" r="1" fill="#FFFFFF" opacity="0.6" />
          <circle cx="6" cy="12" r="1" fill="#FFFFFF" opacity="0.6" />
          <line x1="9" y1="8" x2="15" y2="8" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4" />
          <line x1="17" y1="9" x2="17" y2="11" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4" />
          <line x1="7" y1="9" x2="7" y2="11" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4" />
        </>
      )}
    </svg>
  );
}

export function PerformanceIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="14" width="4" height="7" rx="1" fill={color} />
      <rect x="10" y="8" width="4" height="13" rx="1" fill={color} />
      <rect x="17" y="3" width="4" height="18" rx="1" fill={color} />
    </svg>
  );
}

export function MenuIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.8" fill="none" />
      <rect x="5" y="8" width="6" height="3" rx="1" fill={color} opacity="0.3" />
      <line x1="13" y1="9" x2="19" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="12" x2="17" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="15" x2="19" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="18" x2="14" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PricingIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="2" width="18" height="20" rx="2" stroke={color} strokeWidth="1.8" fill="none" />
      <line x1="7" y1="7" x2="17" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="11" x2="14" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="15" x2="17" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="19" x2="11" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PromotionsIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 8L14 14L10 10L4 16V8H20Z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="7" r="2" fill={color} />
    </svg>
  );
}

export function ReviewsIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SettingsIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" fill="none" />
      <path
        d="M12 1L13.5 4.5L17 3.5L15.5 7L19 8L17 11L20 13L17 14L18.5 17.5L15 17L14 20.5L12 17.5L10 20.5L9 17L5.5 17.5L7 14L4 13L7 11L5 8L8.5 7L7 3.5L10.5 4.5L12 1Z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SupportIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 18V12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12V18"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="1" y="14" width="4" height="7" rx="2" fill={color} />
      <rect x="19" y="14" width="4" height="7" rx="2" fill={color} />
      <path
        d="M7 21H17C17 21 17 17 12 17C7 17 7 21 7 21Z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
    </svg>
  );
}

export function SearchIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" fill="none" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21S18 15 18 8Z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21A2 2 0 0110.27 21"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuMobileIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" stroke={INACTIVE} strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke={INACTIVE} strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" stroke={INACTIVE} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="6" y1="6" x2="18" y2="18" stroke={INACTIVE} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="6" x2="6" y2="18" stroke={INACTIVE} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ChatIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21 11.5C21 16.75 16.75 21 11.5 21C9.8 21 8.2 20.6 6.8 19.8L3 21L4.2 17.2C3.4 15.8 3 14.2 3 12.5C3 7.25 7.25 3 12.5 3C17.75 3 22 7.25 22 12.5L21 11.5Z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      <circle cx="8" cy="12" r="1" fill={color} />
      <circle cx="12" cy="12" r="1" fill={color} />
      <circle cx="16" cy="12" r="1" fill={color} />
    </svg>
  );
}

export function InsightsIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M12 3C12 3 8 9 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9 12 3 12 3Z" stroke={color} strokeWidth="1.5" fill={color} opacity="0.15" />
      <line x1="12" y1="3" x2="12" y2="16" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function ChevronIcon({ direction = "right", className, size = 16 }: { direction?: "left" | "right" | "up" | "down"; className?: string; size?: number }) {
  const rotation = { left: 180, right: 0, up: 90, down: 270 }[direction];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowUpIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDownIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5V19M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalLinkIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BillingIcon({ active, className, size = 24 }: IconProps) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8" fill="none" />
      <line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="1.8" />
      <rect x="5" y="14" width="6" height="2" rx="1" fill={color} opacity="0.4" />
    </svg>
  );
}
