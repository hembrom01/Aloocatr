
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DownloadCloud, UploadCloud, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskManager } from '@/hooks/use-task-manager';


type ActiveDataSection = 'export' | 'backup' | 'delete';

export default function DataManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { resetAllApplicationData } = useTaskManager(); // Get the reset function
  const [selectedTimeline, setSelectedTimeline] = useState<string>("all_time");
  const [activeSection, setActiveSection] = useState<ActiveDataSection>('export');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) as ActiveDataSection;
      if (['export', 'backup', 'delete'].includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection('export'); 
        router.replace(`${pathname}#export`, { scroll: false }); 
      }
    };

    handleHashChange(); 

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname, router]);

  const handlePlaceholderAction = (actionName: string) => {
    toast({
      title: "Feature Not Implemented",
      description: `${actionName} functionality is not yet available.`,
    });
  };

  const handleDeleteAndReset = () => {
    resetAllApplicationData();
    toast({
      title: "Application Reset",
      description: "All application data has been deleted and the app is reset.",
      variant: "destructive" 
    });
    router.push('/'); 
  };

  return (
    <div className="space-y-8 pb-16 animate-page-content-appear">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} aria-label="Go to Tracker page">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Data Management</h1>
            <p className="text-xs text-muted-foreground">Manage your application data.</p>
          </div>
        </div>
      </header>

      {activeSection === 'export' && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DownloadCloud className="h-6 w-6 text-primary" />
              <CardTitle>Export Record</CardTitle>
            </div>
            <CardDescription>Download your task records and logs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timeline-select" className="text-sm font-medium mb-1 block">Select Timeline:</Label>
              <Select value={selectedTimeline} onValueChange={setSelectedTimeline}>
                <SelectTrigger id="timeline-select" className="w-full sm:w-[280px] text-sm">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days" className="text-sm">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days" className="text-sm">Last 30 Days</SelectItem>
                  <SelectItem value="current_month" className="text-sm">Current Month</SelectItem>
                  <SelectItem value="last_month" className="text-sm">Last Month</SelectItem>
                  <SelectItem value="all_time" className="text-sm">All Time</SelectItem>
                  <SelectItem value="custom_range" className="text-sm">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              {selectedTimeline === "custom_range" && (
                <p className="text-xs text-muted-foreground mt-2">(Date range picker would appear here for custom selection)</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => { /* Actual export logic would go here */ }} className="text-sm w-full sm:w-auto">
                Export as Google Sheet
              </Button>
              <Button variant="outline" onClick={() => { /* Actual export logic would go here */ }} className="text-sm w-full sm:w-auto">
                Export as PDF
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">CSV and JSON export options have been replaced by Google Sheet/PDF.</p>
          </CardContent>
        </Card>
      )}

      {activeSection === 'backup' && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UploadCloud className="h-6 w-6 text-primary" />
              <CardTitle>Backup & Restore</CardTitle>
            </div>
            <CardDescription>Backup your current data or restore from a previous backup file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => handlePlaceholderAction('Backup Data')} className="text-sm">
              Backup Data
            </Button>
            <div>
              <Label htmlFor="restoreFile" className="text-xs font-medium">Restore from Backup</Label>
              <Input id="restoreFile" type="file" className="mt-1 text-sm" disabled />
              <Button variant="secondary" className="mt-2 text-sm" onClick={() => handlePlaceholderAction('Restore Data')} disabled>
                Restore Data
              </Button>
              <p className="text-xs text-muted-foreground mt-1">(Restore functionality is a placeholder)</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeSection === 'delete' && (
        <Card className="shadow-lg border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-6 w-6 text-destructive" />
              <CardTitle className="text-destructive">Delete & Reset</CardTitle>
            </div>
            <CardDescription>Permanently delete all your tasks, categories, and logs. This action cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="text-sm">Delete All Data & Reset App</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your
                    Allocatr data, including tasks, categories, and time logs from your browser and reset the application.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAndReset} className="text-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Yes, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
