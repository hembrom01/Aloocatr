
"use client";

import { useMemo } from 'react'; // Removed useState
import { AllocatedTaskTracker } from '@/components/allocated-task-tracker';
import { useTaskManager } from '@/hooks/use-task-manager';
import { TaskCompletionChart } from '@/components/task-completion-chart'; 
// Removed Select and Label imports
// Removed AllocationComparisonBarChart import
import type { Task } from '@/types';
import { AppLoadingScreen } from '@/components/app-loading-screen';
import { Separator } from '@/components/ui/separator';

// Removed ProgressChartType type

export default function ProgressPage() { 
  const { 
    tasks, 
    getTimeSpentOnTask,
    isLoaded 
  } = useTaskManager();

  // Removed selectedChartType state

  const tasksWithAllocations = useMemo(() => {
    return tasks.filter(task => task.allocatedTime > 0);
  }, [tasks]);
  
  if (!isLoaded) {
     return (
      <AppLoadingScreen
        isAppActuallyLoaded={isLoaded}
        onLoadingFinished={() => {}}
      />
    );
  }

  const renderChart = () => {
    if (tasksWithAllocations.length === 0) {
      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground">Task Progress Visuals</h3>
          <p className="text-sm text-muted-foreground py-10">No tasks with allocations to display. Add allocations to your tasks in the Tasks section.</p>
        </div>
      );
    }
    // Directly render TaskCompletionChart as it's the only one
    return <TaskCompletionChart tasks={tasksWithAllocations} getTimeSpent={getTimeSpentOnTask} />;
  };

  return (
    <div className="space-y-8 animate-page-content-appear pb-16">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Task Progress</h1>
      </header>

      {/* Removed the Select component for chart type selection */}
      
      <div className="mt-4 mb-8">
        {renderChart()}
      </div>

      <Separator className="my-6" />
      
      <section aria-labelledby="allocated-task-tracker-title">
        <h2 id="allocated-task-tracker-title" className="sr-only">Allocated Task List</h2>
        <AllocatedTaskTracker tasks={tasks} getTimeSpent={getTimeSpentOnTask} /> 
      </section>
    </div>
  );
}

