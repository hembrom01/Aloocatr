
"use client";

import { BudgetedTaskTracker } from '@/components/budgeted-task-tracker';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Zap } from 'lucide-react';

export default function TrackerPage() {
  const { 
    tasks, 
    getTimeSpentOnTask,
    isLoaded 
  } = useTaskManager();
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl font-semibold">Loading Tracker...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Task Progress Tracker</h1>
        <p className="text-muted-foreground">Monitor your time spent against your budgeted tasks.</p>
      </header>
      
      <section aria-labelledby="budgeted-task-tracker-title">
        <h2 id="budgeted-task-tracker-title" className="sr-only">Budgeted Task List</h2>
        <BudgetedTaskTracker tasks={tasks} getTimeSpent={getTimeSpentOnTask} />
      </section>
    </div>
  );
}

