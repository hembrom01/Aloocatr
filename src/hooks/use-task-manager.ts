
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


const TASKS_STORAGE_KEY = 'chronoFlowTasks';
const TASK_LOGS_STORAGE_KEY = 'chronoFlowTaskLogs';
const ACTIVE_TIMERS_STORAGE_KEY = 'chronoFlowActiveTimers';
const CATEGORIES_STORAGE_KEY = 'chronoFlowCategories';

const createDefaultCategories = (): Category[] => {
  const now = Date.now();
  return [
    { id: 'cat-work', name: 'Work', createdAt: now },
    { id: 'cat-learning', name: 'Learning', createdAt: now + 1 },
    { id: 'cat-fitness', name: 'Fitness', createdAt: now + 2 },
    { id: 'cat-hobbies', name: 'Hobbies', createdAt: now + 3 },
    { id: 'cat-chores', name: 'Chores', createdAt: now + 4 },
  ];
};

const createDefaultTasks = (defaultCategories: Category[]): Task[] => {
  const now = Date.now();
  const getCatId = (name: string) => defaultCategories.find(c => c.name === name)?.id || null;

  return [
    { 
      id: uuidv4(), name: 'Project Phoenix', icon: 'Briefcase' as TaskIconName, 
      budgetedTime: 120, budgetBasis: 'daily', categoryId: getCatId('Work'), 
      createdAt: now, targetDurationDays: 30 
    },
    { 
      id: uuidv4(), name: 'Team Sync', icon: 'Users' as TaskIconName, 
      budgetedTime: 60, budgetBasis: 'weekly', categoryId: getCatId('Work'), 
      createdAt: now + 1 
    },
    { 
      id: uuidv4(), name: 'Read Documentation', icon: 'BookOpen' as TaskIconName, 
      budgetedTime: 30, budgetBasis: 'daily', categoryId: getCatId('Learning'), 
      createdAt: now + 2 
    },
    { 
      id: uuidv4(), name: 'Online Course', icon: 'GraduationCap' as TaskIconName, 
      budgetedTime: 90, budgetBasis: 'weekly', categoryId: getCatId('Learning'), 
      createdAt: now + 3, targetDurationDays: 90
    },
    { 
      id: uuidv4(), name: 'Morning Jog', icon: 'Dumbbell' as TaskIconName, 
      budgetedTime: 45, budgetBasis: 'daily', categoryId: getCatId('Fitness'), 
      createdAt: now + 4, targetDurationDays: 60
    },
    { 
      id: uuidv4(), name: 'Yoga Session', icon: 'Sprout' as TaskIconName, 
      budgetedTime: 60, budgetBasis: 'weekly', categoryId: getCatId('Fitness'), 
      createdAt: now + 5
    },
    { 
      id: uuidv4(), name: 'Practice Guitar', icon: 'Music' as TaskIconName, 
      budgetedTime: 180, budgetBasis: 'weekly', categoryId: getCatId('Hobbies'), 
      createdAt: now + 6 
    },
    { 
      id: uuidv4(), name: 'Gardening', icon: 'Palette' as TaskIconName, // Using Palette as a stand-in for general creative hobby
      budgetedTime: 120, budgetBasis: 'monthly', categoryId: getCatId('Hobbies'), 
      createdAt: now + 7
    },
    { 
      id: uuidv4(), name: 'Grocery Shopping', icon: 'ShoppingCart' as TaskIconName, 
      budgetedTime: 60, budgetBasis: 'weekly', categoryId: getCatId('Chores'), 
      createdAt: now + 8
    },
    { 
      id: uuidv4(), name: 'Meal Prep', icon: 'Utensils'as TaskIconName, 
      budgetedTime: 90, budgetBasis: 'weekly', categoryId: getCatId('Chores'), 
      createdAt: now + 9
    },
  ];
};


export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTasksRaw = localStorage.getItem(TASKS_STORAGE_KEY);
      const storedCategoriesRaw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      
      let initialTasks: Task[] = [];
      let initialCategories: Category[] = [];

      const storedTasks = storedTasksRaw ? JSON.parse(storedTasksRaw) : null;
      const storedCategories = storedCategoriesRaw ? JSON.parse(storedCategoriesRaw) : null;

      if (!storedTasks || storedTasks.length === 0 || !storedCategories || storedCategories.length === 0) {
        // If either tasks or categories are missing, set defaults for both
        initialCategories = createDefaultCategories();
        initialTasks = createDefaultTasks(initialCategories);
        
        // Also save these defaults to localStorage immediately
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialCategories));
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(initialTasks));
      } else {
        initialTasks = storedTasks;
        initialCategories = storedCategories;
      }
      
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
    // Optionally, also remove logs and active timers for this task
    setTaskLogs(prevLogs => prevLogs.filter(log => log.taskId !== taskId));
    setActiveTimers(prevTimers => prevTimers.filter(timer => timer.taskId !== taskId));
  }, []);

  const isTaskActive = useCallback((taskId: string) => {
    return activeTimers.some(timer => timer.taskId === taskId);
  }, [activeTimers]);

  const startTask = useCallback((taskId: string) => {
    if (isTaskActive(taskId)) return; // Don't start if already active
    setActiveTimers(prevTimers => [...prevTimers, { taskId, startTime: Date.now() }]);
  }, [isTaskActive]);

  const stopTask = useCallback((taskIdToStop: string) => {
    const timerToStop = activeTimers.find(timer => timer.taskId === taskIdToStop);
    if (!timerToStop) return null;

    const endTime = Date.now();
    // Duration in minutes, rounded
    const duration = Math.round((endTime - timerToStop.startTime) / (1000 * 60)); 
    
    const newLog: TaskLog = {
      id: uuidv4(),
      taskId: timerToStop.taskId,
      startTime: timerToStop.startTime,
      endTime,
      duration, // Store duration in minutes
    };
    setTaskLogs(prevLogs => [...prevLogs, newLog].sort((a,b) => b.startTime - a.startTime)); // Keep logs sorted, newest first
    setActiveTimers(prevTimers => prevTimers.filter(timer => timer.taskId !== taskIdToStop));
    return newLog;
  }, [activeTimers]);

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
                   .sort((a, b) => a.startTime - b.startTime); // Sort by start time for chronological display
  }, [taskLogs]);

  const getTimeSpentOnTask = useCallback((taskId: string, basis: 'daily' | 'weekly' | 'monthly' | 'total' = 'total') => {
    const now = new Date();
    let startDate: Date;

    if (basis === 'daily') {
      startDate = dateFnsStartOfDay(now);
    } else if (basis === 'weekly') {
      startDate = dateFnsStartOfWeek(now, { weekStartsOn: 1 }); // Monday
    } else if (basis === 'monthly') {
      startDate = dateFnsStartOfMonth(now);
    } else { // 'total'
      startDate = new Date(0); // Effectively all time
    }
    // Ensure the start date's time component is midnight for period calculations,
    // unless it's 'total' which starts from epoch.
    if (basis !== 'total') {
        startDate.setHours(0,0,0,0);
    }

    const relevantLogs = taskLogs.filter(log => log.taskId === taskId && log.endTime >= startDate.getTime());
    return relevantLogs.reduce((total, log) => total + log.duration, 0); // Summing duration in minutes
  }, [taskLogs]);

  const getCategoryById = useCallback((categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  }, [categories]);

  const getAggregatedLogsForPeriod = useCallback((startDate: Date, endDate: Date, dateFormat: 'EEE' | 'MMM d' = 'EEE'): { dateLabel: string, totalMinutes: number }[] => {
    const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });
    return daysInPeriod.map(day => {
      const logsForThisDay = getLogsForDay(day); // getLogsForDay already returns logs for the specified day
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
    getAggregatedLogsForPeriod, // Export new function
    isLoaded,
  };
}


    