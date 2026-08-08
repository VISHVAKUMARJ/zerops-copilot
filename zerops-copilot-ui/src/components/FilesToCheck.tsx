import React from 'react';
import { FileCode, ChevronRight } from 'lucide-react';

const FilesToCheck: React.FC<{ files: string[] }> = ({ files }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3 className="flex items-center gap-2 mb-4">
        <FileCode size={20} color="var(--accent-color)" />
        Likely files to check
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {files.map((file, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-panel-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-app)'}
          >
            <ChevronRight size={16} className="text-muted" />
            <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--accent-color)' }}>
              {file}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesToCheck;
