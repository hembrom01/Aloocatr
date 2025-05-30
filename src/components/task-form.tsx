
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Task, TaskIconName, Category, TaskFormDataValues } from '@/types';
import { taskIconsLookup, defaultTaskIcon } from '@/config/icons';
import { AiTimeSuggester } from './ai-time-suggester';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { DialogFooter as ShadDialogFooter } from '@/components/ui/dialog';
import { IconPicker } from './icon-picker';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInCalendarDays } from 'date-fns';
import type { DateRange } from "react-day-picker";
import { cn } from '@/lib/utils';


const taskFormSchema = z.object({
  name: z.string().min(1, "Task name is required").max(30, "Task name too long (max 30 chars)"),
  icon: z.custom<TaskIconName>((val) => Object.keys(taskIconsLookup).includes(val as TaskIconName), "Invalid icon"),
  budgetTimeValue: z.coerce.number().min(1, "Time value must be at least 1"),
  budgetTimeUnit: z.enum(['minutes', 'hours']),
  budgetBasis: z.enum(['daily', 'weekly', 'monthly']),
  categoryId: z.string().nullable().optional(),
  targetDurationDays: z.coerce.number().min(0, "Duration must be 0 or more days").optional().nullable(),
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
  { label: "Indefinite (no end date)", value: "0" },
  { label: "Custom Date Range", value: "custom_range" },
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
  const [selectedDurationPreset, setSelectedDurationPreset] = useState<string>(
    task?.targetDurationDays === 0 || task?.targetDurationDays === null || task?.targetDurationDays === undefined ? "0" : 
    durationPresets.find(p => p.value === String(task?.targetDurationDays))?.value || "custom_range"
  );
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(() => {
    if (task && task.targetDurationDays && task.createdAt && (selectedDurationPreset === "custom_range" || !durationPresets.find(p=>p.value === String(task.targetDurationDays)))) {
      const startDate = new Date(task.createdAt);
      const endDate = new Date(task.createdAt + (task.targetDurationDays -1) * 24 * 60 * 60 * 1000); // -1 because duration is inclusive
      return { from: startDate, to: endDate };
    }
    return undefined;
  });

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
        targetDurationDays: taskToEdit.targetDurationDays === undefined || taskToEdit.targetDurationDays === null ? 0 : taskToEdit.targetDurationDays,
      };
    }
    return {
      name: '',
      icon: defaultTaskIcon,
      budgetTimeValue: 30, // Default changed to 30
      budgetTimeUnit: 'minutes',
      budgetBasis: 'weekly',
      categoryId: null,
      targetDurationDays: 0, // Default to 0 for indefinite
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
    
    if (task) {
      const taskDuration = task.targetDurationDays;
      if (taskDuration === 0 || taskDuration === null || taskDuration === undefined) {
        setSelectedDurationPreset("0");
        setCustomDateRange(undefined);
        form.setValue('targetDurationDays', 0);
      } else {
        const presetMatch = durationPresets.find(p => p.value === String(taskDuration) && p.value !== "custom_range" && p.value !== "5_daily");
        if (presetMatch) {
          setSelectedDurationPreset(presetMatch.value);
          setCustomDateRange(undefined);
          form.setValue('targetDurationDays', parseInt(presetMatch.value, 10));
        } else if(task.targetDurationDays === 5 && task.budgetBasis === 'daily'){
            setSelectedDurationPreset("5_daily");
            setCustomDateRange(undefined);
            form.setValue('targetDurationDays', 5);
        }
         else if (task.createdAt) { 
          setSelectedDurationPreset("custom_range");
          const startDate = new Date(task.createdAt);
          const endDate = new Date(startDate.getTime() + (Math.max(0, taskDuration -1)) * 24 * 60 * 60 * 1000);
          setCustomDateRange({ from: startDate, to: endDate });
          form.setValue('targetDurationDays', taskDuration);
        } else {
          setSelectedDurationPreset("0");
          setCustomDateRange(undefined);
          form.setValue('targetDurationDays', 0);
        }
      }
    } else {
        setSelectedDurationPreset("0"); 
        setCustomDateRange(undefined);
        form.setValue('targetDurationDays', 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, form.reset]); // form.reset added to dependencies
  
  const watchedBudgetTimeValue = form.watch("budgetTimeValue");
  const watchedBudgetTimeUnit = form.watch("budgetTimeUnit");
  const watchedIcon = form.watch("icon");

  useEffect(() => {
    setCurrentTimeAllocationForAI(`${watchedBudgetTimeValue || 0} ${watchedBudgetTimeUnit || 'minutes'}`);
  }, [watchedBudgetTimeValue, watchedBudgetTimeUnit]);

  useEffect(() => {
    if (selectedDurationPreset === "custom_range") {
      if (customDateRange?.from && customDateRange?.to) {
        const days = differenceInCalendarDays(customDateRange.to, customDateRange.from) + 1;
        form.setValue('targetDurationDays', days > 0 ? days : 0, { shouldValidate: true });
      } else {
        // If no custom range is picked yet, but "custom_range" is selected,
        // reset targetDurationDays to 0 or an appropriate default.
        // This prevents carrying over a value from a previous preset.
        form.setValue('targetDurationDays', 0, { shouldValidate: true });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customDateRange, selectedDurationPreset, form.setValue]);


  const handleFormSubmit: SubmitHandler<TaskFormInternalData> = (data) => {
    let totalMinutes = data.budgetTimeValue;
    if (data.budgetTimeUnit === 'hours') {
      totalMinutes = data.budgetTimeValue * 60;
    }

    let finalTargetDurationDays = data.targetDurationDays;
    if (selectedDurationPreset === "custom_range") {
        if (customDateRange?.from && customDateRange?.to) {
            const days = differenceInCalendarDays(customDateRange.to, customDateRange.from) + 1;
            finalTargetDurationDays = days > 0 ? days : 0;
        } else {
            finalTargetDurationDays = 0; 
        }
    }


    const taskDataToSubmit: TaskFormDataValues = {
      name: data.name,
      icon: data.icon,
      budgetedTime: totalMinutes,
      budgetBasis: data.budgetBasis,
      categoryId: data.categoryId,
      targetDurationDays: finalTargetDurationDays === null || finalTargetDurationDays === undefined ? 0 : Number(finalTargetDurationDays),
    };
    
    onSubmit(taskDataToSubmit, task?.id);
    toast({
      title: task ? "Task Updated" : "Task Added",
      description: `Task "${data.name}" has been ${task ? 'updated' : 'added'}.`,
    });
    if (!task) { 
      form.reset(getInitialFormValues(null));
      setCurrentTimeAllocationForAI('30 minutes');
      setSelectedDurationPreset("0");
      setCustomDateRange(undefined);
    }
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
    setSelectedDurationPreset(value);
    form.setValue('targetDurationDays', 0, { shouldValidate: true }); // Reset target days, custom range will override if picked
    if (value !== "custom_range") { // Clear custom range if not custom
        setCustomDateRange(undefined);
    }


    if (value === "5_daily") {
      form.setValue('targetDurationDays', 5, { shouldValidate: true });
      form.setValue('budgetBasis', 'daily', { shouldValidate: true });
    } else if (value !== "custom_range") { // For direct day presets
      const days = parseInt(value, 10);
      if (!isNaN(days)) {
        form.setValue('targetDurationDays', days, { shouldValidate: true });
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

          <div className="space-y-2"> {/* Container for label + input row */}
            <FormLabel>Budgeted Time</FormLabel>
            <div className="flex items-start gap-2"> {/* Input row */}
              <FormField
                control={form.control}
                name="budgetTimeValue"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetTimeUnit"
                render={({ field }) => (
                  <FormItem className="w-[110px]">
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    {/* FormMessage for budgetTimeUnit can be added here if needed */}
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end -mt-2"> {/* Keep AI Suggester placement */}
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
          
          <div className="space-y-2">
            <FormItem>
              <FormLabel>Target Duration</FormLabel>
              <Select onValueChange={handleDurationPresetChange} value={selectedDurationPreset}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a duration preset" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {durationPresets.map(preset => (
                     <SelectItem key={preset.value} value={preset.value}>{preset.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>

            {selectedDurationPreset === 'custom_range' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2", // Added mt-2
                      !customDateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDateRange?.from ? (
                      customDateRange.to ? (
                        <>
                          {format(customDateRange.from, "LLL dd, y")} -{" "}
                          {format(customDateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(customDateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={customDateRange?.from}
                    selected={customDateRange}
                    onSelect={setCustomDateRange}
                    numberOfMonths={1} // Keep to 1 month for smaller popover
                  />
                </PopoverContent>
              </Popover>
            )}
             <FormField
                control={form.control}
                name="targetDurationDays" 
                render={({ field }) => (
                  <FormItem className="hidden"> {/* This field is hidden but its value is managed */}
                    <FormControl>
                      <Input type="number" {...field} 
                        value={field.value === null || field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Select "Indefinite" for tasks that never expire.
            "Monday to Friday" preset automatically sets budget basis to daily for 5 days.
            For "Custom Date Range", the task is active for the selected period.
          </p>
          
          <ShadDialogFooter className="mt-6"> {/* Reduced top margin for footer */}
            <Button variant="destructive" type="button" onClick={onClose} size="sm">
              Close
            </Button>
            <Button type="submit" size="sm">
              {submitButtonText}
            </Button>
          </ShadDialogFooter>
        </form>
      </Form>
    </>
  );
};
