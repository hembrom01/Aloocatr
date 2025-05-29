
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskLog, ActiveTimer, Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const TASKS_STORAGE_KEY = 'chronoFlowTasks';
const TASK_LOGS_STORAGE_KEY = 'chronoFlowTaskLogs';
const ACTIVE_TIMERS_STORAGE_KEY = 'chronoFlowActiveTimers'; // Changed from ACTIVE_TIMER_STORAGE_KEY
const CATEGORIES_STORAGE_KEY = 'chronoFlowCategories';

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]); // Changed from activeTimer: ActiveTimer | null
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      
      const storedTaskLogs = localStorage.getItem(TASK_LOGS_STORAGE_KEY);
      if (storedTaskLogs) setTaskLogs(JSON.parse(storedTaskLogs));
      
      const storedActiveTimers = localStorage.getItem(ACTIVE_TIMERS_STORAGE_KEY); // Changed
      if (storedActiveTimers) setActiveTimers(JSON.parse(storedActiveTimers));
      
      const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      
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
      localStorage.setItem(ACTIVE_TIMERS_STORAGE_KEY, JSON.stringify(activeTimers)); // Changed
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
    setActiveTimers(prevTimers => prevTimers.filter(timer => timer.taskId !== taskId)); // Stop if active
  }, []);

  const isTaskActive = useCallback((taskId: string) => {
    return activeTimers.some(timer => timer.taskId === taskId);
  }, [activeTimers]);

  const startTask = useCallback((taskId: string) => {
    if (isTaskActive(taskId)) return; // Already active
    setActiveTimers(prevTimers => [...prevTimers, { taskId, startTime: Date.now() }]);
  }, [isTaskActive]);

  const stopTask = useCallback((taskIdToStop: string) => {
    const timerToStop = activeTimers.find(timer => timer.taskId === taskIdToStop);
    if (!timerToStop) return null;

    const endTime = Date.now();
    const duration = Math.round((endTime - timerToStop.startTime) / (1000 * 60)); // duration in minutes
    const newLog: TaskLog = {
      id: uuidv4(),
      taskId: timerToStop.taskId,
      startTime: timerToStop.startTime,
      endTime,
      duration,
    };
    setTaskLogs(prevLogs => [...prevLogs, newLog]);
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
  
  const getLogsForDay = useCallback((date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return taskLogs.filter(log => log.startTime >= startOfDay.getTime() && log.startTime <= endOfDay.getTime())
                   .sort((a, b) => a.startTime - b.startTime);
  }, [taskLogs]);

  const getTimeSpentOnTask = useCallback((taskId: string, basis: 'weekly' | 'monthly' | 'total' = 'total') => {
    const now = new Date();
    let startDate: Date;

    if (basis === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay()); 
      startDate.setHours(0,0,0,0);
    } else if (basis === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); 
      startDate.setHours(0,0,0,0);
    } else { 
      startDate = new Date(0); 
    }

    const relevantLogs = taskLogs.filter(log => log.taskId === taskId && log.endTime >= startDate.getTime());
    return relevantLogs.reduce((total, log) => total + log.duration, 0);
  }, [taskLogs]);

  const getCategoryById = useCallback((categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  }, [categories]);

  return {
    tasks,
    taskLogs,
    activeTimers, // Changed from activeTimer
    categories,
    addTask,
    updateTask,
    deleteTask,
    startTask, // New
    stopTask,  // New signature
    toggleTask, // New
    isTaskActive, // New
    getTaskById,
    getLogsForTask,
    getLogsForDay,
    getTimeSpentOnTask,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    isLoaded,
  };
}
