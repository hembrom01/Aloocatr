
"use client";

import type { FC } from 'react';
import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import type { Task } from '@/types';
import { formatMinutesToFriendlyDuration } from '@/lib/utils';

interface TaskCompletionChartProps {
  tasks: Task[]; 
  getTimeSpent: (taskId: string, basis: 'daily' | 'weekly' | 'monthly') => number;
}

const TaskCompletionChartComponent: FC<TaskCompletionChartProps> = ({ tasks, getTimeSpent }) => {
  const chartData = useMemo(() => {
    return tasks
      .map(task => {
        const actualTime = getTimeSpent(task.id, task.allocationBasis);
        const completionPercentage = task.allocatedTime > 0 ? Math.min(100, (actualTime / task.allocatedTime) * 100) : 0;
        return {
          name: task.name.length > 20 ? `${task.name.substring(0, 17)}...` : task.name, 
          completion: completionPercentage,
          actualTime,
          allocatedTime: task.allocatedTime,
          fullTaskName: task.name, 
        };
      })
      .sort((a, b) => b.completion - a.completion); 
  }, [tasks, getTimeSpent]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="p-3 bg-background border border-border rounded-md shadow-lg text-xs">
          <p className="font-semibold text-sm">{dataPoint.fullTaskName}</p>
          <p className="text-muted-foreground">
            Completion: {dataPoint.completion.toFixed(1)}%
          </p>
          <p className="text-muted-foreground">
            Spent: {formatMinutesToFriendlyDuration(dataPoint.actualTime)} / Allocated: {formatMinutesToFriendlyDuration(dataPoint.allocatedTime)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-foreground">Task Completion Percentage</h3>
        <p className="text-xs text-muted-foreground">How much of each task's allocation has been utilized (capped at 100%).</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }} // Reduced left margin
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
            width={80} // Adjusted YAxis width
            interval={0}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
          <Legend 
            wrapperStyle={{paddingTop: '20px'}} 
            formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '10px' }}>{value}</span>}
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
    </div>
  );
};

export const TaskCompletionChart = memo(TaskCompletionChartComponent);
TaskCompletionChart.displayName = 'TaskCompletionChart';
