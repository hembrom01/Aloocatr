
"use client";

import Link from 'next/link';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, PlusCircle, TimerIcon, Rocket } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { taskIcons, defaultTaskIcon } from '@/config/icons';
import { cn } from '@/lib/utils';
import { useEffect, useState, memo } from 'react';
import { formatSecondsToHHMMSS } from '@/lib/utils';
import type { ActiveTimer as ActiveTimerType, Task as TaskType } from '@/types';
import { AppLoadingScreen } from '@/components/app-loading-screen';
import { useRouter } from 'next/navigation';

const FIRST_TASK_GUIDE_SHOWN_KEY = 'allocatrFirstTaskGuideShown';

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
            <p className="text-sm font-semibold text-foreground">{task.name}</p>
            <p className="text-xs text-muted-foreground">Running...</p>
          </div>
        </div>
        <div className="flex items-center">
          <TimerIcon className="h-5 w-5 mr-2 text-primary" />
          <p className="text-sm font-mono text-primary">{elapsedTime}</p>
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
  const router = useRouter();
  const [showFirstTaskGuide, setShowFirstTaskGuide] = useState(false);

  useEffect(() => {
    if (isLoaded && tasks.length === 0) {
      if (typeof window !== 'undefined') {
        const guideShown = localStorage.getItem(FIRST_TASK_GUIDE_SHOWN_KEY);
        if (guideShown !== 'true') {
          setShowFirstTaskGuide(true);
        }
      }
    }
  }, [isLoaded, tasks]);

  const handleFirstTaskGuideClose = () => {
    setShowFirstTaskGuide(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(FIRST_TASK_GUIDE_SHOWN_KEY, 'true');
    }
  };

  const handleGoToTasksPage = () => {
    handleFirstTaskGuideClose();
    router.push('/settings');
  };

  if (!isLoaded) {
    return (
      <AppLoadingScreen
        isAppActuallyLoaded={isLoaded}
        onLoadingFinished={() => {}}
      />
    );
  }

  return (
    <div className="animate-page-content-appear">
      {/* First Task Guide Dialog */}
      <Dialog open={showFirstTaskGuide} onOpenChange={(isOpen) => {
        if (!isOpen) handleFirstTaskGuideClose();
        else setShowFirstTaskGuide(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <Rocket className="h-12 w-12 text-primary" />
            </div>
            <DialogTitle className="text-center text-lg">Welcome to Allocatr!</DialogTitle>
            <DialogDescription className="text-center text-sm">
              Ready to manage your time like a pro?
              Let's start by adding your first task.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-4">
            <Button onClick={handleGoToTasksPage} className="w-full sm:w-auto">
              Add Your First Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Active Timer Display Bars */}
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
          <p className="text-sm text-foreground">Click on a task below to start or stop tracking.</p>
        </div>

        <Separator className="my-4" />

        {tasks.length === 0 && !showFirstTaskGuide && (
          <Alert variant="default" className="border-primary/50 bg-primary/10">
            <AlertCircle className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-semibold text-primary">No Tasks Yet!</AlertTitle>
            <AlertDescription className="text-xs text-foreground">
              You haven't added any tasks. Click the
              <Button variant="link" asChild className="p-0 h-auto ml-1 mr-1 text-primary hover:underline text-xs">
                <Link href="/settings">plus icon</Link>
              </Button>
               or go to Tasks to add your first task.
            </AlertDescription>
          </Alert>
        )}

        <TooltipProvider>
          <div className="grid grid-cols-4 gap-2 px-4">
            {tasks.map((task) => {
              const IconComponent = taskIcons[task.icon] || taskIcons[defaultTaskIcon];
              const isActive = isTaskActive(task.id);
              return (
                <Tooltip key={task.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-24 py-2 px-1 flex flex-col items-center justify-center overflow-hidden",
                        "shadow-sm hover:shadow-md transition-all transform hover:scale-105",
                        isActive && "ring-2 ring-primary bg-primary/10 border-primary"
                      )}
                      onClick={() => toggleTask(task.id)}
                      aria-label={isActive ? `Stop ${task.name}` : `Start ${task.name}`}
                    >
                      <IconComponent className={cn("h-10 w-10", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("mt-1 text-[11px] text-center w-full leading-tight", isActive ? "text-primary" : "text-muted-foreground")}>
                        {task.name}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{task.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/settings" passHref legacyBehavior>
                  <Button
                    variant="outline"
                    className="w-full h-24 py-2 px-1 flex flex-col items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-all transform hover:scale-105"
                    aria-label="Add new task"
                  >
                    <PlusCircle className="h-10 w-10 text-muted-foreground" />
                     <span className="mt-1 text-[11px] text-center w-full leading-tight text-foreground">
                        Add Task
                      </span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Add a new task (Go to Tasks)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
