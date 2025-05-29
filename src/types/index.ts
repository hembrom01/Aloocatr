
import type { LucideIcon } from 'lucide-react';

export type TaskIconName = 
  | 'Briefcase' 
  | 'BookOpen' 
  | 'Coffee' 
  | 'Dumbbell' 
  | 'Code' 
  | 'Music' 
  | 'Utensils'
  | 'Activity' // Default icon
  | 'Plane'
  | 'Palette'
  | 'DollarSign'
  | 'Heart'
  | 'ShoppingCart'
  | 'Tv'
  | 'Users'
  | 'Home';

export interface Category {
  id: string;
  name: string;
  createdAt: number; // timestamp
}

export interface Task {
  id: string;
  name: string;
  icon: TaskIconName;
  budgetedTime: number; // in minutes (total calculated from form)
  budgetBasis: 'daily' | 'weekly' | 'monthly'; // Added 'daily'
  createdAt: number; // timestamp
  categoryId?: string | null; // Link to Category
  targetDurationDays?: number | null; // Optional: for how many days the target is active
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
