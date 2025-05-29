
"use client";

import { useState } from 'react'; // Removed useEffect
import { DailyTaskTimeline } from '@/components/daily-task-timeline';
import { DateNavigator } from '@/components/date-navigator'; // Added
import { useTaskManager } from '@/hooks/use-task-manager';
import { Zap } from 'lucide-react';
import { format } from 'date-fns'; // Added for title

export default function TimelinePage() {
  const { 
    tasks, 
    getLogsForDay, 
    isLoaded 
  } = useTaskManager();
  
  const [selectedDate, setSelectedDate] = useState(new Date()); // Renamed from currentDate

  // Removed useEffect for auto-updating to today, as date is now manually selected

  const dailyLogs = getLogsForDay(selectedDate);

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
      <header className="mb-6"> {/* Adjusted margin */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Timeline for {format(selectedDate, 'MMMM d')}
        </h1>
        <p className="text-muted-foreground">
          A chronological view of your tasks for {format(selectedDate, 'PPP')}.
        </p>
      </header>
      
      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <section aria-labelledby="daily-task-timeline-title">
        <h2 id="daily-task-timeline-title" className="sr-only">Daily Task Log for {format(selectedDate, 'PPP')}</h2>
        <DailyTaskTimeline tasks={tasks} taskLogs={dailyLogs} currentDate={selectedDate} />
      </section>
    </div>
  );
}
