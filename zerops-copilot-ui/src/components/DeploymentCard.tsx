import React from 'react';
import { GitBranch, GitCommit, Clock, XCircle } from 'lucide-react';

const DeploymentCard: React.FC = () => {
  return (
    <div className="card mb-6" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '4px', height: '100%',
        backgroundColor: 'var(--color-error)'
      }} />
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div style={{
            backgroundColor: 'rgba(218, 54, 51, 0.1)',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <XCircle size={24} color="var(--color-error)" />
          </div>
          <div>
            <h3 style={{ marginBottom: 0, fontSize: '18px' }}>deployment-001</h3>
            <span className="text-muted text-sm">Production Environment</span>
          </div>
        </div>
        
        <span className="badge badge-error">
          FAILED
        </span>
      </div>

      <div className="flex" style={{ gap: '32px' }}>
        <div className="flex items-center gap-2 text-muted text-sm">
          <GitBranch size={16} />
          <span>Branch: <strong style={{ color: 'var(--text-main)' }}>main</strong></span>
        </div>
        <div className="flex items-center gap-2 text-muted text-sm">
          <GitCommit size={16} />
          <span>Commit: <strong style={{ color: 'var(--text-main)' }}>abc123def456</strong></span>
        </div>
        <div className="flex items-center gap-2 text-muted text-sm">
          <Clock size={16} />
          <span>Time: <strong style={{ color: 'var(--text-main)' }}>Just now</strong></span>
        </div>
      </div>
    </div>
  );
};

export default DeploymentCard;
