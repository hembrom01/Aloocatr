
import type { LucideIcon } from 'lucide-react';
import { 
  Briefcase, BookOpen, Coffee, Dumbbell, Code, Music, Utensils, Activity,
  Plane, Palette, DollarSign, Heart, ShoppingCart, Tv, Users, Home,
  GraduationCap, Sprout, BriefcaseMedical, MessageSquare, Car, Wrench,
  Bed, PenTool, ShieldCheck, Brain, Lightbulb, Mountain, Dog
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
      { name: 'Code', IconComponent: Code },
      { name: 'MessageSquare', IconComponent: MessageSquare },
      { name: 'Brain', IconComponent: Brain },
      { name: 'Lightbulb', IconComponent: Lightbulb },
      { name: 'ShieldCheck', IconComponent: ShieldCheck },
    ],
  },
  {
    categoryLabel: "Education & Growth",
    icons: [
      { name: 'BookOpen', IconComponent: BookOpen },
      { name: 'GraduationCap', IconComponent: GraduationCap },
      { name: 'Sprout', IconComponent: Sprout },
      { name: 'PenTool', IconComponent: PenTool },
    ],
  },
  {
    categoryLabel: "Lifestyle & Hobbies",
    icons: [
      { name: 'Coffee', IconComponent: Coffee },
      { name: 'Dumbbell', IconComponent: Dumbbell },
      { name: 'Music', IconComponent: Music },
      { name: 'Utensils', IconComponent: Utensils },
      { name: 'Palette', IconComponent: Palette },
      { name: 'Tv', IconComponent: Tv },
      { name: 'Mountain', IconComponent: Mountain },
      { name: 'Dog', IconComponent: Dog },
    ],
  },
  {
    categoryLabel: "Health & Wellbeing",
    icons: [
      { name: 'Heart', IconComponent: Heart },
      { name: 'BriefcaseMedical', IconComponent: BriefcaseMedical },
      { name: 'Bed', IconComponent: Bed },
    ],
  },
  {
    categoryLabel: "Travel & Errands",
    icons: [
      { name: 'Plane', IconComponent: Plane },
      { name: 'ShoppingCart', IconComponent: ShoppingCart },
      { name: 'Car', IconComponent: Car },
      { name: 'Wrench', IconComponent: Wrench },
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
