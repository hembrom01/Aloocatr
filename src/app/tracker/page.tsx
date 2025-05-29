
"use client";

import { BudgetedTaskTracker } from '@/components/budgeted-task-tracker';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Zap } from 'lucide-react';
import { BudgetComparisonBarChart } from '@/components/budget-comparison-bar-chart'; // New import

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
        <p className="ml-4 text-xl font-semibold">Loading Progress...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page-content-appear pb-16"> {/* Added bottom padding */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Task Progress</h1>
        <p className="text-muted-foreground">Monitor your time spent against your budgeted tasks.</p>
      </header>

      <section aria-labelledby="budget-comparison-chart-title">
        <h2 id="budget-comparison-chart-title" className="sr-only">Budget vs. Actual Time Chart</h2>
        <BudgetComparisonBarChart tasks={tasks} getTimeSpent={getTimeSpentOnTask} />
      </section>
      
      <section aria-labelledby="budgeted-task-tracker-title">
        <h2 id="budgeted-task-tracker-title" className="sr-only">Budgeted Task List</h2>
        <BudgetedTaskTracker tasks={tasks} getTimeSpent={getTimeSpentOnTask} />
      </section>
    </div>
  );
}
