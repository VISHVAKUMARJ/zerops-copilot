import React from 'react';
import { Bot, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { AiAnalysisResponse } from '../types';
import { SeverityBadge } from './SeverityBadge';
import FilesToCheck from './FilesToCheck';

interface CopilotAnalysisProps {
  analysis: AiAnalysisResponse | null;
  isLoading: boolean;
  onAnalyze: () => void;
  error: string | null;
}

const CopilotAnalysis: React.FC<CopilotAnalysisProps> = ({ analysis, isLoading, onAnalyze, error }) => {
  if (error) {
    return (
      <div className="card flex items-center justify-between" style={{ borderColor: 'var(--color-error)', backgroundColor: 'rgba(218, 54, 51, 0.05)' }}>
        <div className="flex items-center gap-3">
          <ShieldAlert size={24} color="var(--color-error)" />
          <span style={{ color: 'var(--color-error)' }}>{error}</span>
        </div>
        <button className="btn btn-secondary" onClick={onAnalyze}>Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        background: 'linear-gradient(180deg, var(--bg-panel) 0%, rgba(13,17,23,1) 100%)'
      }}>
        <div className="animate-spin mb-4" style={{
          background: 'linear-gradient(135deg, var(--accent-color), #8a2be2)',
          padding: '16px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(88, 166, 255, 0.4)'
        }}>
          <Cpu size={32} color="white" />
        </div>
        <h2 className="animate-pulse text-lg font-semibold mb-2">🤖 Copilot is analyzing...</h2>
        <div className="text-muted text-sm flex flex-col items-center gap-1">
          <span>Reading deployment logs...</span>
          <span>Analyzing failure...</span>
          <span>Generating recommendations...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        borderStyle: 'dashed'
      }}>
        <Bot size={48} className="text-muted mb-4" />
        <h2 className="mb-2">AI Copilot Ready</h2>
        <p className="text-muted mb-6 max-w-md">Let Zerops Copilot analyze the deployment logs to find the root cause and provide a suggested resolution.</p>
        <button className="btn btn-primary" onClick={onAnalyze} style={{ padding: '12px 24px', fontSize: '16px' }}>
          <Bot size={20} />
          Analyze with Copilot
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="grid-2">
        <div className="card flex items-center justify-between">
          <div>
            <h4 className="text-muted text-sm mb-1">Severity</h4>
            <SeverityBadge severity={analysis.severity} />
          </div>
          <ShieldAlert size={32} color="var(--color-error)" style={{ opacity: 0.2 }} />
        </div>
        <div className="card flex items-center justify-between">
          <div>
            <h4 className="text-muted text-sm mb-1">AI Confidence</h4>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{analysis.confidence}%</span>
              <div style={{
                width: '100px', height: '6px', backgroundColor: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden'
              }}>
                <div style={{
                  width: `${analysis.confidence}%`, height: '100%', backgroundColor: 'var(--color-success)'
                }} />
              </div>
            </div>
          </div>
          <Bot size={32} color="var(--color-success)" style={{ opacity: 0.2 }} />
        </div>
      </div>

      <div className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
        <h3 className="text-muted text-sm mb-2 uppercase tracking-wider">Root Cause</h3>
        <h2 style={{ fontSize: '20px', marginBottom: 0, color: 'var(--text-main)' }}>{analysis.rootCause}</h2>
      </div>

      <div className="card">
        <h3 className="mb-4 flex items-center gap-2">
          <Bot size={20} color="var(--accent-color)" />
          Suggested Resolution
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#c9d1d9' }}>
          {analysis.summary}
        </p>
      </div>

      <div className="card bg-panel-hover">
        <h3 className="mb-4 flex items-center gap-2">
          <CheckCircle size={20} color="var(--color-success)" />
          Recommended Fixes
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {analysis.recommendedFix.map((fix, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div style={{ marginTop: '2px', color: 'var(--accent-color)' }}>•</div>
              <span style={{ lineHeight: 1.5 }}>{fix}</span>
            </li>
          ))}
        </ul>
      </div>

      <FilesToCheck files={analysis.filesToCheck} />
    </div>
  );
};

export default CopilotAnalysis;
