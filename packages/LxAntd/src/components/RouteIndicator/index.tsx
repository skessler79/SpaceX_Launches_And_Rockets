import React, { useState, useEffect } from "react";
import classnames from "classnames";
import Router from "next/router";
import { Wrapper } from "./styles";

interface Props {
  color?: string;
}

// https://gist.github.com/jaydenseric/15a61ecfe3b52599409787c33fcfe9da
const RouteIndicatorComponent: React.FC<Props> = (props) => {
  const { color } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<any>(null);

  // ============ EVENTS
  const onLoad = () => {
    setLoading(true);
  };
  const onDone = () => {
    setLoading(false);
    setTimeoutId(
      setTimeout(() => {
        setTimeoutId(null);
        setLoading(null);
      }, 2500)
    );
  };

  // ============ EFFETCS
  useEffect(
    () => () => {
      if (timeoutId) clearTimeout(timeoutId);
    },
    [timeoutId]
  );

  useEffect(() => {
    Router.events.on("routeChangeStart", onLoad);
    Router.events.on("routeChangeComplete", onDone);
    Router.events.on("routeChangeError", onDone);
    return () => {
      Router.events.off("routeChangeStart", onLoad);
      Router.events.off("routeChangeComplete", onDone);
      Router.events.off("routeChangeError", onDone);
    };
  });

  return (
    <Wrapper
      $color={color}
      className={classnames({ loading, done: !loading })}
    />
  );
};

export const RouteIndicator = RouteIndicatorComponent;
export default RouteIndicatorComponent;
