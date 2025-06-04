'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quizzes based on a topic and difficulty level.
 *
 * - generateQuiz - A function that generates a quiz based on the given topic and difficulty level.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the quiz.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the quiz.'),
  numberOfQuestions: z
    .number()
    .min(1)
    .max(20)
    .default(10) // Providing a default number of questions.
    .describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert quiz generator. Generate a quiz with the following specifications:

Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Number of Questions: {{{numberOfQuestions}}}

The quiz should be returned in JSON format. Each question should have the following format:
{
  "question": "The question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": "The correct answer"
}

Ensure that the difficulty of the questions matches the specified difficulty level. The quiz should have the specified number of questions.

Here's an example of how the quiz should look:

[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Rome"],
    "answer": "Paris"
  },
  {
    "question": "What is the highest mountain in the world?",
    "options": ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
    "answer": "Mount Everest"
  }
]


Make sure the quiz is in valid JSON format.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);
