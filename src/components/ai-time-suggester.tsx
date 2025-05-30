
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { suggestTimeAllocation, type TimeAllocationInput, type TimeAllocationOutput } from '@/ai/flows/time-allocation-suggestions';
import { useToast } from '@/hooks/use-toast';

interface AiTimeSuggesterProps {
  taskName: string;
  currentTimeAllocation: string; // e.g., "2 hours"
  onSuggestionApplied: (suggestedTime: string) => void;
}

export const AiTimeSuggester: FC<AiTimeSuggesterProps> = ({ taskName, currentTimeAllocation, onSuggestionApplied }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');
  const [suggestion, setSuggestion] = useState<TimeAllocationOutput | null>(null);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const input: TimeAllocationInput = {
        taskName,
        timeAllocation: currentTimeAllocation,
        additionalContext: context,
      };
      const result = await suggestTimeAllocation(input);
      setSuggestion(result);
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to get AI suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      onSuggestionApplied(suggestion.suggestedTimeAllocation);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Wand2 className="mr-2 h-4 w-4" />
        AI Suggest
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg">AI Time Allocation Suggestion</DialogTitle>
            <DialogDescription className="text-sm">
              Let AI suggest a time allocation for '{taskName}' (current: {currentTimeAllocation}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="context" className="text-right col-span-1 text-sm">
                Context
              </Label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., This task is high priority, involves research..."
                className="col-span-3 text-sm"
              />
            </div>
            {isLoading && (
              <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-base">Getting suggestion...</p>
              </div>
            )}
            {suggestion && !isLoading && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-base font-semibold">Suggested Allocation: {suggestion.suggestedTimeAllocation}</p>
                <p className="text-sm text-muted-foreground mt-1">Reasoning: {suggestion.reasoning}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            {suggestion && !isLoading && (
              <Button onClick={handleApplySuggestion} size="sm">Apply Suggestion</Button>
            )}
            <Button onClick={handleGetSuggestion} disabled={isLoading || !taskName || !currentTimeAllocation} size="sm">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Get Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
