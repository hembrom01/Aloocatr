
"use client";

import type { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { categorizedTaskIcons, taskIconsLookup, type CategorizedIcon } from '@/config/icons';
import type { TaskIconName } from '@/types';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentIcon: TaskIconName;
  onIconSelect: (iconName: TaskIconName) => void;
}

export const IconPicker: FC<IconPickerProps> = ({ isOpen, onOpenChange, currentIcon, onIconSelect }) => {
  const handleSelect = (iconName: TaskIconName) => {
    onIconSelect(iconName);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
          <DialogDescription>Browse icons by category or search (search coming soon).</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-3">
          <div className="space-y-6">
            {categorizedTaskIcons.map(category => (
              <div key={category.categoryLabel}>
                <h3 className="text-lg font-semibold mb-3 text-foreground sticky top-0 bg-background py-2 z-10">
                  {category.categoryLabel}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {category.icons.map((iconItem: CategorizedIcon) => {
                    const IconComponent = iconItem.IconComponent;
                    const isSelected = iconItem.name === currentIcon;
                    return (
                      <Button
                        key={iconItem.name}
                        variant="outline"
                        className={cn(
                          "flex flex-col items-center justify-center p-2 h-20 w-full aspect-square shadow-sm hover:shadow-md transition-all transform hover:scale-105",
                          isSelected && "ring-2 ring-primary bg-primary/10 border-primary"
                        )}
                        onClick={() => handleSelect(iconItem.name)}
                        title={iconItem.name}
                      >
                        <IconComponent className={cn("h-8 w-8", isSelected ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-xs mt-1 truncate w-full text-center">{iconItem.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
