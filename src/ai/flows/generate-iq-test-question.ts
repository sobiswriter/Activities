'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating IQ test questions.
 *
 * - generateIQTestQuestion - A function that generates an IQ test question.
 * - GenerateIQTestQuestionInput - The input type for the generateIQTestQuestion function.
 * - GenerateIQTestQuestionOutput - The return type for the generateIQTestQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIQTestQuestionInputSchema = z.object({
  topic: z.string().optional().describe('The topic of the IQ test question.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .default('easy')
    .describe('The difficulty level of the IQ test question.'),
});
export type GenerateIQTestQuestionInput = z.infer<typeof GenerateIQTestQuestionInputSchema>;

const GenerateIQTestQuestionOutputSchema = z.object({
  question: z.string().describe('The generated IQ test question.'),
  answer: z.string().describe('The answer to the IQ test question.'),
  explanation: z.string().optional().describe('The explanation of the answer.'),
});
export type GenerateIQTestQuestionOutput = z.infer<typeof GenerateIQTestQuestionOutputSchema>;

export async function generateIQTestQuestion(
  input: GenerateIQTestQuestionInput
): Promise<GenerateIQTestQuestionOutput> {
  return generateIQTestQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIQTestQuestionPrompt',
  input: {schema: GenerateIQTestQuestionInputSchema},
  output: {schema: GenerateIQTestQuestionOutputSchema},
  prompt: `You are an expert in creating IQ test questions. Generate an IQ test question based on the following criteria:

Topic: {{topic}}
Difficulty: {{difficulty}}

Make sure to provide both the question and the answer. Optionally, you can provide an explanation for the answer.

Question: ...
Answer: ...
Explanation: ...`,
});

const generateIQTestQuestionFlow = ai.defineFlow(
  {
    name: 'generateIQTestQuestionFlow',
    inputSchema: GenerateIQTestQuestionInputSchema,
    outputSchema: GenerateIQTestQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
