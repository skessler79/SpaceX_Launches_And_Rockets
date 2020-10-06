import { ReactNode } from "react";
import { DrawerProps } from "antd/lib/drawer";
import { SiderProps } from "antd/lib/layout";
import { MenuItemOption } from "@lavax-ui/helpers";

type PanelProps = {
  children?: ReactNode;
  config?: {
    shouldHideLayout: boolean;
  };
  authUser?: any;
  theme?: "light" | "dark";
  title?: string;
  heading?: string | ReactNode;
  logo?: string;
  brand?: string;
  navlink?: string;
  indicatorColor?: string;
  sideMenus: MenuItemOption[];
  headerMenus: MenuItemOption[];
  fixedHeader: boolean;
  enableSider: boolean;
  isSiderExpand?: boolean;
  siderWidth?: {
    min: number;
    max: number;
  };
  propsForSider?: SiderProps; // AntD Component "Sider" props
  propsForDrawer?: DrawerProps; // AntD Component "Drawer" propss
  onActionSignOut: () => void;
};

export type DashboardPanelProps = PanelProps;
