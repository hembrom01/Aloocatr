
"use client";

import type { FC } from 'react';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday as dateFnsIsToday,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (newDate: Date) => void;
}

const DateNavigatorComponent: FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  const currentWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); 
  const currentWeekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

  const handlePreviousWeek = () => {
    onDateChange(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    onDateChange(addWeeks(selectedDate, 1));
  };

  const handleGoToCurrentWeek = () => {
    onDateChange(new Date());
  };

  const today = new Date();
  const startOfActualCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfActualCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
  const isViewingCurrentActualWeek = selectedDate >= startOfActualCurrentWeek && selectedDate <= endOfActualCurrentWeek;
  
  const formattedWeekRange = `${format(currentWeekStart, 'MMM d')} - ${format(currentWeekEnd, 'MMM d, yyyy')}`;

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek} aria-label="Previous week">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
           <h3 className="text-sm font-semibold text-foreground">{formattedWeekRange}</h3>
        </div>
        <Button variant="outline" size="icon" onClick={handleNextWeek} aria-label="Next week">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {daysInWeek.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDayToday = dateFnsIsToday(day);
          return (
            <Button
              key={day.toISOString()}
              variant={isSelected ? 'default' : isCurrentDayToday ? 'secondary' : 'ghost'}
              className={cn(
                "p-1 sm:p-2 h-auto flex flex-col items-center justify-center rounded-md text-sm", 
                isSelected && "ring-2 ring-primary shadow-lg",
                isCurrentDayToday && !isSelected && "border border-primary/70"
              )}
              onClick={() => onDateChange(day)}
            >
              <span className="text-xs font-medium">{format(day, 'EEE')}</span>
              <span className="text-sm font-bold">{format(day, 'd')}</span>
            </Button>
          );
        })}
      </div>

      {!isViewingCurrentActualWeek && (
        <div className="flex justify-center pt-1">
          <Button variant="link" onClick={handleGoToCurrentWeek} className="text-primary hover:underline h-auto p-1 text-sm">
            Go to Current Week
          </Button>
        </div>
      )}
    </div>
  );
};

export const DateNavigator = memo(DateNavigatorComponent);
DateNavigator.displayName = 'DateNavigator';
