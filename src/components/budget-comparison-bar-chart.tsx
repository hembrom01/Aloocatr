
"use client";

import type { FC } from 'react';
import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Task } from '@/types';
import { formatMinutesToFriendlyDuration } from '@/lib/utils';

interface AllocationComparisonBarChartProps { // Renamed
  tasks: Task[]; 
  getTimeSpent: (taskId: string, basis: 'daily' | 'weekly' | 'monthly') => number;
}

const AllocationComparisonBarChartComponent: FC<AllocationComparisonBarChartProps> = ({ tasks, getTimeSpent }) => { // Renamed
  const chartData = useMemo(() => {
    return tasks 
      .map(task => ({
        name: task.name.length > 15 ? `${task.name.substring(0, 12)}...` : task.name, 
        Allocated: task.allocatedTime, // Renamed from Budgeted
        Actual: getTimeSpent(task.id, task.allocationBasis), // Renamed from budgetBasis
        fullTaskName: task.name, 
        basis: task.allocationBasis.charAt(0).toUpperCase() + task.allocationBasis.slice(1) // Renamed
      }))
      .sort((a,b) => b.Allocated - a.Allocated); // Sort by Allocated
  }, [tasks, getTimeSpent]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload; 
      return (
        <div className="p-3 bg-background border border-border rounded-md shadow-lg text-xs">
          <p className="font-semibold text-sm">{dataPoint.fullTaskName}</p>
          <p className="text-muted-foreground mb-1">Basis: {dataPoint.basis}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatMinutesToFriendlyDuration(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-foreground">Allocated vs. Actual Time</h3>
        <p className="text-xs text-muted-foreground">Comparison of your allocated tasks based on their individual allocation cycles.</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={chartData} 
          margin={{ top: 5, right: 0, left: -25, bottom: 5 }}
          barGap={4} 
          barCategoryGap="20%" 
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--foreground))" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            interval={0} 
          />
          <YAxis 
            stroke="hsl(var(--foreground))" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => formatMinutesToFriendlyDuration(value)}
            width={80} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
          <Legend 
            wrapperStyle={{paddingTop: '20px'}} 
            formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '10px' }}>{value}</span>}
          />
          <Bar dataKey="Allocated" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} /> {/* Renamed from Budgeted */}
          <Bar dataKey="Actual" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AllocationComparisonBarChart = memo(AllocationComparisonBarChartComponent); // Renamed
AllocationComparisonBarChart.displayName = 'AllocationComparisonBarChart'; // Renamed
