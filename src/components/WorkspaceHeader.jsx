import React from 'react';
import { Flame, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { getTodayKey } from '../utils/storage';

export default function WorkspaceHeader({ activeTab, stats }) {
  const titles = {
    dashboard: { title: 'Today\'s Protocol Dashboard', subtitle: '90 Days of Uncompromising Focus, Discipline & Transformation.' },
    activity: { title: 'Everyday Action & Activity Logger', subtitle: 'Real-time timestamped log of workouts, focus blocks, and daily activities.' },
    macros: { title: 'Daily Nutrition & Macros Tracker', subtitle: 'Track calories, protein, carbs, and fats for your Winter ARC nutrition protocol.' },
    milestones: { title: 'Winter ARC 30 Milestones', subtitle: 'Structured transformation roadmap from Easy foundation tasks to Elite champion.' },
    heatmap: { title: '92-Day Consistency Heatmap Grid', subtitle: 'Visual matrix tracking every single day of your Winter ARC.' },
    profile: { title: 'Athlete Profile & Body Metrics', subtitle: 'Track baseline parameters, height, weight trends, and physical transformation.' },
    media: { title: 'Everyday Media Vault', subtitle: 'Personal gallery of transformation photos, video logs, and voice notes.' },
    goals: { title: 'Rules, Manifesto & Goals', subtitle: 'Define your non-negotiables, seasonal targets, and discipline rules.' },
    analytics: { title: 'Velocity & Category Analytics', subtitle: 'Weekly habit velocity charts and category balance indicators.' },
    settings: { title: 'App Settings & 6 Color Themes', subtitle: 'Customize protocol habits, switch matte dark color themes, export/import backups.' },
  };

  const currentInfo = titles[activeTab] || { title: 'Winter ARC', subtitle: 'Daily Progress Logger' };

  return (
    <div style={{ background: '#0d0d0d', borderBottom: '1px solid var(--border-subtle)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {currentInfo.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Top Quick Stats Ribbon */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--accent-fire-light)', color: 'var(--accent-fire)', padding: '6px', borderRadius: '6px' }}>
            <Flame size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Streak</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.streak} Days</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', padding: '6px', borderRadius: '6px' }}>
            <CheckCircle2 size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Today</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.todayCompleted} / {stats.todayTotal}</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--accent-ice-light)', color: 'var(--accent-ice)', padding: '6px', borderRadius: '6px' }}>
            <Clock size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Days Left</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.daysLeft} Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
