import React from 'react';
import { LayoutDashboard, Rocket, Activity, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-color), #8a2be2)',
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '1px', marginBottom: 0 }}>ZEROPS</h1>
          <div style={{ fontSize: '14px', color: 'var(--accent-color)', fontWeight: 600, letterSpacing: '2px' }}>COPILOT</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'Dashboard'} onClick={() => onNavigate('Dashboard')} />
        <NavItem icon={<Rocket size={20} />} label="Deployments" active={activeView === 'Deployments'} onClick={() => onNavigate('Deployments')} />
        <NavItem icon={<Activity size={20} />} label="AI Analysis" active={activeView === 'AI Analysis'} onClick={() => onNavigate('AI Analysis')} />
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <NavItem icon={<Settings size={20} />} label="Settings" active={activeView === 'Settings'} onClick={() => onNavigate('Settings')} />
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => {
  return (
    <div onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      backgroundColor: active ? 'var(--bg-panel-hover)' : 'transparent',
      color: active ? 'var(--text-main)' : 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: active ? 600 : 400,
      border: active ? '1px solid var(--border-color)' : '1px solid transparent'
    }}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
