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
import { Send, Loader2, BookOpenText } from 'lucide-react';

interface ReportPreviewProps {
  report: string;
  jiraConfig: JiraConfig;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onReportSubmitted?: () => void;
}

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

    if (!jiraConfig.url || !jiraConfig.apiToken || !jiraConfig.projectKey) {
      toast({
        title: "Jira Configuration Missing",
        description: "Please configure your Jira settings before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const input: SummarizeReportForJiraInput = { report: editableReport };
      const result = await summarizeReportForJira(input);
      
      // Simulate Jira submission
      console.log("Jira Submission Details:", {
        config: jiraConfig,
        summary: result.jiraDescription,
      });

      toast({
        title: "Report Submitted to Jira (Simulated)",
        description: `Issue for project ${jiraConfig.projectKey} would be created with the summary.`,
        duration: 5000,
      });
      if (onReportSubmitted) onReportSubmitted();

    } catch (error) {
      console.error("Error submitting to Jira:", error);
      toast({
        title: "Error Submitting to Jira",
        description: "An error occurred while preparing the report for Jira. Please try again.",
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
        <CardDescription>Review and edit the AI-generated report before submitting to Jira.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitToJira} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reportPreview">Report Content</Label>
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
