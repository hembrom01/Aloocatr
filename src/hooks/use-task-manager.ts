
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskLog, ActiveTimer, Category, TaskIconName } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { 
  startOfDay as dateFnsStartOfDay, 
  startOfWeek as dateFnsStartOfWeek, 
  startOfMonth as dateFnsStartOfMonth,
  endOfDay as dateFnsEndOfDay,
  eachDayOfInterval,
  format as dateFnsFormat,
  isSameDay
} from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { showBrowserNotification } from '@/lib/utils';


const TASKS_STORAGE_KEY = 'allocatrTasks';
const TASK_LOGS_STORAGE_KEY = 'allocatrTaskLogs';
const ACTIVE_TIMERS_STORAGE_KEY = 'allocatrActiveTimers';
const CATEGORIES_STORAGE_KEY = 'allocatrCategories';

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTasksRaw = localStorage.getItem(TASKS_STORAGE_KEY);
      const storedCategoriesRaw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      
      let initialTasks: Task[] = [];
      let initialCategories: Category[] = [];

      initialTasks = storedTasksRaw ? JSON.parse(storedTasksRaw) : [];
      initialCategories = storedCategoriesRaw ? JSON.parse(storedCategoriesRaw) : [];
      
      setTasks(initialTasks);
      setCategories(initialCategories);
      
      const storedTaskLogs = localStorage.getItem(TASK_LOGS_STORAGE_KEY);
      if (storedTaskLogs) setTaskLogs(JSON.parse(storedTaskLogs));
      
      const storedActiveTimers = localStorage.getItem(ACTIVE_TIMERS_STORAGE_KEY);
      if (storedActiveTimers) setActiveTimers(JSON.parse(storedActiveTimers));
      
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      localStorage.setItem(TASK_LOGS_STORAGE_KEY, JSON.stringify(taskLogs));
    }
  }, [taskLogs, isLoaded]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      localStorage.setItem(ACTIVE_TIMERS_STORAGE_KEY, JSON.stringify(activeTimers));
    }
  }, [activeTimers, isLoaded]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const addCategory = useCallback((name: string) => {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((updatedCategory: Category) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.categoryId === categoryId ? { ...task, categoryId: null } : task
      )
    );
  }, []);


  const addTask = useCallback((newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setTaskLogs(prevLogs => prevLogs.filter(log => log.taskId !== taskId));
    setActiveTimers(prevTimers => prevTimers.filter(timer => timer.taskId !== taskId));
  }, []);

  const isTaskActive = useCallback((taskId: string) => {
    return activeTimers.some(timer => timer.taskId === taskId);
  }, [activeTimers]);

  const startTask = useCallback((taskId: string) => {
    if (isTaskActive(taskId)) return; 
    setActiveTimers(prevTimers => [...prevTimers, { taskId, startTime: Date.now() }]);
  }, [isTaskActive]);

  const stopTask = useCallback((taskIdToStop: string) => {
    const timerToStop = activeTimers.find(timer => timer.taskId === taskIdToStop);
    if (!timerToStop) return null;

    const endTime = Date.now();
    const duration = Math.round((endTime - timerToStop.startTime) / (1000 * 60)); 
    
    const newLog: TaskLog = {
      id: uuidv4(),
      taskId: timerToStop.taskId,
      startTime: timerToStop.startTime,
      endTime,
      duration, 
    };
    
    const task = tasks.find(t => t.id === timerToStop.taskId);

    if (task && task.allocatedTime > 0) {
      const now = new Date();
      let periodStartDate: Date;
      if (task.allocationBasis === 'daily') {
        periodStartDate = dateFnsStartOfDay(now);
      } else if (task.allocationBasis === 'weekly') {
        periodStartDate = dateFnsStartOfWeek(now, { weekStartsOn: 1 });
      } else { // monthly
        periodStartDate = dateFnsStartOfMonth(now);
      }
      periodStartDate.setHours(0, 0, 0, 0);

      const relevantLogsThisPeriod = taskLogs
        .filter(log => log.taskId === task.id && log.endTime >= periodStartDate.getTime());
      
      const totalDurationThisPeriod = relevantLogsThisPeriod.reduce((total, log) => total + log.duration, 0) + newLog.duration;
      const durationBeforeThisLog = totalDurationThisPeriod - newLog.duration;

      if (totalDurationThisPeriod >= task.allocatedTime && durationBeforeThisLog < task.allocatedTime) {
        toast({
          title: "🎉 Task Completed! 🎉",
          description: `Great job on finishing "${task.name}"!`,
        });
        showBrowserNotification(
          "🎉 Task Completed! 🎉",
          `Great job on finishing "${task.name}"!`
        );
      }
    }
    
    setTaskLogs(prevLogs => [...prevLogs, newLog].sort((a,b) => b.startTime - a.startTime)); 
    setActiveTimers(prevTimers => prevTimers.filter(timer => timer.taskId !== taskIdToStop));
    return newLog;
  }, [activeTimers, taskLogs, tasks, toast]);

  const toggleTask = useCallback((taskId: string) => {
    if (isTaskActive(taskId)) {
      stopTask(taskId);
    } else {
      startTask(taskId);
    }
  }, [isTaskActive, startTask, stopTask]);


  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const getLogsForTask = useCallback((taskId: string) => {
    return taskLogs.filter(log => log.taskId === taskId);
  }, [taskLogs]);
  
  const getLogsForDay = useCallback((date: Date): TaskLog[] => {
    const startOfDay = dateFnsStartOfDay(date);
    const endOfDay = dateFnsEndOfDay(date);

    return taskLogs.filter(log => log.startTime >= startOfDay.getTime() && log.startTime <= endOfDay.getTime())
                   .sort((a, b) => a.startTime - b.startTime);
  }, [taskLogs]);

  const getTimeSpentOnTask = useCallback((taskId: string, basis: 'daily' | 'weekly' | 'monthly' | 'total' = 'total') => {
    const now = new Date();
    let startDate: Date;

    if (basis === 'daily') {
      startDate = dateFnsStartOfDay(now);
    } else if (basis === 'weekly') {
      startDate = dateFnsStartOfWeek(now, { weekStartsOn: 1 }); 
    } else if (basis === 'monthly') {
      startDate = dateFnsStartOfMonth(now);
    } else { 
      startDate = new Date(0); 
    }
    
    if (basis !== 'total') {
        startDate.setHours(0,0,0,0);
    }

    const relevantLogs = taskLogs.filter(log => log.taskId === taskId && log.endTime >= startDate.getTime());
    return relevantLogs.reduce((total, log) => total + log.duration, 0);
  }, [taskLogs]);

  const getCategoryById = useCallback((categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  }, [categories]);

  const getAggregatedLogsForPeriod = useCallback((startDate: Date, endDate: Date, dateFormat: 'EEE' | 'MMM d' = 'EEE'): { dateLabel: string, totalMinutes: number }[] => {
    const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });
    return daysInPeriod.map(day => {
      const logsForThisDay = getLogsForDay(day); 
      const totalMinutes = logsForThisDay.reduce((sum, log) => sum + log.duration, 0);
      return {
        dateLabel: dateFnsFormat(day, dateFormat),
        totalMinutes,
      };
    });
  }, [getLogsForDay]);


  return {
    tasks,
    taskLogs,
    activeTimers,
    categories,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    stopTask,
    toggleTask,
    isTaskActive,
    getTaskById,
    getLogsForTask,
    getLogsForDay,
    getTimeSpentOnTask,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getAggregatedLogsForPeriod,
    isLoaded,
  };
}
