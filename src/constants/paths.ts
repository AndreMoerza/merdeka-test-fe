import {
  Activity,
  LifeBuoy,
  Send,
  Users2,
  type LucideIcon
} from "lucide-react";

export type NavigationMain = {
  group: string;
  menus: NavigationMenu[];
};

export type NavigationMenu = {
  name: string;
  href: string;
  icon: LucideIcon;
  submenus: NavigationSubMenu[] | null;
};

export type NavigationSubMenu = {
  name: string;
  href: string;
};

export type NavigationSecondary = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const NAVIGATION_MAIN: NavigationMain[] = [
  {
    group: "Overview",
    menus: [{ name: "Dashboard", href: "/dashboard", icon: Activity, submenus: null }],
  },
  {
    group: "Master Data",
    menus: [
      {
        name: "Karyawan",
        href: "/dashboard/master/karyawan",
        icon: Users2,
        submenus: null,
      },
    ],
  }
];

export const NAVIGATION_SECONDARY: NavigationSecondary[] = [
  {
    name: "Bantuan",
    href: "#",
    icon: LifeBuoy,
  },
  {
    name: "Saran",
    href: "#",
    icon: Send,
  },
];
