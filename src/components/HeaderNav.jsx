import React from 'react';
import { LayoutDashboard, CalendarDays, User, Camera, Target, BarChart2, Settings, Flame, CheckCircle2, Clock, Trophy, Activity } from 'lucide-react';

export default function HeaderNav({ activeTab, setActiveTab, stats, profileName }) {
  const tabs = [
    { id: 'dashboard', label: 'Today\'s Protocol', icon: LayoutDashboard },
    { id: 'activity', label: 'Activity Logger', icon: Activity },
    { id: 'milestones', label: '30 Milestones', icon: Trophy },
    { id: 'heatmap', label: 'Arc Matrix', icon: CalendarDays },
    { id: 'profile', label: 'Profile & Metrics', icon: User },
    { id: 'media', label: 'Media Vault', icon: Camera },
    { id: 'goals', label: 'Rules & Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ background: '#0d0d0d', borderBottom: '1px solid var(--border-subtle)', padding: '24px 32px 0 32px', transition: 'background-color 0.3s ease' }}>
      {/* Top Banner & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Winter ARC Dashboard
            </h1>
            <span className="badge badge-ice" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
              {profileName || 'Athlete'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            90 Days of Uncompromising Focus, Discipline & Transformation.
          </p>
        </div>

        {/* Quick Stats Pill Cards */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '10px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}>
            <div style={{ background: 'var(--accent-fire-light)', color: 'var(--accent-fire)', padding: '8px', borderRadius: '8px' }}>
              <Flame size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Streak</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.streak} Days</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '10px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}>
            <div style={{ background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', padding: '8px', borderRadius: '8px' }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Today</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.todayCompleted} / {stats.todayTotal}</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '10px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}>
            <div style={{ background: 'var(--accent-ice-light)', color: 'var(--accent-ice)', padding: '8px', borderRadius: '8px' }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Days Left</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.daysLeft} Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--accent-ice)' : '3px solid transparent',
                color: isActive ? 'var(--accent-ice)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
