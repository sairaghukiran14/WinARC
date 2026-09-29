import React, { useState } from 'react';
import { Quote, RefreshCw, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { DISCIPLINE_QUOTES } from '../utils/quotes';

const BACKGROUNDS = [
  { id: 'mountain', name: 'Winter Mountain', url: '/quotes_bg.jpg' },
  { id: 'gym', name: 'Dark Gym', url: '/quotes_bg_gym.jpg' },
  { id: 'obsidian', name: 'Obsidian Solid', color: '#090d16' },
  { id: 'charcoal', name: 'Charcoal Texture', color: '#121212' },
];

export default function QuotePosterCard({ initialQuoteIndex = 0 }) {
  const [quoteIdx, setQuoteIdx] = useState(initialQuoteIndex);
  const [bgIdx, setBgIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentQuote = DISCIPLINE_QUOTES[quoteIdx % DISCIPLINE_QUOTES.length];
  const currentBg = BACKGROUNDS[bgIdx % BACKGROUNDS.length];

  const handleNextQuote = () => {
    setQuoteIdx(prev => (prev + 1) % DISCIPLINE_QUOTES.length);
  };

  const handleNextBg = () => {
    setBgIdx(prev => (prev + 1) % BACKGROUNDS.length);
  };

  const handleCopy = () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        minHeight: '260px',
        padding: '0',
        border: '1px solid var(--border-strong)',
        boxShadow: 'var(--shadow-md)',
        background: currentBg.url ? `#000 url(${currentBg.url}) center/cover no-repeat` : currentBg.color
      }}
    >
      {/* Dark Vignette Overlay Mask for High Contrast Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: currentBg.url ? 'rgba(0, 0, 0, 0.65)' : 'transparent',
          backdropFilter: currentBg.url ? 'blur(2px)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          padding: '24px 32px'
        }}
      >
        {/* Top Header Tag & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge badge-fire" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Harsh Reality Check
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ffffff', background: 'rgba(255, 255, 255, 0.1)' }}
              onClick={handleCopy}
              title="Copy quote text"
            >
              {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ffffff', background: 'rgba(255, 255, 255, 0.1)' }}
              onClick={handleNextBg}
              title="Change image wallpaper"
            >
              <ImageIcon size={14} />
              <span>{currentBg.name}</span>
            </button>

            <button
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ffffff', background: 'rgba(255, 255, 255, 0.1)' }}
              onClick={handleNextQuote}
              title="Get next quote"
            >
              <RefreshCw size={14} />
              <span>Next Quote</span>
            </button>
          </div>
        </div>

        {/* CENTERED QUOTE IN THE MIDDLE */}
        <div style={{ textAlign: 'center', margin: '24px 0', padding: '0 20px' }}>
          <Quote size={32} style={{ color: 'var(--accent-fire)', margin: '0 auto 12px auto', opacity: 0.9 }} />
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: '1.45',
              maxWidth: '850px',
              margin: '0 auto',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            "{currentQuote.text}"
          </h2>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--accent-fire)',
              marginTop: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}
          >
            — {currentQuote.author}
          </div>
        </div>

        {/* Bottom Bar Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {DISCIPLINE_QUOTES.slice(0, 8).map((_, i) => (
            <div
              key={i}
              onClick={() => setQuoteIdx(i)}
              style={{
                width: i === (quoteIdx % 8) ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === (quoteIdx % 8) ? 'var(--accent-fire)' : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
