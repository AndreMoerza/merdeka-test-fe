import { SelectOption } from "@/components/base/app-select";
import { useKaryawanApi } from "@/lib/apis/employee/employee-hook";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useEmployees() {
  const [options, setOptions] = useState<SelectOption[]>([]);

  const { useGetEmployees } = useKaryawanApi();
  const { fetcher, setPage } = useGetEmployees(20);

  const { mappedOptions, pagination } = useMemo(() => {
    const data = fetcher.data;
    if (!data) return { mappedOptions: [], pagination: undefined };

    const mappedOptions: SelectOption[] = data.data.map((item) => ({
      value: String(item.id),
      label: item.name,
    }));

    if (!data.pagination) return { mappedOptions, pagination: undefined };

    const { total, limit, currentPage } = data.pagination;
    const totalPages = Math.ceil(total / limit);

    return {
      mappedOptions,
      pagination: {
        currentPage,
        limit,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }, [fetcher.data]);

  const handleLoadMore = useCallback(() => {
    if (pagination?.hasNext) {
      setPage((prev) => prev + 1);
    }
  }, [pagination, setPage]);

  useEffect(() => {
    if (!mappedOptions.length) return;
    setOptions((prev) =>
      pagination?.currentPage === 1 ? mappedOptions : [...prev, ...mappedOptions],
    );
  }, [mappedOptions, pagination]);

  useEffect(() => {
    setPage(1);
  }, [setPage]);

  return {
    options,
    isLoading: fetcher.isLoading,
    isFetching: fetcher.isFetching,
    error: fetcher.error?.message,
    pagination,
    handleLoadMore,
  };
}
