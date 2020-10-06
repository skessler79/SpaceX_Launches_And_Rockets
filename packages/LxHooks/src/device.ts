import throttle from "lodash/throttle";
import { useState, useEffect } from "react";
import { DeviceConfig } from "./@types";

const getDeviceConfig = (window): DeviceConfig => {
  //  ant design configuration https://ant.design/components/layout/
  // xs: 480px
  // sm: 576px
  // md: 768px
  // lg: 992px
  // xl: 1200px
  // xxl: 1600px
  const { innerWidth, innerHeight } = window;
  const width: number = innerWidth;
  const height: number = innerHeight;
  let breakpoint = null;
  if (width < 480) {
    breakpoint = "xs";
  } else if (width >= 480 && width < 768) {
    breakpoint = "sm";
  } else if (width >= 768 && width < 992) {
    breakpoint = "md";
  } else if (width >= 992 && width < 1200) {
    breakpoint = "lg";
  } else if (width >= 1200 && width < 1600) {
    breakpoint = "xl";
  } else if (width >= 1600) {
    breakpoint = "xxl";
  }
  return {
    width,
    height,
    breakpoint
  };
};

export const useBreakpoint = (): DeviceConfig => {
  const [brkPnt, setBrkPnt] = useState<DeviceConfig>({});
  useEffect(() => {
    const defaultBreakpoint = getDeviceConfig(window);
    setBrkPnt(defaultBreakpoint);
    // eslint-disable-next-line
    const calcInnerWidth = throttle(function () {
      const newBreakpoint: DeviceConfig = getDeviceConfig(window);
      setBrkPnt(newBreakpoint);
    }, 500);
    window.addEventListener("resize", calcInnerWidth);
    return () => window.removeEventListener("resize", calcInnerWidth);
  }, []);

  return brkPnt;
};

export default { useBreakpoint };
