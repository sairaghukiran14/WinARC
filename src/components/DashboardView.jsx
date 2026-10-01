import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, Plus, Sun, Dumbbell, BookOpen, Droplets, 
  Code, Apple, Feather, Sparkles, ChevronLeft, ChevronRight, 
  Calendar, Flame, AlertCircle, Save, MessageSquare, Camera, Video, Mic
} from 'lucide-react';
import { getTodayKey } from '../utils/storage';
import MediaCaptureModal from './MediaCaptureModal';
import { getMediaForDate } from '../utils/mediaStore';
import QuotePosterCard from './QuotePosterCard';

const ICON_MAP = {
  Sun,
  Dumbbell,
  BookOpen,
  Droplets,
  Code,
  Apple,
  Feather,
  Sparkles
};

export default function DashboardView({ habits, rules, logs, onUpdateLogs, onAddHabit }) {
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [dayMediaItems, setDayMediaItems] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Fitness');
  const [saveToast, setSaveToast] = useState(false);

  const todayKey = getTodayKey();
  const currentLog = logs[selectedDate] || { completedHabits: [], rulesCompleted: [], journal: { mood: 'Solid', workout: '', win: '', notes: '' } };

  const loadDayMedia = async () => {
    try {
      const items = await getMediaForDate(selectedDate);
      setDayMediaItems(items);
    } catch (err) {
      console.error('Error loading media for date:', err);
    }
  };

  useEffect(() => {
    loadDayMedia();
  }, [selectedDate]);

  const totalHabitsCount = habits.length;
  const completedHabitsCount = currentLog.completedHabits ? currentLog.completedHabits.length : 0;
  const percentage = totalHabitsCount > 0 ? Math.round((completedHabitsCount / totalHabitsCount) * 100) : 0;

  const toggleHabit = (habitId) => {
    const existing = currentLog.completedHabits || [];
    let updated;
    const isNowCompleted = !existing.includes(habitId);

    if (isNowCompleted) {
      updated = [...existing, habitId];
      if (updated.length === totalHabitsCount && totalHabitsCount > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      updated = existing.filter(id => id !== habitId);
    }

    const newLogs = {
      ...logs,
      [selectedDate]: {
        ...currentLog,
        completedHabits: updated
      }
    };
    onUpdateLogs(newLogs);
  };

  const toggleRule = (ruleId) => {
    const existing = currentLog.rulesCompleted || [];
    const updated = existing.includes(ruleId)
      ? existing.filter(id => id !== ruleId)
      : [...existing, ruleId];

    const newLogs = {
      ...logs,
      [selectedDate]: {
        ...currentLog,
        rulesCompleted: updated
      }
    };
    onUpdateLogs(newLogs);
  };

  const handleJournalChange = (field, value) => {
    const newLogs = {
      ...logs,
      [selectedDate]: {
        ...currentLog,
        journal: {
          ...currentLog.journal,
          [field]: value
        }
      }
    };
    onUpdateLogs(newLogs);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1200);
  };

  const handleAddHabitSubmit = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    onAddHabit({
      id: 'h_' + Date.now(),
      title: newHabitTitle.trim(),
      category: newHabitCategory,
      icon: 'Sparkles',
      targetPerWeek: 7
    });
    setNewHabitTitle('');
    setShowAddModal(false);
  };

  const changeDateByDays = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${day}`);
  };

  const formattedDateStr = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Date Switcher Bar */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => changeDateByDays(-1)}>
            <ChevronLeft size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--accent-ice)' }} />
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {formattedDateStr}
            </span>
            {selectedDate === todayKey && (
              <span className="badge badge-ice">Today</span>
            )}
          </div>
          <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => changeDateByDays(1)}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setShowMediaModal(true)}>
            <Camera size={16} />
            <span>Record Photo / Video / Audio</span>
          </button>
          <button className="btn btn-ice" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Add Protocol Habit</span>
          </button>
        </div>
      </div>

      {/* Harsh Reality Quote Image Poster Card (Quote Centered in the Middle) */}
      <div style={{ marginBottom: '28px' }}>
        <QuotePosterCard />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
        
        {/* Left Column: Habits Checklist (7 Cols) */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Daily Non-Negotiable Protocol</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Check off every habit to complete today's Winter ARC step.</p>
              </div>
              <div className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                {completedHabitsCount} / {totalHabitsCount} Completed
              </div>
            </div>

            {/* Habit Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {habits.map((habit) => {
                const IconComponent = ICON_MAP[habit.icon] || Sparkles;
                const isChecked = currentLog.completedHabits?.includes(habit.id);

                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-app)',
                      border: isChecked ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: isChecked ? 'none' : '2px solid var(--border-strong)',
                          background: isChecked ? '#10b981' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          boxShadow: isChecked ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isChecked && <Check size={16} strokeWidth={3} style={{ color: '#ffffff' }} />}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ color: isChecked ? '#10b981' : 'var(--text-secondary)' }}>
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? '#10b981' : 'var(--text-primary)' }}>
                            {habit.title}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: isChecked ? 'var(--accent-emerald)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                            {habit.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                        {habit.targetPerWeek}x / wk
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Progress Ring & Daily Journal (5 Cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Progress Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="var(--bg-input)" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="var(--accent-ice)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * percentage) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.4s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{percentage}%</span>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {percentage === 100 ? '🔥 ARC Standard Achieved!' : percentage > 50 ? '⚡ Keep Pushing Strong' : '❄️ Winter Arc Standard'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {completedHabitsCount} of {totalHabitsCount} goals locked in for today.
              </p>
              <div style={{ marginTop: '10px' }}>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percentage}%`, background: percentage === 100 ? 'var(--accent-emerald)' : 'var(--accent-ice)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Media Clips attached to this day */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} style={{ color: 'var(--accent-ice)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Media Check-ins ({dayMediaItems.length})</h3>
              </div>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setShowMediaModal(true)}>
                + Record
              </button>
            </div>

            {dayMediaItems.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', italic: true }}>
                No photo, video, or audio log recorded for this date yet.
              </p>
            ) : (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {dayMediaItems.map(item => (
                  <div key={item.id} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', background: '#000', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    {item.type === 'photo' ? (
                      <img src={item.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : item.type === 'video' ? (
                      <video src={item.dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Mic size={24} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Rules Non-Negotiables */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <AlertCircle size={18} style={{ color: 'var(--accent-fire)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Non-Negotiable Rules</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rules.map((rule) => {
                const isDone = currentLog.rulesCompleted?.includes(rule.id);
                return (
                  <label
                    key={rule.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: isDone ? 'var(--accent-fire-light)' : 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: isDone ? 'var(--accent-fire)' : 'var(--text-primary)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!isDone}
                      onChange={() => toggleRule(rule.id)}
                      style={{ accentColor: '#10b981', cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span>{rule.text}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Daily Log & Reflection Journal */}
          <div className="card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} style={{ color: 'var(--accent-purple)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Daily Reflection</h3>
              </div>
              {saveToast && (
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  <Save size={10} /> Saved
                </span>
              )}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Energy / Focus Level
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {['⚡ High', '🔋 Solid', '☕ Low'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleJournalChange('mood', m)}
                    className={currentLog.journal?.mood === m ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1 }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Workout / Activity Log
              </label>
              <input
                type="text"
                placeholder="e.g. Legs & Abs + 5km Run"
                value={currentLog.journal?.workout || ''}
                onChange={(e) => handleJournalChange('workout', e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Key Win of the Day
              </label>
              <input
                type="text"
                placeholder="e.g. Woke up on first alarm & focused 4h straight"
                value={currentLog.journal?.win || ''}
                onChange={(e) => handleJournalChange('win', e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Notes & Mindset Log
              </label>
              <textarea
                rows={3}
                placeholder="What went well today? What will you sharpen tomorrow?"
                value={currentLog.journal?.notes || ''}
                onChange={(e) => handleJournalChange('notes', e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  outline: 'none',
                  fontSize: '0.875rem',
                  resize: 'none'
                }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Modal to Add Habit */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card animate-fade-in" style={{ width: '420px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Add Custom Winter ARC Habit</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Define a custom daily non-negotiable target for your protocol.
            </p>

            <form onSubmit={handleAddHabitSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Habit Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Pushups Daily"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-input)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Category
                </label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-input)',
                    outline: 'none'
                  }}
                >
                  <option value="Fitness">Fitness</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Health">Health</option>
                  <option value="Focus">Focus</option>
                  <option value="Discipline">Discipline</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-ice">
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to Capture Media */}
      {showMediaModal && (
        <MediaCaptureModal
          dateKey={selectedDate}
          onClose={() => setShowMediaModal(false)}
          onSaved={() => loadDayMedia()}
        />
      )}

    </div>
  );
}
