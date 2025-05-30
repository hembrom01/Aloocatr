
"use client";

import { useState, useMemo } from 'react';
import { AllocatedTaskTracker } from '@/components/allocated-task-tracker'; // Renamed
import { useTaskManager } from '@/hooks/use-task-manager';
import { AllocationComparisonBarChart } from '@/components/allocation-comparison-bar-chart'; // Renamed
import { TaskCompletionChart } from '@/components/task-completion-chart'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task } from '@/types';
import { Label } from '@/components/ui/label';
import { AppLoadingScreen } from '@/components/app-loading-screen';
import { Separator } from '@/components/ui/separator';

type ProgressChartType = 'allocationComparison' | 'taskCompletion'; // Renamed

export default function ProgressPage() { 
  const { 
    tasks, 
    getTimeSpentOnTask,
    isLoaded 
  } = useTaskManager();

  const [selectedChartType, setSelectedChartType] = useState<ProgressChartType>('allocationComparison');

  const tasksWithAllocations = useMemo(() => { // Renamed
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
    if (tasksWithAllocations.length === 0) { // Renamed
      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground">Task Progress Visuals</h3>
          <p className="text-sm text-muted-foreground py-10">No tasks with allocations to display. Add allocations to your tasks in the Tasks section.</p>
        </div>
      );
    }

    switch (selectedChartType) {
      case 'allocationComparison':
        return <AllocationComparisonBarChart tasks={tasksWithAllocations} getTimeSpent={getTimeSpentOnTask} />; // Renamed component and prop
      case 'taskCompletion':
        return <TaskCompletionChart tasks={tasksWithAllocations} getTimeSpent={getTimeSpentOnTask} />; // Prop name consistent
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-page-content-appear pb-16">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Task Progress</h1>
      </header>

      <div className="my-6 flex flex-col items-center space-y-2">
        <Label htmlFor="progressChartTypeSelect" className="text-xs font-medium text-muted-foreground">
          Select Visual:
        </Label>
        <Select value={selectedChartType} onValueChange={(value) => setSelectedChartType(value as ProgressChartType)}>
          <SelectTrigger id="progressChartTypeSelect" className="w-[280px] text-sm">
            <SelectValue placeholder="Select visual type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allocationComparison" className="text-sm">Allocated vs. Actual Time</SelectItem> 
            <SelectItem value="taskCompletion" className="text-sm">Task Completion Percentage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
