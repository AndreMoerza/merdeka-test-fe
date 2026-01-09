import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Geist, Geist_Mono } from "next/font/google";

import { nextAuthConfig } from "@/cfgs/auth.cfg";
import { Loaders, Modals } from "@/components/base/app-modals";
import { Toaster } from "@/components/ui/toaster";
import LoaderProvider from "@/providers/loader.provider";
import NextAuthSessionProvider from "@/providers/next-auth.provider";
import NuqsAppProvider from "@/providers/nuqs.provider";
import TanstackProvider from "@/providers/tanstack.provider";

import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Merdeka Admin",
  description: "Merdeka Admin is the web-based dashboard for managing the Merdeka ecosystem",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(nextAuthConfig);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthSessionProvider session={session}>
          <TanstackProvider>
            <LoaderProvider>
              <NuqsAppProvider>
                {children}
                <Toaster />
                <Loaders />
                <Modals />
              </NuqsAppProvider>
            </LoaderProvider>
          </TanstackProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
