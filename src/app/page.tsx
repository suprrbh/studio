// src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { JiraConfigForm, type JiraConfig } from '@/components/JiraConfigForm';
import { SeleniumInputForm } from '@/components/SeleniumInputForm';
import { ReportPreview } from '@/components/ReportPreview';
import { getLocalStorageItem } from '@/lib/localStorage'; // No need to setLocalStorageItem here
import { Separator } from '@/components/ui/separator';

const JIRA_CONFIG_KEY = 'jiraPilotConfig';

export default function HomePage() {
  const [jiraConfig, setJiraConfig] = useState<JiraConfig>({ url: '', email: '', apiToken: '', projectKey: '' });
  const [generatedReport, setGeneratedReport] = useState<string>('');
  
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isSubmittingToJira, setIsSubmittingToJira] = useState(false);

  useEffect(() => {
    const savedConfig = getLocalStorageItem<JiraConfig>(JIRA_CONFIG_KEY, { url: '', email: '', apiToken: '', projectKey: '' });
    setJiraConfig(savedConfig);
  }, []);

  const handleConfigChange = (newConfig: JiraConfig) => {
    setJiraConfig(newConfig);
    // JiraConfigForm already saves to localStorage, this updates parent state
  };

  const handleReportGenerated = (report: string) => {
    setGeneratedReport(report);
  };
  
  const handleReportSubmitted = () => {
    // Optionally clear the report or perform other actions after submission
    // setGeneratedReport(''); 
    // Potentially reset loading state if needed, though ReportPreview handles its own
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <JiraConfigForm 
        initialConfig={jiraConfig} 
        onConfigChange={handleConfigChange} 
      />
      
      <Separator />

      <SeleniumInputForm 
        onReportGenerated={handleReportGenerated}
        isLoading={isLoadingReport}
        setIsLoading={setIsLoadingReport}
      />

      {generatedReport && (
        <>
          <Separator />
          <ReportPreview 
            report={generatedReport} 
            jiraConfig={jiraConfig}
            isLoading={isSubmittingToJira}
            setIsLoading={setIsSubmittingToJira}
            onReportSubmitted={handleReportSubmitted}
          />
        </>
      )}
    </div>
  );
}
