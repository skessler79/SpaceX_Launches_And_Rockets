import isString from "lodash/isString";
import isFunction from "lodash/isFunction";
import isNil from "lodash/isNil";
import get from "lodash/get";
import reduce from "lodash/reduce";
import isBoolean from "lodash/isBoolean";
import { MenuItemOption } from "../@types";
import {
  CascaderDataItem,
  SelectionOption,
  SelectionOptionMapping,
  SelectionOptionConfig
} from "../@types/options";

export const getPathOptions = (path?: string): { link?: string } => {
  if (isNil(path)) return {};
  return !isString(path)
    ? {}
    : {
        link: path
      };
};

export const getTitleString = (
  title: string | ((context: any) => string),
  props?: any
): string | null => {
  return isFunction(title) ? title(props || {}) : title;
};

export const getTooltipOptions = (
  menu: MenuItemOption,
  props?: any
): { title?: string; [key: string]: any } => {
  const { title, tooltip } = menu;
  const hasTooltip = !!tooltip;
  if (!hasTooltip) return {};
  const titleStr = getTitleString(title, props || {});
  if (isBoolean(tooltip)) return { title: titleStr };
  if (isString(tooltip)) return { title: tooltip };
  if (isFunction(tooltip)) return tooltip(props || {});
  if (tooltip.title) return tooltip;
  return {
    title: titleStr,
    ...tooltip
  };
};

/**
 * function to generate cascader option from list
 * @param {Array} list
 * @param {Object} options
 * @param {String} options.labelKey data key for label
 * @param {String} options.valueKey data key for value
 * @param {String} options.childKey data key for nested item
 */
/* ======= Example final output
  [
    {
      label: "Bags",
      value: "65506ad2-4639-4e96-a72d-e8adbc6657da",
      children: [
        {
          label: "Bucket Bag",
          value: "78d6471c-d4a1-4983-916a-13a827acb526"
        },
        {
          label: "Shoulder Bag",
          value: "60ea8710-9a2a-4f17-91d7-c7b2f51b3656"
        },
        {
          label: "Waist Bag",
          value: "171d1ae2-095c-4ffa-84c4-5cf2e28a9ae3"
        }
      ]
    }
  ];
*/
export const formatCascaderOptions = (
  list: CascaderDataItem[] = [],
  options: SelectionOptionConfig = {}
): SelectionOption[] => {
  const labelKey = get(options, "labelKey", "name");
  const valueKey = get(options, "valueKey", "id");
  const childKey = get(options, "childKey", "children");
  return reduce(
    list,
    (result, item) => {
      const payload = {
        label: item[labelKey],
        value: item[valueKey]
      };
      const children: any = item[childKey];
      const child = {};
      if (!!children && children.length > 0) {
        child[childKey] = formatCascaderOptions(children, options);
      }
      result.push({ ...payload, ...child });
      return result;
    },
    []
  );
};

/**
 * function to generate cacasder value path from list
 * @param {Array} list
 * @param {Object} options
 * @param {String} options.valueKey data key for value
 * @param {String} options.childKey data key for nested item
 * @param {String} parentId parent id got nested item
 * @param {Object} prevResult previous list
 */
/* ======= Example final output 
    targetId : [ pathToTargetId ]
  --------------------------------
  {
    "1": ["1"],
    "2": ["1", "2"],
    "3": ["1", "2", "3"],
    "3": ["1", "2", "3"],
    "4": ["4"],
    "5": ["4", "5"],
  }
*/
export const getCascaderValuePathMapping = (
  list: CascaderDataItem[] = [],
  options: SelectionOptionConfig = {
    valueKey: "id",
    childKey: "children"
  },
  parentId: string | null = null,
  prevResult: {
    [key: string]: any[];
  } = {}
): SelectionOptionMapping => {
  const valueKey = get(options, "valueKey", "id");
  const childKey = get(options, "childKey", "children");
  return reduce(
    list,
    (result, item) => {
      const value = get(item, valueKey, null);
      if (value) {
        if (!result[value]) {
          Object.assign(result, { [`${value}`]: [value] });
        }
        if (prevResult[parentId]) {
          Object.assign(result, {
            [`${value}`]: [...prevResult[parentId], value]
          });
        }
        const childs: any = get(item, childKey, []);
        if (childs.length > 0) {
          Object.assign(prevResult, {
            ...prevResult,
            ...getCascaderValuePathMapping(childs, options, value, result)
          });
        }
      }
      return { ...result, ...prevResult };
    },
    {}
  );
};

export default {
  getPathOptions,
  getTitleString,
  getTooltipOptions,
  formatCascaderOptions,
  getCascaderValuePathMapping
};
