export type CrudOptions = {
  size?: number;
  page?: number;
  [key: string]: string | number | null | (() => any);
};

export type CrudHooks = {
  table: {
    rowSelection: (
      ...args: any
    ) => {
      onRowSelection?: {
        selectedRowKeys: (string | number)[];
        onChange: (selectedRows: (string | number)[]) => void;
      };
      currentSelections: (string | number)[];
      clearSelections: () => void;
      onTriggerSelection: () => void;
    };
    pagination: ((...args: any) => any) | any;
  };
};

export type CrudHooksAction = {
  rowSelection: {
    onRowSelection?: {
      selectedRowKeys: (string | number)[];
      onChange: (selectedRows: (string | number)[]) => void;
    };
    currentSelections: (string | number)[];
    clearSelections: () => void;
    onTriggerSelection: () => void;
  };
  pagination: {
    setCurrentPage: (...args: any) => any;
    pagination: {
      current: number;
      defaultCurrent: number;
      defaultPageSize: number;
      total: number;
      onChange: (page: number) => void;
    };
  };
  crud: UseCrudHookAction;
};

export type UseCrudHookAction = {
  quickSearch: (keyword: string) => void;
  formatSorter: (options: {
    columnKey: string | string[];
    order: "ASC" | "DESC";
  }) => {
    sortKey?: string;
    sortOrder?: "DESC" | "ASC";
  };
  refresh: () => void;
  refreshAtPage: (page: number) => void;
  refreshOnFilterChange: (
    paginationOption: CrudPaginateOption,
    filterOption: { [key: string]: any },
    sorterOption: { [key: string]: any }
  ) => void;
};

export type CrudAction = {
  list?: (...args: any) => any;
  get?: (...args: any) => any;
  create?: (...args: any) => any;
  update?: (...args: any) => any;
  delete?: (...args: any) => any;
};

export type CrudStrategy = {
  create?: CrudStrategyAction;
  update?: CrudStrategyAction;
  delete?: CrudStrategyAction;
};

export type CrudStrategyAction = {
  prepare?: ((...args: any) => any) | any;
  onCompleted?: ((...args: any) => any) | any;
  onError?: ((...args: any) => any) | any;
};

export type CrudActionButton = {
  Modal?: any;
  Icon?: any;
};

export type CrudPaginateOption = { defaultPageSize: number; current: number };

export type CrudFetchParams = {
  filter: { [key: string]: any };
  option: { [key: string]: any };
};

export type CrudStrategyResource = {
  create: any;
  update: any;
  delete: any;
};

export type CrudMutationEvent = {
  update: (record: any) => void;
  delete: (record: any) => void;
};

export type CrudLayoutProps = {
  panelProps: any;
  tableProps: any;
};
