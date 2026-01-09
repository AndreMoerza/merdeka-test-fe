import usePagination from "@/hooks/use-pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { karyawanApi } from "..";
import { CreateEmployee } from "./employee-schema";

export function useKaryawanApi() {
  const useGetEmployees = (initialLimit?: number) => {
    const {
      limit,
      setLimit,
      page,
      setPage,
      search,
      handleSearch,
    } = usePagination({
      id: "employee",
      initialLimit: initialLimit ?? 10,
      initialPage: 1,
    });

    const fetcher = useQuery({
      queryKey: ["employee", { limit, page, search }],
      queryFn: async () => {
        const searchParam = search
          ? `name:%${search}%`
          : undefined;

        return await karyawanApi.getKaryawans({
          limit,
          page,
          search: searchParam,
        });
      },
      staleTime: 0,
    });

    return {
      fetcher,
      limit,
      setLimit,
      page,
      setPage,
      search,
      handleSearch,
    };
  };

  const useCreateEmployee = () => {
    const mutation = useMutation({
      mutationKey: ["create-employee"],
      mutationFn: async (data: CreateEmployee) => {
        return await karyawanApi.createKaryawan(data);
      },
    });
    return mutation;
  };

  const useUpdateEmployee = () => {
    const mutation = useMutation({
      mutationKey: ["update-employee"],
      mutationFn: async (data: CreateEmployee & { id: string }) => {
        return await karyawanApi.updateKaryawan(data);
      },
    });
    return mutation;
  };

  const useDeleteEmployee = () => {
    const mutation = useMutation({
      mutationKey: ["delete-employee"],
      mutationFn: async (id: string) => {
        return await karyawanApi.deleteKaryawan(id);
      },
    });
    return mutation;
  };

  const useImportEmployees = () => {
    return useMutation({
      mutationKey: ["import-employee"],
      mutationFn: async (file: File) => {
        return await karyawanApi.importKaryawanCsv(file);
      },
    });
  };

  const useImportProgress = (jobId: string | null) => {
    return useQuery({
      queryKey: ["employee-import-progress", jobId],
      queryFn: async () => {
        if (!jobId) throw new Error("jobId is required");
        return await karyawanApi.getImportProgress(jobId);
      },
      enabled: !!jobId,
      refetchInterval: (query) => {
        const data: any = query.state.data;
        const payload = data?.data ?? data;

        if (!payload) return 1000;

        if (
          payload.status === "completed" ||
          payload.status === "failed" ||
          payload.status === "not_found"
        ) {
          return false;
        }

        return 1000;
      },
    });
  };

  return {
    useGetEmployees,
    useCreateEmployee,
    useUpdateEmployee,
    useDeleteEmployee,
    useImportEmployees,
    useImportProgress,
  };
}

