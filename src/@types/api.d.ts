interface BaseApiOptions {
  baseURL?: string;
}

type PaginatedFilters = {
  limit?: number;
  page?: number;
  search?: string;
  populate?: string;
  sort?: string;
};

type BaseApiResult<T> = {
  data: T;
  message: string;
  status: number;
};

type BasePaginatedApiResult<T> = {
  message: string;
  status: number;
  data: T;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPage: number;
  };
};
