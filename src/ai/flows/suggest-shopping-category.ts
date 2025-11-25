'use server';

/**
 * @fileOverview Shopping category suggestion flow.
 *
 * - suggestShoppingCategory - A function that suggests a category for a shopping item.
 * - SuggestShoppingCategoryInput - The input type for the suggestShoppingCategory function.
 * - SuggestShoppingCategoryOutput - The return type for the suggestShoppingCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestShoppingCategoryInputSchema = z.object({
  itemName: z.string().describe("The name of the shopping item."),
  existingCategories: z.array(z.string()).describe("A list of categories that the user has already created."),
});
export type SuggestShoppingCategoryInput = z.infer<typeof SuggestShoppingCategoryInputSchema>;

const SuggestShoppingCategoryOutputSchema = z.object({
    category: z.string().describe("The suggested category for the item."),
});
export type SuggestShoppingCategoryOutput = z.infer<typeof SuggestShoppingCategoryOutputSchema>;


export async function suggestShoppingCategory(input: SuggestShoppingCategoryInput): Promise<SuggestShoppingCategoryOutput> {
  return suggestShoppingCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestShoppingCategoryPrompt',
  input: {schema: SuggestShoppingCategoryInputSchema},
  output: {schema: SuggestShoppingCategoryOutputSchema},
  prompt: `Tu es un assistant expert en listes de courses. Pour l'article "{{itemName}}", suggère la catégorie de supermarché la plus appropriée en français.

Voici les catégories que l'utilisateur a déjà créées :
{{#each existingCategories}}
- {{this}}
{{/each}}

Privilégie une de ces catégories si elle est pertinente pour l'article. Si aucune ne correspond, tu peux suggérer une nouvelle catégorie logique.

Exemples de suggestions si aucune catégorie existante ne correspond :
- Article: Lait -> Catégorie: Produits laitiers
- Article: Pommes -> Catégorie: Fruits et Légumes
- Article: Papier toilette -> Catégorie: Hygiène
- Article: Steak haché -> Catégorie: Boucherie

Ne retourne que l'objet JSON avec la clé "category".`,
});

const suggestShoppingCategoryFlow = ai.defineFlow(
  {
    name: 'suggestShoppingCategoryFlow',
    inputSchema: SuggestShoppingCategoryInputSchema,
    outputSchema: SuggestShoppingCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
