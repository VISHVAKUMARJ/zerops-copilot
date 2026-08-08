import React from 'react';
import DeploymentCard from './DeploymentCard';

const DeploymentsView: React.FC<{ onNavigateToAnalysis: () => void }> = ({ onNavigateToAnalysis }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex items-center justify-between">
        <h2 style={{ marginBottom: 0 }}>Deployments</h2>
        <button className="btn btn-secondary">Filter</button>
      </div>
      
      <div style={{ cursor: 'pointer' }} onClick={onNavigateToAnalysis}>
        <DeploymentCard />
      </div>

      <div className="card" style={{ position: 'relative', overflow: 'hidden', opacity: 0.8 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--color-success)' }} />
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 style={{ marginBottom: 0, fontSize: '18px' }}>deployment-002</h3>
            <span className="text-muted text-sm">Production Environment</span>
          </div>
          <span className="badge badge-success">SUCCESS</span>
        </div>
        <div className="flex text-muted text-sm gap-4">
          <span>Branch: <strong style={{ color: 'var(--text-main)' }}>main</strong></span>
          <span>Commit: <strong style={{ color: 'var(--text-main)' }}>def456abc</strong></span>
        </div>
      </div>
    </div>
  );
};

export default DeploymentsView;
