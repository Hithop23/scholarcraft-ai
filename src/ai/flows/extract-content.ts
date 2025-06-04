'use server';

/**
 * @fileOverview An AI agent that extracts text content from various document types.
 *
 * - extractContent - A function that handles the content extraction process.
 * - ExtractContentInput - The input type for the extractContent function.
 * - ExtractContentOutput - The return type for the extractContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractContentInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractContentInput = z.infer<typeof ExtractContentInputSchema>;

const ExtractContentOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text content from the document.'),
});
export type ExtractContentOutput = z.infer<typeof ExtractContentOutputSchema>;

export async function extractContent(input: ExtractContentInput): Promise<ExtractContentOutput> {
  return extractContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractContentPrompt',
  input: {schema: ExtractContentInputSchema},
  output: {schema: ExtractContentOutputSchema},
  prompt: `You are a highly skilled AI assistant specializing in extracting text from documents.

  Extract all the text from the provided document.  Return only the extracted text.

  Document: {{media url=fileDataUri}}`,
});

const extractContentFlow = ai.defineFlow(
  {
    name: 'extractContentFlow',
    inputSchema: ExtractContentInputSchema,
    outputSchema: ExtractContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
