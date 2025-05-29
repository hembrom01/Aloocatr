
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Removed Card imports as form is in Dialog
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Task, TaskIconName, Category, TaskFormDataValues } from '@/types'; // Updated TaskFormDataValues
import { taskIconsLookup, defaultTaskIcon } from '@/config/icons';
import { AiTimeSuggester } from './ai-time-suggester';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ChevronDown } from 'lucide-react'; // Added ChevronDown for IconPicker button
import { DialogFooter as ShadDialogFooter } from '@/components/ui/dialog';
import { IconPicker } from './icon-picker'; // Import the new IconPicker

const taskFormSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  icon: z.custom<TaskIconName>((val) => Object.keys(taskIconsLookup).includes(val as TaskIconName), "Invalid icon"),
  budgetTimeValue: z.coerce.number().min(1, "Time value must be at least 1"),
  budgetTimeUnit: z.enum(['minutes', 'hours']),
  budgetBasis: z.enum(['daily', 'weekly', 'monthly']),
  categoryId: z.string().nullable().optional(),
  targetDurationDays: z.coerce.number().min(0, "Duration must be 0 or more days").optional().nullable(), // 0 or null for indefinite
});

type TaskFormInternalData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: Task | null;
  categories: Category[];
  onSubmit: (data: TaskFormDataValues, id?: string) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
  formTitle?: string;
  submitButtonText?: string;
}

const durationPresets = [
  { label: "Custom (enter days below)", value: "custom" },
  { label: "Indefinite (no end date)", value: "0" },
  { label: "7 days (1 Week)", value: "7" },
  { label: "14 days (2 Weeks)", value: "14" },
  { label: "30 days (~1 Month)", value: "30" },
  { label: "60 days (~2 Months)", value: "60" },
  { label: "90 days (~3 Months/Quarterly)", value: "90" },
  { label: "Monday to Friday (5 days, daily budget)", value: "5_daily" },
];

export const TaskForm: FC<TaskFormProps> = ({ task, categories, onSubmit, onDelete, onClose, formTitle = "Add New Task", submitButtonText = "Save Task" }) => {
  const { toast } = useToast();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const getInitialFormValues = (taskToEdit?: Task | null): TaskFormInternalData => {
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
        targetDurationDays: taskToEdit.targetDurationDays === undefined || taskToEdit.targetDurationDays === null ? null : taskToEdit.targetDurationDays,
      };
    }
    return {
      name: '',
      icon: defaultTaskIcon,
      budgetTimeValue: 60,
      budgetTimeUnit: 'minutes',
      budgetBasis: 'weekly',
      categoryId: null,
      targetDurationDays: null, // Default to null for indefinite unless a preset is chosen
    };
  };
  
  const form = useForm<TaskFormInternalData>({
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
  }, [task]);
  
  const watchedBudgetTimeValue = form.watch("budgetTimeValue");
  const watchedBudgetTimeUnit = form.watch("budgetTimeUnit");
  const watchedIcon = form.watch("icon");

  useEffect(() => {
    setCurrentTimeAllocationForAI(`${watchedBudgetTimeValue || 0} ${watchedBudgetTimeUnit || 'minutes'}`);
  }, [watchedBudgetTimeValue, watchedBudgetTimeUnit]);


  const handleFormSubmit: SubmitHandler<TaskFormInternalData> = (data) => {
    let totalMinutes = data.budgetTimeValue;
    if (data.budgetTimeUnit === 'hours') {
      totalMinutes = data.budgetTimeValue * 60;
    }

    const taskDataToSubmit: TaskFormDataValues = {
      name: data.name,
      icon: data.icon,
      budgetedTime: totalMinutes,
      budgetBasis: data.budgetBasis,
      categoryId: data.categoryId,
      targetDurationDays: data.targetDurationDays === null || data.targetDurationDays === undefined ? null : Number(data.targetDurationDays),
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
    // onClose(); // Parent component (SettingsPage) closes the dialog on submit now
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
  
  const handleDurationPresetChange = (value: string) => {
    if (value === "custom") {
      // Do nothing, user will input manually
    } else if (value === "5_daily") {
      form.setValue('targetDurationDays', 5);
      form.setValue('budgetBasis', 'daily', { shouldValidate: true });
    } else {
      const days = parseInt(value, 10);
      if (!isNaN(days)) {
        form.setValue('targetDurationDays', days);
         // If setting a specific duration like 7 days, and budget basis is not daily,
        // it makes sense for it to be weekly or monthly.
        // Let's not force change budgetBasis here unless it's the 5_daily preset.
        // User can select budgetBasis independently for other durations.
      }
    }
  };
  
  const SelectedIconComponent = taskIconsLookup[watchedIcon] || taskIconsLookup[defaultTaskIcon];

  return (
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

          <FormItem>
            <FormLabel>Icon</FormLabel>
            <Button 
              variant="outline" 
              type="button" 
              className="w-full justify-start text-left font-normal"
              onClick={() => setIsIconPickerOpen(true)}
            >
              <SelectedIconComponent className="mr-2 h-5 w-5" />
              {watchedIcon}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
            <FormMessage>{form.formState.errors.icon?.message}</FormMessage>
          </FormItem>
          <IconPicker 
            isOpen={isIconPickerOpen}
            onOpenChange={setIsIconPickerOpen}
            currentIcon={watchedIcon}
            onIconSelect={(iconName) => form.setValue('icon', iconName, { shouldValidate: true })}
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
                  <FormLabel className="sr-only">Time Unit</FormLabel>
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
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <FormField
              control={form.control}
              name="targetDurationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Duration (days)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 30 (0 or empty for indefinite)" 
                      {...field} 
                      value={field.value === null || field.value === undefined ? '' : String(field.value)}
                      onChange={e => {
                        const val = e.target.value;
                        field.onChange(val === '' ? null : parseInt(val, 10));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Set Duration Preset</FormLabel>
                <Select onValueChange={handleDurationPresetChange} defaultValue="custom">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {durationPresets.map(preset => (
                       <SelectItem key={preset.value} value={preset.value}>{preset.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Set to 0 or leave "Target Duration (days)" empty for an indefinite task.
          </p>
          
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

    