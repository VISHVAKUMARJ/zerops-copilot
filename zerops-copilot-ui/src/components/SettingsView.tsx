import React from 'react';
import { Settings, Globe, Database, Cpu } from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div className="flex items-center gap-3 mb-2">
        <Settings size={28} color="var(--text-main)" />
        <h2 style={{ marginBottom: 0 }}>Settings</h2>
      </div>
      
      <div className="card">
        <h3 className="mb-4">System Configuration</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="flex items-center justify-between" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-muted" />
              <div>
                <div className="font-semibold">Current Environment</div>
                <div className="text-sm text-muted">The environment where Copilot is currently running</div>
              </div>
            </div>
            <span className="badge" style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>Development</span>
          </div>
          
          <div className="flex items-center justify-between" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <Database size={20} className="text-muted" />
              <div>
                <div className="font-semibold">Backend</div>
                <div className="text-sm text-muted">Primary application backend</div>
              </div>
            </div>
            <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>Spring Boot</span>
          </div>
          
          <div className="flex items-center justify-between" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <Cpu size={20} className="text-muted" />
              <div>
                <div className="font-semibold">AI Service</div>
                <div className="text-sm text-muted">Service handling Gemini integration</div>
              </div>
            </div>
            <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>Python / FastAPI</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-muted" />
              <div>
                <div className="font-semibold">API Base URL</div>
                <div className="text-sm text-muted">Endpoint for API requests (via Vite proxy)</div>
              </div>
            </div>
            <span style={{ fontSize: '14px', fontFamily: 'monospace', color: 'var(--accent-color)' }}>/api</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
