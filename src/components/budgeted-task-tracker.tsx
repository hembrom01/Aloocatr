"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Task } from '@/types';
import { taskIcons, defaultTaskIcon } from '@/config/icons';

interface BudgetedTaskTrackerProps {
  tasks: Task[];
  getTimeSpent: (taskId: string, basis: 'weekly' | 'monthly') => number;
}

export const BudgetedTaskTracker: FC<BudgetedTaskTrackerProps> = ({ tasks, getTimeSpent }) => {
  if (!tasks.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budgeted Task Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tasks budgeted yet. Add tasks in Settings to track your progress.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budgeted Task Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {tasks.map((task) => {
              const IconComponent = taskIcons[task.icon] || taskIcons[defaultTaskIcon];
              const timeSpent = getTimeSpent(task.id, task.budgetBasis);
              const progressPercentage = task.budgetedTime > 0 ? Math.min((timeSpent / task.budgetedTime) * 100, 100) : 0;

              return (
                <div key={task.id} className="p-3 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <span className="font-medium">{task.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {timeSpent} / {task.budgetedTime} min ({task.budgetBasis})
                    </span>
                  </div>
                  <Progress value={progressPercentage} aria-label={`${task.name} progress`} className="h-3" />
                  {timeSpent > task.budgetedTime && (
                     <p className="text-xs text-destructive mt-1">Over budget by {timeSpent - task.budgetedTime} min</p>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
