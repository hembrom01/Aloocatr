
"use client";

import Link from 'next/link';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Zap, PlusCircle, Square, Play } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { taskIcons, defaultTaskIcon } from '@/config/icons';
import { cn } from '@/lib/utils';

export default function TrackerPage() {
  const { 
    tasks, 
    activeTimer, 
    startTimer, 
    stopTimer,
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

  const onToggleTimer = (taskId: string) => {
    startTimer(taskId); // startTimer now handles toggle logic internally in useTaskManager
  };

  return (
    <div className="space-y-6">
      <div className="text-center mt-4">
        <p className="text-foreground">Click on a task below to start or stop tracking.</p> {/* Changed text-muted-foreground to text-foreground */}
      </div>
      
      <Separator className="my-4" />

      {tasks.length === 0 && (
        <Alert variant="default" className="border-primary/50 text-primary-foreground bg-primary/10">
          <AlertCircle className="h-4 w-4 !text-primary" />
          <AlertTitle className="font-semibold">No Tasks Yet!</AlertTitle>
          <AlertDescription>
            You haven't added any tasks. Click the 
            <Button variant="link" asChild className="p-0 h-auto ml-1 mr-1 text-primary hover:underline">
              <Link href="/settings">plus icon</Link>
            </Button> 
             or go to Settings to add your first task.
          </AlertDescription>
        </Alert>
      )}

      <TooltipProvider>
        <div className="flex flex-wrap justify-center items-center gap-3 px-2">
          {tasks.map((task) => {
            const IconComponent = taskIcons[task.icon] || taskIcons[defaultTaskIcon];
            const isActive = activeTimer?.taskId === task.id;
            return (
              <Tooltip key={task.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex flex-col items-center justify-center p-2 h-20 w-20 shadow-sm hover:shadow-md transition-all transform hover:scale-105",
                      isActive && "ring-2 ring-primary bg-primary/10"
                    )}
                    onClick={() => onToggleTimer(task.id)}
                    aria-label={isActive ? `Stop ${task.name}` : `Start ${task.name}`}
                  >
                    <IconComponent className={cn("h-7 w-7 mb-1", isActive ? "text-primary" : "text-muted-foreground")} />
                    {isActive ? 
                      <Square className="h-3 w-3 text-primary fill-current" /> : 
                      <Play className="h-3 w-3 text-muted-foreground" />}
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
                  className="flex flex-col items-center justify-center p-2 h-20 w-20 shadow-sm hover:shadow-md transition-all transform hover:scale-105"
                  aria-label="Add new task"
                >
                  <PlusCircle className="h-7 w-7 mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Task</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new task (Go to Settings)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      
      {/* Active Timer Display */}
      {activeTimer && tasks.find(t => t.id === activeTimer.taskId) && (
        <Card className="fixed bottom-20 right-4 w-80 shadow-xl z-50 border-primary bg-card">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary animate-ping" />
              Active: {tasks.find(t => t.id === activeTimer.taskId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground">
              Started: {new Date(activeTimer.startTime).toLocaleTimeString()}
            </p>
            <Button onClick={stopTimer} className="w-full mt-3" variant="destructive" size="sm">Stop Timer</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
