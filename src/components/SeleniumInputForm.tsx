"use client";

import React, { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateReportFromSeleniumOutput } from '@/ai/flows/generate-report';
import type { GenerateReportFromSeleniumOutputInput } from '@/ai/flows/generate-report';
import { FileText, Wand2, Loader2 } from 'lucide-react';

interface SeleniumInputFormProps {
  onReportGenerated: (report: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SeleniumInputForm({ onReportGenerated, isLoading, setIsLoading }: SeleniumInputFormProps) {
  const [seleniumOutput, setSeleniumOutput] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!seleniumOutput.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste your Selenium QA test output.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const input: GenerateReportFromSeleniumOutputInput = { seleniumOutput };
      const result = await generateReportFromSeleniumOutput(input);
      onReportGenerated(result.report);
      toast({
        title: "Report Generated",
        description: "AI has generated a report based on your input.",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error Generating Report",
        description: "An error occurred while generating the report. Please try again.",
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
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle>Selenium QA Output</CardTitle>
        </div>
        <CardDescription>Paste your Selenium test output below to generate a report.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="seleniumOutput">Test Output</Label>
            <Textarea
              id="seleniumOutput"
              placeholder="Paste console logs, error messages, etc."
              value={seleniumOutput}
              onChange={(e) => setSeleniumOutput(e.target.value)}
              required
              className="min-h-[200px] bg-background text-sm"
              rows={10}
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
