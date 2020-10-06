import map from "lodash/map";
import flatten from "lodash/flatten";
import concat from "lodash/concat";
import includes from "lodash/includes";
import find from "lodash/find";
import get from "lodash/get";
import isObject from "lodash/isObject";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";
import React from "react";
import { translateScreenName } from "./translate";
import { BreadCrumbOptions } from "../@types";

// refer to
// projects/xxx/src/config/settings.js
// for a list of screenKeys
export const getBreadcrumbRoutes = (
  screenKeys: string[] = [],
  options: BreadCrumbOptions
): any => {
  const { t, menus, params = {} } = options;
  const screenParamKeys = map(params, (e, k) => k);
  const breadcrumbRoutes = [];
  const listOfAllMenus = flatten(
    map(menus, (menu) => {
      const submenu = menu.submenu || [];
      return concat(menu, submenu);
    })
  );

  const findParamsByKey = (screenKey: string) => {
    const found = find(screenParamKeys, (key) => includes(screenKey, key));
    return get(params, found, null);
  };

  const constructParamsToPath = (screenKey: string) => {
    const foundParams = findParamsByKey(screenKey);
    if (!foundParams) return null;
    if (isObject(foundParams)) {
      return foundParams;
    }
    return {
      path: null,
      breadcrumbName: foundParams
    };
  };

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < screenKeys.length; i++) {
    const screenKey = screenKeys[i];
    const foundScreenParams = constructParamsToPath(screenKey);
    if (!isEmpty(foundScreenParams)) {
      breadcrumbRoutes.push(foundScreenParams);
    } else {
      const menu = find(listOfAllMenus, {
        key: screenKey
      });
      breadcrumbRoutes.push({
        path: menu ? menu.path : null,
        breadcrumbName: translateScreenName(t, screenKey, "short_name")
      });
    }
  }

  return {
    routes: breadcrumbRoutes,
    itemRender: (route, itemParams, routes) => {
      const last = routes.indexOf(route) === routes.length - 1;
      if (last || !route.path) {
        return <span>{route.breadcrumbName}</span>;
      }
      return (
        <Link href={route.path}>
          <a>{route.breadcrumbName}</a>
        </Link>
      );
    }
  };
};

export default {
  getBreadcrumbRoutes
};
