"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Task, TaskIconName } from '@/types';
import { availableIcons, taskIcons, defaultTaskIcon } from '@/config/icons';
import { AiTimeSuggester } from './ai-time-suggester';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

const taskFormSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  icon: z.custom<TaskIconName>((val) => availableIcons.includes(val as TaskIconName), "Invalid icon"),
  budgetedTime: z.coerce.number().min(1, "Budgeted time must be at least 1 minute"),
  budgetBasis: z.enum(['weekly', 'monthly']),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData, id?: string) => void;
  onDelete?: (taskId: string) => void;
  formTitle?: string;
  submitButtonText?: string;
}

export const TaskForm: FC<TaskFormProps> = ({ task, onSubmit, onDelete, formTitle = "Add New Task", submitButtonText = "Save Task" }) => {
  const { toast } = useToast();
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: task?.name || '',
      icon: task?.icon || defaultTaskIcon,
      budgetedTime: task?.budgetedTime || 60,
      budgetBasis: task?.budgetBasis || 'weekly',
    },
  });
  
  const [currentTimeAllocationForAI, setCurrentTimeAllocationForAI] = useState(
    task ? `${task.budgetedTime} minutes` : '60 minutes'
  );

  useEffect(() => {
    if (task) {
      form.reset({
        name: task.name,
        icon: task.icon,
        budgetedTime: task.budgetedTime,
        budgetBasis: task.budgetBasis,
      });
      setCurrentTimeAllocationForAI(`${task.budgetedTime} minutes`);
    } else {
       form.reset({
        name: '',
        icon: defaultTaskIcon,
        budgetedTime: 60,
        budgetBasis: 'weekly',
      });
      setCurrentTimeAllocationForAI('60 minutes');
    }
  }, [task, form]);
  
  const watchedBudgetedTime = form.watch("budgetedTime");
  useEffect(() => {
    setCurrentTimeAllocationForAI(`${watchedBudgetedTime || 0} minutes`);
  }, [watchedBudgetedTime]);


  const handleFormSubmit: SubmitHandler<TaskFormData> = (data) => {
    onSubmit(data, task?.id);
    toast({
      title: task ? "Task Updated" : "Task Added",
      description: `Task "${data.name}" has been ${task ? 'updated' : 'added'}.`,
    });
    if (!task) { // Reset form only if it's a new task
      form.reset();
      setCurrentTimeAllocationForAI('60 minutes');
    }
  };

  const handleAiSuggestionApplied = (suggestedTime: string) => {
    // Attempt to parse "X minutes" or "Y hours" from suggestion
    const timeValue = parseInt(suggestedTime.split(' ')[0]);
    let minutes = 0;
    if (suggestedTime.includes('hour')) {
      minutes = timeValue * 60;
    } else if (suggestedTime.includes('minute')) {
      minutes = timeValue;
    }
    
    if (!isNaN(minutes) && minutes > 0) {
      form.setValue('budgetedTime', minutes);
      toast({
        title: "AI Suggestion Applied",
        description: `Budgeted time set to ${minutes} minutes.`,
      });
    } else {
      toast({
        title: "AI Suggestion Format Error",
        description: `Could not parse time from "${suggestedTime}". Please enter manually.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{formTitle}</CardTitle>
          {task && onDelete && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          )}
        </div>
        {task && <CardDescription>Editing task: {task.name}</CardDescription>}
      </CardHeader>
      <CardContent>
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
                      {availableIcons.map(iconName => {
                        const IconComponent = taskIcons[iconName];
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center">
                              <IconComponent className="mr-2 h-5 w-5" />
                              {iconName}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budgetedTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budgeted Time (minutes)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input type="number" placeholder="e.g., 60" {...field} />
                    </FormControl>
                    <AiTimeSuggester 
                      taskName={form.getValues('name') || 'this task'}
                      currentTimeAllocation={currentTimeAllocationForAI}
                      onSuggestionApplied={handleAiSuggestionApplied}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              {submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
