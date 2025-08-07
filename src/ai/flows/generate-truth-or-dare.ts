'use server';
/**
 * @fileOverview Truth and Dare generator AI agent.
 *
 * - generateTruthOrDare - A function that handles the truth or dare generation process.
 * - GenerateTruthOrDareInput - The input type for the generateTruthOrDare function.
 * - GenerateTruthOrDareOutput - The return type for the generateTruthOrDare function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTruthOrDareInputSchema = z.object({
  type: z.enum(['truth', 'dare']).describe('The type of challenge to generate: truth or dare.'),
});
export type GenerateTruthOrDareInput = z.infer<typeof GenerateTruthOrDareInputSchema>;

const GenerateTruthOrDareOutputSchema = z.object({
  challenge: z.string().describe('The generated truth or dare challenge.'),
});
export type GenerateTruthOrDareOutput = z.infer<typeof GenerateTruthOrDareOutputSchema>;

export async function generateTruthOrDare(input: GenerateTruthOrDareInput): Promise<GenerateTruthOrDareOutput> {
  return generateTruthOrDareFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTruthOrDarePrompt',
  input: {schema: GenerateTruthOrDareInputSchema},
  output: {schema: GenerateTruthOrDareOutputSchema},
  prompt: `You are a creative game master specializing in creating engaging truth and dare challenges for college students during their induction week.

  Generate a {{type}} challenge that is appropriate, fun, and encourages interaction among new students.

  Challenge:`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateTruthOrDareFlow = ai.defineFlow(
  {
    name: 'generateTruthOrDareFlow',
    inputSchema: GenerateTruthOrDareInputSchema,
    outputSchema: GenerateTruthOrDareOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
