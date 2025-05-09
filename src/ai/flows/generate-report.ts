'use server';

/**
 * @fileOverview AI flow to generate a concise report from Selenium QA test output.
 *
 * - generateReportFromSeleniumOutput - A function that handles the report generation process.
 * - GenerateReportFromSeleniumOutputInput - The input type for the generateReportFromSeleniumOutput function.
 * - GenerateReportFromSeleniumOutputOutput - The return type for the generateReportFromSeleniumOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportFromSeleniumOutputInputSchema = z.object({
  seleniumOutput: z
    .string()
    .describe('The Selenium QA test output, including console logs and error messages.'),
});
export type GenerateReportFromSeleniumOutputInput = z.infer<
  typeof GenerateReportFromSeleniumOutputInputSchema
>;

const GenerateReportFromSeleniumOutputOutputSchema = z.object({
  report: z.string().describe('The concise report summarizing issues and potential root causes.'),
});
export type GenerateReportFromSeleniumOutputOutput = z.infer<
  typeof GenerateReportFromSeleniumOutputOutputSchema
>;

export async function generateReportFromSeleniumOutput(
  input: GenerateReportFromSeleniumOutputInput
): Promise<GenerateReportFromSeleniumOutputOutput> {
  return generateReportFromSeleniumOutputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportFromSeleniumOutputPrompt',
  input: {schema: GenerateReportFromSeleniumOutputInputSchema},
  output: {schema: GenerateReportFromSeleniumOutputOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing Selenium QA test output and generating concise reports.

  Analyze the following Selenium output and generate a report that summarizes the identified issues and their potential root causes. The report should be human-readable and easy to understand.

  Selenium Output:
  {{seleniumOutput}}`,
});

const generateReportFromSeleniumOutputFlow = ai.defineFlow(
  {
    name: 'generateReportFromSeleniumOutputFlow',
    inputSchema: GenerateReportFromSeleniumOutputInputSchema,
    outputSchema: GenerateReportFromSeleniumOutputOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
