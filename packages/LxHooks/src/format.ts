import get from "lodash/get";
import { useState, useEffect } from "react";
import {
  formatCascaderOptions,
  getCascaderValuePathMapping,
  CascaderDataItem,
  SelectionOption,
  SelectionOptionMapping,
  SelectionOptionConfig
} from "@lavax-ui/helpers";
import { CascaderOptionsSettings } from "./@types";

export const useFormatCascaderOptionHook = (
  list: CascaderDataItem[] = [],
  opts: SelectionOptionConfig = {}
): CascaderOptionsSettings => {
  const [options, setOptions] = useState<SelectionOption[]>([]);
  const [paths, setPaths] = useState<SelectionOptionMapping>({});

  useEffect(() => {
    const finalOptions: SelectionOption[] = formatCascaderOptions(list, opts);
    const finalPaths: SelectionOptionMapping = getCascaderValuePathMapping(
      list,
      opts
    );

    setOptions(finalOptions);
    setPaths(finalPaths);
  }, [list, opts]);

  return {
    options,
    paths,
    findValue: (value) => {
      return get(paths, value, []);
    }
  };
};

export default {
  useFormatCascaderOptionHook
};
