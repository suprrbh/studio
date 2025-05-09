# **App Name**: JiraPilot

## Core Features:

- Input Parser: Accepts Selenium QA test output (e.g., console logs, error messages) as input, either through direct upload or pasting text.
- AI-Powered Report Generation: Uses the Gemma 3 model as a tool to analyze the QA test output and generate a concise, human-readable report summarizing the findings, including identified issues and potential root causes.
- Jira Integration: Allows users to directly push the generated report to Jira, automatically creating a new issue (e.g., bug report) with the report content pre-populated.
- Jira Setup: Simple UI for configuring Jira connection settings (e.g., Jira URL, API token, project key).
- Report Preview: Display a formatted version of the AI-generated report for user review before submitting to Jira. Provides edit capabilities to tweak AI output, if required.

## Style Guidelines:

- Primary color: Teal (#008080) for a professional and technical feel.
- Secondary color: Light gray (#F0F0F0) for background and neutral elements.
- Accent: Coral (#FF7F50) for call-to-action buttons and highlights.
- Clean and readable sans-serif fonts for the report display and UI.
- Use clear, consistent icons for actions (e.g., upload, generate, submit).
- A clear, single-column layout to easily visualize all of the main features. No hidden complexity.
- Loading animations for the AI report generation. Subtle transitions between sections.