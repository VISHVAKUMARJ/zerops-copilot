import React, { useState } from 'react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LogViewer from './components/LogViewer';
import CopilotAnalysis from './components/CopilotAnalysis';

import DashboardView from './components/DashboardView';
import DeploymentsView from './components/DeploymentsView';
import SettingsView from './components/SettingsView';

import { analyzeDeployment } from './services/api';
import { AiAnalysisResponse } from './types';

interface DeploymentStage {
  id: string;
  deploymentId: string;
  name: string;
  status: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Deployment {
  id: string;
  projectId?: string;
  commitHash?: string;
  branchName?: string;
  status?: string;
  stages?: DeploymentStage[];
  createdAt?: string;
  updatedAt?: string;
}

interface DeploymentLog {
  id: string;
  stageId: string;
  message: string;
  level: string;
  timestamp: string;
}

const App: React.FC = () => {
  /*
   * Current page
   */
  const [currentView, setCurrentView] =
    useState<string>('Dashboard');

  /*
   * Currently selected deployment
   */
  const [selectedDeploymentId, setSelectedDeploymentId] =
    useState<string>(
      '72477302-6a79-45c5-ba27-7e1c3781e671'
    );

  /*
   * Real deployment logs
   */
  const [deploymentLogs, setDeploymentLogs] =
    useState<DeploymentLog[]>([]);

  /*
   * AI analysis result
   */
  const [analysis, setAnalysis] =
    useState<AiAnalysisResponse | null>(null);

  /*
   * Loading state
   */
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  /*
   * Error message
   */
  const [error, setError] =
    useState<string | null>(null);

  /*
   * Called when user selects a deployment
   */
  const handleDeploymentSelect = (
    deploymentId: string
  ) => {
    console.log(
      'Selected deployment:',
      deploymentId
    );

    setSelectedDeploymentId(deploymentId);

    /*
     * Clear previous analysis
     * because we selected another deployment.
     */
    setAnalysis(null);

    /*
     * Clear previous logs.
     */
    setDeploymentLogs([]);

    /*
     * Clear previous error.
     */
    setError(null);

    /*
     * Navigate to AI Analysis.
     */
    setCurrentView('AI Analysis');
  };

  /*
   * Fetch selected deployment
   */
  const fetchDeployment = async (): Promise<Deployment> => {
    if (!selectedDeploymentId) {
      throw new Error(
        'No deployment has been selected.'
      );
    }

    const url =
      `/api/v1/deployments/${selectedDeploymentId}`;

    console.log(
      'Fetching deployment:',
      url
    );

    const response = await fetch(url);

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Failed to fetch deployment (${response.status}): ${
          errorText || 'Unknown backend error'
        }`
      );
    }

    const deployment: Deployment =
      await response.json();

    console.log(
      'Real deployment response:',
      deployment
    );

    return deployment;
  };

  /*
   * Fetch deployment logs using stage ID
   */
  const fetchDeploymentLogs = async (
    stageId: string
  ): Promise<DeploymentLog[]> => {
    const url =
      `/api/v1/deployment-logs/stage/${stageId}`;

    console.log(
      'Fetching deployment logs:',
      url
    );

    const response = await fetch(url);

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Failed to fetch deployment logs (${response.status}): ${
          errorText || 'Unknown backend error'
        }`
      );
    }

    const logs: DeploymentLog[] =
      await response.json();

    console.log(
      'Real deployment logs:',
      logs
    );

    return logs;
  };

  /*
   * Convert deployment logs into text
   * for the AI analysis API.
   */
  const convertLogsToText = (
    logs: DeploymentLog[]
  ): string => {
    return logs
      .map((log) => {
        const level =
          log.level?.toUpperCase() || 'INFO';

        return `${level}  ${log.message}`;
      })
      .join('\n');
  };

  /*
   * Analyze currently selected deployment
   */
  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);

    try {
      /*
       * 1. Get selected deployment
       */
      const deployment =
        await fetchDeployment();

      /*
       * 2. Find appropriate stage
       */
      let stage =
        deployment.stages?.[0];

      /*
       * Prefer FAILED stage if one exists.
       */
      const failedStage =
        deployment.stages?.find(
          (item) =>
            item.status?.toUpperCase() ===
            'FAILED'
        );

      if (failedStage) {
        stage = failedStage;
      }

      if (!stage) {
        throw new Error(
          'No deployment stage was found for this deployment.'
        );
      }

      console.log(
        'Selected deployment stage:',
        stage
      );

      /*
       * 3. Fetch REAL deployment logs
       */
      const logs =
        await fetchDeploymentLogs(
          stage.id
        );

      if (
        !logs ||
        logs.length === 0
      ) {
        throw new Error(
          'No deployment logs were found for this stage.'
        );
      }

      /*
       * 4. Store REAL logs
       *
       * These logs are displayed
       * inside LogViewer.
       */
      setDeploymentLogs(logs);

      /*
       * 5. Convert logs into text
       * for AI analysis.
       */
      const logsText =
        convertLogsToText(logs);

      console.log(
        'Logs sent to AI:',
        logsText
      );

      /*
       * 6. Send REAL deployment ID
       * and REAL logs to backend.
       */
      const response =
        await analyzeDeployment({
          deploymentId:
            deployment.id,
          logs: logsText,
        });

      console.log(
        'Copilot analysis response:',
        response
      );

      /*
       * 7. Display AI result
       */
      setAnalysis(response);

    } catch (err: unknown) {
      console.error(
        'Analysis failed:',
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Unable to analyze the deployment.'
        );
      }

    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Render current page
   */
  const renderView = () => {
    switch (currentView) {

      /*
       * DASHBOARD
       */
      case 'Dashboard':
        return (
          <DashboardView
            onNavigateToDeployments={() =>
              setCurrentView('Deployments')
            }
            onNavigateToAnalysis={
              handleDeploymentSelect
            }
          />
        );

      /*
       * DEPLOYMENTS
       */
      case 'Deployments':
        return (
          <DeploymentsView
            onNavigateToAnalysis={
              handleDeploymentSelect
            }
          />
        );

      /*
       * SETTINGS
       */
      case 'Settings':
        return (
          <SettingsView />
        );

      /*
       * AI ANALYSIS
       */
      case 'AI Analysis':
      default:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '0',
              }}
            >
              <h2
                style={{
                  marginBottom: '4px',
                }}
              >
                🤖 Copilot Analysis
              </h2>

              <span className="text-muted text-sm">
                Deployment:{' '}
                {selectedDeploymentId}
              </span>
            </div>

            <CopilotAnalysis
              analysis={analysis}
              isLoading={isLoading}
              onAnalyze={handleAnalyze}
              error={error}
            />

            {/*
             * Display REAL deployment logs
             */}
            <LogViewer
              logs={deploymentLogs}
            />

          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >

      <Sidebar
        activeView={currentView}
        onNavigate={setCurrentView}
      />

      <div className="main-content">

        <Header />

        <main className="content">
          {renderView()}
        </main>

      </div>

    </div>
  );
};

export default App;