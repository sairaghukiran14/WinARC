import React, { useState } from 'react';
import { Settings, Download, Upload, Trash2, RefreshCw, Shield, Check, HardDrive, Database } from 'lucide-react';
import { INITIAL_HABITS, INITIAL_RULES, INITIAL_GOALS, getTodayKey, loadAppData, saveAppData } from '../utils/storage';
import { getAllMedia, saveMultipleMedia, clearAllMedia } from '../utils/mediaStore';
import CustomDialogModal from './CustomDialogModal';

export default function SettingsView({ habits, rules, goals, logs, onUpdateHabits, onUpdateLogs, onResetAll }) {
  const [exportNotice, setExportNotice] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

  const handleExportFullBackup = async () => {
    try {
      const fullAppData = loadAppData();
      const allMedia = await getAllMedia();

      const exportPackage = {
        appData: fullAppData,
        mediaVault: allMedia,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(exportPackage, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `winter_arc_full_local_backup_${getTodayKey()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 3000);
    } catch (err) {
      console.error('Export error', err);
      setDialogInfo({
        isOpen: true,
        title: 'Export Failed',
        message: 'Could not complete local backup export.',
        type: 'warning'
      });
    }
  };

  const handleImportFullBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const packageData = JSON.parse(event.target.result);
        const data = packageData.appData || packageData;

        if (data.habits || data.logs) {
          saveAppData(data);
          
          if (packageData.mediaVault && Array.isArray(packageData.mediaVault)) {
            await saveMultipleMedia(packageData.mediaVault);
          }

          onUpdateHabits(data.habits || habits);
          onUpdateLogs(data.logs || logs);
          
          setDialogInfo({
            isOpen: true,
            title: 'Full Backup Imported',
            message: `Successfully restored local protocol data and ${packageData.mediaVault?.length || 0} media vault items! Please refresh or switch tabs to see updated records.`,
            type: 'success'
          });
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          title: 'Import Failed',
          message: 'Invalid backup file format. Please select a valid Winter ARC backup JSON file.',
          type: 'warning'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSeedDemoData = () => {
    const newLogs = { ...logs };
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      
      const completedCount = Math.floor(Math.random() * 3) + 5;
      const shuffled = [...habits].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, completedCount).map(h => h.id);

      newLogs[key] = {
        completedHabits: selected,
        rulesCompleted: ['r1', 'r2', 'r3'],
        journal: {
          mood: 'Solid',
          workout: 'Morning Gym & 5km Run',
          win: 'Stayed 100% locked in with zero distractions',
          notes: 'Consistency compounding day by day.'
        }
      };
    }
    onUpdateLogs(newLogs);
    setDialogInfo({
      isOpen: true,
      title: 'Demo Data Seeded',
      message: 'Seeded 14 days of realistic Winter ARC demo progress for testing!',
      type: 'success'
    });
  };

  const handleDeleteHabit = (id) => {
    if (habits.length <= 1) {
      setDialogInfo({
        isOpen: true,
        title: 'Action Restricted',
        message: 'You must keep at least 1 habit in your daily protocol.',
        type: 'warning'
      });
      return;
    }
    const updated = habits.filter(h => h.id !== id);
    onUpdateHabits(updated);
  };

  const handleResetConfirm = () => {
    setDialogInfo({
      isOpen: true,
      title: 'Reset All Winter ARC Local Data & Media?',
      message: 'Are you sure you want to permanently clear all local protocol logs, macro history, athlete profile data, and local Media Vault photos/videos? This action cannot be undone.',
      type: 'confirm',
      confirmText: 'Reset Everything',
      onConfirm: async () => {
        await clearAllMedia();
        onResetAll();
      }
    });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Stealth Carbon Active Theme Card */}
      <div className="card" style={{ marginBottom: '28px', borderLeft: '4px solid #f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={22} style={{ color: '#f8fafc' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Active Theme: Stealth Carbon</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              High-contrast monochrome dark aesthetic with stark silver primary action buttons and pitch black base.
            </p>
          </div>
          <span className="badge badge-ice" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            ✓ Active & Default Theme
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
        
        {/* Left: Habits Management (7 Cols) */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Manage Protocol Habits</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Add, remove, or customize your active daily Winter ARC protocol habits.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {habits.map((habit) => (
                <div
                  key={habit.id}
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
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{habit.title}</span>
                    <span className="badge badge-purple" style={{ marginLeft: '10px', fontSize: '0.7rem' }}>
                      {habit.category}
                    </span>
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '4px 8px', color: 'var(--text-tertiary)' }}
                    onClick={() => handleDeleteHabit(habit.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Data Export/Import & Seeder (5 Cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Data Backup */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <HardDrive size={20} style={{ color: 'var(--accent-ice)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Local Storage & Backups</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              100% of your data (habits, logs, macros, weight, notes) AND media (photos, videos, audio clips) are saved locally on your device via localStorage & IndexedDB.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-primary" onClick={handleExportFullBackup}>
                <Download size={16} /> Export Complete Backup Package (Data + Media)
              </button>

              {exportNotice && (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Complete backup package downloaded locally to your disk!
                </div>
              )}

              <label className="btn btn-secondary" style={{ cursor: 'pointer', textAlign: 'center' }}>
                <Upload size={16} /> Restore Complete Backup File
                <input type="file" accept=".json" onChange={handleImportFullBackup} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Demo Data & Reset */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>Quick Tools</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Seed realistic demo data or reset application data.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-ice" onClick={handleSeedDemoData}>
                <RefreshCw size={16} /> Seed 14-Day Demo Data
              </button>

              <button
                className="btn btn-secondary"
                style={{ color: '#ef4444', borderColor: '#7f1d1d' }}
                onClick={handleResetConfirm}
              >
                Reset All Logs
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Custom Dialog Modal */}
      <CustomDialogModal
        isOpen={dialogInfo.isOpen}
        title={dialogInfo.title}
        message={dialogInfo.message}
        type={dialogInfo.type}
        confirmText={dialogInfo.confirmText}
        onConfirm={dialogInfo.onConfirm}
        onClose={() => setDialogInfo({ ...dialogInfo, isOpen: false })}
      />

    </div>
  );
}
