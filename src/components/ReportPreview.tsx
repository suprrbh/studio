// src/components/ReportPreview.tsx
"use client";

import React, { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { summarizeReportForJira } from '@/ai/flows/summarize-report-for-jira';
import type { SummarizeReportForJiraInput } from '@/ai/flows/summarize-report-for-jira';
import type { JiraConfig } from './JiraConfigForm';
import { createJiraIssue } from '@/app/actions/jiraActions'; // Import the server action
import { Send, Loader2, BookOpenText, ExternalLink } from 'lucide-react';
import Link from 'next/link';


interface ReportPreviewProps {
  report: string;
  jiraConfig: JiraConfig;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onReportSubmitted?: () => void;
}

const JIRA_DESCRIPTION_MAX_LENGTH = 254; // Less than 255 characters

export function ReportPreview({ report, jiraConfig, isLoading, setIsLoading, onReportSubmitted }: ReportPreviewProps) {
  const [editableReport, setEditableReport] = useState(report);
  const { toast } = useToast();

  useEffect(() => {
    setEditableReport(report);
  }, [report]);

  const handleSubmitToJira = async (e: FormEvent) => {
    e.preventDefault();
    if (!editableReport.trim()) {
      toast({
        title: "Report Empty",
        description: "Cannot submit an empty report to Jira.",
        variant: "destructive",
      });
      return;
    }

    if (!jiraConfig.url || !jiraConfig.email || !jiraConfig.apiToken || !jiraConfig.projectKey) {
      toast({
        title: "Jira Configuration Missing",
        description: "Please complete your Jira settings (URL, Email, API Token, Project Key) before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const summarizeInput: SummarizeReportForJiraInput = { report: editableReport };
      const summaryResult = await summarizeReportForJira(summarizeInput);
      
      let reportForJiraDescription = editableReport;
      if (editableReport.length > JIRA_DESCRIPTION_MAX_LENGTH) {
        reportForJiraDescription = editableReport.substring(0, JIRA_DESCRIPTION_MAX_LENGTH);
        toast({
          title: "Report Content Truncated",
          description: `The report content was truncated to ${JIRA_DESCRIPTION_MAX_LENGTH} characters for the Jira issue description. The AI-generated summary is used for the issue title.`,
          duration: 7000,
        });
      }

      const jiraIssueResult = await createJiraIssue({
        config: jiraConfig,
        summary: summaryResult.jiraDescription, // This is the AI-generated summary for the Jira issue title
        description: reportForJiraDescription, // This is the (potentially truncated) full report for the Jira issue description
      });

      if (jiraIssueResult.success && jiraIssueResult.data) {
        toast({
          title: "Report Submitted to Jira!",
          description: (
            <div className="flex flex-col gap-1">
              <p>Issue <span className="font-semibold">{jiraIssueResult.data.key}</span> created successfully.</p>
              <a 
                href={`${jiraConfig.url.replace(/\/$/, '')}/browse/${jiraIssueResult.data.key}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View Issue <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ),
          duration: 7000,
        });
        if (onReportSubmitted) onReportSubmitted();
      } else {
        toast({
          title: "Jira Submission Failed",
          description: jiraIssueResult.error || "An unknown error occurred while creating the Jira issue.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error submitting to Jira:", error);
      toast({
        title: "Error Submitting to Jira",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BookOpenText className="h-6 w-6 text-primary" />
          <CardTitle>Generated Report</CardTitle>
        </div>
        <CardDescription>Review and edit the AI-generated report. The full content below will be used as the Jira issue description (truncated if over {JIRA_DESCRIPTION_MAX_LENGTH} characters). An AI-generated summary will be used for the Jira issue title.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitToJira} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reportPreview">Report Content (for Jira Description)</Label>
            <Textarea
              id="reportPreview"
              value={editableReport}
              onChange={(e) => setEditableReport(e.target.value)}
              className="min-h-[250px] bg-background text-sm"
              rows={12}
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
             {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Submitting...' : 'Submit to Jira'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
