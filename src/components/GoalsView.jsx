import React, { useState } from 'react';
import { Target, ShieldAlert, Plus, Trash2, Award, Sparkles, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { DISCIPLINE_QUOTES } from '../utils/quotes';

export default function GoalsView({ rules, goals, onUpdateRules, onUpdateGoals }) {
  const [newRuleText, setNewRuleText] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalCategory, setNewGoalCategory] = useState('Fitness');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    const updated = [...rules, { id: 'r_' + Date.now(), text: newRuleText.trim(), active: true }];
    onUpdateRules(updated);
    setNewRuleText('');
  };

  const handleDeleteRule = (ruleId) => {
    const updated = rules.filter(r => r.id !== ruleId);
    onUpdateRules(updated);
  };

  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const updated = [...goals, {
      id: 'g_' + Date.now(),
      category: newGoalCategory,
      title: newGoalTitle.trim(),
      target: newGoalTarget.trim() || 'Achieved',
      current: 'In Progress'
    }];
    onUpdateGoals(updated);
    setNewGoalTitle('');
    setNewGoalTarget('');
    setShowGoalModal(false);
  };

  const handleDeleteGoal = (goalId) => {
    const updated = goals.filter(g => g.id !== goalId);
    onUpdateGoals(updated);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Manifesto Card (Solid Dark Matte - No Gradient) */}
      <div
        className="card"
        style={{
          background: 'var(--bg-card)',
          borderLeft: '4px solid var(--accent-ice)',
          color: '#ffffff',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-ice)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--accent-ice)', textTransform: 'uppercase' }}>
            Winter ARC Manifesto
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
          "Execute in Silence. Let Progress Make the Noise."
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: '800px', lineHeight: '1.6' }}>
          While the rest of the world slows down in Q4, the Winter ARC is where champions build their foundation for next year. Define your non-negotiables, uphold your standards, and stay relentless.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px', marginBottom: '32px' }}>
        
        {/* Left: Non-negotiable Rules (6 Cols) */}
        <div style={{ gridColumn: 'span 6' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={20} style={{ color: 'var(--accent-fire)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Non-Negotiable Rules
                </h3>
              </div>
              <span className="badge badge-fire">{rules.length} Rules</span>
            </div>

            {/* Form to add rule */}
            <form onSubmit={handleAddRule} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Add new rule (e.g., No phone in morning)"
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <Plus size={16} /> Add Rule
              </button>
            </form>

            {/* List of rules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-fire)' }} />
                    <span>{rule.text}</span>
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '4px 8px', color: 'var(--text-tertiary)' }}
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Seasonal Goals (6 Cols) */}
        <div style={{ gridColumn: 'span 6' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Target size={20} style={{ color: 'var(--accent-ice)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Winter ARC Milestones
                </h3>
              </div>
              <button className="btn btn-ice" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setShowGoalModal(true)}>
                <Plus size={14} /> New Goal
              </button>
            </div>

            {/* Goals list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                >
                  <div>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                      {goal.category}
                    </span>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {goal.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Target: <strong style={{ color: 'var(--accent-ice)' }}>{goal.target}</strong> (Current: {goal.current})
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ padding: '4px 6px', color: 'var(--text-tertiary)' }} onClick={() => handleDeleteGoal(goal.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Harsh Reality & Discipline Quotes Vault */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <MessageSquareQuote size={20} style={{ color: 'var(--accent-fire)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Discipline & Harsh Reality Quotes Vault</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {DISCIPLINE_QUOTES.map((q, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.5', italic: true }}>
                "{q.text}"
              </p>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-fire)', marginTop: '12px', textTransform: 'uppercase' }}>
                — {q.author}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Goal Modal */}
      {showGoalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card animate-fade-in" style={{ width: '420px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Create Winter ARC Milestone</h3>

            <form onSubmit={handleAddGoalSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Category
                </label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  style={{ width: '100%', marginTop: '6px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                >
                  <option value="Fitness">Fitness</option>
                  <option value="Career">Career & Skill</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Financial">Financial</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Goal Objective
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Run 100km total during Winter ARC"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  style={{ width: '100%', marginTop: '6px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Target Metric
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100 km"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  style={{ width: '100%', marginTop: '6px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowGoalModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-ice">
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
