'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating dynamic typing passages.
 *
 * - generateTypingPassage - A function that generates a typing passage.
 * - GenerateTypingPassageInput - The input type for the generateTypingPassage function.
 * - GenerateTypingPassageOutput - The return type for the generateTypingPassage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTypingPassageInputSchema = z.object({
  wordCount: z
    .number()
    .optional()
    .describe('The approximate number of words for the typing passage.'),
});
export type GenerateTypingPassageInput = z.infer<
  typeof GenerateTypingPassageInputSchema
>;

const GenerateTypingPassageOutputSchema = z.object({
  passage: z.string().describe('The generated typing passage.'),
});
export type GenerateTypingPassageOutput = z.infer<
  typeof GenerateTypingPassageOutputSchema
>;

const DEFAULT_PASSAGES = [
  "Innovation is the ability to see change as an opportunity, not a threat. Success is not final, failure is not fatal: it is the courage to continue that counts. The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
  "The future belongs to those who believe in the beauty of their dreams. Quality is not an act, it is a habit. Precision is the soul of craftsmanship. Every detail matters when excellence is the only acceptable standard for the work we produce.",
  "Simplicity is the ultimate sophistication. Design is not just what it looks like and feels like. Design is how it works. Focus means saying no to the hundred other good ideas that there are. You have to pick carefully."
];

export async function generateTypingPassage(
  input: GenerateTypingPassageInput
): Promise<GenerateTypingPassageOutput> {
  return generateTypingPassageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTypingPassagePrompt',
  input: {schema: GenerateTypingPassageInputSchema},
  output: {schema: GenerateTypingPassageOutputSchema},
  prompt: `Generate a unique, challenging, and varied typing passage.

It should be engaging and suitable for a typing speed test. Do not include any introductory or concluding remarks, just the passage text.

{{#if wordCount}}
Aim for approximately {{{wordCount}}} words.
{{/if}}

Ensure the passage contains a mix of common and less common words, punctuation, and sentence structures to provide a comprehensive typing challenge.
`,
});

const generateTypingPassageFlow = ai.defineFlow(
  {
    name: 'generateTypingPassageFlow',
    inputSchema: GenerateTypingPassageInputSchema,
    outputSchema: GenerateTypingPassageOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output?.passage) throw new Error("No passage generated");
      return output;
    } catch (e) {
      // Graceful fallback if quota is exceeded or API fails
      const fallback = DEFAULT_PASSAGES[Math.floor(Math.random() * DEFAULT_PASSAGES.length)];
      return { passage: fallback };
    }
  }
);
