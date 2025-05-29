import type { LucideIcon } from 'lucide-react';
import { Briefcase, BookOpen, Coffee, Dumbbell, Code, Music, Utensils, Activity } from 'lucide-react';
import type { TaskIconName } from '@/types';

export const taskIcons: Record<TaskIconName, LucideIcon> = {
  Briefcase,
  BookOpen,
  Coffee,
  Dumbbell,
  Code,
  Music,
  Utensils,
  Activity, // Default icon
};

export const defaultTaskIcon: TaskIconName = 'Activity';

export const availableIcons: TaskIconName[] = [
  'Briefcase', 
  'BookOpen', 
  'Coffee', 
  'Dumbbell', 
  'Code', 
  'Music', 
  'Utensils',
  'Activity'
];
