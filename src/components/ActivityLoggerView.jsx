import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar, Tag, CheckCircle, Zap, Activity } from 'lucide-react';
import { getTodayKey } from '../utils/storage';

export default function ActivityLoggerView({ activityLogs = {}, onUpdateActivityLogs }) {
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [actionText, setActionText] = useState('');
  const [category, setCategory] = useState('Workout');
  const [actionTime, setActionTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  const dateLogs = activityLogs[selectedDate] || [];

  const handleAddAction = (e) => {
    e.preventDefault();
    if (!actionText.trim()) return;

    const newAction = {
      id: 'act_' + Date.now(),
      time: actionTime,
      text: actionText.trim(),
      category,
      createdAt: new Date().toISOString()
    };

    const updatedDateLogs = [newAction, ...dateLogs];
    const updatedAll = {
      ...activityLogs,
      [selectedDate]: updatedDateLogs
    };

    onUpdateActivityLogs(updatedAll);
    setActionText('');
    setActionTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleQuickPreset = (presetText, presetCategory) => {
    const newAction = {
      id: 'act_' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: presetText,
      category: presetCategory,
      createdAt: new Date().toISOString()
    };

    const updatedDateLogs = [newAction, ...dateLogs];
    const updatedAll = {
      ...activityLogs,
      [selectedDate]: updatedDateLogs
    };

    onUpdateActivityLogs(updatedAll);
  };

  const handleDeleteAction = (id) => {
    const updatedDateLogs = dateLogs.filter(a => a.id !== id);
    const updatedAll = {
      ...activityLogs,
      [selectedDate]: updatedDateLogs
    };
    onUpdateActivityLogs(updatedAll);
  };

  const PRESETS = [
    { text: 'Woke up on first alarm & drank 500ml water', category: 'Mindset' },
    { text: 'Completed 45m workout session', category: 'Workout' },
    { text: 'Cold shower taken', category: 'Discipline' },
    { text: 'Read 10 pages of non-fiction book', category: 'Mindset' },
    { text: 'Completed 2-hour deep work focus session', category: 'Focus' },
    { text: 'Clean meal logged (zero junk)', category: 'Nutrition' },
    { text: '10 min daily journal & reflection written', category: 'Mindset' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={24} style={{ color: 'var(--accent-ice)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Everyday Action & Activity Logger</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Record every action, workout, deep work block, and meal throughout your day in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={18} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', fontWeight: 700 }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
        
        {/* Left Column: Record Form & Quick Presets (5 Cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Action Input Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>Record New Action</h3>

            <form onSubmit={handleAddAction}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Time</label>
                  <input
                    type="text"
                    required
                    value={actionTime}
                    onChange={(e) => setActionTime(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  >
                    <option value="Workout">Workout / Gym</option>
                    <option value="Focus">Deep Work / Code</option>
                    <option value="Mindset">Reading / Journal</option>
                    <option value="Nutrition">Nutrition / Water</option>
                    <option value="Discipline">Discipline / Habit</option>
                    <option value="Rest">Rest / Sleep</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Action Details</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Completed 30m HIIT Session + 100 Pushups"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  style={{ width: '100%', marginTop: '4px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                />
              </div>

              <button type="submit" className="btn btn-ice" style={{ width: '100%' }}>
                <Plus size={16} /> Log Action Now
              </button>
            </form>
          </div>

          {/* Quick Presets */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>One-Tap Action Presets</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPreset(p.text, p.category)}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start', fontSize: '0.8rem', textAlign: 'left', padding: '8px 12px' }}
                >
                  <Zap size={14} style={{ color: 'var(--accent-fire)', flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{p.text}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Chronological Action Stream (7 Cols) */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Timeline Stream for {selectedDate}</h3>
              <span className="badge badge-purple">{dateLogs.length} Actions Logged</span>
            </div>

            {dateLogs.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <Clock size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No actions logged for this date yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Use the form on the left or tap a preset to record your day!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                {/* Timeline line */}
                <div style={{ position: 'absolute', top: '16px', bottom: '16px', left: '19px', width: '2px', background: 'var(--border-strong)', zIndex: 1 }} />

                {dateLogs.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      position: 'relative',
                      zIndex: 2,
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-ice)', marginTop: '6px', flexShrink: 0 }} />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-ice)', fontFamily: 'var(--font-mono)' }}>
                          {item.time}
                        </span>
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                          {item.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {item.text}
                      </div>
                    </div>

                    <button
                      className="btn btn-ghost"
                      style={{ padding: '4px 6px', color: 'var(--text-tertiary)' }}
                      onClick={() => handleDeleteAction(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
