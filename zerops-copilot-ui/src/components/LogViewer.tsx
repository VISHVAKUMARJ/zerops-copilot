import React from 'react';
import { Terminal } from 'lucide-react';

const mockLogs = `INFO   Application starting...
INFO   Initializing Spring Boot...
INFO   Connecting to PostgreSQL database...
WARN   Connection attempt 1 failed, retrying...
WARN   Connection attempt 2 failed, retrying...
ERROR  Database connection refused.
ERROR  Database connection timeout after 30 seconds.
ERROR  Deployment failed.`;

const LogViewer: React.FC = () => {
  const getLogColor = (line: string) => {
    if (line.includes('ERROR')) return 'var(--color-error)';
    if (line.includes('WARN')) return 'var(--color-warning)';
    if (line.includes('INFO')) return 'var(--accent-color)';
    return 'var(--text-muted)';
  };

  return (
    <div className="card" style={{ marginTop: '24px', backgroundColor: '#0d1117' }}>
      <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <Terminal size={20} className="text-muted" />
        <h3 style={{ marginBottom: 0 }}>Deployment Logs</h3>
      </div>
      
      <div style={{
        fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: 1.6,
        overflowX: 'auto',
        whiteSpace: 'pre-wrap'
      }}>
        {mockLogs.split('\n').map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#484f58', userSelect: 'none', minWidth: '24px', textAlign: 'right' }}>
              {i + 1}
            </span>
            <span style={{ color: getLogColor(line) }}>
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
