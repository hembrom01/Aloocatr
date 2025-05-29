
"use client";

import { useState } from 'react';
import { TaskForm } from '@/components/task-form';
import { useTaskManager } from '@/hooks/use-task-manager';
import type { Task, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { taskIcons, defaultTaskIcon } from '@/config/icons';
import { Edit2, PlusCircle, Palette, UserCircle, Zap, Trash2, FolderPlus, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { 
    tasks, 
    categories,
    addTask, 
    updateTask, 
    deleteTask, 
    addCategory,
    deleteCategory, 
    isLoaded 
  } = useTaskManager();
  const { toast } = useToast();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  const handleTaskSubmit = (data: Omit<Task, 'id' | 'createdAt' | 'categoryId'> & { categoryId?: string | null }, id?: string) => {
    if (id) {
      updateTask({ 
        ...data, 
        id, 
        createdAt: tasks.find(t => t.id === id)?.createdAt || Date.now(),
        categoryId: data.categoryId === "null" ? null : data.categoryId 
      });
      setEditingTask(null);
    } else {
      addTask({
        ...data,
        categoryId: data.categoryId === "null" ? null : data.categoryId
      });
    }
    setShowAddTaskForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTaskForm(true); 
  };

  const handleDeleteTaskWithConfirmation = (taskId: string) => {
    // Potentially add a confirmation dialog here
    deleteTask(taskId);
    toast({ title: "Task Deleted", description: "The task has been removed."});
    if (editingTask?.id === taskId) {
      setEditingTask(null);
      setShowAddTaskForm(false);
    }
  };
  
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
      return;
    }
    addCategory(newCategoryName.trim());
    toast({ title: "Category Added", description: `Category "${newCategoryName.trim()}" created.` });
    setNewCategoryName('');
    setIsAddCategoryDialogOpen(false);
  };

  const handleDeleteCategoryWithConfirmation = (categoryId: string) => {
    // Potentially add a confirmation dialog here
    const category = categories.find(c => c.id === categoryId);
    deleteCategory(categoryId);
    toast({ title: "Category Deleted", description: `Category "${category?.name}" and its tasks (now uncategorized) removed.`});
  };

  if (!isLoaded) {
    return (
       <div className="flex justify-center items-center min-h-screen">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl font-semibold">Loading Settings...</p>
      </div>
    );
  }

  const uncategorizedTasks = tasks.filter(task => !task.categoryId || !categories.find(c => c.id === task.categoryId));
  
  return (
    <div className="space-y-8 pb-24"> {/* Added padding-bottom for FAB */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your tasks, categories, and application preferences.</p>
      </header>

      {showAddTaskForm && (
        <Dialog open={showAddTaskForm} onOpenChange={setShowAddTaskForm}>
          <DialogContent className="sm:max-w-lg">
             <TaskForm
                task={editingTask}
                categories={categories}
                onSubmit={handleTaskSubmit}
                onDelete={handleDeleteTaskWithConfirmation}
                formTitle={editingTask ? "Edit Task" : "Add New Task"}
                submitButtonText={editingTask ? "Update Task" : "Save Task"}
              />
          </DialogContent>
        </Dialog>
      )}

      <section id="manage-categories-tasks">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Manage Categories & Tasks</CardTitle>
            <CardDescription>Organize your tasks by categories, or manage them individually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollArea className="h-[400px] pr-3">
              {categories.map(category => (
                <div key={category.id} className="mb-6">
                  <div className="flex justify-between items-center mb-2 p-2 bg-muted/20 rounded-t-md">
                    <h3 className="text-xl font-semibold text-primary">{category.name}</h3>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategoryWithConfirmation(category.id)} aria-label="Delete category">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <ul className="space-y-3 pl-2">
                    {tasks.filter(task => task.categoryId === category.id).map(task => {
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
                    {tasks.filter(task => task.categoryId === category.id).length === 0 && (
                      <p className="text-sm text-muted-foreground pl-3">No tasks in this category.</p>
                    )}
                  </ul>
                </div>
              ))}
              
              {uncategorizedTasks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary mb-2 p-2 bg-muted/20 rounded-t-md">Uncategorized Tasks</h3>
                  <ul className="space-y-3 pl-2">
                    {uncategorizedTasks.map(task => {
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
                </div>
              )}

             {categories.length === 0 && uncategorizedTasks.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No categories or tasks found. Add a category or use the <Plus className="inline h-4 w-4"/> button to add a task.
                </p>
             )}
            </ScrollArea>

            <Separator />
            
            <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FolderPlus className="mr-2 h-5 w-5" /> Add New Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Category Name (e.g., Hobbies, Work)" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)} 
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
             <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
              <div className="flex items-center">
                <Palette className="h-5 w-5 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Appearance</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark mode.
                  </p>
                </div>
              </div>
              <ThemeToggle />
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

      {/* Floating Action Button to Add Task */}
      <Button
        className="fixed bottom-20 right-6 h-14 w-14 rounded-lg shadow-xl z-50" // Square shape with rounded corners
        size="icon"
        onClick={() => {
          setEditingTask(null);
          setShowAddTaskForm(true);
        }}
        aria-label="Add new task"
      >
        <PlusCircle className="h-8 w-8" />
      </Button>
    </div>
  );
}
