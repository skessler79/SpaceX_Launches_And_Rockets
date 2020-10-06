import reduce from "lodash/reduce";
import { MenuItemOption } from "../@types/menu";

// refer to
// projects/admin/src/config/settings.js
// for a list of menus
export const getMenuKeysByPath = (
  menus: MenuItemOption[],
  pathname: string
): { openKeys: string[]; selectedKeys: string[] } => {
  const selectedKeys = [];
  const openKeys = [];

  menus.forEach((menu) => {
    if (menu.path === pathname) {
      selectedKeys.push(menu.key);
    } else if (menu.submenu) {
      menu.submenu.forEach((submenu) => {
        if (submenu.path === pathname) {
          openKeys.push(menu.key);
          selectedKeys.push(submenu.key);
        }
      });
    }
  });

  return {
    openKeys,
    selectedKeys
  };
};

export const getExpandableMenuKeys = (
  menus: MenuItemOption[],
  desireLevel: number = 1,
  level: number = 0
): string[] => {
  return reduce(
    menus,
    (results, menu) => {
      if (menu.submenu) {
        const newLevel = level + 1;
        results.push(menu.key);
        if (newLevel < desireLevel) {
          const nested = getExpandableMenuKeys(
            menu.submenu,
            desireLevel,
            newLevel
          );
          Object.assign(results, [...nested]);
        }
      }
      return results;
    },
    []
  );
};

export default {
  getMenuKeysByPath,
  getExpandableMenuKeys
};
