import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDeleteModal({ mediaItem, onConfirm, onCancel }) {
  if (!mediaItem) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000 }}>
      <div className="card animate-modal-pop" style={{ width: '420px', padding: '28px', border: '1px solid #7f1d1d', background: 'var(--bg-card)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={22} style={{ color: 'var(--accent-fire)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Media Deletion</h3>
          </div>
          <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
          Are you sure you want to permanently delete this media entry (<strong style={{ color: 'var(--text-primary)' }}>{mediaItem.caption || mediaItem.type}</strong>) from your Winter ARC vault? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: '#ef4444', borderColor: '#b91c1c' }}
            onClick={onConfirm}
          >
            <Trash2 size={16} /> Permanently Delete
          </button>
        </div>

      </div>
    </div>
  );
}
