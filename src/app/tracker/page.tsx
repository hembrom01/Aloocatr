
"use client";

import { useMemo } from 'react';
import { AllocatedTaskTracker } from '@/components/allocated-task-tracker';
import { useTaskManager } from '@/hooks/use-task-manager';
import { TaskCompletionChart } from '@/components/task-completion-chart'; 
import type { Task } from '@/types';
import { AppLoadingScreen } from '@/components/app-loading-screen';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { DownloadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/lib/utils';
import { format } from 'date-fns';

export default function ProgressPage() { 
  const { 
    tasks, 
    categories,
    getTimeSpentOnTask,
    isLoaded 
  } = useTaskManager();
  const { toast } = useToast();

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

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return 'N/A';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'N/A';
  };

  const prepareExportData = () => {
    return tasksWithAllocations.map(task => {
      const timeSpent = getTimeSpentOnTask(task.id, task.allocationBasis);
      const completionPercentage = task.allocatedTime > 0 ? Math.min(100, (timeSpent / task.allocatedTime) * 100) : 0;
      const timeDifferenceMinutes = timeSpent - task.allocatedTime;
      
      return {
        taskId: task.id,
        taskName: task.name,
        icon: task.icon,
        categoryName: getCategoryName(task.categoryId),
        allocatedTimeMinutes: task.allocatedTime,
        allocationBasis: task.allocationBasis,
        timeSpentMinutes: timeSpent,
        completionPercentage: parseFloat(completionPercentage.toFixed(2)),
        timeDifferenceMinutes: timeDifferenceMinutes,
        targetDurationDays: task.targetDurationDays ?? 'N/A',
        createdAtISO: format(new Date(task.createdAt), "yyyy-MM-dd'T'HH:mm:ssxxx"),
      };
    });
  };

  const handleExportAsCSV = () => {
    const dataToExport = prepareExportData();
    if (dataToExport.length === 0) {
      toast({ title: "No Data", description: "No progress data to export." });
      return;
    }

    const csvHeader = "Task ID,Task Name,Icon,Category Name,Allocated Time (min),Allocation Basis,Time Spent (min),Completion (%),Time Difference (min),Target Duration (days),Created At (ISO)\n";
    const csvRows = dataToExport.map(d => 
      [
        d.taskId,
        `"${d.taskName.replace(/"/g, '""')}"`, // Handle quotes in names
        d.icon,
        `"${getCategoryName(tasks.find(t=>t.id === d.taskId)?.categoryId).replace(/"/g, '""')}"`,
        d.allocatedTimeMinutes,
        d.allocationBasis,
        d.timeSpentMinutes,
        d.completionPercentage,
        d.timeDifferenceMinutes,
        d.targetDurationDays,
        d.createdAtISO
      ].join(',')
    ).join('\n');

    const csvContent = csvHeader + csvRows;
    downloadFile('allocatr_progress_export.csv', csvContent, 'data:text/csv;charset=utf-8;');
    toast({ title: "Export Successful", description: "Progress data exported as CSV." });
  };

  const handleExportAsJSON = () => {
    const dataToExport = prepareExportData();
    if (dataToExport.length === 0) {
      toast({ title: "No Data", description: "No progress data to export." });
      return;
    }
    downloadFile('allocatr_progress_export.json', JSON.stringify(dataToExport, null, 2), 'data:application/json;charset=utf-8;');
    toast({ title: "Export Successful", description: "Progress data exported as JSON." });
  };


  const renderChart = () => {
    if (tasksWithAllocations.length === 0) {
      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground">Task Progress Visuals</h3>
          <p className="text-sm text-muted-foreground py-10">No tasks with allocations to display. Add allocations to your tasks in the Tasks section.</p>
        </div>
      );
    }
    return <TaskCompletionChart tasks={tasksWithAllocations} getTimeSpent={getTimeSpentOnTask} />;
  };

  return (
    <div className="space-y-8 animate-page-content-appear pb-16">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Task Progress</h1>
      </header>
      
      <div className="mt-4 mb-8">
        {renderChart()}
      </div>

      {tasksWithAllocations.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4 mb-6">
          <Button variant="outline" onClick={handleExportAsCSV} className="text-sm">
            <DownloadCloud className="mr-2 h-4 w-4" />
            Export Progress as CSV
          </Button>
          <Button variant="outline" onClick={handleExportAsJSON} className="text-sm">
            <DownloadCloud className="mr-2 h-4 w-4" />
            Export Progress as JSON
          </Button>
        </div>
      )}

      <Separator className="my-6" />
      
      <section aria-labelledby="allocated-task-tracker-title">
        <h2 id="allocated-task-tracker-title" className="sr-only">Allocated Task List</h2>
        <AllocatedTaskTracker tasks={tasks} getTimeSpent={getTimeSpentOnTask} /> 
      </section>
    </div>
  );
}
