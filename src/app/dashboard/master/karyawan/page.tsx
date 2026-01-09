"use client";

import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { toast } from "@/components/ui/use-toast";
import { useKaryawanApi } from "@/lib/apis/employee/employee-hook";
import { safePromise } from "@/lib/utils";
import { formatThousandSeparator } from "@/lib/utils/money";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Import, Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { confirmDeleteEmployeeModal, formEmployeeModal, importEmployeeModal } from "./_module/components/employee-modals.component";
import { IconButtonWithTooltip } from "./_module/components/icon-button-tooltip";

export default function KaryawanPage() {
  const { useGetEmployees, useDeleteEmployee } = useKaryawanApi();
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetEmployees();
  const { mutateAsync: deleteEmployee } = useDeleteEmployee();

  const employees = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Karyawan"
        description="Kelola dan pantau semua karyawan."
      />

      <DataTable<Karyawan>
        columns={[
          {
            accessorKey: "name",
            header: "Nama",
            cell: ({ row }) => <div className="text-sm">{row.original?.name}</div>,
          },
          {
            accessorKey: "age",
            header: "Umur",
            cell: ({ row }) => <div className="text-sm">{row.original?.age}</div>,
          },
          {
            accessorKey: "position",
            header: "Posisi",
            cell: ({ row }) => <div className="text-sm">{row.original?.position}</div>,
          },
          {
            accessorKey: "salary",
            header: "Gaji",
            cell: ({ row }) => (
              <div className="flex flex-col items-start space-y-2">
                <p className="text-sm">{formatThousandSeparator(row.original?.salary.toLocaleString('id-ID'))}</p>
              </div>
            ),
          },
          {
            accessorKey: "createdAt",
            header: "Tanggal Dibuat",
            cell: ({ row }) => (
              <div className="flex flex-col items-start space-y-2">
                <p className="text-sm">{formatDate(row.original?.createdAt)}</p>
                <p className="text-xs text-gray-500">{getClockTime(row.getValue("createdAt"))}</p>
              </div>
            ),
          },
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <AppDropdownActions
                onEdit={formEmployeeModal(row.original, onRefresh).open}
                onDelete={
                  confirmDeleteEmployeeModal({
                    requireType: row.original?.name?.trim(),
                    next: async () => {
                      await safePromise(async () => {
                        await deleteEmployee(row.original?.id)
                          .then(() => {
                            toast({
                              title: "Karyawan berhasil dihapus",
                              description: "Karyawan telah berhasil dihapus.",
                              variant: "success",
                            });
                          })
                          .finally(onRefresh);
                      });
                    },
                  }).open
                }
              />
            ),
            size: 20,
          },
        ]}
        data={employees}
        headerChildren={
          <TooltipProvider delayDuration={100}>
            <IconButtonWithTooltip
              tooltip="Tambah karyawan"
              onClick={formEmployeeModal(undefined, onRefresh).open}
            >
              <Plus className="h-4 w-4" />
            </IconButtonWithTooltip>

            <IconButtonWithTooltip tooltip="Refresh data" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </IconButtonWithTooltip>

            <IconButtonWithTooltip tooltip="Import data" onClick={importEmployeeModal().open}>
              <Import className="h-4 w-4" />
            </IconButtonWithTooltip>
          </TooltipProvider>
        }
        limit={limit}
        page={page}
        totalData={fetcher?.data?.pagination?.total || 0}
        onSearch={handleSearch}
        onLimitChanged={(limit) => {
          setLimit(limit);
        }}
        onPageChanged={(page) => {
          setPage(page);
        }}
        loading={fetcher?.isFetching}
        usePagination
        noResultText="Belum ada data karyawan"
      />
    </div>
  );
}
