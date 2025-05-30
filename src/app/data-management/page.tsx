
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DownloadCloud, UploadCloud, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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


export default function DataManagementPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handlePlaceholderAction = (actionName: string) => {
    toast({
      title: "Feature Not Implemented",
      description: `${actionName} functionality is not yet available.`,
    });
  };
  
  const handleDeleteAndReset = () => {
    console.log("Delete & Reset action triggered");
    toast({
      title: "Data Reset (Placeholder)",
      description: "All application data would be deleted here.",
      variant: "destructive"
    });
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

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DownloadCloud className="h-6 w-6 text-primary" />
            <CardTitle>Export Record</CardTitle>
          </div>
          <CardDescription>Download your task records and logs as a CSV or JSON file.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handlePlaceholderAction('CSV Export')} className="text-sm">
              Export as CSV
            </Button>
            <Button variant="outline" onClick={() => handlePlaceholderAction('JSON Export')} className="text-sm">
              Export as JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

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

      <Separator />

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
                  Allocatr data, including tasks, categories, and time logs from your browser.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAndReset} className="text-sm">
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

    </div>
  );
}
