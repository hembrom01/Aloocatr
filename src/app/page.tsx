
"use client";

import Link from 'next/link';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Zap, PlusCircle, TimerIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { taskIcons, defaultTaskIcon } from '@/config/icons';
import { cn } from '@/lib/utils';
import { useEffect, useState, memo } from 'react';
import { formatSecondsToHHMMSS } from '@/lib/utils';
import type { ActiveTimer as ActiveTimerType, Task as TaskType } from '@/types';


// Component to display individual active task bar
const ActiveTaskBar = memo(({ activeTimer, task, onStop }: { activeTimer: ActiveTimerType; task: TaskType | undefined; onStop: () => void }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    const updateDisplay = () => {
      const now = Date.now();
      const diffMs = now - activeTimer.startTime;
      const totalSeconds = Math.floor(diffMs / 1000);
      setElapsedTime(formatSecondsToHHMMSS(totalSeconds));
    };

    updateDisplay(); // Initial display
    const intervalId = setInterval(updateDisplay, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [activeTimer.startTime]);

  if (!task) return null;

  const IconComponent = taskIcons[task.icon] || taskIcons[defaultTaskIcon];

  return (
    <Card
      className="w-full mx-auto mb-2 shadow-md border-primary bg-card cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onStop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onStop()}
      aria-label={`Stop ${task.name}`}
    >
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          <IconComponent className="h-6 w-6 mr-3 text-primary" />
          <div>
            <p className="text-md font-semibold text-foreground">{task.name}</p>
            <p className="text-xs text-muted-foreground">Running...</p>
          </div>
        </div>
        <div className="flex items-center">
          <TimerIcon className="h-5 w-5 mr-2 text-primary" />
          <p className="text-lg font-mono text-primary">{elapsedTime}</p>
        </div>
      </CardContent>
    </Card>
  );
});
ActiveTaskBar.displayName = 'ActiveTaskBar';


export default function TrackerPage() {
  const {
    tasks,
    activeTimers,
    toggleTask,
    stopTask,
    isTaskActive,
    getTaskById,
    isLoaded
  } = useTaskManager();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl font-semibold">Loading ChronoFlow...</p>
      </div>
    );
  }

  return (
    <div className="animate-page-content-appear">
      {/* Active Timer Display Bars - MOVED TO TOP & MODIFIED */}
      {activeTimers.length > 0 && (
        <div className="w-full max-w-lg mx-auto mb-6 space-y-2">
          {activeTimers.map(timer => {
            const task = getTaskById(timer.taskId);
            return (
              <ActiveTaskBar
                key={timer.taskId}
                activeTimer={timer}
                task={task}
                onStop={() => stopTask(timer.taskId)}
              />
            );
          })}
        </div>
      )}

      <div className="space-y-6">
        <div className="text-center mt-4">
          <p className="text-foreground">Click on a task below to start or stop tracking.</p>
        </div>

        <Separator className="my-4" />

        {tasks.length === 0 && (
          <Alert variant="default" className="border-primary/50 bg-primary/10">
            <AlertCircle className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-semibold text-primary">No Tasks Yet!</AlertTitle>
            <AlertDescription className="text-foreground">
              You haven't added any tasks. Click the
              <Button variant="link" asChild className="p-0 h-auto ml-1 mr-1 text-primary hover:underline">
                <Link href="/settings">plus icon</Link>
              </Button>
               or go to Tasks to add your first task.
            </AlertDescription>
          </Alert>
        )}

        <TooltipProvider>
          <div className="flex flex-wrap justify-center items-start gap-3 px-6">
            {tasks.map((task) => {
              const IconComponent = taskIcons[task.icon] || taskIcons[defaultTaskIcon];
              const isActive = isTaskActive(task.id);
              return (
                <Tooltip key={task.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex flex-col items-center justify-center h-20 w-20 p-2 shadow-sm hover:shadow-md transition-all transform hover:scale-105", 
                        isActive && "ring-2 ring-primary bg-primary/10 border-primary"
                      )}
                      onClick={() => toggleTask(task.id)}
                      aria-label={isActive ? `Stop ${task.name}` : `Start ${task.name}`}
                    >
                      <IconComponent className={cn("h-8 w-8", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="mt-1 text-[11px] text-center w-full whitespace-nowrap overflow-hidden text-ellipsis">
                        {task.name}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{task.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/settings" passHref legacyBehavior>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center h-20 w-20 p-2 shadow-sm hover:shadow-md transition-all transform hover:scale-105" 
                    aria-label="Add new task"
                  >
                    <PlusCircle className="h-8 w-8 text-muted-foreground" />
                     <span className="mt-1 text-[11px] text-center w-full whitespace-nowrap overflow-hidden text-ellipsis">
                        Add Task
                      </span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new task (Go to Tasks)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

