import React from 'react';
import { 
  LayoutDashboard, CalendarDays, User, Camera, Target, BarChart2, 
  Settings, Flame, Trophy, Activity, Snowflake, Plus, Shield, Utensils, BookOpen
} from 'lucide-react';

export default function SidebarNav({ activeTab, setActiveTab, profile, stats, onOpenMediaModal }) {
  const menuItems = [
    { id: 'dashboard', label: 'Today\'s Protocol', icon: LayoutDashboard },
    { id: 'journal', label: 'Mindset Journal', icon: BookOpen },
    { id: 'activity', label: 'Activity Logger', icon: Activity },
    { id: 'macros', label: 'Daily Macros', icon: Utensils },
    { id: 'milestones', label: '30 Milestones', icon: Trophy },
    { id: 'heatmap', label: 'Arc Matrix', icon: CalendarDays },
    { id: 'profile', label: 'Profile & Metrics', icon: User },
    { id: 'media', label: 'Media Vault', icon: Camera },
    { id: 'goals', label: 'Rules & Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: '240px',
        background: '#0d0d0d',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        flexShrink: 0,
        height: 'calc(100vh - 42px)',
        position: 'sticky',
        top: '42px',
        userSelect: 'none',
        zIndex: 900
      }}
    >
      {/* Top Sidebar Header & Nav Menu */}
      <div style={{ padding: '20px 16px 0 16px', overflowY: 'auto' }}>
        
        {/* Brand Header */}
        <div style={{ padding: '0 8px 20px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--accent-ice-light)', color: 'var(--accent-ice)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Snowflake size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                WINTER ARC
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                90-Day Protocol Logger
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation Group */}
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', padding: '0 8px 8px 8px', letterSpacing: '0.06em' }}>
          Navigation
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--accent-ice-light)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-ice-border)' : '1px solid transparent',
                  color: isActive ? 'var(--accent-ice)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent-ice)' : 'var(--text-tertiary)' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Button */}
        <div style={{ marginTop: '20px', padding: '0 4px' }}>
          <button
            className="btn btn-ice"
            style={{ width: '100%', padding: '10px', fontSize: '0.8rem' }}
            onClick={onOpenMediaModal}
          >
            <Camera size={16} />
            <span>Record Media Log</span>
          </button>
        </div>

      </div>

      {/* Bottom Sidebar Footer (User Athlete Profile Chip) */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-app)' }}>
        <div
          onClick={() => setActiveTab('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-fire-light)', color: 'var(--accent-fire)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', border: '1px solid #7c2d12' }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile.name}
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>
              🔥 {stats.streak} Day Streak
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
