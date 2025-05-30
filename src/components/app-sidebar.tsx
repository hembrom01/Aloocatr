
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
  // SidebarGroupContent is NOT exported, so it was removed.
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield, Palette, Bell, Globe, MapPin, FileText, DownloadCloud, UploadCloud, Trash2, Settings2, ChevronDown, Info } from 'lucide-react';
import Link from 'next/link';

export function AppSidebar() {
  const appName = "ChronoFlow";
  const appVersion = "v1.0.0 - Free"; // Hardcoded for now

  // Placeholder state for switch, no actual functionality
  const [dailyReminder, setDailyReminder] = React.useState(true);

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
          <SidebarGroupLabel className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Shield className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Preferences</span>
          </SidebarGroupLabel>
          {/* Removed SidebarGroupContent, direct children or SidebarMenuItem for structure */}
          <div>
            {/* Appearance Section within a "collapsible-like" item */}
            <SidebarMenuItem className="group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1">
               <details className="w-full group">
                <summary className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Appearance</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[[open]]:rotate-180 group-data-[collapsible=icon]:hidden" />
                </summary>
                <div className="pl-4 pr-2 py-2 space-y-3 group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme-toggle" className="text-xs text-muted-foreground">Theme</Label>
                    <ThemeToggle />
                  </div>
                  <div>
                    <Label htmlFor="country-select" className="text-xs text-muted-foreground mb-1 block">Country</Label>
                    <Select defaultValue="us">
                      <SelectTrigger id="country-select" className="h-8 text-xs bg-background border-border focus:ring-sidebar-ring">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="gb">United Kingdom</SelectItem>
                        {/* Add more countries as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language-select" className="text-xs text-muted-foreground mb-1 block">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language-select" className="h-8 text-xs bg-background border-border focus:ring-sidebar-ring">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español (Spanish)</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </details>
            </SidebarMenuItem>

            {/* Notifications Section within a "collapsible-like" item */}
             <SidebarMenuItem className="group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1">
              <details className="w-full group">
                <summary className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Notifications</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[[open]]:rotate-180 group-data-[collapsible=icon]:hidden" />
                </summary>
                <div className="pl-4 pr-2 py-2 space-y-2 group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-reminder" className="text-xs text-muted-foreground">Daily Reminder</Label>
                    <Switch id="daily-reminder" checked={dailyReminder} onCheckedChange={setDailyReminder} />
                  </div>
                </div>
              </details>
            </SidebarMenuItem>
            
            <SidebarMenuItem className="group-data-[collapsible=icon]:justify-center">
              <Link href="#privacy-policy" className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center">
                <FileText className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Privacy Policy</span>
              </Link>
            </SidebarMenuItem>
          </div>
        </SidebarGroup>

        <Separator className="my-2 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
             <DownloadCloud className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Data Management</span>
          </SidebarGroupLabel>
           {/* Removed SidebarGroupContent, direct children or SidebarMenuItem for structure */}
           <div>
            <SidebarMenuButton tooltip="Export your task records" className="group-data-[collapsible=icon]:justify-center">
              <FileText className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Export Record</span>
            </SidebarMenuButton>
            <SidebarMenuButton tooltip="Backup your data" className="group-data-[collapsible=icon]:justify-center">
              <UploadCloud className="h-4 w-4" />
               <span className="group-data-[collapsible=icon]:hidden">Backup & Restore</span>
            </SidebarMenuButton>
            <SidebarMenuButton tooltip="Delete all data and reset app" className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive group-data-[collapsible=icon]:justify-center">
              <Trash2 className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Delete & Reset</span>
            </SidebarMenuButton>
          </div>
        </SidebarGroup>
        
        <Separator className="my-2 bg-sidebar-border group-data-[collapsible=icon]:mx-1" />

         <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Info className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">More</span>
          </SidebarGroupLabel>
          {/* Removed SidebarGroupContent, direct children or SidebarMenuItem for structure */}
          <div>
            <SidebarMenuButton tooltip="Placeholder Feature X" className="group-data-[collapsible=icon]:justify-center">
              <Settings2 className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Feature X</span>
            </SidebarMenuButton>
             <SidebarMenuButton tooltip="Placeholder Feature Y" className="group-data-[collapsible=icon]:justify-center">
              <Settings2 className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Feature Y</span>
            </SidebarMenuButton>
          </div>
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
