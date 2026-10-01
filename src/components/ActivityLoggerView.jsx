import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar, Tag, CheckCircle, Zap, Activity, Droplets, RefreshCw } from 'lucide-react';
import { getTodayKey } from '../utils/storage';

export default function ActivityLoggerView({ activityLogs = {}, onUpdateActivityLogs }) {
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [actionText, setActionText] = useState('');
  const [category, setCategory] = useState('Workout');
  const [actionTime, setActionTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [customWaterMl, setCustomWaterMl] = useState('');

  const dateData = activityLogs[selectedDate] || {};
  // Handle array format vs object format for date logs
  const dateLogs = Array.isArray(dateData) ? dateData : (dateData.logs || []);
  const waterIntakeMl = Array.isArray(dateData) ? (dateData.waterIntakeMl || 0) : (dateData.waterIntakeMl || 0);
  const waterTargetMl = 3500; // 3.5 Liters default target

  const updateDateActivityData = (newLogs, newWaterMl = waterIntakeMl) => {
    const updatedAll = {
      ...activityLogs,
      [selectedDate]: {
        logs: newLogs,
        waterIntakeMl: newWaterMl
      }
    };
    onUpdateActivityLogs(updatedAll);
  };

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
    updateDateActivityData(updatedDateLogs, waterIntakeMl);
    setActionText('');
    setActionTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleAddWater = (amountMl) => {
    const added = Number(amountMl) || 0;
    if (added <= 0) return;

    const newTotal = waterIntakeMl + added;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newAction = {
      id: 'act_water_' + Date.now(),
      time: timeNow,
      text: `💧 Drank ${added} ml water (Total today: ${(newTotal / 1000).toFixed(2)} L)`,
      category: 'Nutrition',
      createdAt: new Date().toISOString()
    };

    const updatedDateLogs = [newAction, ...dateLogs];
    updateDateActivityData(updatedDateLogs, newTotal);
  };

  const handleResetWater = () => {
    updateDateActivityData(dateLogs, 0);
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
    updateDateActivityData(updatedDateLogs, waterIntakeMl);
  };

  const handleDeleteAction = (id) => {
    const updatedDateLogs = dateLogs.filter(a => a.id !== id);
    updateDateActivityData(updatedDateLogs, waterIntakeMl);
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

  const waterPct = Math.min(100, Math.round((waterIntakeMl / waterTargetMl) * 100));

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={24} style={{ color: 'var(--accent-ice)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Everyday Action & Water Logger</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Record every action, workout, deep work block, and track your total daily water intake.
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

      {/* Prominent Daily Water Intake Tracker Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '24px', borderLeft: '4px solid var(--accent-ice)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--accent-ice-light)', color: 'var(--accent-ice)' }}>
              <Droplets size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Daily Hydration Consumption
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
                {waterIntakeMl.toLocaleString()} mL <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>/ {waterTargetMl.toLocaleString()} mL ({(waterIntakeMl / 1000).toFixed(2)} L / {(waterTargetMl / 1000).toFixed(1)} L)</span>
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="badge badge-ice" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {waterPct}% Target Met
            </span>
            {waterIntakeMl > 0 && (
              <button
                className="btn btn-ghost"
                style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}
                onClick={handleResetWater}
                title="Reset Water Counter"
              >
                <RefreshCw size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Water Progress Track */}
        <div className="progress-track" style={{ height: '10px', marginBottom: '20px' }}>
          <div
            className="progress-fill"
            style={{
              width: `${waterPct}%`,
              background: waterPct >= 100 ? 'var(--accent-emerald)' : 'var(--accent-ice)'
            }}
          />
        </div>

        {/* Quick Add Buttons */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            ⚡ One-Tap Water Intake Logger:
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={() => handleAddWater(250)} style={{ fontSize: '0.8rem' }}>
              🥤 +250 mL (Glass)
            </button>
            <button className="btn btn-secondary" onClick={() => handleAddWater(500)} style={{ fontSize: '0.8rem' }}>
              🍾 +500 mL (Bottle)
            </button>
            <button className="btn btn-secondary" onClick={() => handleAddWater(750)} style={{ fontSize: '0.8rem' }}>
              ⚡ +750 mL (Shaker)
            </button>
            <button className="btn btn-ice" onClick={() => handleAddWater(1000)} style={{ fontSize: '0.8rem' }}>
              💧 +1,000 mL (1 Liter)
            </button>

            {/* Custom Input */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: 'auto' }}>
              <input
                type="number"
                placeholder="Custom mL (e.g. 350)"
                value={customWaterMl}
                onChange={(e) => setCustomWaterMl(e.target.value)}
                style={{
                  width: '150px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  fontSize: '0.8rem'
                }}
              />
              <button
                className="btn btn-primary"
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                onClick={() => {
                  if (customWaterMl) {
                    handleAddWater(Number(customWaterMl));
                    setCustomWaterMl('');
                  }
                }}
              >
                + Add
              </button>
            </div>
          </div>
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

