import React, { memo, ReactNode } from "react";
import { Menu, Tooltip } from "antd";
import { isFunction, isEmpty, map } from "lodash";
import { MenuProps } from "antd/lib/menu";
import {
  isAuthorised,
  getPathOptions,
  getTitleString,
  getTooltipOptions,
  shouldBreakpointViewable,
  MenuItemOption
} from "@lavax-ui/helpers";
import { CloneElement } from "@lavax-ui/components";
import { useBreakpoint } from "@lavax-ui/hooks";
import { NavLink } from "../NavLink";
import { Props } from "./props";

const { SubMenu } = Menu;

const NavMenuComponent: React.FC<Props & MenuProps> = (props) => {
  const { authUser, menus, context, ...restProps } = props;

  // ============================ HOOKS
  const { breakpoint } = useBreakpoint();

  // ============================ ICON VIEW
  const renderIcon = (icon: ReactNode, padding: boolean): ReactNode => {
    if (!icon) return <></>;
    if (!padding) return icon;
    return <CloneElement style={{ marginRight: 5 }}>{icon}</CloneElement>;
  };

  // ============================ TOOLTIPS VIEW
  const renderTooltipView = (
    menuitem: MenuItemOption,
    innerView: ReactNode
  ): ReactNode => {
    const tooltipOptions = getTooltipOptions(menuitem);
    if (isEmpty(tooltipOptions)) return innerView;
    return (
      <Tooltip title={tooltipOptions.tooltip}>
        <a href="#">{innerView}</a>
      </Tooltip>
    );
  };

  // ============================ MENU VIEW
  const renderMenuItemView = (
    menuitem: MenuItemOption,
    index: number
  ): ReactNode => {
    const {
      key,
      icon,
      title,
      path,
      breakpoints,
      authorization,
      authentication,
      onActionClick
    } = menuitem;

    const authorised = isAuthorised(authUser, {
      authorization,
      authentication
    });
    const isViewable = shouldBreakpointViewable(breakpoints, breakpoint);
    if (!authorised || !isViewable) return null;

    const titleStr = getTitleString(title, props);
    const linkOptions = getPathOptions(path);
    const tooltipOptions = getTooltipOptions(menuitem);
    const innerView = (
      <>
        {renderIcon(icon, !!title)}
        <span>{titleStr}</span>
      </>
    );

    if (isEmpty(linkOptions)) {
      return (
        <Menu.Item
          key={key || index}
          onClick={(e) => {
            if (onActionClick)
              onActionClick(e, { authUser, ...menuitem, ...context });
          }}>
          {renderTooltipView(menuitem, innerView)}
        </Menu.Item>
      );
    }

    return (
      <Menu.Item key={key || index}>
        <NavLink link={linkOptions?.link} tooltip={tooltipOptions}>
          {innerView}
        </NavLink>
      </Menu.Item>
    );
  };

  const renderSubMenuView = (
    menuitem: MenuItemOption,
    index: number
  ): ReactNode => {
    const { key, icon, title, submenu } = menuitem;
    const titleStr = getTitleString(title, props);
    if (!submenu || (!!submenu && submenu.length === 0)) {
      return renderMenuItemView(menuitem, index);
    }
    return (
      <SubMenu
        key={key}
        title={
          isFunction(title) ? (
            title(props)
          ) : (
            <span>
              {renderIcon(icon, !!title)}
              <span>{titleStr}</span>
            </span>
          )
        }>
        {map(submenu, (item, i) => renderSubMenuView(item, i))}
      </SubMenu>
    );
  };

  // ============================ VIEW
  return (
    <Menu {...restProps}>
      {map(menus, (e, index) => renderSubMenuView(e, index))}
    </Menu>
  );
};

export const NavMenu = memo(NavMenuComponent);

export default NavMenu;
