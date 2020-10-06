export type UsePaginationOptions = {
  page: number;
  size: number;
  total: number;
  onPaginate?: (page: number) => void;
};

export type UseRowSelectionProps = {
  onRowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedRows: (string | number)[]) => void;
  };
  currentSelections: (string | number)[];
  clearSelections: () => void;
  onTriggerSelection: () => void;
};

export type UsePaginationProps = {
  setCurrentPage: (...args: any) => any;
  pagination: {
    current: number;
    defaultCurrent: number;
    defaultPageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
};
