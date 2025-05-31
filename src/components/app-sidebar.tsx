
"use client";

import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Shield, Settings2, Info, LogOut, DownloadCloud, UploadCloud, Trash2, DatabaseZap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function AppSidebar() {
  const appVersion = "v1.0.0 - Free";
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleMobileNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const mainMenuItems = [
    {
      label: "Preferences",
      href: "/preferences",
      icon: Shield,
    },
  ];

  const dataManagementItems = [
    {
      label: "Export Record",
      href: "/data-management",
      icon: DownloadCloud,
      tooltip: "Export your task records"
    },
    {
      label: "Backup & Restore",
      href: "/data-management",
      icon: UploadCloud,
      tooltip: "Backup or restore data"
    },
    {
      label: "Delete & Reset",
      href: "/data-management",
      icon: Trash2,
      tooltip: "Delete all application data"
    },
  ];
  
  const moreItems = [
    { label: "Feature X", icon: Settings2, tooltip: "Placeholder Feature X" },
    { label: "Feature Y", icon: Settings2, tooltip: "Placeholder Feature Y" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex flex-col items-center group-data-[collapsible=icon]:hidden">
          <Image src="/images/allocatr-logo-new-script.png" alt="Allocatr Logo" width={120} height={36} className="object-contain mb-1" />
          <p className="text-xs text-muted-foreground">{appVersion}</p>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
           {/* Collapsed view: Minimal, no logo or text here, rely on tooltips */}
        </div>
      </SidebarHeader>

      <Separator className="my-1 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />

      <SidebarContent className="p-2">
        <SidebarGroup>
          {mainMenuItems.map((item) => (
            <SidebarMenuItem key={item.href} className="list-none">
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                className="group-data-[collapsible=icon]:justify-center text-sm"
                data-active={pathname === item.href}
                onClick={handleMobileNavClick}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>

        <Separator className="my-2 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center text-xs">
            <DatabaseZap className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Data</span>
          </SidebarGroupLabel>
          {dataManagementItems.map((item) => (
            <SidebarMenuItem key={item.label} className="list-none">
              <SidebarMenuButton
                asChild
                tooltip={item.tooltip}
                className="group-data-[collapsible=icon]:justify-center text-sm"
                data-active={pathname === item.href && item.href.includes(pathname)} 
                onClick={handleMobileNavClick}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>

        <Separator className="my-2 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />

         <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center text-xs">
            <Info className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">More</span>
          </SidebarGroupLabel>
          {moreItems.map((item) => (
            <SidebarMenuItem key={item.label} className="list-none">
                <SidebarMenuButton 
                  tooltip={item.tooltip} 
                  className="group-data-[collapsible=icon]:justify-center text-sm"
                  onClick={handleMobileNavClick} 
                >
                <item.icon className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      
    </Sidebar>
  );
}
