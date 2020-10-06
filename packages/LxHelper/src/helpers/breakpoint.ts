import includes from "lodash/includes";
import findIndex from "lodash/findIndex";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import intersection from "lodash/intersection";
import map from "lodash/map";
import isString from "lodash/isString";
import isArray from "lodash/isObject";
import {
  BreakpointScreenGroup,
  BreakpointTypes,
  BreakpointPosition,
  BreakpointValidity
} from "../@types/breakpoint";

export const getScreenMode = (
  breakpoint: BreakpointTypes
): BreakpointScreenGroup => {
  if (includes(["lg", "xl", "xxl"], breakpoint)) {
    return "desktop";
  }
  if (includes(["md"], breakpoint)) {
    return "tablet";
  }
  return "mobile";
};

export const findBreakpointPosition = (
  breakpoint: BreakpointTypes
): BreakpointValidity => {
  const breakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"];
  // find breakpoint position
  const index = findIndex(breakpoints, (e) => e === breakpoint);
  return {
    position: index,
    valid: index !== -1
  };
};

export const compareBreakpointPosition = (
  breakpoint: BreakpointTypes,
  screen: BreakpointTypes
): BreakpointPosition => {
  let viewSize: BreakpointValidity = null;
  let screenSize: BreakpointValidity = null;
  if (isString(breakpoint)) {
    viewSize = findBreakpointPosition(breakpoint);
  }
  if (isString(screen)) {
    screenSize = findBreakpointPosition(screen);
  }
  if (isEmpty(viewSize) || isEmpty(screenSize)) return null;
  if (!viewSize.valid) return null;
  if (!screenSize.valid) return null;
  const viewPos = viewSize.position;
  const screenPos = screenSize.position;
  return {
    below: viewPos <= screenPos,
    equal: viewPos === screenPos,
    above: viewPos > screenPos
  };
};

export const shouldBreakpointViewable = (
  breakpoints: BreakpointTypes | BreakpointTypes[],
  screenSize: BreakpointTypes
): boolean => {
  if (isNil(breakpoints)) return true;
  if (isString(breakpoints)) {
    const result: BreakpointPosition = compareBreakpointPosition(
      breakpoints,
      screenSize
    );
    return !!result && (result.equal || result.above);
  }
  if (isArray(breakpoints)) {
    const results = map(breakpoints, (e) => {
      const result: BreakpointPosition = compareBreakpointPosition(
        e,
        screenSize
      );
      return !!result && (result.equal || result.above);
    });
    return intersection(results, [true]).length > 0;
  }
  return false;
};

export default {
  getScreenMode,
  findBreakpointPosition,
  compareBreakpointPosition,
  shouldBreakpointViewable
};
