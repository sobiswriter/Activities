'use server';

/**
 * @fileOverview Rapid fire question generator flow.
 *
 * - generateRapidFireQuestion - A function that generates rapid fire questions.
 * - GenerateRapidFireQuestionInput - The input type for the generateRapidFireQuestion function.
 * - GenerateRapidFireQuestionOutput - The return type for the generateRapidFireQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRapidFireQuestionInputSchema = z.object({
  topic: z
    .string()
    .optional()
    .describe('Optional topic for the rapid fire questions.'),
  number: z
    .number()
    .min(1)
    .max(10)
    .default(5)
    .describe('The number of rapid fire questions to generate.'),
});
export type GenerateRapidFireQuestionInput = z.infer<typeof GenerateRapidFireQuestionInputSchema>;

const GenerateRapidFireQuestionOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of rapid fire questions.'),
});
export type GenerateRapidFireQuestionOutput = z.infer<typeof GenerateRapidFireQuestionOutputSchema>;

export async function generateRapidFireQuestion(
  input: GenerateRapidFireQuestionInput
): Promise<GenerateRapidFireQuestionOutput> {
  return generateRapidFireQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRapidFireQuestionPrompt',
  input: {schema: GenerateRapidFireQuestionInputSchema},
  output: {schema: GenerateRapidFireQuestionOutputSchema},
  prompt: `You are a creative question generator, skilled at creating engaging and quick rapid fire questions.\n\n  Generate {{{number}}} rapid fire questions.\n\n  {{#if topic}}\n  The questions should be on the topic of {{{topic}}}.\n  {{/if}}\n\n  Format each question as a simple string in a JSON array. No numbering is required.\n  `,
});

const generateRapidFireQuestionFlow = ai.defineFlow(
  {
    name: 'generateRapidFireQuestionFlow',
    inputSchema: GenerateRapidFireQuestionInputSchema,
    outputSchema: GenerateRapidFireQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
