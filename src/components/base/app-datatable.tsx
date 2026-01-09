"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { Fragment, ReactElement, ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlexRow } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppSearchBar } from "./app-searchbar";

export type DataTableProps<T, V = unknown> = {
  columns: ColumnDef<T, V>[];
  data: T[];
  limit?: number;
  page?: number;
  totalData?: number;
  onSearch?: (search: string) => void;
  onLimitChanged?: (limit: number) => void;
  onPageChanged?: (page: number) => void;
  onCheckedChanged?: (data: T[], value: boolean) => void;
  onRowClicked?: (data: T) => void;
  headerChildren?: ReactNode;
  loading?: boolean;
  noResultText?: string | ReactNode;
  usePagination?: boolean;
  className?: string;
};

export function DataTable<T>(props: DataTableProps<T>): ReactElement {
  const {
    columns,
    data,
    limit = 15,
    page = 0,
    totalData = 100,
    onSearch,
    onLimitChanged,
    onPageChanged,
    onCheckedChanged,
    headerChildren = null,
    loading = false,
    onRowClicked,
  } = props;

  const [search, setSearch] = useState("");
  const [limitData, setLimitData] = useState(limit);

  const totalPage = Math.ceil(totalData / limitData);

  const table = useReactTable({
    data,
    columns: onCheckedChanged
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate") ||
                  false
                }
                onCheckedChange={(value) => {
                  const rows = table.getRowModel();
                  const checkedRows = rows.rows;
                  onCheckedChanged(
                    checkedRows.map((data) => data.original),
                    !!value,
                  );
                  table.toggleAllPageRowsSelected(!!value);
                }}
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                  row.toggleSelected(!!value);
                  onCheckedChanged([row.original], !!value);
                }}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
          },
          ...columns,
        ]
      : columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getColSpan = () => {
    if (onCheckedChanged) {
      return columns.length + 1;
    }
    return columns.length;
  };

  return (
    <div className={cn("rounded-xl border w-full shadow", props.className)}>
      <div className="flex flex-row space-x-2 w-full justify-start items-center py-3 px-4 border-b">
        {onSearch && (
          <>
            <AppSearchBar
              search={search}
              onSearch={(value) => setSearch(value)}
              onClear={() => setSearch("")}
              inputClassName="h-12"
              showClearIcon={search !== ""}
            />
            <Button
              className="py-6 px-4 w-min"
              variant="outline"
              size="icon"
              onClick={() => onSearch(search)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </>
        )}
        {headerChildren}
      </div>
      <div className="m-4 border rounded-lg overflow-hidden">
        <div style={{ direction: table.options.columnResizeDirection }} className="w-full">
          <Table
            className="w-full table-auto"
            style={{ direction: table.options.columnResizeDirection }}
          >
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        colSpan={header.colSpan}
                        className="py-3 px-4"
                      >
                        <FlexRow responsive={false} className="items-center">
                          <div>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        </FlexRow>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(limitData)
                  .fill(0)
                  .map((_, index) => (
                    <Fragment key={index}>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="w-fit">
                          {headerGroup.headers.map((header) => (
                            <TableCell key={header.id} className="w-fit">
                              <Skeleton className="h-5 bg-gray-200 rounded-lg" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </Fragment>
                  ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-100 cursor-pointer transition-colors duration-200 ease-in-out"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3 px-4"
                        style={{ width: cell.column.getSize() }}
                        onClick={
                          cell.id !== "action"
                            ? onRowClicked
                              ? () => {
                                  const cid = cell.column.id;
                                  if (cid === "action") return;
                                  onRowClicked(row.original);
                                }
                              : undefined
                            : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={getColSpan()} className="h-24 text-center text-gray-400">
                    {props.noResultText || "No results."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer */}
      {limitData && props.usePagination && (
        <div className="py-3 px-4 border-t">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="text-sm text-gray-600">
              {`${(page - 1) * limitData + 1}-${Math.min(page * limitData, totalData)} dari ${totalData} baris terpilih.`}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Baris per halaman</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-auto h-5 ml-auto rounded-md">
                      {limitData} <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {["5", "10", "15", "20", "25", "30"].map((item, index) => (
                      <DropdownMenuItem
                        key={index}
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1.5 text-sm font-semibold"
                        onClick={() => {
                          setLimitData(Number(item));
                          onLimitChanged?.(Number(item));
                        }}
                      >
                        {item}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="text-sm text-gray-600">{`Halaman ${page} dari ${totalPage}`}</div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onPageChanged?.(1)}
                  disabled={page === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">Halaman pertama</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onPageChanged?.(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Halaman sebelumnya</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onPageChanged?.(page + 1)}
                  disabled={page === totalPage}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Halaman selanjutnya</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onPageChanged?.(totalPage)}
                  disabled={page === totalPage}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Halaman terakhir</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
