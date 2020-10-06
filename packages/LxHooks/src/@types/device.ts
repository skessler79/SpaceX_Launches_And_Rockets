export type DeviceConfig =
  | {
      width: number;
      height: number;
      breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    }
  | { [key: string]: any };
