
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
  | 'Home'
  // New Icons
  | 'GraduationCap' // Academics/Learning
  | 'Sprout' // Personal Growth/New Habits
  | 'BriefcaseMedical' // Health/Appointments
  | 'MessageSquare' // Communication/Meetings
  | 'Car' // Commute/Travel
  | 'Wrench' // Chores/Maintenance
  | 'Bed' // Rest/Sleep
  | 'PenTool' // Writing/Journaling
  | 'ShieldCheck' // Responsibilities
  | 'Brain' // Deep Work/Focus
  | 'Lightbulb' // Ideas/Brainstorming
  | 'Mountain' // Outdoor Activities/Challenges
  | 'Dog'; // Pets

export interface Category {
  id: string;
  name: string;
  createdAt: number; // timestamp
}

export interface Task {
  id: string;
  name: string;
  icon: TaskIconName;
  allocatedTime: number; // in minutes (total calculated from form)
  allocationBasis: 'daily' | 'weekly' | 'monthly';
  createdAt: number; // timestamp
  categoryId?: string | null; // Link to Category
  targetDurationDays?: number | null; // Optional: for how many days the target is active
}

export interface TaskFormDataValues {
  name: string;
  icon: TaskIconName;
  allocatedTime: number; // in minutes
  allocationBasis: 'daily' | 'weekly' | 'monthly';
  categoryId?: string | null;
  targetDurationDays?: number | null;
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
