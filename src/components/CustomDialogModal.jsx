import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function CustomDialogModal({ 
  isOpen, 
  title = 'Winter ARC Notification', 
  message, 
  type = 'info', // 'info' | 'success' | 'warning' | 'confirm'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm, 
  onClose 
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={22} style={{ color: 'var(--accent-emerald)' }} />;
      case 'warning': case 'confirm': return <AlertCircle size={22} style={{ color: 'var(--accent-fire)' }} />;
      default: return <Info size={22} style={{ color: 'var(--accent-ice)' }} />;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6000 }}>
      <div className="card animate-modal-pop" style={{ width: '420px', padding: '28px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {getIcon()}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{title}</h3>
          </div>
          <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '24px' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {type === 'confirm' && (
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (type === 'confirm' && onConfirm) onConfirm();
              onClose();
            }}
          >
            {type === 'confirm' ? confirmText : 'Got it'}
          </button>
        </div>

      </div>
    </div>
  );
}
