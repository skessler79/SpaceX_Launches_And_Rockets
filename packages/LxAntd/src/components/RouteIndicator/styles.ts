import styled from "styled-components";

type RouteIndicatorStylesProps = {
  $color: string;
};

export const Wrapper = styled.div<RouteIndicatorStylesProps>`
  position: fixed;
  left: 0;
  top: 0;
  right: 100%;
  z-index: 1000;
  height: 4px;
  box-shadow: 0 1px 8px hsla(0, 0%, 0%, 0.1);
  opacity: 0;
  transition-property: right, opacity;
  transition-duration: 0s;
  pointer-events: none;
  background-color: ${(props) => props.$color || "#1890ff"};

  &.loading {
    right: 5%;
    opacity: 1;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    transition-duration: 8s, 0s;
  }

  &.done {
    right: 0;
    transition-duration: 250ms;
    transition-delay: 0s, 250ms;
  }
`;

export default {
  Wrapper
};
