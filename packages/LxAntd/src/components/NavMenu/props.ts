import { MenuItemOption } from "@lavax-ui/helpers";

export type Props = {
  authUser?: any;
  menus: MenuItemOption[];
  context?: {
    [key: string]: (...args: any) => void;
  };
};
