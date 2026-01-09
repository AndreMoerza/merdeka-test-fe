import { nextAuthConfig } from "@/cfgs/auth.cfg";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthConfig);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="h-screen w-full justify-center items-center flex flex-col">{children}</div>
  );
}

export default AuthLayout;
