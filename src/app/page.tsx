
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TaskTimerLauncher } from '@/components/task-timer-launcher';
import { DailyTaskTimeline } from '@/components/daily-task-timeline';
import { BudgetedTaskTracker } from '@/components/budgeted-task-tracker';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Zap, Settings, UserCircle, Palette } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { 
    tasks, 
    activeTimer, 
    startTimer, 
    stopTimer, 
    getLogsForDay, 
    getTimeSpentOnTask,
    isLoaded 
  } = useTaskManager();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timerId);
  }, []);

  const dailyLogs = getLogsForDay(currentDate);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl font-semibold">Loading ChronoFlow...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Your daily overview and task management hub.</p>
      </header>
      
      {tasks.length === 0 && (
        <Alert variant="default" className="border-primary/50 text-primary-foreground bg-primary/10">
          <AlertCircle className="h-4 w-4 !text-primary" />
          <AlertTitle className="font-semibold">Get Started with ChronoFlow!</AlertTitle>
          <AlertDescription>
            You haven't budgeted any tasks yet. Head over to the 
            <Button variant="link" asChild className="p-0 h-auto ml-1 mr-1 text-primary hover:underline">
              <Link href="/settings">Settings</Link>
            </Button> 
            page to add your first task and start tracking your time.
          </AlertDescription>
        </Alert>
      )}

      {/* Section 1: Task Timer Launcher */}
      <section aria-labelledby="task-timer-launcher-title">
        <h2 id="task-timer-launcher-title" className="text-2xl font-semibold mb-4">Quick Start Tasks</h2>
        <TaskTimerLauncher tasks={tasks} activeTimer={activeTimer} onToggleTimer={startTimer} />
      </section>

      {/* Section 2 & 3: Daily Timeline and Budget Tracker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section aria-labelledby="daily-task-timeline-title">
          <h2 id="daily-task-timeline-title" className="sr-only">Daily Task Timeline</h2>
          <DailyTaskTimeline tasks={tasks} taskLogs={dailyLogs} currentDate={currentDate} />
        </section>

        <section aria-labelledby="budgeted-task-tracker-title">
          <h2 id="budgeted-task-tracker-title" className="sr-only">Budgeted Task Tracker</h2>
          <BudgetedTaskTracker tasks={tasks} getTimeSpent={getTimeSpentOnTask} />
        </section>
      </div>

      {/* Section 4: Account & Settings Hub */}
      <section aria-labelledby="settings-hub-title">
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle id="settings-hub-title" className="text-2xl font-semibold flex items-center">
              <Settings className="mr-3 h-6 w-6 text-primary" />
              Manage Your ChronoFlow
            </CardTitle>
            <CardDescription>
              Configure your tasks, preferences, and application settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start p-3 bg-muted/30 rounded-md border">
              <Settings className="h-5 w-5 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <h3 className="font-medium">Task Management</h3>
                <p className="text-sm text-muted-foreground">
                  Add new tasks, edit existing ones, set budget allocations (weekly/monthly), and choose icons on the Settings page.
                </p>
                 <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href="/settings">Go to Task Settings</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start p-3 bg-muted/30 rounded-md border">
              <Palette className="h-5 w-5 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <h3 className="font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark mode using the theme switcher in the bottom navigation bar.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-muted/30 rounded-md border">
               <UserCircle className="h-5 w-5 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <h3 className="font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">
                  Login and account synchronization features are coming soon!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Active Timer Display */}
      {activeTimer && tasks.find(t => t.id === activeTimer.taskId) && (
        <Card className="fixed bottom-20 right-4 w-80 shadow-xl z-50 border-primary bg-card"> {/* Adjusted bottom for nav bar */}
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary animate-ping" />
              Active: {tasks.find(t => t.id === activeTimer.taskId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground">
              Started: {new Date(activeTimer.startTime).toLocaleTimeString()}
            </p>
            <Button onClick={stopTimer} className="w-full mt-3" variant="destructive" size="sm">Stop Timer</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
