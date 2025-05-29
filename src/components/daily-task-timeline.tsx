
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Task, TaskLog } from '@/types';
import { taskIcons, defaultTaskIcon } from '@/config/icons';
import { format, isToday } from 'date-fns'; 
import { formatMinutesToFriendlyDuration } from '@/lib/utils'; // Updated import

interface DailyTaskTimelineProps {
  tasks: Task[];
  taskLogs: TaskLog[];
  currentDate: Date; 
}

export const DailyTaskTimeline: FC<DailyTaskTimelineProps> = ({ tasks, taskLogs, currentDate }) => {
  const getTaskName = (taskId: string) => tasks.find(t => t.id === taskId)?.name || 'Unknown Task';
  const getTaskIcon = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? taskIcons[task.icon] || taskIcons[defaultTaskIcon] : taskIcons[defaultTaskIcon];
  };

  const timelineTitle = isToday(currentDate) ? "Today's Timeline" : `Timeline for ${format(currentDate, 'MMMM d')}`;
  const timelineDescription = format(currentDate, 'PPP');

  if (!taskLogs.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{timelineTitle}</CardTitle>
          <CardDescription>{timelineDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tasks logged for {isToday(currentDate) ? 'today' : format(currentDate, 'MMMM d')} yet. Start a timer to see your progress!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{timelineTitle}</CardTitle>
        <CardDescription>{timelineDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {taskLogs.map((log, index) => {
              const IconComponent = getTaskIcon(log.taskId);
              return (
                <div key={log.id}>
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-medium">{getTaskName(log.taskId)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(log.startTime), 'p')} - {format(new Date(log.endTime), 'p')}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary whitespace-nowrap">
                      {formatMinutesToFriendlyDuration(log.duration)} {/* Updated format */}
                    </p>
                  </div>
                  {index < taskLogs.length - 1 && <Separator className="my-1" />}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
