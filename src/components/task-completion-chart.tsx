
"use client";

import type { FC } from 'react';
import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatMinutesToFriendlyDuration } from '@/lib/utils';

interface TaskCompletionChartProps {
  tasks: Task[]; // Expects tasks already filtered for budgetedTime > 0
  getTimeSpent: (taskId: string, basis: 'daily' | 'weekly' | 'monthly') => number;
}

const TaskCompletionChartComponent: FC<TaskCompletionChartProps> = ({ tasks, getTimeSpent }) => {
  const chartData = useMemo(() => {
    return tasks
      .map(task => {
        const actualTime = getTimeSpent(task.id, task.budgetBasis);
        const completionPercentage = task.budgetedTime > 0 ? Math.min(100, (actualTime / task.budgetedTime) * 100) : 0;
        return {
          name: task.name.length > 20 ? `${task.name.substring(0, 17)}...` : task.name, // Truncate long names for Y-axis
          completion: completionPercentage,
          actualTime,
          budgetedTime: task.budgetedTime,
          fullTaskName: task.name, // For tooltip
        };
      })
      .sort((a, b) => b.completion - a.completion); // Sort by completion percentage desc
  }, [tasks, getTimeSpent]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="p-3 bg-background border border-border rounded-md shadow-lg">
          <p className="font-semibold text-sm">{dataPoint.fullTaskName}</p>
          <p className="text-xs text-muted-foreground">
            Completion: {dataPoint.completion.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">
            Spent: {formatMinutesToFriendlyDuration(dataPoint.actualTime)} / Budget: {formatMinutesToFriendlyDuration(dataPoint.budgetedTime)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Task Completion Percentage</CardTitle>
        <CardDescription className="text-sm">How much of each task's budget has been utilized (capped at 100%).</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              stroke="hsl(var(--foreground))" 
              fontSize={10}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--foreground))" 
              fontSize={10}
              width={100} // Adjust as needed for task names
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
            <Legend 
              wrapperStyle={{paddingTop: '20px'}} 
              formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value}</span>}
            />
            <Bar dataKey="completion" name="Completion %" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]}>
              <LabelList 
                dataKey="completion" 
                position="right" 
                formatter={(value: number) => `${value.toFixed(0)}%`} 
                fontSize={10}
                fill="hsl(var(--foreground))"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const TaskCompletionChart = memo(TaskCompletionChartComponent);
TaskCompletionChart.displayName = 'TaskCompletionChart';
