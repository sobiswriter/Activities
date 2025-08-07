'use server';

/**
 * @fileOverview Generates a "Two Truths and a Lie" game.
 *
 * - generateTwoTruthsAndALie - A function that generates two true statements and one lie.
 * - GenerateTwoTruthsAndALieInput - The input type for the generateTwoTruthsAndALie function.
 * - GenerateTwoTruthsAndALieOutput - The return type for the generateTwoTruthsAndALie function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTwoTruthsAndALieInputSchema = z.object({
  topic: z.string().optional().describe('Optional topic for the statements.'),
});
export type GenerateTwoTruthsAndALieInput = z.infer<typeof GenerateTwoTruthsAndALieInputSchema>;

const GenerateTwoTruthsAndALieOutputSchema = z.object({
  statements: z.array(z.string()).length(3).describe('An array of three statements: two truths and one lie.'),
  lieIndex: z.number().min(0).max(2).describe('The index of the lie in the statements array.'),
});
export type GenerateTwoTruthsAndALieOutput = z.infer<typeof GenerateTwoTruthsAndALieOutputSchema>;

export async function generateTwoTruthsAndALie(
  input: GenerateTwoTruthsAndALieInput
): Promise<GenerateTwoTruthsAndALieOutput> {
  return generateTwoTruthsAndALieFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTwoTruthsAndALiePrompt',
  input: { schema: GenerateTwoTruthsAndALieInputSchema },
  output: { schema: GenerateTwoTruthsAndALieOutputSchema },
  prompt: `You are a creative assistant that generates "Two Truths and a Lie" games for college freshers. The statements should be fun, interesting, and believable.

  Generate two true statements and one lie. If a topic is provided, the statements should be related to that topic.

  Topic: {{topic}}

  Return the three statements in a random order and provide the index of the lie.
  `,
});

const generateTwoTruthsAndALieFlow = ai.defineFlow(
  {
    name: 'generateTwoTruthsAndALieFlow',
    inputSchema: GenerateTwoTruthsAndALieInputSchema,
    outputSchema: GenerateTwoTruthsAndALieOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
