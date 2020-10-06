import { AuthorizationTypes } from "./auth";
import { BreakpointTypes } from "./breakpoint";

export type MenuItemOption = {
  key: string;
  type?: "divider" | "menu";
  icon?: React.ReactNode;
  path?: string;
  title?: string | ((context: any) => string);
  tooltip?:
    | boolean
    | string
    | { [key: string]: any }
    | ((context: any) => { [key: string]: any });
  includes?: string[];
  onActionClick?: (
    event: React.MouseEvent<HTMLButtonElement> | any,
    context: any
  ) => void;
  submenu?: MenuItemOption[];
  authentication?: boolean;
  authorization?: AuthorizationTypes;
  breakpoints?: BreakpointTypes | BreakpointTypes[];
};
