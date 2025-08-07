
'use server';
/**
 * @fileOverview A Genkit flow for generating a "Guess the Name" game.
 *
 * - generateGuessTheName - A function that creates a challenge.
 * - GenerateGuessTheNameInput - The input type for the generateGuessTheName function.
 * - GenerateGuessTheNameOutput - The return type for the generateGuessTheName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGuessTheNameInputSchema = z.object({
  topic: z.string().optional().describe('Optional topic for the challenge (e.g., "Scientists", "80s Movies", "Capital Cities").'),
});
export type GenerateGuessTheNameInput = z.infer<typeof GenerateGuessTheNameInputSchema>;

const GenerateGuessTheNameOutputSchema = z.object({
  name: z.string().describe('The name of the famous person, place, or thing to be guessed.'),
  description: z.string().describe('A one-sentence description of the subject, without giving away the name.'),
  hints: z.array(z.string()).length(3).describe('An array of three progressively easier hints.'),
  imagePrompt: z.string().describe('A descriptive prompt for an AI image generator to create a visual clue that is artistic and suggestive, not a direct photo.'),
});
export type GenerateGuessTheNameOutput = z.infer<typeof GenerateGuessTheNameOutputSchema>;

export async function generateGuessTheName(
  input: GenerateGuessTheNameInput
): Promise<GenerateGuessTheNameOutput> {
  return generateGuessTheNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGuessTheNamePrompt',
  input: {schema: GenerateGuessTheNameInputSchema},
  output: {schema: GenerateGuessTheNameOutputSchema},
  prompt: `You are a creative game master creating a "Guess the Name" challenge for college students. The subject should be a well-known person, place, or thing.

  Your response must be in JSON format.

  Here are the requirements for the generated content:
  - **name**: The name to be guessed.
  - **description**: A single, intriguing sentence that describes the subject without using any part of its name.
  - **hints**: An array of exactly three strings. Each hint should make it progressively easier to guess the name.
  - **imagePrompt**: A creative and descriptive prompt for an AI image generator. The prompt should describe an artistic scene related to the subject, not a simple depiction. For example, for "Eiffel Tower", a bad prompt is "Photo of the Eiffel Tower". A good prompt is "An impressionist oil painting of a towering iron lattice structure sparkling against a Parisian twilight sky."

  {{#if topic}}
  The challenge should be related to the topic of: {{{topic}}}.
  {{/if}}
  `,
});

const generateGuessTheNameFlow = ai.defineFlow(
  {
    name: 'generateGuessTheNameFlow',
    inputSchema: GenerateGuessTheNameInputSchema,
    outputSchema: GenerateGuessTheNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
