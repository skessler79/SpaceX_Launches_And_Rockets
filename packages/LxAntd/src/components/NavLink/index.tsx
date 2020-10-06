import { isBoolean, isString, isNil } from "lodash";
import React, { ReactNode } from "react";
import Link from "next/link";
import { Tooltip } from "antd";
import { TooltipPropsWithTitle } from "antd/lib/tooltip";

type NavLinkProps = {
  link: string;
  external?: boolean;
  linkAlias?: string;
  method?: "replace" | "external" | "push";
  tooltip?: boolean | string | ReactNode | TooltipPropsWithTitle;
};

type NavLinkExternalProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler;
};

const NavLinkComponent: React.FC<
  NavLinkProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const {
    link,
    method,
    external,
    className,
    linkAlias,
    tooltip,
    children
  } = props;

  // ================= HELPERS
  const prepareExternalProps = (): NavLinkExternalProps => {
    const externalProps: NavLinkExternalProps = { href: "#" };

    // if contain onClick event
    if (props.onClick) {
      externalProps.onClick = props.onClick;
    }
    // if is external link then open new tab
    if (external) {
      externalProps.href = link;
      externalProps.target = "_blank";
    }
    return externalProps;
  };

  const prepareTooltipProps = (): any => {
    if (isNil(tooltip)) {
      return null;
    }
    if (React.isValidElement(tooltip) || isString(tooltip)) {
      return { title: tooltip };
    }
    if (isBoolean(tooltip)) {
      return { title: linkAlias || link || "#" };
    }
    return tooltip;
  };

  // ================= VIEW
  const externalProps = prepareExternalProps();
  const tooltipProps = prepareTooltipProps();
  const hasTooltip = !isNil(tooltipProps);
  const view = (
    <a className={className} {...externalProps}>
      {children}
    </a>
  );

  // if link is undefined or if is external link just render view
  if (external) {
    return !hasTooltip ? view : <Tooltip {...tooltipProps}>{view}</Tooltip>;
  }

  if (hasTooltip) {
    return (
      <Link href={link} replace={method === "replace"}>
        <Tooltip {...tooltipProps}>{view}</Tooltip>
      </Link>
    );
  }

  // render nextjs link
  return (
    <Link href={link} replace={method === "replace"}>
      {view}
    </Link>
  );
};

NavLinkComponent.defaultProps = {
  method: "push",
  external: false
};

export const NavLink = NavLinkComponent;
export default NavLink;
