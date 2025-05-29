"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Task, ActiveTimer } from '@/types';
import { taskIcons, defaultTaskIcon } from '@/config/icons';
import { Play, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskTimerLauncherProps {
  tasks: Task[];
  activeTimer: ActiveTimer | null;
  onToggleTimer: (taskId: string) => void;
}

export const TaskTimerLauncher: FC<TaskTimerLauncherProps> = ({ tasks, activeTimer, onToggleTimer }) => {
  if (!tasks.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Launcher</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tasks budgeted yet. Add tasks in Settings to start tracking time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Launcher</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tasks.map((task) => {
              const IconComponent = taskIcons[task.icon] || taskIcons[defaultTaskIcon];
              const isActive = activeTimer?.taskId === task.id;
              return (
                <Tooltip key={task.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 h-28 w-full shadow-md hover:shadow-lg transition-shadow transform hover:scale-105",
                        isActive && "ring-2 ring-primary animate-pulse"
                      )}
                      onClick={() => onToggleTimer(task.id)}
                      aria-label={isActive ? `Stop ${task.name}` : `Start ${task.name}`}
                    >
                      <IconComponent className="h-8 w-8 mb-2" />
                      <span className="text-sm text-center truncate w-full">{task.name}</span>
                      {isActive && <Square className="h-4 w-4 mt-1 text-primary-foreground" />}
                      {!isActive && <Play className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-accent-foreground" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isActive ? `Stop tracking: ${task.name}` : `Start tracking: ${task.name}`}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
