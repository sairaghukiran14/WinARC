import React, { useState } from 'react';
import { Calendar, CheckCircle2, Flame, Award, ChevronRight, X, Feather } from 'lucide-react';
import { getTodayKey } from '../utils/storage';

export default function HeatmapView({ habits, logs, onUpdateLogs }) {
  const [selectedDayKey, setSelectedDayKey] = useState(null);
  
  const currentYear = new Date().getFullYear();
  const todayKey = getTodayKey();

  // Generate 92 Days of Winter ARC (Oct 1 to Dec 31)
  const arcDays = [];
  const startDate = new Date(currentYear, 9, 1); // Oct 1
  for (let i = 0; i < 92; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    
    const dayLog = logs[key] || { completedHabits: [] };
    const totalHabits = habits.length;
    const completedCount = dayLog.completedHabits ? dayLog.completedHabits.length : 0;
    const ratio = totalHabits > 0 ? completedCount / totalHabits : 0;

    arcDays.push({
      dateObj: d,
      key,
      dayNum: i + 1,
      completedCount,
      totalHabits,
      ratio,
      journal: dayLog.journal
    });
  }

  // Calculate statistics
  const perfectDaysCount = arcDays.filter(d => d.ratio === 1).length;
  const activeDaysCount = arcDays.filter(d => d.completedCount > 0).length;

  const getIntensityColor = (ratio, isToday) => {
    if (ratio === 0) return { bg: 'var(--bg-app)', border: isToday ? '2px solid var(--accent-ice)' : '1px solid var(--border-subtle)', text: 'var(--text-tertiary)' };
    if (ratio < 0.5) return { bg: 'var(--accent-ice-light)', border: '1px solid var(--accent-ice-border)', text: 'var(--accent-ice)' };
    if (ratio < 1) return { bg: 'var(--accent-emerald-light)', border: '1px solid var(--accent-emerald)', text: 'var(--accent-emerald)' };
    return { bg: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)', text: '#ffffff' };
  };

  const selectedDayData = arcDays.find(d => d.key === selectedDayKey);

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Arc Duration
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            92 Days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Oct 1 - Dec 31</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Days Logged
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-ice)', marginTop: '4px' }}>
            {activeDaysCount} Days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Total active check-ins</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Perfect 100% Days
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
            {perfectDaysCount} Days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Full protocol completion</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Matrix Intensity
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Less</span>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--accent-ice-light)', border: '1px solid var(--accent-ice-border)' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--accent-emerald-light)', border: '1px solid var(--accent-emerald)' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--accent-emerald)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>100%</span>
          </div>
        </div>
      </div>

      {/* Main Heatmap Matrix Grid */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>92-Day Winter ARC Consistency Matrix</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click on any day cell to inspect or reflect on your progress.</p>
          </div>
          <div className="badge badge-purple" style={{ fontSize: '0.8rem' }}>
            Winter Season Matrix
          </div>
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: '10px' }}>
          {arcDays.map((day) => {
            const styleInfo = getIntensityColor(day.ratio, day.key === todayKey);
            const isToday = day.key === todayKey;

            return (
              <div
                key={day.key}
                onClick={() => setSelectedDayKey(day.key)}
                style={{
                  height: '70px',
                  borderRadius: 'var(--radius-md)',
                  background: styleInfo.bg,
                  border: styleInfo.border,
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  boxShadow: isToday ? '0 0 0 2px var(--accent-ice)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: styleInfo.text }}>
                    D{day.dayNum}
                  </span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.8, color: styleInfo.text }}>
                    {day.dateObj.getMonth() + 1}/{day.dateObj.getDate()}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: styleInfo.text, textAlign: 'center' }}>
                  {day.completedCount > 0 ? `${day.completedCount}/${day.totalHabits}` : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Inspector Drawer / Modal */}
      {selectedDayKey && selectedDayData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card animate-fade-in" style={{ width: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-ice">Day {selectedDayData.dayNum} of 92</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>
                  {selectedDayData.dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => setSelectedDayKey(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Habits Completed ({selectedDayData.completedCount} / {selectedDayData.totalHabits})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {habits.map(h => {
                  const dayLog = logs[selectedDayKey] || { completedHabits: [] };
                  const isDone = dayLog.completedHabits?.includes(h.id);
                  return (
                    <span
                      key={h.id}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: isDone ? 'var(--accent-emerald-light)' : 'var(--bg-app)',
                        color: isDone ? 'var(--accent-emerald)' : 'var(--text-tertiary)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {isDone ? '✓ ' : '✕ '} {h.title}
                    </span>
                  );
                })}
              </div>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <Feather size={14} /> Reflection Notes
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', italic: true }}>
                {selectedDayData.journal?.notes || 'No reflections recorded for this day yet.'}
              </p>
              {selectedDayData.journal?.win && (
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--accent-fire)', fontWeight: 600 }}>
                  🏆 Win: {selectedDayData.journal.win}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-primary" onClick={() => setSelectedDayKey(null)}>
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
