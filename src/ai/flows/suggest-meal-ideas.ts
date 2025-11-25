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
    .describe("A comma separated list of dietary restrictions for the family (e.g., 'vegetarian, gluten-free, nut allergy'). Can be empty if specified in availableIngredients."),
  availableIngredients: z
    .string()
    .describe('A comma separated list of ingredients currently available, can also contain preferences and restrictions.'),
  pastPreferences: z
    .string()
    .describe('A summary of the family’s past meal preferences. Can be empty if specified in availableIngredients.'),
});
export type SuggestMealIdeasInput = z.infer<typeof SuggestMealIdeasInputSchema>;

const MealIdeaSchema = z.object({
  name: z.string().describe('The name of the meal.'),
  description: z.string().describe('A short, appealing description of the meal.'),
  recipe: z.string().describe('A complete, step-by-step recipe, including ingredients and instructions. Use markdown for formatting. Start with a list of ingredients, then provide numbered steps.'),
});

const SuggestMealIdeasOutputSchema = z.object({
  mealSuggestions: z.array(MealIdeaSchema).describe('A list of meal suggestions that meet the specified criteria.'),
});
export type SuggestMealIdeasOutput = z.infer<typeof SuggestMealIdeasOutputSchema>;

type MealSuggestionWithImage = z.infer<typeof MealIdeaSchema> & { imageUrl?: string };

export async function suggestMealIdeas(input: SuggestMealIdeasInput): Promise<{ mealSuggestions: MealSuggestionWithImage[]}> {
  const mealIdeas = await suggestMealIdeasFlow(input);
  
  if (!mealIdeas.mealSuggestions) {
    return { mealSuggestions: [] };
  }

  // Generate an image for each meal suggestion
  const suggestionsWithImages = await Promise.all(
    mealIdeas.mealSuggestions.map(async (suggestion) => {
      try {
        const { media } = await ai.generate({
          model: 'googleai/imagen-4.0-fast-generate-001',
          prompt: `A delicious, professionally photographed image of ${suggestion.name}, ${suggestion.description}`,
        });
        return { ...suggestion, imageUrl: media.url };
      } catch (error) {
        console.error(`Failed to generate image for ${suggestion.name}:`, error);
        // Return the suggestion without an image if generation fails
        return { ...suggestion, imageUrl: undefined };
      }
    })
  );

  return { mealSuggestions: suggestionsWithImages };
}

const prompt = ai.definePrompt({
  name: 'suggestMealIdeasPrompt',
  input: {schema: SuggestMealIdeasInputSchema},
  output: {schema: SuggestMealIdeasOutputSchema},
  prompt: `You are a meal planning assistant. Your goal is to provide three distinct and appealing meal ideas based on the user's input. For each meal, provide a name, a short description, and a complete, step-by-step recipe formatted with Markdown. The recipe must start with a list of ingredients, followed by numbered steps for the instructions. All responses must be in French.

User's prompt (contains ingredients, preferences, and/or restrictions): {{{availableIngredients}}}
`,
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
