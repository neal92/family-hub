'use server';

/**
 * @fileOverview Meal suggestion flow.
 *
 * - suggestMealIdeas - A function that suggests meal ideas based on family preferences.
 * - SuggestMealIdeasInput - The input type for the suggestMealIdeas function.
 * - SuggestMealIdeasOutput - The return type for the suggestMealIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMealIdeasInputSchema = z.object({
  dietaryRestrictions: z
    .string()
    .describe("A comma separated list of dietary restrictions for the family (e.g., 'vegetarian, gluten-free, nut allergy')."),
  availableIngredients: z
    .string()
    .describe('A comma separated list of ingredients currently available.'),
  pastPreferences: z
    .string()
    .describe('A summary of the family’s past meal preferences.'),
});
export type SuggestMealIdeasInput = z.infer<typeof SuggestMealIdeasInputSchema>;

const SuggestMealIdeasOutputSchema = z.object({
  mealSuggestions: z
    .string()
    .describe('A list of meal suggestions that meet the specified criteria.'),
});
export type SuggestMealIdeasOutput = z.infer<typeof SuggestMealIdeasOutputSchema>;

export async function suggestMealIdeas(input: SuggestMealIdeasInput): Promise<SuggestMealIdeasOutput> {
  return suggestMealIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMealIdeasPrompt',
  input: {schema: SuggestMealIdeasInputSchema},
  output: {schema: SuggestMealIdeasOutputSchema},
  prompt: `You are a meal planning assistant. Suggest meal ideas based on the following information:

Dietary Restrictions: {{{dietaryRestrictions}}}
Available Ingredients: {{{availableIngredients}}}
Past Preferences: {{{pastPreferences}}}

Provide a list of meal suggestions that meet these criteria.`,
});

const suggestMealIdeasFlow = ai.defineFlow(
  {
    name: 'suggestMealIdeasFlow',
    inputSchema: SuggestMealIdeasInputSchema,
    outputSchema: SuggestMealIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
