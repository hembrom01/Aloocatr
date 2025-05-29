
"use client";

import type { FC } from 'react';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Task, TaskLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { formatMinutesToFriendlyDuration } from '@/lib/utils'; // Updated import

interface DailyUsagePieChartProps {
  tasks: Task[];
  taskLogs: TaskLog[];
  selectedDate: Date;
}

// Define a broader palette of colors for chart segments
const COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#82ca9d', // A distinct green
  '#ffc658', // A distinct yellow/orange
  '#8884d8', // A distinct purple
  '#FA8072', // Salmon
  '#20B2AA', // LightSeaGreen
  '#778899', // LightSlateGray
];
const UNTRACKED_COLOR = 'hsl(var(--muted))'; // Color for untracked time

export const DailyUsagePieChart: FC<DailyUsagePieChartProps> = ({ tasks, taskLogs, selectedDate }) => {
  const dataForChart = useMemo(() => {
    const aggregatedData: { [key: string]: { value: number, isTask: boolean } } = {};
    let totalTrackedTime = 0;

    taskLogs.forEach(log => {
      const task = tasks.find(t => t.id === log.taskId);
      const taskName = task?.name || 'Deleted Task'; // Handle if task was deleted
      aggregatedData[taskName] = {
        value: (aggregatedData[taskName]?.value || 0) + log.duration,
        isTask: true,
      };
      totalTrackedTime += log.duration;
    });

    const totalMinutesInDay = 24 * 60;
    const untrackedTime = Math.max(0, totalMinutesInDay - totalTrackedTime); // Ensure untracked time isn't negative

    const chartData = Object.entries(aggregatedData).map(([name, data]) => ({
      name,
      value: data.value,
      isTask: data.isTask,
    }));

    if (untrackedTime > 0 || chartData.length === 0) { // Add untracked if it's > 0 or if no tasks logged at all
      chartData.push({ name: 'Untracked Time', value: untrackedTime, isTask: false });
    }
    
    return chartData.filter(d => d.value > 0 || d.name === 'Untracked Time'); // Show segments with time or always show untracked if it's the only item
  }, [taskLogs, tasks]);

  if (dataForChart.length === 0 || (dataForChart.length === 1 && dataForChart[0].name === 'Untracked Time' && dataForChart[0].value === 0 && taskLogs.length > 0) ) {
     // This condition means all time is tracked, and untracked is 0, but we still want to show the chart if tasks exist.
     // Let's refine the "no data" condition: show "no data" only if there are no task logs for the day.
     if (taskLogs.length === 0) {
      return (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle>Daily Time Breakdown</CardTitle>
            <CardDescription>For {format(selectedDate, 'MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-10">No tasks logged for this day to display in the chart.</p>
          </CardContent>
        </Card>
      );
    }
  }


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = (payload[0].percent * 100).toFixed(0);
      return (
        <div className="p-2 bg-background border border-border rounded-md shadow-lg">
          <p className="font-semibold">{`${data.name}`}</p>
          <p className="text-sm text-muted-foreground">{`Time: ${formatMinutesToFriendlyDuration(data.value)} (${percentage}%)`}</p> {/* Updated format */}
        </div>
      );
    }
    return null;
  };
  
  // If the only entry is "Untracked Time" and it's the full 1440 minutes, it means no tasks were logged.
  // This is handled by the taskLogs.length === 0 check above.

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle>Daily Time Breakdown</CardTitle>
        <CardDescription>Visualizing your time distribution for {format(selectedDate, 'MMMM d, yyyy')}.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={dataForChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              innerRadius={50} // Makes it a donut chart
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {dataForChart.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isTask ? COLORS[index % COLORS.length] : UNTRACKED_COLOR} 
                  stroke={entry.isTask ? COLORS[index % COLORS.length] : UNTRACKED_COLOR}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => {
                const { color } = entry;
                // Format time for legend if needed, here we just show name.
                // const itemData = dataForChart.find(d => d.name === value);
                // const formattedTime = itemData ? formatMinutesToFriendlyDuration(itemData.value) : '';
                // return <span style={{ color }}>{value} ({formattedTime})</span>;
                return <span style={{ color }}>{value}</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
