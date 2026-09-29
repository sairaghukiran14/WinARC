import React, { useState } from 'react';
import { Trophy, Award, CheckCircle2, Lock, Flame, Shield, Star, Filter } from 'lucide-react';
import { WINTER_ARC_30_MILESTONES } from '../utils/milestones';

export default function Milestones30View({ milestoneProgress = {}, onUpdateMilestoneProgress }) {
  const [activeTier, setActiveTier] = useState('All');

  // Compute unlocked count
  const unlockedCount = Object.values(milestoneProgress).filter(m => m.completed).length;
  const totalCount = WINTER_ARC_30_MILESTONES.length;
  const completionPct = Math.round((unlockedCount / totalCount) * 100);

  const handleToggleMilestone = (id, target) => {
    const existing = milestoneProgress[id] || { current: 0, completed: false };
    const isNowCompleted = !existing.completed;
    
    const updated = {
      ...milestoneProgress,
      [id]: {
        current: isNowCompleted ? target : 0,
        completed: isNowCompleted,
        unlockedAt: isNowCompleted ? new Date().toISOString() : null
      }
    };
    onUpdateMilestoneProgress(updated);
  };

  const handleIncrementProgress = (id, target, delta) => {
    const existing = milestoneProgress[id] || { current: 0, completed: false };
    const newCurrent = Math.max(0, Math.min(target, (existing.current || 0) + delta));
    const isNowCompleted = newCurrent >= target;

    const updated = {
      ...milestoneProgress,
      [id]: {
        current: newCurrent,
        completed: isNowCompleted,
        unlockedAt: isNowCompleted ? (existing.unlockedAt || new Date().toISOString()) : null
      }
    };
    onUpdateMilestoneProgress(updated);
  };

  const filteredMilestones = WINTER_ARC_30_MILESTONES.filter(m => {
    if (activeTier === 'All') return true;
    return m.tier === activeTier;
  });

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Easy': return { bg: 'var(--accent-emerald-light)', text: 'var(--accent-emerald)', border: 'var(--accent-emerald)' };
      case 'Medium': return { bg: 'var(--accent-ice-light)', text: 'var(--accent-ice)', border: 'var(--accent-ice-border)' };
      case 'Hard': return { bg: 'var(--accent-fire-light)', text: 'var(--accent-fire)', border: '#7c2d12' };
      case 'Elite': return { bg: 'var(--accent-purple-light)', text: 'var(--accent-purple)', border: '#581c87' };
      default: return { bg: 'var(--bg-input)', text: 'var(--text-primary)', border: 'var(--border-subtle)' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Overview Banner */}
      <div className="card" style={{ marginBottom: '28px', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={24} style={{ color: 'var(--accent-fire)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Winter ARC 30 Milestones</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Structured progress roadmap from Easy foundation tasks up to Elite Transformation.
          </p>
        </div>

        {/* Progress Ring & Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Milestones Unlocked
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {unlockedCount} / {totalCount} ({completionPct}%)
            </div>
          </div>
          <div style={{ width: '120px' }}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionPct}%`, background: 'var(--accent-fire)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {['All', 'Easy', 'Medium', 'Hard', 'Elite'].map(tier => (
          <button
            key={tier}
            onClick={() => setActiveTier(tier)}
            className={activeTier === tier ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            {tier === 'All' ? 'All 30 Milestones' : `Tier: ${tier}`}
          </button>
        ))}
      </div>

      {/* 30 Milestones Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredMilestones.map((m) => {
          const prog = milestoneProgress[m.id] || { current: 0, completed: false };
          const isDone = prog.completed;
          const tierColors = getTierColor(m.tier);
          const ratio = Math.min(100, Math.round(((prog.current || 0) / m.target) * 100));

          return (
            <div
              key={m.id}
              className="card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                background: isDone ? 'var(--bg-card)' : 'var(--bg-app)',
                border: isDone ? `1px solid ${tierColors.text}` : '1px solid var(--border-subtle)',
                opacity: isDone ? 1 : 0.85,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{m.icon}</span>
                    <div>
                      <span className="badge" style={{ background: tierColors.bg, color: tierColors.text, border: `1px solid ${tierColors.border}`, fontSize: '0.65rem' }}>
                        {m.tier} • {m.category}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost"
                    style={{ padding: '4px', color: isDone ? 'var(--accent-emerald)' : 'var(--text-tertiary)' }}
                    onClick={() => handleToggleMilestone(m.id, m.target)}
                    title={isDone ? 'Mark as Incomplete' : 'Mark as Achieved'}
                  >
                    {isDone ? <CheckCircle2 size={22} /> : <Lock size={20} />}
                  </button>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '16px' }}>
                  {m.desc}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                  <span>Target Progress</span>
                  <span style={{ color: isDone ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                    {prog.current || 0} / {m.target}
                  </span>
                </div>
                <div className="progress-track" style={{ marginBottom: '12px' }}>
                  <div className="progress-fill" style={{ width: `${ratio}%`, background: isDone ? 'var(--accent-emerald)' : tierColors.text }} />
                </div>

                {/* Incrementor Quick Controls */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={() => handleIncrementProgress(m.id, m.target, -1)}
                  >
                    -1
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={() => handleIncrementProgress(m.id, m.target, 1)}
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
