
"use client";

import type { FC } from 'react';
import { useMemo, memo } from 'react';
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

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#82ca9d',
  '#ffc658',
  '#8884d8',
  '#FA8072',
  '#20B2AA',
  '#778899',
];
const UNTRACKED_COLOR = 'hsl(var(--muted))';

const DailyUsagePieChartComponent: FC<DailyUsagePieChartProps> = ({ tasks, taskLogs, selectedDate }) => {
  const dataForChart = useMemo(() => {
    const aggregatedData: { [key: string]: { value: number, isTask: boolean } } = {};
    let totalTrackedTime = 0;

    taskLogs.forEach(log => {
      const task = tasks.find(t => t.id === log.taskId);
      const taskName = task?.name || 'Deleted Task';
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

  if (dataForChart.length === 0 || (dataForChart.length === 1 && dataForChart[0].name === 'Untracked Time' && dataForChart[0].value === 24 * 60)) {
      return (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Daily Time Breakdown</CardTitle>
            <CardDescription className="text-xs">For {format(selectedDate, 'MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-10">No tasks logged for this day to display in the chart.</p>
          </CardContent>
        </Card>
      );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const rawPercent = payload[0].percent;
      const percentage = (typeof rawPercent === 'number' && !isNaN(rawPercent))
                         ? (rawPercent * 100).toFixed(1)
                         : '0.0';
      return (
        <div className="p-2 bg-background border border-border rounded-md shadow-lg text-xs">
          <p className="font-semibold text-sm">{`${data.name}`}</p>
          <p className="text-muted-foreground">{`Time: ${formatMinutesToFriendlyDuration(data.value)} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  if (dataForChart.every(d => d.value === 0) && dataForChart.length > 0) {
     return (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Daily Time Breakdown</CardTitle>
            <CardDescription className="text-xs">For {format(selectedDate, 'MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-10">No time logged for any tasks on this day.</p>
          </CardContent>
        </Card>
      );
  }

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Daily Time Breakdown</CardTitle>
        <CardDescription className="text-xs">Visualizing your time distribution for {format(selectedDate, 'MMMM d, yyyy')}.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}> {/* Adjusted height for potentially taller legend */}
          <PieChart margin={{ top: 5, right: 30, left: 0, bottom: 5 }}> {/* Added right margin for legend */}
            <Pie
              data={dataForChart}
              cx="40%" // Shifted pie to the left
              cy="50%"
              labelLine={false}
              outerRadius={80} // Slightly reduced radius if needed for space
              innerRadius={40}
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
              layout="vertical" // Stack legend items vertically
              verticalAlign="middle" // Align legend vertically in the middle
              align="right" // Position legend to the right
              wrapperStyle={{ fontSize: '10px', paddingLeft: '10px' }} // Ensure legend text is small and has some padding
              formatter={(value) => {
                const itemData = dataForChart.find(d => d.name === value);
                const colorIndex = dataForChart.filter(d => d.isTask).findIndex(d => d.name === value);
                const color = itemData?.isTask ? COLORS[colorIndex % COLORS.length] : UNTRACKED_COLOR;
                return <span style={{ color: color, display: 'inline-block', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const DailyUsagePieChart = memo(DailyUsagePieChartComponent);
DailyUsagePieChart.displayName = 'DailyUsagePieChart';
