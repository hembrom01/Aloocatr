
"use client";

import { useState, useMemo } from 'react';
import { BudgetedTaskTracker } from '@/components/budgeted-task-tracker';
import { useTaskManager } from '@/hooks/use-task-manager';
import { BudgetComparisonBarChart } from '@/components/budget-comparison-bar-chart';
import { TaskCompletionChart } from '@/components/task-completion-chart'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task } from '@/types';
import { Label } from '@/components/ui/label';
import { AppLoadingScreen } from '@/components/app-loading-screen';
import { Separator } from '@/components/ui/separator';

type ProgressChartType = 'budgetComparison' | 'taskCompletion';

export default function ProgressPage() { 
  const { 
    tasks, 
    getTimeSpentOnTask,
    isLoaded 
  } = useTaskManager();

  const [selectedChartType, setSelectedChartType] = useState<ProgressChartType>('budgetComparison');

  const tasksWithBudgets = useMemo(() => {
    return tasks.filter(task => task.budgetedTime > 0);
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
    if (tasksWithBudgets.length === 0) {
      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold text-center">Task Progress Visuals</h3>
          <p className="text-sm text-muted-foreground text-center py-10">No tasks with budgets to display. Add budgets to your tasks in the Tasks section.</p>
        </div>
      );
    }

    switch (selectedChartType) {
      case 'budgetComparison':
        return <BudgetComparisonBarChart tasks={tasksWithBudgets} getTimeSpent={getTimeSpentOnTask} />;
      case 'taskCompletion':
        return <TaskCompletionChart tasks={tasksWithBudgets} getTimeSpent={getTimeSpentOnTask} />;
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
            <SelectItem value="budgetComparison" className="text-sm">Budget vs. Actual Time</SelectItem>
            <SelectItem value="taskCompletion" className="text-sm">Task Completion Percentage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-4 mb-8">
        {renderChart()}
      </div>

      <Separator className="my-6" />
      
      <section aria-labelledby="budgeted-task-tracker-title">
        <h2 id="budgeted-task-tracker-title" className="sr-only">Budgeted Task List</h2>
        <BudgetedTaskTracker tasks={tasks} getTimeSpent={getTimeSpentOnTask} />
      </section>
    </div>
  );
}

