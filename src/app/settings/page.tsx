
"use client";

import { useState } from 'react';
import { TaskForm } from '@/components/task-form';
import { useTaskManager } from '@/hooks/use-task-manager';
import type { Task, Category, TaskFormDataValues } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { taskIconsLookup, defaultTaskIcon } from '@/config/icons';
import { Edit2, PlusCircle, Trash2, FolderPlus, Plus } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AppLoadingScreen } from '@/components/app-loading-screen';

export default function TasksPage() { 
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
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  const handleTaskSubmit = (data: TaskFormDataValues, id?: string) => {
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
    setShowTaskFormDialog(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskFormDialog(true); 
  };

  const handleDeleteTaskWithConfirmation = (taskId: string) => {
    deleteTask(taskId);
    toast({ title: "Task Deleted", description: "The task has been removed."});
    if (editingTask?.id === taskId) {
      setEditingTask(null);
      setShowTaskFormDialog(false);
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
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      deleteCategory(categoryId);
      toast({ title: "Category Deleted", description: `Category "${category.name}" removed. Associated tasks are now uncategorized.`});
    } else {
      toast({ title: "Error", description: "Category not found.", variant: "destructive" });
    }
  };

  if (!isLoaded) {
     return (
      <AppLoadingScreen
        isAppActuallyLoaded={isLoaded}
        onLoadingFinished={() => {}}
      />
    );
  }

  const uncategorizedTasks = tasks.filter(task => !task.categoryId || !categories.find(c => c.id === task.categoryId));
  
  return (
    <div className="space-y-8 pb-24 animate-page-content-appear">
      <header className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Tasks</h1>
        <p className="text-xs text-muted-foreground">Manage your tasks, categories. App-wide preferences are in the sidebar.</p>
      </header>

      <Dialog open={showTaskFormDialog} onOpenChange={(isOpen) => {
        setShowTaskFormDialog(isOpen);
        if (!isOpen) setEditingTask(null); 
      }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <TaskForm
                task={editingTask}
                categories={categories}
                onSubmit={handleTaskSubmit}
                onDelete={handleDeleteTaskWithConfirmation}
                onClose={() => {
                  setShowTaskFormDialog(false);
                  setEditingTask(null);
                }}
                formTitle={editingTask ? "Edit Task" : "Add New Task"}
                submitButtonText={editingTask ? "Update Task" : "Save Task"}
            />
        </DialogContent>
      </Dialog>

      <section id="manage-categories-tasks" className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Manage Categories & Tasks</h2>
          <p className="text-xs text-muted-foreground mb-4">Organize your tasks by categories, or manage them individually.</p>
        </div>
        
        <div className="space-y-6"> {/* Replaces ScrollArea, no fixed height or specific styling */}
          {categories.map(category => (
            <div key={category.id} className="mb-6">
              <div className="flex justify-between items-center mb-2 p-2 bg-muted/20 rounded-t-md">
                <h3 className="text-base font-semibold text-primary">{category.name}</h3>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategoryWithConfirmation(category.id)} aria-label="Delete category">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <ul className="space-y-3 pl-2">
                {tasks.filter(task => task.categoryId === category.id).map(task => {
                  const IconComponent = taskIconsLookup[task.icon] || taskIconsLookup[defaultTaskIcon];
                  return (
                    <li key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <div>
                          <span className="text-sm font-medium">{task.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {task.allocatedTime} min / {task.allocationBasis}
                            {task.targetDurationDays ? ` for ${task.targetDurationDays} days` : ''}
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
                  <p className="text-xs text-muted-foreground pl-3">No tasks in this category.</p>
                )}
              </ul>
            </div>
          ))}
          
          {uncategorizedTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-primary mb-2 p-2 bg-muted/20 rounded-t-md">Uncategorized Tasks</h3>
              <ul className="space-y-3 pl-2">
                {uncategorizedTasks.map(task => {
                  const IconComponent = taskIconsLookup[task.icon] || taskIconsLookup[defaultTaskIcon];
                  return (
                    <li key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <div>
                          <span className="text-sm font-medium">{task.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {task.allocatedTime} min / {task.allocationBasis}
                            {task.targetDurationDays ? ` for ${task.targetDurationDays} days` : ''}
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
            <p className="text-xs text-muted-foreground text-center py-4">
              No categories or tasks found. Add a category or use the <Plus className="inline h-4 w-4"/> button to add a task.
            </p>
         )}
        </div>

        <Separator />
        
        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full text-sm">
              <FolderPlus className="mr-2 h-5 w-5" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input 
                placeholder="Category Name (e.g., Hobbies, Work)" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)} 
                className="text-sm"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddCategory} size="sm">Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </section>

      <Button
        className="fixed bottom-20 right-6 h-14 w-14 rounded-lg shadow-xl z-50"
        size="icon"
        onClick={() => {
          setEditingTask(null);
          setShowTaskFormDialog(true);
        }}
        aria-label="Add new task"
      >
        <PlusCircle className="h-8 w-8" />
      </Button>
    </div>
  );
}

