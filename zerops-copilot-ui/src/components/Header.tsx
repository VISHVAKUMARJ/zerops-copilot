import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header style={{
      padding: '24px 32px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Deployment Intelligence</h2>
        <p className="text-muted text-sm">Monitor deployments and get AI-powered troubleshooting recommendations.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 16px',
          width: '250px'
        }}>
          <Search size={16} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search deployments..." 
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              outline: 'none',
              width: '100%',
              fontSize: '14px'
            }}
          />
        </div>
        
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <Bell size={20} />
        </button>
        
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-panel-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-color)'
        }}>
          <User size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;
