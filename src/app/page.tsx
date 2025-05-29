
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TaskTimerLauncher } from '@/components/task-timer-launcher';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function LauncherPage() {
  const { 
    tasks, 
    activeTimer, 
    startTimer, 
    stopTimer,
    isLoaded 
  } = useTaskManager();
  
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
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Task Launcher</h1>
        <p className="text-muted-foreground">Quickly start or stop your task timers.</p>
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

      <section aria-labelledby="task-timer-launcher-title">
        <h2 id="task-timer-launcher-title" className="sr-only">Quick Start Tasks</h2>
        <TaskTimerLauncher tasks={tasks} activeTimer={activeTimer} onToggleTimer={startTimer} />
      </section>

      {/* Active Timer Display */}
      {activeTimer && tasks.find(t => t.id === activeTimer.taskId) && (
        <Card className="fixed bottom-20 right-4 w-80 shadow-xl z-50 border-primary bg-card">
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
