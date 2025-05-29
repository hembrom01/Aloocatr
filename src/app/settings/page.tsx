
"use client";

import { useState } from 'react';
import { TaskForm } from '@/components/task-form';
import { useTaskManager } from '@/hooks/use-task-manager';
import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { taskIcons, defaultTaskIcon } from '@/config/icons';
import { Edit2, PlusCircle, Palette, UserCircle, Zap } from 'lucide-react'; // Added Palette, UserCircle

export default function SettingsPage() {
  const { tasks, addTask, updateTask, deleteTask, isLoaded } = useTaskManager();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const handleTaskSubmit = (data: Omit<Task, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      updateTask({ ...data, id, createdAt: tasks.find(t => t.id === id)?.createdAt || Date.now() });
      setEditingTask(null);
    } else {
      addTask(data);
    }
    setShowAddTaskForm(false); // Hide form after submit
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTaskForm(true); // Show form for editing
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (editingTask?.id === taskId) {
      setEditingTask(null);
      setShowAddTaskForm(false);
    }
  };

  if (!isLoaded) {
    return (
       <div className="flex justify-center items-center min-h-screen">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl font-semibold">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your tasks and application preferences.</p>
      </header>

      <section id="manage-tasks">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Manage Tasks</CardTitle>
                <CardDescription>Add, edit, or remove your budgeted tasks.</CardDescription>
              </div>
              <Button onClick={() => { setEditingTask(null); setShowAddTaskForm(true); }} variant="default" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddTaskForm && (
              <TaskForm
                task={editingTask}
                onSubmit={handleTaskSubmit}
                onDelete={handleDeleteTask}
                formTitle={editingTask ? "Edit Task" : "Add New Task"}
                submitButtonText={editingTask ? "Update Task" : "Add Task"}
              />
            )}
            
            {tasks.length > 0 && (
              <>
                <h3 className="text-lg font-medium mt-6 mb-3">Your Tasks:</h3>
                <ScrollArea className="h-[300px] pr-3">
                  <ul className="space-y-3">
                    {tasks.map((task) => {
                      const IconComponent = taskIcons[task.icon] || taskIcons[defaultTaskIcon];
                      return (
                        <li key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-primary" />
                            <div>
                              <span className="font-medium">{task.name}</span>
                              <p className="text-xs text-muted-foreground">
                                {task.budgetedTime} min / {task.budgetBasis}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </>
            )}
            {tasks.length === 0 && !showAddTaskForm && (
              <p className="text-muted-foreground text-center py-4">You haven't added any tasks yet. Click "Add New Task" to get started.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="app-preferences">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">App Preferences</CardTitle>
            <CardDescription>Customize your ChronoFlow experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-start p-3 bg-muted/30 rounded-md border">
              <Palette className="h-5 w-5 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <h3 className="font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark mode using the theme switcher in the bottom navigation bar.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-muted/30 rounded-md border">
               <UserCircle className="h-5 w-5 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <h3 className="font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">
                  Login and account synchronization features are coming soon!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
