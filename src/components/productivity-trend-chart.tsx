
"use client";

import type { FC } from 'react';
import { useMemo, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatMinutesToFriendlyDuration } from '@/lib/utils';

interface ProductivityDataPoint {
  dateLabel: string;
  totalMinutes: number;
}

interface ProductivityTrendChartProps {
  data: ProductivityDataPoint[];
  title: string;
  description: string;
}

const ProductivityTrendChartComponent: FC<ProductivityTrendChartProps> = ({ data, title, description }) => {
  const chartData = useMemo(() => data.map(item => ({
    name: item.dateLabel,
    "Tracked Time": item.totalMinutes,
  })), [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border border-border rounded-md shadow-lg text-xs">
          <p className="font-semibold text-sm">{`${label}`}</p>
          <p className="text-muted-foreground">{`Time: ${formatMinutesToFriendlyDuration(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0 || chartData.every(d => d["Tracked Time"] === 0)) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-10">No productivity data to display for this period.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--foreground))" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--foreground))" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => formatMinutesToFriendlyDuration(value)}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
            <Legend wrapperStyle={{paddingTop: '20px'}} formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '10px' }}>{value}</span>} />
            <Line 
              type="monotone" 
              dataKey="Tracked Time" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2} 
              dot={{ r: 4, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const ProductivityTrendChart = memo(ProductivityTrendChartComponent);
ProductivityTrendChart.displayName = 'ProductivityTrendChart';
