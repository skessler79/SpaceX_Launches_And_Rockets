import { SelectionOption, SelectionOptionMapping } from "@lavax-ui/helpers";

export type CascaderOptionsSettings = {
  options: SelectionOption[];
  paths: SelectionOptionMapping;
  findValue: (value: string | number) => (string | number)[];
};
