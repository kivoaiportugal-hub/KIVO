import type { CSSProperties } from "react";

type IconProps = {
  name:
    | "arrow"
    | "bot"
    | "chart"
    | "check"
    | "chevron"
    | "close"
    | "message"
    | "shield"
    | "spark"
    | "star"
    | "trend"
    | "utensils"
    | "zap";
  size?: number;
};

export function Icon({ name, size = 20 }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`ui-icon icon-${name}`}
      style={{ "--icon-size": `${size}px` } as CSSProperties}
    />
  );
}
