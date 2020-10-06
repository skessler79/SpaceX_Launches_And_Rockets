import styled from "styled-components";
import { Layout } from "antd";

type ContentWrapperProps = {
  $siderWidthMin?: number;
  $siderWidthMax?: number;
};

export const Wrapper = styled.div`
  min-height: 100vh;
  background: #f0f2f5;

  .lx-layout-content-wrapper {
    transition: all 0.2s;
    position: relative;

    .lx-layout-content {
      position: relative;
      transition: all 0.2s;

      .layout-wrap-content {
        margin-top: 24px;
      }
    }

    @media only screen and (min-width: 768px) {
      .lx-layout-content-wrapper {
        .lx-layout-content {
          margin: 24px;

          .layout-shrink-wrap {
            margin: -24px -24px 0;
          }

          .layout-shrink-wrap-content {
            margin-left: -24px;
            margin-right: -24px;
          }
        }
      }
    }
  }
`;

export const LayoutWrapper = styled(Layout)`
  min-height: 100vh;
`;

export const ContentWrapper = styled(Layout.Content)<ContentWrapperProps>`
  &.fixed-header {
    margin-top: 64px !important;
  }
  &.sider {
    margin-left: ${(props) => props?.$siderWidthMax || 256}px;
    &.collapsed {
      margin-left: ${(props) => props?.$siderWidthMin || 80}px;
    }
  }
`;

export const ContentInner = styled(Layout.Content)`
  position: relative;
  transition: all 0.2s;

  @media only screen and (min-width: 768px) {
    margin: 24px;
  }
`;
