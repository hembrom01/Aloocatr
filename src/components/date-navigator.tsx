
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (newDate: Date) => void;
}

export const DateNavigator: FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handleGoToToday = () => {
    onDateChange(new Date());
  };

  return (
    <Card className="mb-6 shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousDay} aria-label="Previous day">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-foreground">
            {format(selectedDate, 'MMMM d, yyyy')}
          </span>
          {!isToday(selectedDate) && (
             <Button variant="link" size="sm" onClick={handleGoToToday} className="p-0 h-auto text-primary hover:underline">
              Go to Today
            </Button>
          )}
        </div>
        <Button variant="outline" size="icon" onClick={handleNextDay} aria-label="Next day" disabled={isToday(selectedDate)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Need to add Card and CardContent imports
import { Card, CardContent } from '@/components/ui/card';
