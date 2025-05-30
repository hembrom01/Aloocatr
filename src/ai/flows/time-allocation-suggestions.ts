
'use server';

/**
 * @fileOverview A time allocation suggestion AI agent.
 *
 * - suggestTimeAllocation - A function that suggests time allocations for tasks.
 * - TimeAllocationInput - The input type for the suggestTimeAllocation function.
 * - TimeAllocationOutput - The return type for the suggestTimeAllocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimeAllocationInputSchema = z.object({
  taskName: z.string().describe('The name of the task.'),
  allocatedTime: z.string().describe('The current time allocated to the task (e.g., 2 hours).'),
  additionalContext: z.string().optional().describe('Any additional context about the task.'),
});
export type TimeAllocationInput = z.infer<typeof TimeAllocationInputSchema>;

const TimeAllocationOutputSchema = z.object({
  suggestedTimeAllocation: z.string().describe('A suggested time allocation for the task.'),
  reasoning: z.string().describe('The reasoning behind the suggested time allocation.'),
});
export type TimeAllocationOutput = z.infer<typeof TimeAllocationOutputSchema>;

export async function suggestTimeAllocation(input: TimeAllocationInput): Promise<TimeAllocationOutput> {
  return suggestTimeAllocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'timeAllocationPrompt',
  input: {schema: TimeAllocationInputSchema},
  output: {schema: TimeAllocationOutputSchema},
  prompt: `You are a time management expert. Given the task name, current time allocation, and any additional context, suggest a revised time allocation.

Task Name: {{{taskName}}}
Current Time Allocation: {{{allocatedTime}}}
Additional Context: {{{additionalContext}}}

Provide a suggested time allocation and the reasoning behind it.

Suggested Time Allocation: {
  "suggestedTimeAllocation": "<suggested_time>",
  "reasoning": "<reasoning>"
}
`,
});

const suggestTimeAllocationFlow = ai.defineFlow(
  {
    name: 'suggestTimeAllocationFlow',
    inputSchema: TimeAllocationInputSchema,
    outputSchema: TimeAllocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
