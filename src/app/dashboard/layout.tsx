import { nextAuthConfig } from "@/cfgs/auth.cfg";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AppDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthConfig);

  if (!session) {
    redirect("/auth/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
