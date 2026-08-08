import React from 'react';
import { Activity, Rocket, CheckCircle, XCircle, Bot } from 'lucide-react';
import DeploymentCard from './DeploymentCard';

const DashboardView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ marginBottom: 0 }}>Dashboard Overview</h2>
      
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="card flex items-center justify-between">
          <div>
            <h4 className="text-muted text-sm mb-1">Total Deployments</h4>
            <span className="text-lg font-semibold">1,248</span>
          </div>
          <Rocket size={32} color="var(--accent-color)" style={{ opacity: 0.2 }} />
        </div>
        
        <div className="card flex items-center justify-between">
          <div>
            <h4 className="text-muted text-sm mb-1">Successful</h4>
            <span className="text-lg font-semibold">1,203</span>
          </div>
          <CheckCircle size={32} color="var(--color-success)" style={{ opacity: 0.2 }} />
        </div>
        
        <div className="card flex items-center justify-between" style={{ borderColor: 'var(--color-error)' }}>
          <div>
            <h4 className="text-muted text-sm mb-1">Failed</h4>
            <span className="text-lg font-semibold" style={{ color: 'var(--color-error)' }}>45</span>
          </div>
          <XCircle size={32} color="var(--color-error)" style={{ opacity: 0.2 }} />
        </div>
        
        <div className="card flex items-center justify-between">
          <div>
            <h4 className="text-muted text-sm mb-1">AI Analyses</h4>
            <span className="text-lg font-semibold">12</span>
          </div>
          <Bot size={32} color="var(--accent-color)" style={{ opacity: 0.2 }} />
        </div>
      </div>
      
      <div className="grid-2 mt-4">
        <div>
          <h3 className="mb-4">Recent Deployments</h3>
          <DeploymentCard />
          {/* Mock a successful one just for visual variety */}
          <div className="card mt-4" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--color-success)' }} />
            <div className="flex justify-between items-center">
              <div>
                <h3 style={{ marginBottom: 0, fontSize: '16px' }}>deployment-002</h3>
                <span className="text-muted text-sm">main • def456abc</span>
              </div>
              <span className="badge badge-success">SUCCESS</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="mb-4">Recent AI Analysis</h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex justify-between items-center">
              <span className="font-semibold">deployment-001</span>
              <span className="badge badge-critical">CRITICAL</span>
            </div>
            <p className="text-sm text-muted mb-0">Database connection refused. The application could not establish a connection to PostgreSQL.</p>
            <div className="flex items-center gap-2 mt-2">
              <Bot size={16} color="var(--color-success)" />
              <span className="text-sm">95% Confidence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
