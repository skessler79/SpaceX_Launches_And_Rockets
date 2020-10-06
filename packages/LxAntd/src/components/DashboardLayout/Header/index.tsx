import React, { memo, Fragment, ReactNode } from "react";
import classnames from "classnames";
import { MenuOutlined } from "@ant-design/icons";
import { isString, isArray, map } from "lodash";
import { useBreakpoint } from "@lavax-ui/hooks";
import {
  getPathOptions,
  getTitleString,
  getTooltipOptions,
  shouldBreakpointViewable,
  MenuItemOption
} from "@lavax-ui/helpers";
import { AuthorisedView, CloneElement } from "@lavax-ui/components";
import { NavMenu } from "../../NavMenu";
import { DashboardHeaderProps } from "./props";
import {
  HeaderWrapper,
  HeaderLogoLink,
  HeadingTextView,
  HeaderButtonTrigger,
  HeaderActionWrapper,
  HeaderActionDropdown,
  HeaderActionLink
} from "./styles";

const HeaderComponent: React.FC<DashboardHeaderProps> = (props) => {
  // ========================= VARIABLES
  const {
    mode,
    title,
    heading,
    logo,
    menus,
    fixed,
    navlink,
    authUser,
    enableLogo,
    enableSider,
    siderWidth,
    isSiderVisible,
    onActionToggleDrawer,
    onActionSignOut
  } = props;

  // ========================= HOOKS
  const { breakpoint } = useBreakpoint();

  // ============================ MENU VIEW
  const renderIcon = (icon: ReactNode, padding: boolean): ReactNode => {
    if (!icon) return <></>;
    if (!padding) return icon;
    return <CloneElement style={{ marginRight: 5 }}>{icon}</CloneElement>;
  };

  const renderMenuView = (menu: MenuItemOption): ReactNode => {
    const {
      icon,
      path,
      submenu,
      authorization,
      authentication,
      breakpoints
    } = menu;
    const isViewable = shouldBreakpointViewable(breakpoints, breakpoint);
    if (!isViewable) return <></>;

    const titleStr = getTitleString(menu.title, props);
    if (submenu && isArray(submenu)) {
      return (
        <AuthorisedView
          authUser={authUser}
          authentication={authentication}
          authorization={authorization}>
          <HeaderActionDropdown
            trigger={["click"]}
            className="header-action"
            overlay={
              <NavMenu
                menus={menu.submenu}
                authUser={authUser}
                context={{
                  onActionSignOut
                }}
              />
            }
            placement="bottomRight">
            <a className="ant-dropdown-link" href="#">
              {renderIcon(icon, !!title)}
              {title && <span>{titleStr}</span>}
            </a>
          </HeaderActionDropdown>
        </AuthorisedView>
      );
    }
    const linkOptions = getPathOptions(path);
    const tooltipOptions = getTooltipOptions(menu);
    return (
      <AuthorisedView
        authUser={authUser}
        authentication={authentication}
        authorization={authorization}>
        <HeaderActionLink
          className="header-action"
          link={linkOptions?.link}
          tooltip={tooltipOptions}>
          {renderIcon(icon, !!title)}
          {title && <span>{titleStr}</span>}
        </HeaderActionLink>
      </AuthorisedView>
    );
  };

  // ============================ HEADER VIEW
  return (
    <HeaderWrapper
      className={classnames({
        fixed
      })}
      $fixed={fixed}
      $enableSider={enableSider}
      $siderWidthMin={siderWidth.min}
      $siderWidthMax={siderWidth.max}
      $isSiderVisible={isSiderVisible}>
      {/* LOGO */}
      {mode === "mobile" && enableLogo && logo && (
        <HeaderLogoLink href={navlink || "/"}>
          {isString(logo) ? (
            <img src={logo} alt={title || "Panel"} width="32" height="32" />
          ) : (
            logo
          )}
        </HeaderLogoLink>
      )}
      {/* TOGGLE MENU BUTTON */}
      <HeaderButtonTrigger type="link" onClick={onActionToggleDrawer}>
        <MenuOutlined />
      </HeaderButtonTrigger>

      {/* HEADING TEXT */}
      {!!heading && <HeadingTextView>{heading}</HeadingTextView>}

      {/* ACTION WRAPPER */}
      {menus && menus.length > 0 && (
        <HeaderActionWrapper>
          {map(menus, (e, i) => (
            <Fragment key={i}>{renderMenuView(e)}</Fragment>
          ))}
        </HeaderActionWrapper>
      )}
    </HeaderWrapper>
  );
};

HeaderComponent.defaultProps = {
  heading: null,
  fixed: false,
  menus: [],
  navlink: "/",
  enableLogo: false,
  enableSider: false,
  isSiderVisible: false,
  siderWidth: {
    min: 80,
    max: 256
  }
};

export const Header = memo(HeaderComponent);

export default Header;
