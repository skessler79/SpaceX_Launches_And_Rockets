import { MenuItemOption } from "./menu";

export type BreadCrumbOptions = {
  t: (...args: any) => string;
  menus: MenuItemOption[];
  params: any;
};
