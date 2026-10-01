import React, { useState } from 'react';
import { BookOpen, Calendar, Plus, Trash2, Edit3, Save, Search, Sparkles, Tag, Check, MessageSquare } from 'lucide-react';
import { getTodayKey } from '../utils/storage';
import CustomDialogModal from './CustomDialogModal';

export default function JournalView({ journalLogs = {}, onUpdateJournalLogs }) {
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('⚡ High');
  const [win, setWin] = useState('');
  const [tag, setTag] = useState('Mindset');

  const [dialogInfo, setDialogInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [selectedJournalModal, setSelectedJournalModal] = useState(null);

  const MOOD_OPTIONS = ['⚡ High', '🔋 Solid', '🧠 Reflective', '🔥 Beast Mode', '☕ Low Energy'];
  const TAG_OPTIONS = ['Mindset', 'Fitness', 'Discipline', 'Career', 'Health', 'Reflection'];

  const dateEntries = journalLogs[selectedDate] || [];

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setDialogInfo({
        isOpen: true,
        title: 'Missing Fields',
        message: 'Please provide both a title and reflection content for your journal entry.',
        type: 'info'
      });
      return;
    }

    const newEntry = {
      id: editingId || 'j_' + Date.now(),
      date: selectedDate,
      title: title.trim(),
      content: content.trim(),
      mood,
      win: win.trim(),
      tags: [tag],
      createdAt: new Date().toISOString()
    };

    let updatedDateEntries;
    if (editingId) {
      updatedDateEntries = dateEntries.map(item => item.id === editingId ? newEntry : item);
    } else {
      updatedDateEntries = [newEntry, ...dateEntries];
    }

    const updatedAll = {
      ...journalLogs,
      [selectedDate]: updatedDateEntries
    };

    onUpdateJournalLogs(updatedAll);

    // Reset Form
    setTitle('');
    setContent('');
    setWin('');
    setEditingId(null);

    setDialogInfo({
      isOpen: true,
      title: editingId ? 'Journal Entry Updated' : 'Journal Entry Saved',
      message: 'Your mindset journal entry has been stored securely!',
      type: 'success'
    });
  };

  const handleEditClick = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || '⚡ High');
    setWin(entry.win || '');
    if (entry.tags && entry.tags.length > 0) {
      setTag(entry.tags[0]);
    }
    setSelectedDate(entry.date);
  };

  const handleDeleteClick = (id) => {
    const updatedDateEntries = dateEntries.filter(item => item.id !== id);
    const updatedAll = {
      ...journalLogs,
      [selectedDate]: updatedDateEntries
    };
    onUpdateJournalLogs(updatedAll);
    if (selectedJournalModal?.id === id) {
      setSelectedJournalModal(null);
    }
  };

  // Collect all journal entries across dates for search history view
  const allEntriesFlattened = Object.entries(journalLogs).flatMap(([date, entries]) => 
    (entries || []).map(e => ({ ...e, date }))
  ).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  const filteredEntries = allEntriesFlattened.filter(e => {
    if (!searchQuery.trim()) return e.date === selectedDate;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.content.toLowerCase().includes(q) ||
      (e.win && e.win.toLowerCase().includes(q)) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q))) ||
      e.date.includes(q)
    );
  });

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} style={{ color: 'var(--accent-purple)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Winter ARC Mindset & Daily Journal</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Document your thoughts, daily wins, mental shifts, and reflection logs throughout the 90 days.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search journals or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-input)',
                fontSize: '0.85rem',
                width: '220px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', fontWeight: 700 }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
        
        {/* Left Column: Write / Edit Journal Form (5 Cols) */}
        <div style={{ gridColumn: 'span 5' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {editingId ? 'Edit Journal Entry' : 'Write Journal Entry'}
              </h3>
              {editingId && (
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', color: 'var(--accent-fire)' }}
                  onClick={() => {
                    setEditingId(null);
                    setTitle('');
                    setContent('');
                    setWin('');
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveEntry}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Entry Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Day 14: Overcoming Resistance & Cold Shower"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', marginTop: '4px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Energy / State
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  >
                    {MOOD_OPTIONS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Category Tag
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  >
                    {TAG_OPTIONS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Key Win of the Day
                </label>
                <input
                  type="text"
                  placeholder="e.g. Completed 10km run in under 50 minutes"
                  value={win}
                  onChange={(e) => setWin(e.target.value)}
                  style={{ width: '100%', marginTop: '4px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Journal Reflection & Thoughts
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write freely... How did you handle today's challenges? What did you discover or improve?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%', marginTop: '4px', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', resize: 'vertical', minHeight: '140px' }}
                />
              </div>

              <button type="submit" className="btn btn-ice" style={{ width: '100%' }}>
                <Save size={16} /> {editingId ? 'Update Journal Entry' : 'Store Journal Entry'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Journal History Feed (7 Cols) */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {searchQuery ? `Search Results (${filteredEntries.length})` : `Journal Entries (${filteredEntries.length})`}
              </h3>
              <span className="badge badge-purple">
                {searchQuery ? `Query: "${searchQuery}"` : selectedDate}
              </span>
            </div>

            {filteredEntries.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <BookOpen size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>No journal entries found.</p>
                <p style={{ fontSize: '0.825rem', marginTop: '4px' }}>Write your reflection on the left to start building your Winter ARC archive!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-ice)', fontFamily: 'var(--font-mono)' }}>
                            {entry.date}
                          </span>
                          {entry.mood && (
                            <span className="badge badge-ice" style={{ fontSize: '0.65rem' }}>
                              {entry.mood}
                            </span>
                          )}
                          {entry.tags && entry.tags.map(t => (
                            <span key={t} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {entry.title}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '4px 8px', color: 'var(--text-tertiary)' }}
                          onClick={() => handleEditClick(entry)}
                          title="Edit Entry"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '4px 8px', color: 'var(--text-tertiary)' }}
                          onClick={() => handleDeleteClick(entry.id)}
                          title="Delete Entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {entry.win && (
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', background: 'var(--accent-emerald-light)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid #065f46' }}>
                        🏆 Key Win: {entry.win}
                      </div>
                    )}

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                      {entry.content.length > 280 ? entry.content.substring(0, 280) + '...' : entry.content}
                    </p>

                    {entry.content.length > 280 && (
                      <button
                        className="btn btn-ghost"
                        style={{ alignSelf: 'flex-start', padding: '2px 0', fontSize: '0.75rem', color: 'var(--accent-ice)', fontWeight: 700 }}
                        onClick={() => setSelectedJournalModal(entry)}
                      >
                        Read full entry →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Full View Journal Modal */}
      {selectedJournalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card animate-modal-pop" style={{ width: '640px', maxWidth: '90vw', padding: '32px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-ice)' }}>
                  {selectedJournalModal.date}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px' }}>
                  {selectedJournalModal.title}
                </h3>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px' }}
                onClick={() => setSelectedJournalModal(null)}
              >
                Close
              </button>
            </div>

            {selectedJournalModal.win && (
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)', background: 'var(--accent-emerald-light)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                🏆 Key Win: {selectedJournalModal.win}
              </div>
            )}

            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {selectedJournalModal.content}
            </div>
          </div>
        </div>
      )}

      {/* Custom Dialog Modal */}
      <CustomDialogModal
        isOpen={dialogInfo.isOpen}
        title={dialogInfo.title}
        message={dialogInfo.message}
        type={dialogInfo.type}
        onClose={() => setDialogInfo({ ...dialogInfo, isOpen: false })}
      />

    </div>
  );
}
