
"use client";

import type { FC } from 'react';
import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatMinutesToFriendlyDuration } from '@/lib/utils';

interface BudgetComparisonBarChartProps {
  tasks: Task[];
  getTimeSpent: (taskId: string, basis: 'daily' | 'weekly' | 'monthly') => number;
}

const BudgetComparisonBarChartComponent: FC<BudgetComparisonBarChartProps> = ({ tasks, getTimeSpent }) => {
  const chartData = useMemo(() => {
    return tasks
      .filter(task => task.budgetedTime > 0)
      .map(task => ({
        name: task.name.length > 15 ? `${task.name.substring(0, 12)}...` : task.name, // Truncate long names
        Budgeted: task.budgetedTime,
        Actual: getTimeSpent(task.id, task.budgetBasis),
        fullTaskName: task.name, // For tooltip
        basis: task.budgetBasis.charAt(0).toUpperCase() + task.budgetBasis.slice(1) // For tooltip
      }))
      .sort((a,b) => b.Budgeted - a.Budgeted); // Sort by budgeted time desc
  }, [tasks, getTimeSpent]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload; // The whole data object for this bar group
      return (
        <div className="p-3 bg-background border border-border rounded-md shadow-lg">
          <p className="font-semibold text-sm">{dataPoint.fullTaskName}</p>
          <p className="text-xs text-muted-foreground mb-1">Basis: {dataPoint.basis}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {formatMinutesToFriendlyDuration(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle>Budget vs. Actual Time</CardTitle>
          <CardDescription>Comparison of your budgeted tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-10">No tasks with budgets to display. Add budgets to your tasks in the Tasks section.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle>Budget vs. Actual Time</CardTitle>
        <CardDescription>Comparison of your budgeted tasks based on their individual budget cycles (daily, weekly, monthly).</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={chartData} 
            margin={{ top: 5, right: 0, left: -25, bottom: 5 }} // Adjusted left margin for Y-axis labels
            barGap={4} // Gap between bars of the same group
            barCategoryGap="20%" // Gap between groups of bars
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--foreground))" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              interval={0} // Show all labels if possible
            />
            <YAxis 
              stroke="hsl(var(--foreground))" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => formatMinutesToFriendlyDuration(value)}
              width={80} // Provide enough space for longer Y-axis labels
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
            <Legend 
              wrapperStyle={{paddingTop: '20px'}} 
              formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value}</span>}
            />
            <Bar dataKey="Budgeted" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const BudgetComparisonBarChart = memo(BudgetComparisonBarChartComponent);
BudgetComparisonBarChart.displayName = 'BudgetComparisonBarChart';
