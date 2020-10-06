import { isNil } from "lodash";
import classnames from "classnames";
import React, { memo, useState, useEffect } from "react";
import { useBreakpoint } from "@lavax-ui/hooks";
import { getScreenMode } from "@lavax-ui/helpers";
import RouteIndicatorComponent from "../../RouteIndicator";
import SidebarView from "../Sidebar";
import HeaderView from "../Header";
import { DashboardPanelProps } from "./props";
import { Wrapper, LayoutWrapper, ContentWrapper, ContentInner } from "./styles";

// ======================= FUNCTIONAL COMPONENT
const PanelComponent: React.FC<DashboardPanelProps> = (props) => {
  const {
    children,
    navlink,
    indicatorColor,
    fixedHeader,
    config,
    siderWidth,
    enableSider,
    isSiderExpand,
    headerMenus,
    ...restProps
  } = props;
  const { title, logo, heading, authUser, onActionSignOut } = restProps;

  const { breakpoint } = useBreakpoint();
  const mode = getScreenMode(breakpoint);
  const hideLayout = !isNil(config) && config.shouldHideLayout;

  const isTablet = mode === "tablet";
  const isPhone = mode === "mobile";
  const isMobileDevice = isTablet || isPhone;

  const [enableSiderView, setShowSiderView] = useState<boolean>(enableSider);
  const [isSiderVisible, setIsSiderVisible] = useState<boolean>(isSiderExpand);

  useEffect(() => {
    if (enableSider) {
      setShowSiderView(!isMobileDevice);
    }
    // eslint-disable-next-line
  }, [mode]);

  // ======================= VARIABLES
  const newProps = {
    mode,
    ...restProps
  };

  // ============================ EVENTS
  const onActionToggleDrawer = () => {
    setIsSiderVisible(!isSiderVisible);
  };

  const onActionCloseDrawer = () => {
    setIsSiderVisible(false);
  };

  // ======================= VIEW
  const childrenWithProps = React.Children.map(children, (child: any) => {
    if (!child || typeof child === "boolean") {
      return null;
    }
    return React.cloneElement(child, newProps);
  });

  return (
    <>
      <RouteIndicatorComponent color={indicatorColor} />
      <Wrapper className="lx-dashboard">
        {hideLayout ? (
          childrenWithProps
        ) : (
          <LayoutWrapper
            className={classnames({
              "fixed-header": fixedHeader
            })}
            hasSider={enableSiderView}>
            <SidebarView
              {...newProps}
              navlink={navlink}
              siderWidth={siderWidth}
              enableSider={enableSiderView}
              isSiderVisible={isSiderVisible}
              onActionCloseDrawer={onActionCloseDrawer}
            />

            <ContentWrapper
              className={classnames("lx-dashboard-content-wrapper", {
                "fixed-header": fixedHeader,
                sider: enableSiderView,
                collapsed: !isSiderVisible
              })}
              $siderWidthMin={siderWidth?.min}
              $siderWidthMax={siderWidth?.max}>
              <HeaderView
                mode={mode}
                navlink={navlink}
                enableLogo
                logo={logo}
                title={title}
                heading={heading}
                authUser={authUser}
                menus={headerMenus}
                fixed={fixedHeader}
                siderWidth={siderWidth}
                enableSider={enableSiderView}
                isSiderVisible={isSiderVisible}
                onActionSignOut={onActionSignOut}
                onActionToggleDrawer={onActionToggleDrawer}
              />
              <ContentInner className="lx-dashboard-content-inner">
                {children}
              </ContentInner>
            </ContentWrapper>
          </LayoutWrapper>
        )}
      </Wrapper>
    </>
  );
};

PanelComponent.defaultProps = {
  theme: "light",
  title: "Lava X",
  indicatorColor: "#1890ff",
  heading: null,
  logo: null,
  sideMenus: [],
  headerMenus: [],
  fixedHeader: false,
  isSiderExpand: true,
  siderWidth: {
    min: 80,
    max: 256
  }
};

export const Panel = memo(PanelComponent);
export default Panel;
