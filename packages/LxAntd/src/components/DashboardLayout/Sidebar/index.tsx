import map from "lodash/map";
import React, { memo, useState, useEffect, ReactNode } from "react";
import Router, { useRouter } from "next/router";
import { getMenuKeysByPath, getExpandableMenuKeys } from "@lavax-ui/helpers";
import { NavLink } from "../../NavLink";
import { NavMenu } from "../../NavMenu";
import { DashboardSidebarProps } from "./props";
import {
  DrawerWrapper,
  SiderWrapper,
  MenuWrapper,
  LogoWrapper,
  TitleTextView
} from "./styles";

const SidebarComponent: React.FC<DashboardSidebarProps> = (props) => {
  const {
    theme,
    mode,
    logo,
    navlink,
    brand,
    title,
    authUser,
    sideMenus,
    siderWidth,
    propsForSider,
    propsForDrawer,
    enableSider,
    isSiderVisible,
    expandMenuOnStart,
    onActionCloseDrawer
  } = props;

  // ============================ HOOKS
  const router = useRouter();

  // ============================ VARIABLES
  const isTablet = mode === "tablet";
  const isPhone = mode === "mobile";
  const isMobileDevice = isTablet || isPhone;

  const hasBranding = !!brand;
  const hasAnyBranding = !!brand || !!logo;
  const hasNoBranding = !logo && !brand;
  const shouldShowBranding = !isPhone && hasBranding ? brand || logo : logo;

  const { openKeys, selectedKeys } = getMenuKeysByPath(
    sideMenus,
    router && router.pathname
  );

  // ============================ STATE
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>(
    !expandMenuOnStart ? openKeys : getExpandableMenuKeys(sideMenus)
  );
  const [menuSelectedKeys, setMenuSelectedKeys] = useState<string[]>(
    selectedKeys
  );

  // ============================ EFFECTS
  useEffect(() => {
    // set current viewing path menu when sider is visible
    if (isSiderVisible && !expandMenuOnStart) {
      setMenuOpenKeys(openKeys);
    }
    // eslint-disable-next-line
  }, [isSiderVisible]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const menuKeys = getMenuKeysByPath(sideMenus, url);
      const newMenuOpenKeys = menuKeys.openKeys.filter(
        (key) => menuOpenKeys.indexOf(key) !== 1
      );
      setMenuOpenKeys([...menuOpenKeys, ...newMenuOpenKeys]);
      setMenuSelectedKeys(menuKeys.selectedKeys);

      // collapse drawer, whenver route change
      if (isMobileDevice) {
        onActionCloseDrawer();
      }
    };

    Router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      Router.events.off("routeChangeStart", handleRouteChange);
    };
  });

  // ============================ EVENTS
  const onActionOpenMenu = (openingKeys: string[]): void => {
    const latestOpenKey = openingKeys.find(
      (key) => openingKeys.indexOf(key) === -1
    );
    const submenuKeys = map(sideMenus, (e) => e.key);
    if (submenuKeys.indexOf(latestOpenKey) === -1) {
      setMenuOpenKeys(openingKeys);
    } else {
      setMenuOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  // ============================ MENU VIEW
  const renderMenuView = (): ReactNode => {
    return (
      <MenuWrapper className="lx-dashboard-menu">
        {(logo || brand) && (
          <LogoWrapper $hasBranding={hasAnyBranding}>
            <NavLink link={navlink || "/"}>
              <img
                alt={title}
                src={
                  isMobileDevice || (shouldShowBranding && isSiderVisible)
                    ? brand || logo
                    : logo
                }
              />
              {hasNoBranding && (
                <TitleTextView>{title || "Lava X"}</TitleTextView>
              )}
            </NavLink>
          </LogoWrapper>
        )}
        <NavMenu
          mode="inline"
          className="lx-dashboard-menu-list"
          theme={theme}
          defaultOpenKeys={isSiderVisible ? menuOpenKeys : []}
          defaultSelectedKeys={selectedKeys}
          selectedKeys={menuSelectedKeys}
          openKeys={isSiderVisible ? menuOpenKeys : []}
          onOpenChange={onActionOpenMenu}
          authUser={authUser}
          menus={sideMenus}
        />
      </MenuWrapper>
    );
  };

  // ============================ SIDEBAR VIEW
  return (
    <>
      {enableSider && (
        <SiderWrapper
          theme={theme}
          width={siderWidth.max}
          collapsedWidth={siderWidth.min}
          {...propsForSider}
          trigger={null}
          collapsible
          collapsed={!isSiderVisible}>
          {renderMenuView()}
        </SiderWrapper>
      )}
      {!enableSider && (
        <DrawerWrapper
          placement="left"
          {...propsForDrawer}
          className="lx-drawer-wrapper"
          width={siderWidth.max}
          closable={false}
          onClose={onActionCloseDrawer}
          visible={isSiderVisible}>
          {renderMenuView()}
        </DrawerWrapper>
      )}
    </>
  );
};

SidebarComponent.defaultProps = {
  theme: "light",
  title: "Lava X",
  navlink: "/",
  heading: null,
  logo: null,
  brand: null,
  sideMenus: [],
  propsForSider: {},
  propsForDrawer: {},
  siderWidth: {
    min: 80,
    max: 256
  },
  expandMenuOnStart: false
};

export const Sidebar = memo(SidebarComponent);

export default Sidebar;
