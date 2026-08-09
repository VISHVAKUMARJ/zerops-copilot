import React from 'react';
import { Terminal } from 'lucide-react';

interface DeploymentLog {
  id: string;
  stageId: string;
  message: string;
  level: string;
  timestamp: string;
}

interface LogViewerProps {
  logs: DeploymentLog[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const getLogColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'ERROR':
        return 'var(--color-error)';

      case 'WARN':
      case 'WARNING':
        return 'var(--color-warning)';

      case 'INFO':
        return 'var(--accent-color)';

      case 'DEBUG':
        return 'var(--text-muted)';

      default:
        return 'var(--text-main)';
    }
  };

  return (
    <div
      className="card"
      style={{
        marginTop: '24px',
        backgroundColor: '#0d1117',
      }}
    >
      <div
        className="flex items-center gap-2 mb-4 pb-4"
        style={{
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Terminal
          size={18}
          color="var(--accent-color)"
        />

        <h3 style={{ marginBottom: 0 }}>
          Deployment Logs
        </h3>
      </div>

      {logs.length === 0 ? (
        <div
          style={{
            color: 'var(--text-muted)',
            padding: '20px 0',
            textAlign: 'center',
          }}
        >
          No deployment logs loaded.
        </div>
      ) : (
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: 1.6,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {logs.map((log, index) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '2px',
              }}
            >
              <span
                style={{
                  color: '#484f58',
                  userSelect: 'none',
                  minWidth: '24px',
                  textAlign: 'right',
                }}
              >
                {index + 1}
              </span>

              <span
                style={{
                  color: getLogColor(log.level),
                }}
              >
                {log.level?.toUpperCase()}{'  '}
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogViewer;