"use client";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavigationMain } from "@/constants/paths";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface NavMainProps {
  items: NavigationMain[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <Fragment>
      {items.map((item) => (
        <SidebarGroup key={item.group}>
          <SidebarGroupLabel>{item.group}</SidebarGroupLabel>
          <SidebarMenu>
            {item.menus.map((menu) => {
              const isActive =
                pathname === menu.href || menu.submenus?.some((sub) => pathname === sub.href);

              return (
                <Collapsible key={menu.name} asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={menu.name}
                      className={cn(isActive && "bg-muted text-primary font-semibold")}
                    >
                      <Link href={menu.href}>
                        <menu.icon />
                        <span>{menu.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {menu.submenus?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {menu.submenus?.map((subMenu) => {
                              const isSubActive = pathname === subMenu.href;

                              return (
                                <SidebarMenuSubItem key={subMenu.name}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={cn(
                                      isSubActive && "bg-muted text-primary font-semibold",
                                    )}
                                  >
                                    <Link href={subMenu.href}>
                                      <span>{subMenu.name}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </Fragment>
  );
}
