export type BreakpointScreenGroup = "desktop" | "tablet" | "mobile";

export type BreakpointTypes = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type BreakpointValidity = {
  position: number;
  valid: boolean;
};

export type BreakpointPosition = {
  below: boolean;
  equal: boolean;
  above: boolean;
};
