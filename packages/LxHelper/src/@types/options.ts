export type CascaderDataItem = {
  [key: string]: string | number | CascaderDataItem[];
  children?: CascaderDataItem[];
};

export type SelectionOptionConfig = {
  labelKey?: string;
  valueKey?: string;
  childKey?: string;
};

export interface SelectionOption {
  label: string | number;
  value: string | number;
  children: SelectionOption[];
}

export interface SelectionOptionMapping {
  [target: string]: (string | number)[];
}
