// src/app/actions/jiraActions.ts
'use server';

import type { JiraConfig } from '@/components/JiraConfigForm';

interface CreateJiraIssueParams {
  config: JiraConfig;
  summary: string;
  description: string; // Full report content
  issueType?: string; // Optional: Default to 'Bug'
}

interface JiraIssueResponse {
  id: string;
  key: string;
  self: string;
}

interface JiraErrorResponse {
  errorMessages?: string[];
  errors?: Record<string, string>;
}

export async function createJiraIssue({
  config,
  summary,
  description,
  issueType = 'Bug',
}: CreateJiraIssueParams): Promise<{ success: boolean; data?: JiraIssueResponse; error?: string }> {
  const { url, email, apiToken, projectKey } = config;

  if (!url || !email || !apiToken || !projectKey) {
    return { success: false, error: 'Jira configuration is incomplete.' };
  }

  const JIRA_API_ENDPOINT = `${url.replace(/\/$/, '')}/rest/api/3/issue`;

  const credentials = Buffer.from(`${email}:${apiToken}`).toString('base64');

  const body = {
    fields: {
      project: {
        key: projectKey,
      },
      summary: summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: description,
              },
            ],
          },
        ],
      },
      issuetype: {
        name: issueType,
      },
    },
  };

  try {
    const response = await fetch(JIRA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData: JiraErrorResponse = await response.json();
      console.error('Jira API Error:', errorData);
      const errorMessages = errorData.errorMessages?.join(', ') || 
                            (errorData.errors && Object.values(errorData.errors).join(', ')) || 
                            `Jira API responded with status ${response.status}`;
      return { success: false, error: `Failed to create Jira issue: ${errorMessages}` };
    }

    const responseData: JiraIssueResponse = await response.json();
    return { success: true, data: responseData };
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    return { success: false, error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` };
  }
}
