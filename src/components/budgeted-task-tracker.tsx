
"use client";

import type { FC } from 'react';
import { memo, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Task } from '@/types';
import { taskIconsLookup, defaultTaskIcon } from '@/config/icons';
import { formatMinutesToFriendlyDuration } from '@/lib/utils';

interface AllocatedTaskTrackerProps { // Renamed
  tasks: Task[];
  getTimeSpent: (taskId: string, basis: 'daily' | 'weekly' | 'monthly') => number;
}

const AllocatedTaskTrackerComponent: FC<AllocatedTaskTrackerProps> = ({ tasks, getTimeSpent }) => { // Renamed

  const activeTasks = useMemo(() => {
    const now = Date.now();
    return tasks.filter(task => {
      if (task.targetDurationDays === null || task.targetDurationDays === undefined || task.targetDurationDays <= 0) {
        return true; 
      }
      const taskEndDate = task.createdAt + (task.targetDurationDays * 24 * 60 * 60 * 1000);
      return taskEndDate > now; 
    });
  }, [tasks]);


  if (!activeTasks.length) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-foreground mb-4">Allocated Task Tracker</h3> 
        <p className="text-sm text-muted-foreground text-center py-10">No active allocated tasks. Add tasks in Tasks section or check if existing tasks have expired.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Allocated Task Tracker</h3>
      <ScrollArea className="h-[300px] pr-4 border rounded-md p-4 bg-card text-card-foreground shadow-sm">
        <div className="space-y-6">
          {activeTasks.map((task) => {
            const IconComponent = taskIconsLookup[task.icon] || taskIconsLookup[defaultTaskIcon];
            const timeSpent = getTimeSpent(task.id, task.allocationBasis); // Renamed
            const progressPercentage = task.allocatedTime > 0 ? Math.min((timeSpent / task.allocatedTime) * 100, 100) : 0; // Renamed
            
            let basisDisplay = '';
            if (task.allocationBasis === 'daily' || task.allocationBasis === 'weekly' || task.allocationBasis === 'monthly') { // Renamed
              basisDisplay = ` (${task.allocationBasis.charAt(0).toUpperCase() + task.allocationBasis.slice(1)})`; // Renamed
            }

            return (
              <div key={task.id} className="p-3 rounded-lg border bg-background hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{task.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatMinutesToFriendlyDuration(timeSpent)} / {formatMinutesToFriendlyDuration(task.allocatedTime)}{basisDisplay} {/* Renamed */}
                  </span>
                </div>
                <Progress value={progressPercentage} aria-label={`${task.name} progress`} className="h-3" />
                {timeSpent > task.allocatedTime && ( // Renamed
                   <p className="text-xs text-destructive mt-1">
                     Over allocation by {formatMinutesToFriendlyDuration(timeSpent - task.allocatedTime)} {/* Renamed */}
                   </p>
                )}
                {task.targetDurationDays !== undefined && task.targetDurationDays !== null && task.targetDurationDays > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Target for {task.targetDurationDays} days
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export const AllocatedTaskTracker = memo(AllocatedTaskTrackerComponent); // Renamed
AllocatedTaskTracker.displayName = 'AllocatedTaskTracker'; // Renamed
