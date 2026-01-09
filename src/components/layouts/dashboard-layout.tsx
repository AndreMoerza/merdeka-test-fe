"use client";

import { AppSidebar } from "@/components/base/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AppBreadcrumb } from "../base/app-breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type NotificationItem = {
  id: string;
  title: string;
  message?: string;
  createdAt: string;
  read: boolean;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3000";

    const socket: Socket = io(wsUrl, {
      transports: ["websocket"],
    });

    socket.on("employee.created", (payload: { employeeId: string; name: string }) => {
      setNotifications((prev) => [
        {
          id: `employee-created-${payload.employeeId}-${Date.now()}`,
          title: "Karyawan baru ditambahkan",
          message: payload.name,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    });

    socket.on(
      "employee.import.completed",
      (payload: { total: number; jobId: string }) => {
        setNotifications((prev) => [
          {
            id: `employee-import-${payload.jobId}-${Date.now()}`,
            title: "Import karyawan selesai",
            message: `${payload.total} data berhasil diproses`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ]);
      },
    );

    socket.on("connect_error", (err) => {
      console.error("Notification socket error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [isMounted]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const toggleNotificationPanel = () => {
    setIsNotifOpen((prev) => {
      const next = !prev;
      if (next) {
        setNotifications((items) =>
          items.map((n) => ({ ...n, read: true })),
        );
      }
      return next;
    });
  };

  if (!isMounted) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="relative flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumb />
          </div>

          <div className="flex items-center gap-4 pr-2">
            {/* Notification button */}
            <button
              type="button"
              onClick={toggleNotificationPanel}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition hover:text-primary"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown panel */}
            {isNotifOpen && (
              <div
                className="absolute right-4 top-16 z-50 w-80 rounded-lg border bg-popover shadow-lg"
                aria-label="Notification list"
              >
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <span className="text-sm font-semibold">
                    Notifikasi
                  </span>
                  {notifications.length > 0 && (
                    <button
                      className="text-xs text-muted-foreground hover:text-primary"
                      onClick={() =>
                        setNotifications((items) =>
                          items.map((n) => ({ ...n, read: true })),
                        )
                      }
                    >
                      Tandai semua sudah dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                      Belum ada notifikasi.
                    </div>
                  )}

                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`border-b px-3 py-2 text-xs last:border-b-0 ${!notif.read ? "bg-muted/60" : ""
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold">
                            {notif.title}
                          </div>
                          {notif.message && (
                            <div className="text-muted-foreground">
                              {notif.message}
                            </div>
                          )}
                        </div>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {new Date(notif.createdAt).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="px-6 pb-6 pt-2">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
