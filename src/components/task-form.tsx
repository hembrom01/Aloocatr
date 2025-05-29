
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as ShadSelectLabel } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Added CardFooter
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Task, TaskIconName, Category } from '@/types';
import { categorizedTaskIcons, taskIconsLookup, defaultTaskIcon } from '@/config/icons'; // Updated imports
import { AiTimeSuggester } from './ai-time-suggester';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { DialogFooter as ShadDialogFooter } from '@/components/ui/dialog'; // For the main dialog footer

const taskFormSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  icon: z.custom<TaskIconName>((val) => Object.keys(taskIconsLookup).includes(val as TaskIconName), "Invalid icon"),
  budgetTimeValue: z.coerce.number().min(1, "Time value must be at least 1"),
  budgetTimeUnit: z.enum(['minutes', 'hours']),
  budgetBasis: z.enum(['daily', 'weekly', 'monthly']),
  categoryId: z.string().nullable().optional(),
  targetDurationDays: z.coerce.number().min(0, "Duration must be 0 or more days").optional().nullable(), // 0 or null for indefinite
});

// This will be the data structure used by the form internally
type TaskFormData = z.infer<typeof taskFormSchema>;

// This is the structure expected by the onSubmit prop (matches Task, but without id/createdAt)
type TaskSubmitData = Omit<Task, 'id' | 'createdAt'>;


interface TaskFormProps {
  task?: Task | null;
  categories: Category[];
  onSubmit: (data: TaskSubmitData, id?: string) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void; // New prop to handle closing the dialog
  formTitle?: string;
  submitButtonText?: string;
}

export const TaskForm: FC<TaskFormProps> = ({ task, categories, onSubmit, onDelete, onClose, formTitle = "Add New Task", submitButtonText = "Save Task" }) => {
  const { toast } = useToast();

  const getInitialFormValues = (taskToEdit?: Task | null): TaskFormData => {
    if (taskToEdit) {
      const totalMinutes = taskToEdit.budgetedTime;
      let budgetTimeValue = totalMinutes;
      let budgetTimeUnit: 'minutes' | 'hours' = 'minutes';
      if (totalMinutes >= 60 && totalMinutes % 60 === 0) {
        budgetTimeValue = totalMinutes / 60;
        budgetTimeUnit = 'hours';
      }
      return {
        name: taskToEdit.name,
        icon: taskToEdit.icon,
        budgetTimeValue,
        budgetTimeUnit,
        budgetBasis: taskToEdit.budgetBasis,
        categoryId: taskToEdit.categoryId || null,
        targetDurationDays: taskToEdit.targetDurationDays === undefined ? null : taskToEdit.targetDurationDays,
      };
    }
    return {
      name: '',
      icon: defaultTaskIcon,
      budgetTimeValue: 60,
      budgetTimeUnit: 'minutes',
      budgetBasis: 'weekly',
      categoryId: null,
      targetDurationDays: null, // Default to null (indefinite)
    };
  };
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getInitialFormValues(task),
  });
  
  const [currentTimeAllocationForAI, setCurrentTimeAllocationForAI] = useState(() => {
    const initialValues = getInitialFormValues(task);
    return `${initialValues.budgetTimeValue} ${initialValues.budgetTimeUnit}`;
  });

  useEffect(() => {
    form.reset(getInitialFormValues(task));
    const currentValues = getInitialFormValues(task);
    setCurrentTimeAllocationForAI(`${currentValues.budgetTimeValue} ${currentValues.budgetTimeUnit}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, form.reset]); // form.reset is stable
  
  const watchedBudgetTimeValue = form.watch("budgetTimeValue");
  const watchedBudgetTimeUnit = form.watch("budgetTimeUnit");

  useEffect(() => {
    setCurrentTimeAllocationForAI(`${watchedBudgetTimeValue || 0} ${watchedBudgetTimeUnit || 'minutes'}`);
  }, [watchedBudgetTimeValue, watchedBudgetTimeUnit]);


  const handleFormSubmit: SubmitHandler<TaskFormData> = (data) => {
    let totalMinutes = data.budgetTimeValue;
    if (data.budgetTimeUnit === 'hours') {
      totalMinutes = data.budgetTimeValue * 60;
    }

    const taskDataToSubmit: TaskSubmitData = {
      name: data.name,
      icon: data.icon,
      budgetedTime: totalMinutes,
      budgetBasis: data.budgetBasis,
      categoryId: data.categoryId,
      targetDurationDays: data.targetDurationDays === null || data.targetDurationDays === undefined ? undefined : data.targetDurationDays,
    };

    onSubmit(taskDataToSubmit, task?.id);
    toast({
      title: task ? "Task Updated" : "Task Added",
      description: `Task "${data.name}" has been ${task ? 'updated' : 'added'}.`,
    });
    if (!task) { 
      form.reset(getInitialFormValues(null));
      setCurrentTimeAllocationForAI('60 minutes');
    }
    // onClose(); // Close dialog after submit. The parent component (SettingsPage) might also handle this.
  };

  const handleAiSuggestionApplied = (suggestedTime: string) => {
    const parts = suggestedTime.toLowerCase().split(' ');
    const timeValue = parseInt(parts[0]);
    
    if (isNaN(timeValue) || timeValue <= 0) {
      toast({ title: "AI Suggestion Error", description: "Invalid time value suggested.", variant: "destructive" });
      return;
    }

    if (parts.includes('hour') || parts.includes('hours')) {
      form.setValue('budgetTimeValue', timeValue);
      form.setValue('budgetTimeUnit', 'hours');
      toast({ title: "AI Suggestion Applied", description: `Budget set to ${timeValue} hours.` });
    } else if (parts.includes('minute') || parts.includes('minutes')) {
      form.setValue('budgetTimeValue', timeValue);
      form.setValue('budgetTimeUnit', 'minutes');
      toast({ title: "AI Suggestion Applied", description: `Budget set to ${timeValue} minutes.` });
    } else {
      toast({ title: "AI Suggestion Format Error", description: `Could not parse unit from "${suggestedTime}".`, variant: "destructive" });
    }
  };

  return (
    // This component is now rendered inside a DialogContent, so Card isn't strictly needed for modal appearance.
    // However, keeping it for structure and potential reuse elsewhere if needed.
    // Removing Card and CardHeader/Content for direct Dialog styling if preferred.
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{formTitle}</h2>
        {task && onDelete && (
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        )}
      </div>
      {task && <p className="text-sm text-muted-foreground mb-4">Editing task: {task.name}</p>}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Morning Workout" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorizedTaskIcons.map(category => (
                      <SelectGroup key={category.categoryLabel}>
                        <ShadSelectLabel>{category.categoryLabel}</ShadSelectLabel>
                        {category.icons.map(iconItem => {
                          const IconComponent = iconItem.IconComponent;
                          return (
                            <SelectItem key={iconItem.name} value={iconItem.name}>
                              <div className="flex items-center">
                                <IconComponent className="mr-2 h-5 w-5" />
                                {iconItem.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (Optional)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "null" ? null : value)} 
                  value={field.value || "null"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">Uncategorized</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <FormField
              control={form.control}
              name="budgetTimeValue"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Budgeted Time</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budgetTimeUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Time Unit</FormLabel> {/* Label is visually covered by "Budgeted Time" */}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end -mt-2">
             <AiTimeSuggester 
                taskName={form.getValues('name') || 'this task'}
                currentTimeAllocation={currentTimeAllocationForAI}
                onSuggestionApplied={handleAiSuggestionApplied}
              />
          </div>


          <FormField
            control={form.control}
            name="budgetBasis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Basis</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget basis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetDurationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Duration (days, optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 30 (0 or empty for indefinite)" 
                    {...field} 
                    value={field.value === null || field.value === undefined ? '' : field.value}
                    onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* DialogFooter is handled by the parent DialogContent component */}
          {/* This form's submit button will be placed in the DialogFooter by parent */}
          <ShadDialogFooter className="mt-8">
            <Button variant="destructive" type="button" onClick={onClose}>
              Close
            </Button>
            <Button type="submit">
              {submitButtonText}
            </Button>
          </ShadDialogFooter>
        </form>
      </Form>
    </>
  );
};
