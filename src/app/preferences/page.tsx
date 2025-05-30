
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Palette, Bell, FileText, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PreferencesPage() {
  const router = useRouter();
  const [dailyReminder, setDailyReminder] = React.useState(true);

  return (
    <div className="space-y-8 pb-16 animate-page-content-appear">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} aria-label="Go to Tracker page">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Preferences</h1>
            <p className="text-base text-muted-foreground">Customize your application experience.</p>
          </div>
        </div>
      </header>

      <section id="appearance-settings">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Appearance</CardTitle>
            </div>
            <CardDescription className="text-sm">Adjust how the application looks and feels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
              <Label htmlFor="theme-toggle-prefs" className="text-sm font-medium">Theme</Label>
              <ThemeToggle />
            </div>
            <div className="p-3 bg-muted/30 rounded-md border space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <Globe className="h-5 w-5 text-muted-foreground" />
                 <h4 className="font-medium text-base">Regional Settings</h4>
              </div>
              <div>
                <Label htmlFor="country-select-prefs" className="text-sm text-muted-foreground mb-1 block">Country</Label>
                <Select defaultValue="us">
                  <SelectTrigger id="country-select-prefs" className="h-9 text-sm bg-background border-input focus:ring-ring">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language-select-prefs" className="text-sm text-muted-foreground mb-1 block">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language-select-prefs" className="h-9 text-sm bg-background border-input focus:ring-ring">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español (Spanish)</SelectItem>
                    <SelectItem value="fr">Français (French)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section id="notification-settings">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Notifications</CardTitle>
            </div>
            <CardDescription className="text-sm">Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
              <Label htmlFor="daily-reminder-prefs" className="text-sm font-medium">Daily Reminder</Label>
              <Switch id="daily-reminder-prefs" checked={dailyReminder} onCheckedChange={setDailyReminder} />
            </div>
            {/* Add more notification settings here */}
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section id="privacy-policy-section">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Legal & Privacy</CardTitle>
            </div>
             <CardDescription className="text-sm">Review our policies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" asChild className="p-0 h-auto text-sm">
                <Link href="#privacy-policy">
                View Privacy Policy
                </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              (This is a placeholder link)
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
