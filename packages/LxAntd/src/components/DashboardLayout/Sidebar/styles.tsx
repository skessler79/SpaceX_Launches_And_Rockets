import styled from "styled-components";
import { Layout, Drawer, Typography } from "antd";

const { Sider } = Layout;

export const DrawerWrapper = styled(Drawer)`
  z-index: 1052;

  .ant-drawer-body {
    padding: 0 !important;
  }
`;

export const SiderWrapper = styled(Sider)`
  overflow: auto;
  min-height: 100vh;
  position: fixed;
  left: 0;
  box-shadow: 0 10px 10px rgba(0, 21, 41, 0.28);
  z-index: 10;

  .ant-menu {
    max-width: 100%;
  }

  &.ant-layout-sider-collapsed {
    .ant-menu-item.ant-menu-item-selected::after {
      opacity: 1;
      transform: scaleY(1);
    }
  }
`;

export const TitleTextView = styled(Typography)`
  display: inline-block;
  margin: 0 0 0 12px;
  font-weight: 600;
  font-size: 20px;
  vertical-align: middle;
`;

type LogoTylesProps = {
  $hasBranding: boolean;
};

export const LogoWrapper = styled.div<LogoTylesProps>`
  position: relative;
  height: 64px;
  overflow: hidden;
  line-height: 64px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
  text-align: ${(props) => (props.$hasBranding ? "center" : "left")};
  img {
    display: inline-block;
    max-height: 32px;
    max-width: 200px;
    vertical-align: middle;
    width: auto;
    object-fit: contain;
  }
`;

export const MenuWrapper = styled.div`
  overflow: scroll;
  height: 100vh;

  .lx-dashboard-menu-list {
    min-height: calc(100vh - 64px);
  }
`;
