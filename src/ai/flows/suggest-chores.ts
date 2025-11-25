'use server';

/**
 * @fileOverview Chore suggestion AI agent.
 *
 * - suggestChores - A function that handles the chore suggestion process.
 * - SuggestChoresInput - The input type for the suggestChores function.
 * - SuggestChoresOutput - The return type for the suggestChores function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChoresInputSchema = z.object({
  familyMembers: z.array(
    z.object({
      name: z.string().describe('Name of the family member'),
      age: z.number().describe('Age of the family member'),
      skills: z.string().describe('Skills of the family member'),
      availability: z.string().describe('Availability of the family member'),
    })
  ).describe('List of family members with their age, skills and availability.'),
  chores: z.array(
    z.string().describe('List of chores to be assigned')
  ).describe('List of chores to be assigned'),
});
export type SuggestChoresInput = z.infer<typeof SuggestChoresInputSchema>;

const SuggestChoresOutputSchema = z.array(
  z.object({
    familyMember: z.string().describe('Name of the family member'),
    chore: z.string().describe('Chore assigned to the family member'),
    reason: z.string().describe('Reason for assigning the chore to the family member'),
  })
).describe('List of chore assignments for each family member.');
export type SuggestChoresOutput = z.infer<typeof SuggestChoresOutputSchema>;

export async function suggestChores(input: SuggestChoresInput): Promise<SuggestChoresOutput> {
  return suggestChoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChoresPrompt',
  input: {schema: SuggestChoresInputSchema},
  output: {schema: SuggestChoresOutputSchema},
  prompt: `Vous êtes un assistant IA qui suggère des attributions de corvées pour les membres de la famille. Toutes les réponses doivent être en français.

Étant donné les membres de la famille suivants et leurs attributs :

{{#each familyMembers}}
- Nom: {{this.name}}, Âge: {{this.age}}, Compétences: {{this.skills}}, Disponibilité: {{this.availability}}
{{/each}}

Et les corvées suivantes :

{{#each chores}}
- {{this}}
{{/each}}

Suggérez des attributions de corvées, en tenant compte de l'âge, des compétences et de la disponibilité de chaque membre de la famille. Fournissez une raison en français pour chaque attribution.

Formatez votre réponse sous forme de tableau JSON d'objets, où chaque objet a les clés suivantes :
- familyMember: Le nom du membre de la famille.
- chore: La corvée assignée au membre de la famille.
- reason: La raison de l'attribution de la corvée au membre de la famille.
`,
});

const suggestChoresFlow = ai.defineFlow(
  {
    name: 'suggestChoresFlow',
    inputSchema: SuggestChoresInputSchema,
    outputSchema: SuggestChoresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
