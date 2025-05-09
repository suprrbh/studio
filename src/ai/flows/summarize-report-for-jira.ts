'use server';

/**
 * @fileOverview Summarizes an AI-generated report into a Jira-compatible issue description.
 *
 * - summarizeReportForJira - A function that summarizes the report for Jira.
 * - SummarizeReportForJiraInput - The input type for the summarizeReportForJira function.
 * - SummarizeReportForJiraOutput - The return type for the summarizeReportForJira function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReportForJiraInputSchema = z.object({
  report: z.string().describe('The AI-generated report to summarize.'),
});
export type SummarizeReportForJiraInput = z.infer<typeof SummarizeReportForJiraInputSchema>;

const SummarizeReportForJiraOutputSchema = z.object({
  jiraDescription: z
    .string()
    .describe('A Jira-compatible issue description summarizing the report.'),
});
export type SummarizeReportForJiraOutput = z.infer<typeof SummarizeReportForJiraOutputSchema>;

export async function summarizeReportForJira(input: SummarizeReportForJiraInput): Promise<SummarizeReportForJiraOutput> {
  return summarizeReportForJiraFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReportForJiraPrompt',
  input: {schema: SummarizeReportForJiraInputSchema},
  output: {schema: SummarizeReportForJiraOutputSchema},
  prompt: `You are an AI assistant who is an expert at summarizing reports into a Jira-compatible issue description.

  Given the following report, summarize it into a Jira-compatible issue description.

  Report:
  {{report}}`,
});

const summarizeReportForJiraFlow = ai.defineFlow(
  {
    name: 'summarizeReportForJiraFlow',
    inputSchema: SummarizeReportForJiraInputSchema,
    outputSchema: SummarizeReportForJiraOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
