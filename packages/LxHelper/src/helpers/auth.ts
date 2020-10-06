import get from "lodash/get";
import intersection from "lodash/intersection";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isNil from "lodash/isNil";
import isFunction from "lodash/isFunction";
import isObject from "lodash/isObject";
import { IsAuthorizedOptions } from "../@types";

export const isAuthorisedRole = (
  authUser: any,
  roles = [],
  roleKey = "roles"
): boolean => {
  if (!authUser) return false;

  // user existing role
  const currentRole = authUser[roleKey];
  let currentRoles = [];
  if (isString(currentRole)) {
    currentRoles = [currentRole];
  }
  if (isArray(currentRole)) {
    currentRoles = currentRole;
  }

  // default compare roles
  let compareRoles = [];
  // check input roles whether is string
  if (isString(roles)) {
    const anyRole = roles === "*";
    // if is any role just return true
    if (anyRole) return true;
    // overwrite compare roles
    compareRoles = [roles];
  }
  // check input roles whether an array and overwrite compare roles
  if (isArray(roles) && roles.length > 0) {
    compareRoles = roles;
  }
  // check whether user has role in order to proceed
  return intersection(compareRoles, currentRoles).length > 0;
};

/**
 *
 * @param {*} authUser
 * @param {Object} options
 * @param {String} options.roleKey optional
 * @param {Array} options.roles optional
 * @param {Boolean} options.authentication to inidicate whether only authenticated user is authorised to perform action
 * @param {Object|Function|String|Array} options.authorization
 * @param {String} options.authorization.roleKey
 * @param {String|Array[String]} options.authorization.roles
 */
export const isAuthorised = (
  authUser: any,
  options: IsAuthorizedOptions = {},
  defaultProps = { roleKey: "roles", roles: [] }
): boolean => {
  const newOptions: IsAuthorizedOptions = { ...defaultProps, ...options };
  const { authorization } = newOptions;

  // create params
  let roles: string[] = newOptions.roles || [];
  let { roleKey } = newOptions;

  const authentication = newOptions.authentication || false;
  // check whether `authUser` is defined
  const hasUser = !isNil(authUser);
  // check whether `authentication` is defined
  const hasAuthenticationDefined = !isNil(newOptions.authentication);
  // check whether `authorization` is defined
  const hasAuthorizationDefined = !isNil(authorization);

  // ===== if `auhthentication` & `authorization` is `not defined` return `true`
  if (!hasAuthenticationDefined && !hasAuthorizationDefined) {
    return true;
  }

  // ===== both or either `authentication` and `authorization` is defined, perform more checking on both configuration
  const hasAuthNoSignIn = authentication && !hasUser; // if authentication is `true` and user is not `defined`
  const hasAuthHasSignIn = authentication && hasUser; // if authentication is `true` and user is `defined`
  const noAuthHasSignIn = !authentication && hasUser; // if authentication is `false` and user is `defined`
  const noAuthNoSignIn = !authentication && !hasUser; // if auhthentication is `false` and user is `not defined`

  // ===== if `authentication` is defined
  if (hasAuthenticationDefined) {
    // if `authorization` is `not defined`
    if (!hasAuthorizationDefined) {
      if (hasAuthNoSignIn) return false;
      if (hasAuthHasSignIn) return true;
      if (noAuthHasSignIn) return true;
      if (noAuthNoSignIn) return true;
    }
    // has `authentication` and `authorization` configuration
    if (hasAuthNoSignIn) return false;
    if (noAuthNoSignIn) return true;
    // note: `hasAuthHasSignIn` and `noAuthNoSignIn` will be checking below for authorization configuration
  }

  // if `authorization` is function then get callback and decide whether to proceed action
  if (hasAuthorizationDefined && isFunction(authorization)) {
    return authorization(authUser);
  }

  // if `authorization` is array then update roles based on configuration
  if (hasAuthorizationDefined && isArray(authorization)) {
    roles = authorization || [];
  }

  // if `authorization` is object then update roles based on configuration
  if (
    hasAuthorizationDefined &&
    isObject(authorization) &&
    !isArray(authorization)
  ) {
    roleKey = get(authorization, "roleKey", "roles") || "roles";
    roles = get(authorization, "roles", []) || [];
  }

  // if `authorization` is string then assign into roles array
  if (hasAuthorizationDefined && isString(authorization)) {
    // if `authorization` is all then return true
    if (authorization === "*") {
      return true;
    }
    roles = [authorization];
  }

  const hasAuthCheck = !!roleKey && roles.length > 0;
  // without `authorization` then anyone can proceed
  if (!hasAuthCheck) return true;

  // check whether user is authorised
  const authorised = isAuthorisedRole(authUser, roles, roleKey);

  // authenticated user will not proceed action even if role is covered
  if (hasAuthenticationDefined && !authentication && authorised) return false;

  return authorised;
};

export default {
  isAuthorisedRole,
  isAuthorised
};
