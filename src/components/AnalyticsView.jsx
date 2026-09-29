import React from 'react';
import { Award, Flame, Trophy, TrendingUp, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { getTodayKey } from '../utils/storage';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AnalyticsView({ habits, logs }) {
  // Compute last 7 days data for Bar Chart
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    
    const dayLog = logs[key] || { completedHabits: [] };
    const count = dayLog.completedHabits ? dayLog.completedHabits.length : 0;
    const total = habits.length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    last7Days.push({
      dateStr: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count,
      pct
    });
  }

  // Category breakdown calculation
  const categoryStats = {};
  habits.forEach(h => {
    categoryStats[h.category] = { total: 0, completed: 0 };
  });

  Object.values(logs).forEach(dayLog => {
    if (dayLog.completedHabits) {
      dayLog.completedHabits.forEach(habitId => {
        const found = habits.find(h => h.id === habitId);
        if (found) {
          if (!categoryStats[found.category]) categoryStats[found.category] = { total: 0, completed: 0 };
          categoryStats[found.category].completed += 1;
        }
      });
    }
  });

  // Chart.js Bar Chart Data (Weekly Completion Velocity)
  const velocityBarData = {
    labels: last7Days.map(d => d.dateStr),
    datasets: [
      {
        label: 'Completion Velocity (%)',
        data: last7Days.map(d => d.pct),
        backgroundColor: last7Days.map(d => d.pct === 100 ? '#10b981' : '#38bdf8'),
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const velocityBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#27272a',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` Velocity: ${context.parsed.y}%`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 12, weight: 'bold' } } },
      y: { min: 0, max: 100, grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 11, weight: 'bold' } } }
    }
  };

  // Chart.js Doughnut Data (Category Focus Distribution)
  const categoryLabels = Object.keys(categoryStats);
  const categoryData = Object.values(categoryStats).map(c => c.completed);
  const categoryColors = ['#f97316', '#a855f7', '#38bdf8', '#10b981', '#e2e8f0'];

  const categoryDoughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryData.some(v => v > 0) ? categoryData : [1, 1, 1, 1],
        backgroundColor: categoryColors.slice(0, categoryLabels.length),
        borderColor: '#121212',
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const categoryDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { size: 12, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#27272a',
        borderWidth: 1,
        padding: 10
      }
    }
  };

  // Achievements evaluation
  const totalLogsCount = Object.keys(logs).length;
  const perfectDaysCount = Object.values(logs).filter(l => l.completedHabits?.length === habits.length && habits.length > 0).length;

  const BADGES = [
    { title: 'Winter Recruit', desc: 'Started your Winter ARC journey', unlocked: totalLogsCount >= 1, icon: '❄️' },
    { title: '7-Day Iron Will', desc: 'Logged 7 days of consistency', unlocked: totalLogsCount >= 7, icon: '⚔️' },
    { title: 'Perfect Protocol', desc: 'Achieved 100% completion on a day', unlocked: perfectDaysCount >= 1, icon: '⚡' },
    { title: '30-Day Master', desc: 'Logged 30 days during the Arc', unlocked: totalLogsCount >= 30, icon: '👑' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
        
        {/* Left Column: Last 7 Days Visual Chart (7 Cols) */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Weekly Completion Velocity
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Habit completion percentage over the last 7 days.
                </p>
              </div>
              <div className="badge badge-ice">Last 7 Days</div>
            </div>

            {/* Interactive ChartJS Bar Chart */}
            <div style={{ height: '220px', padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Bar data={velocityBarData} options={velocityBarOptions} />
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="card" style={{ marginTop: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Category Balance & Focus Distribution</h3>
            <div style={{ height: '220px', position: 'relative' }}>
              <Doughnut data={categoryDoughnutData} options={categoryDoughnutOptions} />
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Badges (5 Cols) */}
        <div style={{ gridColumn: 'span 5' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Trophy size={20} style={{ color: 'var(--accent-fire)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Winter ARC Achievements
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {BADGES.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: b.unlocked ? 'var(--bg-card)' : 'var(--bg-app)',
                    border: b.unlocked ? '1px solid var(--accent-ice-border)' : '1px dashed var(--border-strong)',
                    opacity: b.unlocked ? 1 : 0.6
                  }}
                >
                  <div style={{ fontSize: '1.8rem' }}>{b.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {b.title}
                      </span>
                      {b.unlocked && (
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Unlocked</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
