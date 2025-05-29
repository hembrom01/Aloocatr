
import type { LucideIcon } from 'lucide-react';
import { 
  Briefcase, BookOpen, Coffee, Dumbbell, Code, Music, Utensils, Activity,
  Plane, Palette, DollarSign, Heart, ShoppingCart, Tv, Users, Home
} from 'lucide-react';
import type { TaskIconName } from '@/types';

export interface CategorizedIcon {
  name: TaskIconName;
  IconComponent: LucideIcon;
}

export interface IconCategory {
  categoryLabel: string;
  icons: CategorizedIcon[];
}

export const categorizedTaskIcons: IconCategory[] = [
  {
    categoryLabel: "Work & Productivity",
    icons: [
      { name: 'Briefcase', IconComponent: Briefcase },
      { name: 'BookOpen', IconComponent: BookOpen },
      { name: 'Code', IconComponent: Code },
    ],
  },
  {
    categoryLabel: "Lifestyle & Hobbies",
    icons: [
      { name: 'Coffee', IconComponent: Coffee },
      { name: 'Dumbbell', IconComponent: Dumbbell },
      { name: 'Music', IconComponent: Music },
      { name: 'Utensils', IconComponent: Utensils },
      { name: 'Palette', IconComponent: Palette }, // Art/Creativity
      { name: 'Heart', IconComponent: Heart }, // Health/Wellbeing/Relationships
      { name: 'Tv', IconComponent: Tv }, // Entertainment
    ],
  },
  {
    categoryLabel: "Travel & Errands",
    icons: [
      { name: 'Plane', IconComponent: Plane },
      { name: 'ShoppingCart', IconComponent: ShoppingCart },
    ],
  },
  {
    categoryLabel: "Finance & Home",
    icons: [
      { name: 'DollarSign', IconComponent: DollarSign },
      { name: 'Home', IconComponent: Home },
    ],
  },
  {
    categoryLabel: "Social",
    icons: [
      { name: 'Users', IconComponent: Users },
    ],
  },
  {
    categoryLabel: "General",
    icons: [
      { name: 'Activity', IconComponent: Activity }, // Default/Generic
    ],
  },
];

// Flattened list of all icons for simple lookup or validation
export const allTaskIconsArray: CategorizedIcon[] = categorizedTaskIcons.flatMap(category => category.icons);

// Lookup map for icon components by name
export const taskIconsLookup: Record<TaskIconName, LucideIcon> = Object.fromEntries(
  allTaskIconsArray.map(item => [item.name, item.IconComponent])
);

// Array of all available icon names
export const availableIcons: TaskIconName[] = allTaskIconsArray.map(icon => icon.name);

// Default icon
export const defaultTaskIcon: TaskIconName = 'Activity';

// For compatibility with old references, though categorizedTaskIcons and taskIconsLookup are preferred
export const taskIcons: Record<TaskIconName, LucideIcon> = taskIconsLookup;

