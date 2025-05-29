
"use client";

import { useState } from 'react';
import { DailyTaskTimeline } from '@/components/daily-task-timeline';
import { DateNavigator } from '@/components/date-navigator';
import { useTaskManager } from '@/hooks/use-task-manager';
import { Zap } from 'lucide-react';
import { format } from 'date-fns';
import { DailyUsagePieChart } from '@/components/daily-usage-pie-chart';

export default function TimelinePage() {
  const { 
    tasks, 
    getLogsForDay, 
    isLoaded 
  } = useTaskManager();
  
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    <div className="space-y-8 pb-16 animate-page-content-appear"> {/* Added padding-bottom for nav bar and animation class */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Timeline for {format(selectedDate, 'MMMM d')}
        </h1>
        <p className="text-muted-foreground">
          A chronological view of your tasks for {format(selectedDate, 'PPP')}.
        </p>
      </header>
      
      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <section aria-labelledby="daily-usage-pie-chart-title">
        <h2 id="daily-usage-pie-chart-title" className="sr-only">Daily Time Usage Pie Chart for {format(selectedDate, 'PPP')}</h2>
        <DailyUsagePieChart tasks={tasks} taskLogs={dailyLogs} selectedDate={selectedDate} />
      </section>

      <section aria-labelledby="daily-task-timeline-title">
        <h2 id="daily-task-timeline-title" className="sr-only">Daily Task Log for {format(selectedDate, 'PPP')}</h2>
        <DailyTaskTimeline tasks={tasks} taskLogs={dailyLogs} currentDate={selectedDate} />
      </section>
    </div>
  );
}
