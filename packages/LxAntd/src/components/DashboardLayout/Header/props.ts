import { MenuItemOption, BreakpointScreenGroup } from "@lavax-ui/helpers";
import { ReactNode } from "react";

export type DashboardHeaderProps = {
  authUser?: any;
  mode: BreakpointScreenGroup;
  title?: string;
  fixed?: boolean;
  heading?: string | ReactNode;
  logo?: string | ReactNode;
  navlink?: string;
  enableLogo?: boolean;
  enableSider?: boolean;
  isSiderVisible?: boolean;
  menus: MenuItemOption[];
  siderWidth?: {
    min: number;
    max: number;
  };
  onActionSignOut?: () => void;
  onActionToggleDrawer?: () => void;
};
