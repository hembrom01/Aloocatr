
"use client";

import { useEffect, useState } from 'react';
import { DailyTaskTimeline } from '@/components/daily-task-timeline';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Zap } from 'lucide-react';

export default function TimelinePage() {
  const { 
    tasks, 
    getLogsForDay, 
    isLoaded 
  } = useTaskManager();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute to refresh timeline for "today"
    return () => clearInterval(timerId);
  }, []);

  const dailyLogs = getLogsForDay(currentDate);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl font-semibold">Loading Timeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Daily Timeline</h1>
        <p className="text-muted-foreground">A chronological view of your tasks for the day.</p>
      </header>
      
      <section aria-labelledby="daily-task-timeline-title">
        <h2 id="daily-task-timeline-title" className="sr-only">Daily Task Log</h2>
        <DailyTaskTimeline tasks={tasks} taskLogs={dailyLogs} currentDate={currentDate} />
      </section>
    </div>
  );
}
