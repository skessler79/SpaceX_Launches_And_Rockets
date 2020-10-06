export type AuthorizationTypes =
  | string
  | string[]
  | AuthorizationConfig
  | ((user: any) => boolean);

export type AuthorizationConfig = {
  roleKey?: string;
  roles?: string[];
  permissions?: string[];
};

export type IsAuthorizedOptions = {
  roleKey?: string;
  roles?: string[];
  authentication?: boolean;
  authorization?: AuthorizationTypes;
};
