// src/components/JiraConfigForm.tsx
"use client";

import React, { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage';
import { Settings2, Save, Mail } from 'lucide-react';

const JIRA_CONFIG_KEY = 'jiraPilotConfig';

export interface JiraConfig {
  url: string;
  email: string; 
  apiToken: string;
  projectKey: string;
}

interface JiraConfigFormProps {
  onConfigChange: (config: JiraConfig) => void;
  initialConfig: JiraConfig;
}

export function JiraConfigForm({ onConfigChange, initialConfig }: JiraConfigFormProps) {
  const [jiraUrl, setJiraUrl] = useState(initialConfig.url || '');
  const [jiraEmail, setJiraEmail] = useState(initialConfig.email || ''); 
  const [apiToken, setApiToken] = useState(initialConfig.apiToken || '');
  const [projectKey, setProjectKey] = useState(initialConfig.projectKey || '');
  const { toast } = useToast();

  useEffect(() => {
    // Ensure values are always strings for controlled inputs
    setJiraUrl(initialConfig.url || '');
    setJiraEmail(initialConfig.email || ''); 
    setApiToken(initialConfig.apiToken || '');
    setProjectKey(initialConfig.projectKey || '');
  }, [initialConfig]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newConfig = { url: jiraUrl, email: jiraEmail, apiToken, projectKey };
    setLocalStorageItem(JIRA_CONFIG_KEY, newConfig);
    onConfigChange(newConfig);
    toast({
      title: "Jira Configuration Saved",
      description: "Your Jira connection settings have been updated.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Settings2 className="h-6 w-6 text-primary" />
          <CardTitle>Jira Configuration</CardTitle>
        </div>
        <CardDescription>Set up your Jira connection details to push reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jiraUrl">Jira URL</Label>
            <Input
              id="jiraUrl"
              type="url"
              placeholder="https://your-domain.atlassian.net"
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jiraEmail">Jira Email</Label> 
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="jiraEmail"
                type="email"
                placeholder="your-email@example.com"
                value={jiraEmail}
                onChange={(e) => setJiraEmail(e.target.value)}
                required
                className="bg-background pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiToken">API Token</Label>
            <Input
              id="apiToken"
              type="password"
              placeholder="Enter your Jira API Token"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectKey">Project Key</Label>
            <Input
              id="projectKey"
              type="text"
              placeholder="e.g., PROJ"
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
              required
              className="bg-background"
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
