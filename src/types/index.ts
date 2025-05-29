import type { LucideIcon } from 'lucide-react';

export type TaskIconName = 
  | 'Briefcase' 
  | 'BookOpen' 
  | 'Coffee' 
  | 'Dumbbell' 
  | 'Code' 
  | 'Music' 
  | 'Utensils'
  | 'Activity'; // Default icon

export interface Task {
  id: string;
  name: string;
  icon: TaskIconName;
  budgetedTime: number; // in minutes
  budgetBasis: 'weekly' | 'monthly';
  createdAt: number; // timestamp
}

export interface TaskLog {
  id: string;
  taskId: string;
  startTime: number; // timestamp
  endTime: number; // timestamp
  duration: number; // in minutes
}

export interface ActiveTimer {
  taskId: string;
  startTime: number;
}
