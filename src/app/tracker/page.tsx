
"use client";

import { useState, useMemo } from 'react';
import { BudgetedTaskTracker } from '@/components/budgeted-task-tracker';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Zap } from 'lucide-react';
import { BudgetComparisonBarChart } from '@/components/budget-comparison-bar-chart';
import { TaskCompletionChart } from '@/components/task-completion-chart'; // New import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Task } from '@/types';

type ProgressChartType = 'budgetComparison' | 'taskCompletion';

export default function TrackerPage() {
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
      <div className="flex justify-center items-center min-h-screen">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl font-semibold">Loading Progress...</p>
      </div>
    );
  }

  const renderChart = () => {
    if (tasksWithBudgets.length === 0) {
      return (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Task Progress Visuals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground text-center py-10">No tasks with budgets to display. Add budgets to your tasks in the Tasks section.</p>
          </CardContent>
        </Card>
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Task Progress</h1>
        <p className="text-base text-muted-foreground">Monitor your time spent against your budgeted tasks.</p>
      </header>

      <Card className="shadow-md">
        <CardContent className="p-4 space-y-4">
          <div>
            <label htmlFor="progressChartTypeSelect" className="text-sm font-medium text-muted-foreground">
              Select Visual:
            </label>
            <Select value={selectedChartType} onValueChange={(value) => setSelectedChartType(value as ProgressChartType)}>
              <SelectTrigger id="progressChartTypeSelect" className="w-full sm:w-[280px] mt-1 text-sm">
                <SelectValue placeholder="Select visual type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budgetComparison" className="text-sm">Budget vs. Actual Time</SelectItem>
                <SelectItem value="taskCompletion" className="text-sm">Task Completion Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4">
            {renderChart()}
          </div>
        </CardContent>
      </Card>
      
      <section aria-labelledby="budgeted-task-tracker-title">
        <h2 id="budgeted-task-tracker-title" className="sr-only">Budgeted Task List</h2>
        <BudgetedTaskTracker tasks={tasks} getTimeSpent={getTimeSpentOnTask} />
      </section>
    </div>
  );
}
