
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
  // SidebarMenu is NOT exported from ui/sidebar, so it was removed from imports and usage.
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Shield, DownloadCloud, UploadCloud, Trash2, Settings2, Info, FileText as PrivacyIcon } from 'lucide-react'; 
import Link from 'next/link';

export function AppSidebar() {
  const appName = "ChronoFlow";
  const appVersion = "v1.0.0 - Free"; // Hardcoded for now

  return (
    <Sidebar collapsible="icon"> {/* Makes sidebar collapsible to icon-only state on desktop */}
      <SidebarHeader className="p-4 text-sm">
        <div className="flex flex-col items-center group-data-[collapsible=icon]:hidden">
          <Settings2 className="h-7 w-7 text-primary mb-1" />
          <h2 className="text-lg font-semibold text-foreground">{appName}</h2>
          <p className="text-xs text-muted-foreground">{appVersion}</p>
        </div>
         {/* Icon-only view header */}
        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
           <Settings2 className="h-7 w-7 text-primary" />
        </div>
      </SidebarHeader>

      <Separator className="my-1 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />

      <SidebarContent className="p-2 text-sm">
        <SidebarGroup>
          {/* Preferences Link */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="App Preferences" className="group-data-[collapsible=icon]:justify-center">
              <Link href="/preferences">
                <Shield className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Preferences</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>

        <Separator className="my-2 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
             <DownloadCloud className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Data Management</span>
          </SidebarGroupLabel>
          {/* Data Management Items */}
          <SidebarMenuItem>
              <SidebarMenuButton tooltip="Export your task records" className="group-data-[collapsible=icon]:justify-center">
              <PrivacyIcon className="h-4 w-4" /> {/* Using PrivacyIcon (FileText) for Export */}
              <span className="group-data-[collapsible=icon]:hidden">Export Record</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
              <SidebarMenuButton tooltip="Backup your data" className="group-data-[collapsible=icon]:justify-center">
              <UploadCloud className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Backup & Restore</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
              <SidebarMenuButton tooltip="Delete all data and reset app" className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive group-data-[collapsible=icon]:justify-center">
              <Trash2 className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Delete & Reset</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
        
        <Separator className="my-2 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />

         <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Info className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">More</span>
          </SidebarGroupLabel>
          {/* More Items */}
          <SidebarMenuItem>
              <SidebarMenuButton tooltip="Placeholder Feature X" className="group-data-[collapsible=icon]:justify-center">
              <Settings2 className="h-4 w-4" /> {/* Using Settings2 icon */}
              <span className="group-data-[collapsible=icon]:hidden">Feature X</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
              <SidebarMenuButton tooltip="Placeholder Feature Y" className="group-data-[collapsible=icon]:justify-center">
              <Settings2 className="h-4 w-4" /> {/* Using Settings2 icon */}
              <span className="group-data-[collapsible=icon]:hidden">Feature Y</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      
      {/* 
      <SidebarFooter className="p-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
        © {new Date().getFullYear()} ChronoFlow
      </SidebarFooter>
      */}
    </Sidebar>
  );
}
