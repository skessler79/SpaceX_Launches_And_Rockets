import { BreakpointScreenGroup, MenuItemOption } from "@lavax-ui/helpers";
import { ReactNode } from "react";
import { SiderProps } from "antd/lib/layout";
import { DrawerProps } from "antd/lib/drawer";

export type DashboardSidebarProps = {
  authUser?: any;
  theme?: "light" | "dark";
  title?: string;
  heading?: string | ReactNode;
  logo?: string;
  brand?: string;
  mode?: BreakpointScreenGroup;
  navlink?: string;
  sideMenus: MenuItemOption[];
  enableSider: boolean;
  siderWidth?: {
    min: number;
    max: number;
  };
  isSiderVisible: boolean;
  expandMenuOnStart?: boolean;
  propsForSider?: SiderProps; // AntD Component "Sider" props
  propsForDrawer?: DrawerProps; // AntD Component "Drawer" props
  onActionSignOut: () => void;
  onActionCloseDrawer: () => void;
};
