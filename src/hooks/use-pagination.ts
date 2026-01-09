"use client";

import { parseAsInteger, useQueryState } from "nuqs";

export type UsePaginatedQueryOptions = {
  initialPage?: number;
  initialLimit?: number;
  id?: string;
};

export default function usePagination(opts?: UsePaginatedQueryOptions) {
  const [page, setPage] = useQueryState(
    opts?.id ? `${opts?.id}_page` : "page",
    parseAsInteger.withDefault(opts?.initialPage || 0),
  );
  const [limit, setLimit] = useQueryState(
    opts?.id ? `${opts?.id}_limit` : "limit",
    parseAsInteger.withDefault(opts?.initialLimit || 10),
  );
  const [search, handleSearch] = useQueryState(opts?.id ? `${opts?.id}_search` : "search");

  return {
    page,
    setPage,
    limit,
    setLimit,
    search: String(search || ""),
    handleSearch,
  };
}
