
"use client";

import type { FC } from 'react';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Task, TaskLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { formatMinutesToFriendlyDuration } from '@/lib/utils';

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
    const untrackedTime = Math.max(0, totalMinutesInDay - totalTrackedTime); 

    const chartData = Object.entries(aggregatedData).map(([name, data]) => ({
      name,
      value: data.value,
      isTask: data.isTask,
    }));

    if (untrackedTime > 0 || chartData.length === 0) { 
      chartData.push({ name: 'Untracked Time', value: untrackedTime, isTask: false });
    }
    
    return chartData.filter(d => d.value > 0 || (d.name === 'Untracked Time' && d.value >= 0));
  }, [taskLogs, tasks]);

  if (taskLogs.length === 0 && (dataForChart.length === 0 || (dataForChart.length === 1 && dataForChart[0].name === 'Untracked Time' && dataForChart[0].value === 24*60) )) {
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


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const rawPercent = payload[0].percent;
      const percentage = (typeof rawPercent === 'number' && !isNaN(rawPercent))
                         ? (rawPercent * 100).toFixed(1) // Changed to toFixed(1)
                         : '0.0'; // Default to '0.0'
      return (
        <div className="p-2 bg-background border border-border rounded-md shadow-lg">
          <p className="font-semibold">{`${data.name}`}</p>
          <p className="text-sm text-muted-foreground">{`Time: ${formatMinutesToFriendlyDuration(data.value)} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (dataForChart.every(d => d.value === 0) && dataForChart.length > 0) {
     return (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle>Daily Time Breakdown</CardTitle>
            <CardDescription>For {format(selectedDate, 'MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-10">No time logged for any tasks on this day.</p>
          </CardContent>
        </Card>
      );
  }


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
              outerRadius={100}
              innerRadius={50} 
              fill="#8884d8"
              dataKey="value"
              paddingAngle={dataForChart.length > 1 ? 2 : 0} 
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
                const itemData = dataForChart.find(d => d.name === value);
                const colorIndex = dataForChart.filter(d => d.isTask).findIndex(d => d.name === value);
                const color = itemData?.isTask ? COLORS[colorIndex % COLORS.length] : UNTRACKED_COLOR;
                return <span style={{ color }}>{value}</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

