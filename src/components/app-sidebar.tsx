
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
  useSidebar, // Import useSidebar
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Shield, DatabaseZap, Settings2, Info, LogOut } from 'lucide-react'; // Removed unused icons
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const appName = "ChronoFlow";
  const appVersion = "v1.0.0 - Free";
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar(); // Get isMobile and setOpenMobile

  const handleMobileNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const menuItems = [
    {
      label: "Preferences",
      href: "/preferences",
      icon: Shield,
    },
    {
      label: "Data Management",
      href: "/data-management",
      icon: DatabaseZap,
    },
  ];

  const moreItems = [
    { label: "Feature X", icon: Settings2, tooltip: "Placeholder Feature X" },
    { label: "Feature Y", icon: Settings2, tooltip: "Placeholder Feature Y" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 text-sm">
        <div className="flex flex-col items-center group-data-[collapsible=icon]:hidden">
          <Settings2 className="h-7 w-7 text-primary mb-1" />
          <h2 className="text-lg font-semibold text-foreground">{appName}</h2>
          <p className="text-xs text-muted-foreground">{appVersion}</p>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
           <Settings2 className="h-7 w-7 text-primary" />
        </div>
      </SidebarHeader>

      <Separator className="my-1 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />

      <SidebarContent className="p-2 text-sm">
        <SidebarGroup>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                className="group-data-[collapsible=icon]:justify-center"
                data-active={pathname === item.href}
                onClick={handleMobileNavClick} // Add onClick handler
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
          <SidebarGroupLabel className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Info className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">More</span>
          </SidebarGroupLabel>
          {moreItems.map((item) => (
            <SidebarMenuItem key={item.label}>
                <SidebarMenuButton 
                  tooltip={item.tooltip} 
                  className="group-data-[collapsible=icon]:justify-center"
                  // Potentially add onClick={handleMobileNavClick} if these are links
                >
                <item.icon className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer can be uncommented if needed
      <SidebarFooter className="p-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-center gap-2 p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
           <LogOut className="h-4 w-4"/>
           <span>Logout</span>
        </div>
      </SidebarFooter>
      */}
    </Sidebar>
  );
}
