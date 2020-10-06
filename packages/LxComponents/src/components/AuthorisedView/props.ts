import React from "react";
import { AuthorizationTypes } from "@lavax-ui/helpers";

export type Props = {
  children: React.ReactNode;
  authUser?: any;
  roleKey?: string;
  roles?: string[];
  authentication?: boolean;
  authorization?: AuthorizationTypes;
};
