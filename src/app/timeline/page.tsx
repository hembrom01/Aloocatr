
"use client";

import { useState, useMemo, useEffect } from 'react';
import { DailyTaskTimeline } from '@/components/daily-task-timeline';
import { DateNavigator } from '@/components/date-navigator';
import { useTaskManager } from '@/hooks/use-task-manager';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { DailyUsagePieChart } from '@/components/daily-usage-pie-chart';
import { ProductivityTrendChart } from '@/components/productivity-trend-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AppLoadingScreen } from '@/components/app-loading-screen';
import { Separator } from '@/components/ui/separator';

type ChartType = 'dailyBreakdown' | 'weeklyProductivity';

export default function TimelinePage() {
  const { 
    tasks, 
    getLogsForDay, 
    getAggregatedLogsForPeriod,
    isLoaded 
  } = useTaskManager();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); 
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('dailyBreakdown');

  useEffect(() => {
    // Initialize selectedDate on the client side to avoid hydration mismatch
    setSelectedDate(new Date());
  }, []);

  const dailyLogs = useMemo(() => {
    if (!selectedDate) return [];
    return getLogsForDay(selectedDate);
  }, [selectedDate, getLogsForDay]);

  const weeklyProductivityData = useMemo(() => {
    if (selectedChartType !== 'weeklyProductivity' || !selectedDate) return [];
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); 
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return getAggregatedLogsForPeriod(weekStart, weekEnd, 'EEE');
  }, [selectedDate, selectedChartType, getAggregatedLogsForPeriod]);

  if (!isLoaded || !selectedDate) {
    return (
      <AppLoadingScreen
        isAppActuallyLoaded={isLoaded && !!selectedDate}
        onLoadingFinished={() => {}}
      />
    );
  }

  const renderChart = () => {
    switch (selectedChartType) {
      case 'dailyBreakdown':
        return <DailyUsagePieChart tasks={tasks} taskLogs={dailyLogs} selectedDate={selectedDate} />;
      case 'weeklyProductivity':
        return (
          <ProductivityTrendChart 
            data={weeklyProductivityData} 
            title="Weekly Productivity Trend"
            description={`Tracked time from ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d')} to ${format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-page-content-appear">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Timeline for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Loading...'}
        </h1>
        <p className="text-xs text-muted-foreground">
          {selectedDate ? `A chronological view of your tasks and productivity for ${format(selectedDate, 'PPP')}.` : 'Loading date...'}
        </p>
      </header>
      
      {selectedDate && <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />}
      
      <div className="my-6 flex flex-col items-center space-y-2">
        <Label htmlFor="chartTypeSelect" className="text-xs font-medium text-muted-foreground">
          Select Chart View:
        </Label>
        <Select value={selectedChartType} onValueChange={(value) => setSelectedChartType(value as ChartType)}>
          <SelectTrigger id="chartTypeSelect" className="w-[280px] text-sm">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dailyBreakdown" className="text-sm">Daily Time Breakdown (Pie Chart)</SelectItem>
            <SelectItem value="weeklyProductivity" className="text-sm">Weekly Productivity (Line Chart)</SelectItem>
          </SelectContent>
        </Select>
      </div>
          
      <div className="mt-4 mb-8"> {/* Chart rendering section */}
        {selectedDate && renderChart()}
      </div>

      <Separator className="my-6" />

      {/* Daily Task Timeline rendered directly, not in a card */}
      <section aria-labelledby="daily-task-timeline-title" className="mt-8">
        <h2 id="daily-task-timeline-title" className="sr-only">Daily Task Log for {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}</h2>
        {selectedDate && <DailyTaskTimeline tasks={tasks} taskLogs={dailyLogs} currentDate={selectedDate} />}
      </section>
    </div>
  );
}
