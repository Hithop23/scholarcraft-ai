import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/extract-content.ts';
import '@/ai/flows/summarize-content.ts';
import '@/ai/flows/generate-flashcards.ts';