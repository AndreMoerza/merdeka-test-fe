"use client";

import { DataTable } from "@/components/base/app-datatable";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesData = {
  name: string;
  sales: number;
};

const salesData: SalesData[] = [
  { name: "Sen", sales: 400 },
  { name: "Sel", sales: 300 },
  { name: "Rab", sales: 600 },
  { name: "Kam", sales: 500 },
  { name: "Jum", sales: 800 },
  { name: "Sab", sales: 700 },
  { name: "Min", sales: 1000 },
];

type RecentTransaction = {
  id: number;
  item: string;
  amount: number;
  status: string;
};

const recentTransactions: RecentTransaction[] = [
  { id: 1, item: "Cappuccino", amount: 25000, status: "Selesai" },
  { id: 2, item: "Latte", amount: 30000, status: "Selesai" },
  { id: 3, item: "Espresso", amount: 20000, status: "Tertunda" },
  { id: 4, item: "Croissant", amount: 15000, status: "Selesai" },
];

export default function AppDashboardPage() {
  return (
    <div className="space-y-6">
      <AppHeading
        title="Dashboard"
        description="Pantau performa toko dan transaksi POS secara real-time."
      />

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 12.5M</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-4 w-4" /> +12% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transaksi</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,245</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-4 w-4" /> +8% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs flex items-center gap-1 text-red-600">
              <ArrowDownRight className="h-4 w-4" /> -2% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">POS Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-4 w-4" /> Stabil
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Penjualan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => {
                  const daysMap: Record<string, string> = {
                    Sen: "Senin",
                    Sel: "Selasa",
                    Rab: "Rabu",
                    Kam: "Kamis",
                    Jum: "Jumat",
                    Sab: "Sabtu",
                    Min: "Minggu",
                  };
                  return daysMap[label] || label;
                }}
                formatter={(value) => [value, "Penjualan"]}
              />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <DataTable<RecentTransaction>
        columns={[
          {
            accessorKey: "item",
            header: "Item",
            cell: ({ row }) => <span>{row.original.item}</span>,
          },
          {
            accessorKey: "amount",
            header: "Jumlah",
            cell: ({ row }) => <span>Rp {row.original.amount.toLocaleString("id-ID")}</span>,
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
              const status = row.original.status;
              return (
                <span
                  className={
                    status === "Selesai"
                      ? "text-green-600 font-medium"
                      : "text-yellow-600 font-medium"
                  }
                >
                  {status}
                </span>
              );
            },
          },
        ]}
        data={recentTransactions}
        totalData={recentTransactions.length}
        headerChildren={
          <div className="w-full flex items-center justify-between">
            <p className="leading-none font-semibold">Transaksi Terakhir</p>
            <Button className="py-6 px-4 w-min" variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        }
        usePagination={false}
        noResultText="Tidak ada transaksi."
      />
    </div>
  );
}
