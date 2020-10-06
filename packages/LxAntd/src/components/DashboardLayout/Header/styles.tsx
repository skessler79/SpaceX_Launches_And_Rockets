import React from "react";
import styled, { css } from "styled-components";
import { Layout, Button as AntButton, Dropdown } from "antd";
import { ButtonProps } from "antd/lib/button";
import { DropDownProps } from "antd/lib/dropdown";
import { NavLink } from "../../NavLink";

const { Header } = Layout;

type HeaderStyleProps = {
  $fixed: boolean;
  $enableSider: boolean;
  $isSiderVisible: boolean;
  $siderWidthMin: number;
  $siderWidthMax: number;
};

export const HeaderWrapper = styled(Header)<HeaderStyleProps>`
  line-height: 64px;
  position: relative;
  height: 64px;
  padding: 0;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: width 0.2s;
  width: ${(props: HeaderStyleProps) => {
    const minWidth = props?.$siderWidthMin || 80;
    const maxWidth = props?.$siderWidthMax || 256;
    return props.$enableSider && props.$fixed
      ? `calc(100% - ${props.$isSiderVisible ? maxWidth : minWidth}px)`
      : "100%";
  }};

  &.fixed {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
  }
`;

export const HeaderLogoLink = styled.a`
  display: inline-block;
  height: 64px;
  padding: 0 0 0 24px;
  font-size: 20px;
  line-height: 64px;
  vertical-align: top;
  cursor: pointer;
`;

export const HeadingTextView = styled.span`
  font-size: 18px;
  font-weight: 500;
  display: none;

  @media only screen and (min-width: 576px) {
    display: inline-block;
  }
`;

export const HeaderButtonTrigger: React.FunctionComponent<ButtonProps> = styled(
  AntButton
)`
  height: 64px;
  padding: 21px 24px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1;
`;

export const HeaderActionWrapper = styled.div`
  float: right;
  height: 64px;
  margin-left: auto;
  overflow: hidden;
`;

const HeaderActionStyles = css`
  color: rgba(0, 0, 0, 0.65);

  &:hover {
    color: rgba(0, 0, 0, 0.85);
    background: rgba(0, 0, 0, 0.025);
  }
`;

export const HeaderActionDropdown: React.FunctionComponent<DropDownProps> = styled(
  Dropdown
)`
  display: inline-block;
  height: 100%;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
  .opened {
    background: rgba(0, 0, 0, 0.025);
  }

  ${HeaderActionStyles}
`;

export const HeaderActionLink = styled(NavLink)`
  display: inline-block;
  height: 100%;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.3s;

  ${HeaderActionStyles}
`;
