import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DeploymentCard from './components/DeploymentCard';
import LogViewer from './components/LogViewer';
import CopilotAnalysis from './components/CopilotAnalysis';
import DashboardView from './components/DashboardView';
import DeploymentsView from './components/DeploymentsView';
import SettingsView from './components/SettingsView';
import { analyzeDeployment } from './services/api';
import { AiAnalysisResponse } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('Dashboard');

  const [analysis, setAnalysis] = useState<AiAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeDeployment({
        deploymentId: 'deployment-001',
        logs: 'INFO   Application starting...\nINFO   Initializing Spring Boot...\nINFO   Connecting to PostgreSQL database...\nWARN   Connection attempt 1 failed, retrying...\nWARN   Connection attempt 2 failed, retrying...\nERROR  Database connection refused.\nERROR  Database connection timeout after 30 seconds.\nERROR  Deployment failed.'
      });
      setAnalysis(response);
    } catch (err: any) {
      setError(err.message || 'Unable to reach Zerops Copilot backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Deployments':
        return <DeploymentsView onNavigateToAnalysis={() => setCurrentView('AI Analysis')} />;
      case 'Settings':
        return <SettingsView />;
      case 'AI Analysis':
      default:
        return (
          <>
            <DeploymentCard />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ marginBottom: 0 }}>🤖 Copilot Analysis</h2>
            </div>

            <CopilotAnalysis 
              analysis={analysis} 
              isLoading={isLoading} 
              onAnalyze={handleAnalyze} 
              error={error} 
            />

            <LogViewer />
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeView={currentView} onNavigate={setCurrentView} />
      <div className="main-content">
        <Header />
        <main className="content-wrapper">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
