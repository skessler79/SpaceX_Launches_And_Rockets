import isNil from "lodash/isNil";
import reduce from "lodash/reduce";
import assign from "lodash/assign";
import forEach from "lodash/forEach";
import set from "lodash/set";
import get from "lodash/get";
import map from "lodash/map";
import findKey from "lodash/findKey";
import { useState, useEffect } from "react";
import {
  UsePaginationOptions,
  UseRowSelectionProps,
  UsePaginationProps
} from "./@types";

export const useRowSelection = (
  rowSelection?: (...args: any[]) => void
): UseRowSelectionProps => {
  const [selectable, setSelectable] = useState(false);
  const [currentSelections, setCurrentSelections] = useState([]);

  const onTriggerSelection = () => {
    setSelectable(!selectable);
  };
  const clearSelections = () => {
    setSelectable(false);
    setCurrentSelections([]);
  };
  let onRowSelection = null;
  if (selectable) {
    onRowSelection = {
      selectedRowKeys: currentSelections,
      onChange: (selectedRows) => {
        setCurrentSelections(selectedRows);
        if (rowSelection) rowSelection(selectedRows);
      }
    };
  }
  return {
    onRowSelection,
    currentSelections,
    clearSelections,
    onTriggerSelection
  };
};

export const usePagination = (
  options: UsePaginationOptions
): UsePaginationProps => {
  const { page, size, total, onPaginate } = options;
  const [currentPage, setCurrentPage] = useState(page);

  const triggerOnPaginate = (newPageNumber) => {
    setCurrentPage(newPageNumber);
    if (onPaginate) onPaginate(newPageNumber);
  };

  return {
    setCurrentPage,
    pagination: {
      current: currentPage,
      defaultCurrent: 1,
      defaultPageSize: size,
      total,
      onChange: triggerOnPaginate
    }
  };
};

// TODO: create types for intialDataset
export const useExpandableRow = (initialDataset: any): any => {
  const [expandAtPath, setExpandAtPath] = useState(null);
  const [processedData, setProcessedData] = useState([]);

  // map to { `some.path.here`: `item.id.here` }
  const composePathMapping = (parent?: any) => (result, item, index) => {
    let parentPath = null;
    if (item.id) {
      if (!isNil(parent)) {
        parentPath = `${parent}[${index}]`;
      } else {
        parentPath = `[${index}]`;
      }
      if (item.children && item.children.length > 0) {
        parentPath = `${parentPath}`;
      }
      Object.assign(result, { [`${parentPath}`]: item.id });
    }
    if (item.children && item.children.length > 0) {
      reduce(
        item.children,
        composePathMapping(`${parentPath}.children`),
        result
      );
    }
    return result;
  };

  const assignChildrenIfAny = (item) => {
    if (item.hasChildren) {
      return assign({ children: [] }, item);
    }
    return item;
  };

  const assignDataToChildren = (path, results, inData) => {
    if (inData && inData.length > 0) {
      const pathMaps = reduce(inData, composePathMapping(), {});
      forEach(pathMaps, (value, key) => {
        const selected = get(inData, key);
        if (!!selected && selected.hasChildren) {
          set(inData, `${key}.children`, []);
        }
      });
      if (path) {
        return set(results, `${path}.children`, inData);
      }
    }
    return results;
  };

  const findExpandingPath = (stores, id) => {
    const pathMaps = reduce(stores, composePathMapping(), {});
    return findKey(pathMaps, (o) => o === id);
  };

  const processInitialData = (stores, datas) => {
    return map(datas, (item) => assignChildrenIfAny(item));
  };

  const injectChildrenData = (stores, datas) => {
    return assignDataToChildren(expandAtPath, stores, datas);
  };

  const prepareExpandPath = (expanded, record) => {
    setExpandAtPath(null);
    if (expanded) {
      setExpandAtPath(findExpandingPath(processedData, record.id));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    const rows = processInitialData(processedData, initialDataset.items);
    setProcessedData([...rows]);
    // eslint-disable-next-line
  }, [initialDataset]);

  return [processedData, injectChildrenData, prepareExpandPath];
};
