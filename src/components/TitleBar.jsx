import React, { useState } from 'react';
import { Snowflake, Flame, MessageSquareQuote, Shield } from 'lucide-react';
import { calculateArcInfo } from '../utils/storage';
import { getRandomQuote } from '../utils/quotes';

export default function TitleBar() {
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());
  const arcInfo = calculateArcInfo();

  return (
    <div className="app-titlebar">
      <div className="app-titlebar-title">
        <Snowflake size={16} style={{ color: 'var(--accent-ice)' }} />
        <span>WINTER ARC PROTOCOL</span>
        <span className="app-titlebar-badge">
          {arcInfo.status === 'active' ? `DAY ${arcInfo.currentDay} / ${arcInfo.totalDays}` : 'MODE: PREPARATION'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        
        {/* Quote Ticker */}
        <button
          className="btn btn-ghost"
          style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', maxWidth: '380px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          onClick={() => setCurrentQuote(getRandomQuote())}
          title="Click to get new harsh reality quote"
        >
          <MessageSquareQuote size={14} style={{ color: 'var(--accent-fire)', flexShrink: 0 }} />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>"{currentQuote.text}"</span>
        </button>

        {/* Theme Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-input)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700, border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
          <Shield size={12} style={{ color: 'var(--accent-ice)' }} />
          <span>Stealth Carbon</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--accent-fire)' }}>
          <Flame size={14} />
          <span>LOCKED IN</span>
        </div>
      </div>
    </div>
  );
}
