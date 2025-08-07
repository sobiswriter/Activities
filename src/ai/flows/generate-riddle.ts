'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating random, fun riddles.
 * 
 * - generateRiddle - A function that generates a riddle.
 * - GenerateRiddleInput - The input type for the generateRiddle function (currently empty).
 * - GenerateRiddleOutput - The return type for the generateRiddle function, containing the riddle and its answer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRiddleInputSchema = z.object({});
export type GenerateRiddleInput = z.infer<typeof GenerateRiddleInputSchema>;

const GenerateRiddleOutputSchema = z.object({
  riddle: z.string().describe('The generated riddle.'),
  answer: z.string().describe('The answer to the generated riddle.'),
  isAgeAppropriate: z.boolean().describe('Whether the riddle is age appropriate'),
});
export type GenerateRiddleOutput = z.infer<typeof GenerateRiddleOutputSchema>;

export async function generateRiddle(input: GenerateRiddleInput): Promise<GenerateRiddleOutput> {
  return generateRiddleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiddlePrompt',
  input: {schema: GenerateRiddleInputSchema},
  output: {schema: GenerateRiddleOutputSchema},
  prompt: `You are a riddle generator. Generate a fun and easy riddle suitable for college freshers.

Riddle: {{ riddle }}
Answer: {{ answer }}
Is Age Appropriate: {{isAgeAppropriate}}

Ensure the riddle is appropriate for all audiences.

Response in JSON format.`,
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

const generateRiddleFlow = ai.defineFlow(
  {
    name: 'generateRiddleFlow',
    inputSchema: GenerateRiddleInputSchema,
    outputSchema: GenerateRiddleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
