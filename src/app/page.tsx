"use client";

import { useEffect, useState } from 'react';
import { TaskTimerLauncher } from '@/components/task-timer-launcher';
import { DailyTaskTimeline } from '@/components/daily-task-timeline';
import { BudgetedTaskTracker } from '@/components/budgeted-task-tracker';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { 
    tasks, 
    taskLogs, 
    activeTimer, 
    startTimer, 
    stopTimer, 
    getLogsForDay, 
    getTimeSpentOnTask,
    isLoaded 
  } = useTaskManager();
  
  const [currentDate, setCurrentDate] = useState(new Date()); // For DailyTaskTimeline

  // Update currentDate periodically or on a relevant trigger if needed, for now it's static on load
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute to refresh relative times if any (not strictly needed for current setup)
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
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Your daily overview and task management hub.</p>
      </header>
      
      {tasks.length === 0 && (
        <Alert variant="default" className="border-accent text-accent-foreground bg-accent/10">
          <AlertCircle className="h-4 w-4 !text-accent" />
          <AlertTitle className="font-semibold">Get Started with ChronoFlow!</AlertTitle>
          <AlertDescription>
            You haven't budgeted any tasks yet. Head over to the 
            <Button variant="link" asChild className="p-0 h-auto ml-1 mr-1 text-accent hover:underline">
              <Link href="/settings">Settings</Link>
            </Button> 
            page to add your first task and start tracking your time.
          </AlertDescription>
        </Alert>
      )}

      {/* Section 1: Task Timer Launcher */}
      <section aria-labelledby="task-timer-launcher-title">
        <h2 id="task-timer-launcher-title" className="sr-only">Task Timer Launcher</h2>
        <TaskTimerLauncher tasks={tasks} activeTimer={activeTimer} onToggleTimer={startTimer} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 2: Daily Task Timeline */}
        <section aria-labelledby="daily-task-timeline-title">
          <h2 id="daily-task-timeline-title" className="sr-only">Daily Task Timeline</h2>
          <DailyTaskTimeline tasks={tasks} taskLogs={dailyLogs} currentDate={currentDate} />
        </section>

        {/* Section 3: Budgeted Task Tracker */}
        <section aria-labelledby="budgeted-task-tracker-title">
          <h2 id="budgeted-task-tracker-title" className="sr-only">Budgeted Task Tracker</h2>
          <BudgetedTaskTracker tasks={tasks} getTimeSpent={getTimeSpentOnTask} />
        </section>
      </div>

      {/* Active Timer Display - could be a global component or toast later */}
      {activeTimer && tasks.find(t => t.id === activeTimer.taskId) && (
        <Card className="fixed bottom-4 right-4 w-80 shadow-xl z-50 border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary animate-ping" />
              Active Task: {tasks.find(t => t.id === activeTimer.taskId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Started at: {new Date(activeTimer.startTime).toLocaleTimeString()}
            </p>
            <Button onClick={stopTimer} className="w-full mt-3" variant="destructive">Stop Timer</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
