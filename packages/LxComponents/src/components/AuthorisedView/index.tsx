import React from "react";
import { isAuthorised } from "@lavax-ui/helpers";
import { Props } from "./props";

const AuthorisedViewComponent: React.FC<Props> = (props) => {
  const { authUser, children, ...restProps } = props;
  const check = isAuthorised(authUser, restProps);
  return <>{check ? children : null}</>;
};

export const AuthorisedView = AuthorisedViewComponent;
export default AuthorisedView;
