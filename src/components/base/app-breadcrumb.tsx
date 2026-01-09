"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NAVIGATION_MAIN } from "@/constants/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function AppBreadcrumb() {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    let items: { name: string; href?: string }[] = [];

    for (const group of NAVIGATION_MAIN) {
      for (const menu of group.menus) {
        if (menu.href === pathname) {
          items = [{ name: menu.name, href: menu.href }];
        }

        if (menu.submenus) {
          const found = menu.submenus.find((s) => s.href === pathname);
          if (found) {
            items = [
              { name: menu.name, href: menu.href },
              { name: found.name, href: found.href },
            ];
          }
        }
      }
    }

    return [{ name: "Dashboard", href: "/dashboard" }, ...items];
  };

  const breadcrumbs = getBreadcrumbItems();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname !== "/dashboard" &&
          breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {isLast || item.href === "#" ? (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={String(item.href)}>{item.name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
