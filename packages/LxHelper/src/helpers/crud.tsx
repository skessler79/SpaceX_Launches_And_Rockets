import React, { useState, useRef, ReactNode } from "react";
import get from "lodash/get";
import isArray from "lodash/isArray";
import {
  CrudOptions,
  CrudHooks,
  CrudAction,
  CrudStrategy,
  CrudActionButton,
  CrudPaginateOption,
  CrudStrategyAction,
  CrudHooksAction,
  UseCrudHookAction,
  CrudFetchParams,
  CrudStrategyResource,
  CrudMutationEvent,
  CrudLayoutProps
} from "../@types";

/**
 * ===============================
 * useCRUD hook
 * ===============================
 */
// MIGRATION: useAdminCRUD --> useCRUD
export const useCRUD = (options: {
  pagination: CrudPaginateOption;
  defaultParams?: CrudFetchParams;
  refetch: (...args: any) => any;
  setCurrentPage: (page: number) => any;
}): UseCrudHookAction => {
  const {
    refetch,
    setCurrentPage,
    pagination,
    defaultParams = { filter: {}, option: {} }
  } = options;

  // =========== useCRUD hook STATE
  const [tableSorter, setTableSorter] = useState<{ [key: string]: any }>({});
  const [tableFilter, setTableFilter] = useState<{ [key: string]: any }>({});

  // =========== useCRUD hook HELPERS
  const constructFetchParams = (
    newFilter: { [key: string]: any } = {},
    newOption: { [key: string]: any } = {}
  ): CrudFetchParams => {
    // do a deep merge between defaultParams with 'filter' and 'option'
    return {
      filter: {
        ...defaultParams.filter,
        ...newFilter
      },
      option: {
        ...defaultParams.option,
        ...newOption
      }
    };
  };

  const quickSearch = (keyword: string): void => {
    refetch({
      option: {
        q: keyword,
        page: 1,
        size: pagination.defaultPageSize
      }
    });
  };

  const refreshPage = (
    paginationOption: CrudPaginateOption,
    filterOption: { [key: string]: any } = {},
    sorterOption: { [key: string]: any } = {}
  ): void => {
    const filter = {
      ...filterOption
    };
    const option = {
      ...sorterOption,
      page: paginationOption.current,
      size: paginationOption.defaultPageSize
    };

    // do a deep merge between defaultParams with 'filter' and 'option'
    refetch(constructFetchParams(filter, option));
  };

  const refreshOnFilterChange = (
    paginationOption: CrudPaginateOption,
    filterOption: { [key: string]: any } = {},
    sorterOption: { [key: string]: any } = {}
  ): void => {
    setCurrentPage(paginationOption.current);
    setTableFilter(filterOption);
    setTableSorter(sorterOption);
    refreshPage(paginationOption, filterOption, sorterOption);
  };

  const refreshAtPage = (page: number): void => {
    setCurrentPage(page);
    refreshPage(
      {
        ...pagination,
        current: page
      },
      tableFilter,
      tableSorter
    );
  };

  const refresh = (): void => {
    refreshAtPage(pagination.current);
  };

  const formatSorter = (sorterOption: {
    columnKey: string | string[];
    order: "ASC" | "DESC";
  }): {
    sortKey?: string;
    sortOrder?: "DESC" | "ASC";
  } => {
    // update table sorter
    let tableSortOption = {};
    if (sorterOption && sorterOption.order) {
      tableSortOption = {
        sortKey: sorterOption.columnKey,
        sortOrder: sorterOption.order
      };
    }
    return tableSortOption;
  };

  return {
    quickSearch,
    formatSorter,
    refresh,
    refreshAtPage,
    refreshOnFilterChange
  };
};

/**
 * ===============================
 * HELPER METHODS
 * ===============================
 */

const countRecords = (
  response: any,
  responseKey: string | string[]
): number => {
  return get(response, responseKey, 0);
};

const getPageNumberOnLatestCount = (
  totalCount: number,
  pagination: CrudPaginateOption
): number => {
  const calculatedPageCount = Math.ceil(
    totalCount / pagination.defaultPageSize
  );
  const maxPageCount = calculatedPageCount > 0 ? calculatedPageCount : 1;
  const newlyUpdatedPage =
    pagination.current > maxPageCount ? maxPageCount : pagination.current;
  return newlyUpdatedPage;
};

// eslint-disable-next-line
const getPageNumberAfterDeletion = (
  totalCount: number,
  deletedCount: number,
  pagination: CrudPaginateOption
): number => {
  const newlyUpdatedTotal = totalCount - deletedCount;
  return getPageNumberOnLatestCount(newlyUpdatedTotal, pagination);
};

const compositeStrategy = (
  ...strategies: CrudStrategyAction[]
): CrudStrategyAction => {
  return {
    prepare: (...params) => {
      strategies.forEach((strategy) => {
        if (strategy.prepare) strategy.prepare(...params);
      });
    },
    onCompleted: (...params) => {
      strategies.forEach((strategy) => {
        if (strategy.onCompleted) strategy.onCompleted(...params);
      });
    },
    onError: (...error) => {
      strategies.forEach((strategy) => {
        if (strategy.onError) strategy.onError(...error);
      });
    }
  };
};

const commonNotificationStrategy = (
  Notification: any,
  resourceName: string
) => (action: string, actionInPastTense: string): CrudStrategyAction => {
  return {
    onCompleted: () => {
      Notification({
        duration: 5,
        type: "success",
        message: `Successfully ${actionInPastTense} ${resourceName}`
      });
    },
    onError: () => {
      Notification({
        duration: 5,
        type: "error",
        message: `Failed to ${action} ${resourceName}`
      });
    }
  };
};

// TODO: create Types for payload
const commonDeletionStrategy = (hooks: CrudHooksAction): CrudStrategyAction => {
  const { pagination } = hooks.pagination;
  const { clearSelections } = hooks.rowSelection;
  const { refreshAtPage } = hooks.crud;
  let countAtResponseKey;

  return {
    prepare: ({ responseKey }) => {
      countAtResponseKey = responseKey;
    },
    onCompleted: (response) => {
      const totalCount = countRecords(response, [
        countAtResponseKey,
        "totalCount"
      ]);
      const newPageNumber = getPageNumberOnLatestCount(totalCount, pagination);
      clearSelections();
      refreshAtPage(newPageNumber);
    }
  };
};

/**
 * ===============================
 * RENDER UI HELPERS
 * ===============================
 */

// MIGRATION: commonActionButton --> makeCommonActionButton
export const makeCommonActionButton = (
  iconKey: string,
  onClick: (...args: any) => void,
  buttons: CrudActionButton,
  recordIdentifier?: {
    resourceName?: string;
    identifier?: string;
  }
): ReactNode => {
  const { Modal, Icon } = buttons;
  if (iconKey === "delete") {
    const resourceName = get(recordIdentifier, "resourceName", "record");
    const identifier = get(recordIdentifier, "identifier", null);
    const viewing = identifier ? ` (${identifier})` : "";

    return (
      <Icon
        type="delete"
        onClick={() => {
          Modal.confirm({
            title: `Are you sure to delete this ${resourceName}${viewing}?`,
            okText: "Confirm",
            cancelText: "Cancel",
            onOk: () => {
              onClick();
            }
          });
        }}
        style={{ fontSize: 20 }}
      />
    );
  }

  return <Icon type={iconKey} onClick={onClick} style={{ fontSize: 20 }} />;
};

// MIGRATION: commonEditAndDeleteButton --> makeCommonMutationButton
export const makeCommonMutationButton = (
  events: CrudMutationEvent,
  buttons: CrudActionButton,
  options?: { resourceName?: string; identifierKey?: string }
) => (
  record: any
): {
  updateButton: ReactNode;
  deleteButton: ReactNode;
} => {
  const { Modal, Icon } = buttons;
  const recordIdentify = options?.identifierKey || "name";
  const resourceName = options?.resourceName;

  const updateButton = makeCommonActionButton(
    "edit",
    () => events.update(record),
    {
      Icon
    }
  );
  const deleteButton = makeCommonActionButton(
    "delete",
    () => events.delete(record),
    { Icon, Modal },
    {
      resourceName,
      identifier: get(record, recordIdentify, null)
    }
  );
  return {
    updateButton,
    deleteButton
  };
};

// MIGRATION: commonDialogForm --> makeCommonDialogForm
export const makeCommonDialogForm = (
  dialogTitle: string,
  Dialog: any,
  renderForm: (payload: {
    data: any;
    hideDialog: () => void;
    showDialog: (data: any) => void;
  }) => ReactNode
): [ReactNode, (data: any) => void, () => void] => {
  // eslint-disable-next-line
  const resourceDialogFormRef = useRef(null);
  // eslint-disable-next-line
  const [dialogData, setDialogData] = useState<any>();

  const dialogProps = {
    ref: resourceDialogFormRef,
    title: dialogTitle
  };
  const showDialog = (data) => {
    setDialogData(data);
    resourceDialogFormRef.current.onDialogPop();
  };
  const hideDialog = () => {
    resourceDialogFormRef.current.onDialogDismiss();
  };
  return [
    <Dialog {...dialogProps}>
      {renderForm({ data: dialogData, hideDialog, showDialog })}
    </Dialog>,
    showDialog,
    hideDialog
  ];
};

/**
 * ===============================
 * CRUD HELPERS CLASS
 * ===============================
 */
export class CRUD {
  private resourceName: string = null;
  private options: CrudOptions = {};
  private actions: CrudAction = {};
  private strategies: CrudStrategy = {};
  private hooks: CrudHooks;

  constructor(
    resourceName: string,
    options: CrudOptions,
    actions: CrudAction,
    hooks: CrudHooks
  ) {
    this.resourceName = resourceName;
    this.options = options;
    this.actions = actions;
    this.hooks = hooks;
  }

  list(...args: any): any {
    const { page, size } = this.options;
    return this.actions.list({
      variables: {
        option: {
          page,
          size
        }
      },
      ...args
    });
  }

  // MIGRATION: useCommonHooks --> useHooks
  useHooks = (listHook: any): CrudHooksAction => {
    const { data, refetch } = listHook;
    const { page, size } = this.options;
    const total = countRecords(data, "total");
    const rowSelectionHook = this.hooks.table.rowSelection();
    const paginationHook = this.hooks.table.pagination({
      total,
      page,
      size
    });
    const { pagination, setCurrentPage } = paginationHook;

    return {
      pagination: paginationHook,
      rowSelection: rowSelectionHook,
      // eslint-disable-next-line
      crud: useCRUD({
        pagination,
        setCurrentPage,
        refetch
        // TODO: find where defaultParams from
        // defaultParams
      })
    };
  };

  // MIGRATION: useCommonCRUDStrategy --> useStrategy
  useStrategy = (
    commonCrudHooks: CrudHooksAction,
    Notification: ReactNode
  ): CrudStrategyResource => {
    const notificationStrategy = commonNotificationStrategy(
      Notification,
      this.resourceName
    );

    this.strategies.delete = compositeStrategy(
      commonDeletionStrategy(commonCrudHooks),
      notificationStrategy("delete", "deleted")
    );
    this.strategies.create = notificationStrategy("create", "created");
    this.strategies.update = notificationStrategy("update", "updated");

    const [createResource] = this.actions.create(this.strategies.create);
    const [updateResource] = this.actions.update(this.strategies.update);
    const [deleteResources] = this.actions.delete(this.strategies.delete);
    return {
      create: createResource,
      update: updateResource,
      delete: deleteResources
    };
  };

  // MIGRATION: commonProps --> useProps
  useProps = (
    payload: {
      hooks: CrudHooksAction;
      list: any;
    },
    resources: CrudStrategyResource
  ): CrudLayoutProps => {
    const { hooks, list } = payload;
    const { pagination } = hooks.pagination;
    const { loading, data } = list;
    const {
      onTriggerSelection,
      onRowSelection,
      currentSelections,
      clearSelections
    } = hooks.rowSelection;

    const {
      quickSearch,
      formatSorter,
      refresh,
      refreshOnFilterChange
    } = hooks.crud;

    // --------------------- common props
    const onTriggerSearch = (values) => {
      // eslint-disable-next-line
      console.log("onTriggerSearch --->", values);
      quickSearch(values);
    };

    const onTriggerBulkAction = (action) => {
      // eslint-disable-next-line
      console.log("onTriggerBulkAction --->", action);
      if (action === "delete") {
        resources.delete({
          variables: {
            input: {
              ids: currentSelections
            }
          }
        });
      } else if (action === "export") {
        // console.log("currentSelections", currentSelections);
      }
    };

    const onTableChange = (paginationOption, filterOption, sorterOption) => {
      const tableSortOption = formatSorter(sorterOption);
      refreshOnFilterChange(paginationOption, filterOption, tableSortOption);
    };

    const onTriggerRefresh = () => {
      clearSelections();
      refresh();
    };

    const panelProps = {
      onTriggerSelection,
      totalSelectedCount: currentSelections.length || 0,
      onTriggerSearch,
      onTriggerRefresh,
      onTriggerBulkAction,
      placeholderSearchText: "Search by name",
      createButtonText: `Create ${this.resourceName}`,
      enableCreate: true,
      enableSearch: true,
      enableRefresh: true,
      enableExportAll: true,
      enableBulkSelection: true,
      enableBulkAction: !!onRowSelection, // true
      bulkActionList: "default"
    };
    const tableProps = {
      creatable: false,
      rowSelection: onRowSelection,
      dataSource: isArray(data) ? data : data.items || [],
      loading,
      pagination,
      onChange: onTableChange,
      rowKey: (record) => `${record.id}`
    };
    return {
      panelProps,
      tableProps
    };
  };
}

export default {
  CRUD,
  makeCommonActionButton,
  makeCommonMutationButton,
  makeCommonDialogForm
};
