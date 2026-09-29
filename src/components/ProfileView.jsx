import React, { useState } from 'react';
import { User, Scale, Ruler, Target, Plus, Trash2, TrendingDown, TrendingUp, Award, Calendar, Activity, Info, Sparkles } from 'lucide-react';
import CustomDialogModal from './CustomDialogModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProfileView({ profile, onUpdateProfile }) {
  const [name, setName] = useState(profile.name || '');
  const [heightCm, setHeightCm] = useState(profile.heightCm || 180);
  const [startWeightKg, setStartWeightKg] = useState(profile.startWeightKg || 85.0);
  const [targetWeightKg, setTargetWeightKg] = useState(profile.targetWeightKg || 78.0);
  const [unit, setUnit] = useState(profile.unit || 'kg');

  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [newWeightNote, setNewWeightNote] = useState('');

  const [dialogInfo, setDialogInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const weightLogs = profile.weightLogs || [];
  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : startWeightKg;
  
  const totalChange = currentWeight - startWeightKg;
  const targetDiff = startWeightKg - targetWeightKg;
  const currentDiff = startWeightKg - currentWeight;
  const weightProgressPct = targetDiff !== 0 ? Math.min(Math.max(Math.round((currentDiff / targetDiff) * 100), 0), 100) : 100;

  // BMI Calculation
  // BMI = weight(kg) / (height(m))^2
  const heightM = (Number(heightCm) || 180) / 100;
  const weightInKg = unit === 'lbs' ? (Number(currentWeight) || 70) * 0.453592 : (Number(currentWeight) || 70);
  const startWeightInKg = unit === 'lbs' ? (Number(startWeightKg) || 85) * 0.453592 : (Number(startWeightKg) || 85);
  const targetWeightInKg = unit === 'lbs' ? (Number(targetWeightKg) || 78) * 0.453592 : (Number(targetWeightKg) || 78);

  const bmi = heightM > 0 ? (weightInKg / (heightM * heightM)).toFixed(1) : 0;
  const targetBmi = heightM > 0 ? (targetWeightInKg / (heightM * heightM)).toFixed(1) : 0;

  // Ideal weight range for height (BMI 18.5 - 24.9)
  const minIdealKg = (18.5 * heightM * heightM).toFixed(1);
  const maxIdealKg = (24.9 * heightM * heightM).toFixed(1);
  const minIdealDisplay = unit === 'lbs' ? (minIdealKg * 2.20462).toFixed(1) : minIdealKg;
  const maxIdealDisplay = unit === 'lbs' ? (maxIdealKg * 2.20462).toFixed(1) : maxIdealKg;

  let bmiCategory = 'Normal';
  let bmiColor = 'var(--accent-emerald)';

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'var(--accent-yellow)';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    bmiCategory = 'Normal (Optimal)';
    bmiColor = 'var(--accent-emerald)';
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = 'var(--accent-fire)';
  } else {
    bmiCategory = 'Obese';
    bmiColor = 'var(--accent-fire)';
  }

  // Weight Trend rate calculation
  let trendRateText = '0.0 ' + unit + '/week';
  if (weightLogs.length >= 2) {
    const firstLog = weightLogs[0];
    const lastLog = weightLogs[weightLogs.length - 1];
    const daysDiff = Math.max(1, Math.round((new Date(lastLog.date) - new Date(firstLog.date)) / (1000 * 60 * 60 * 24)));
    const weightDiff = lastLog.weight - firstLog.weight;
    const weeklyRate = ((weightDiff / daysDiff) * 7).toFixed(1);
    trendRateText = `${weeklyRate > 0 ? '+' : ''}${weeklyRate} ${unit}/week`;
  }

  // Prepare Chart.js Line Chart Data
  const chartLabels = weightLogs.map(l => l.date);
  const chartDataPoints = weightLogs.map(l => l.weight);
  const targetDataPoints = weightLogs.map(() => targetWeightKg);

  const lineChartData = {
    labels: chartLabels.length > 0 ? chartLabels : ['Start'],
    datasets: [
      {
        label: `Logged Weight (${unit})`,
        data: chartDataPoints.length > 0 ? chartDataPoints : [startWeightKg],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#f8fafc',
        pointBorderColor: '#38bdf8',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: `Target Goal (${unit})`,
        data: targetDataPoints.length > 0 ? targetDataPoints : [targetWeightKg],
        borderColor: '#a855f7',
        borderDash: [6, 6],
        fill: false,
        pointRadius: 0,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'sans-serif', size: 12, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#27272a',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    },
    scales: {
      x: {
        grid: { color: '#1e293b' },
        ticks: { color: '#64748b', font: { size: 11, weight: 'bold' } }
      },
      y: {
        grid: { color: '#1e293b' },
        ticks: { color: '#64748b', font: { size: 11, weight: 'bold' } }
      }
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      heightCm: Number(heightCm),
      startWeightKg: Number(startWeightKg),
      targetWeightKg: Number(targetWeightKg),
      unit
    });
    setDialogInfo({
      isOpen: true,
      title: 'Profile & BMI Parameters Updated',
      message: 'Your athlete profile, target weight, and body mass index metrics have been saved successfully!',
      type: 'success'
    });
  };

  const handleAddWeightLog = (e) => {
    e.preventDefault();
    if (!newWeight) return;
    const entry = {
      date: newWeightDate,
      weight: Number(newWeight),
      note: newWeightNote.trim() || 'Weight check-in'
    };
    const updatedLogs = [...weightLogs, entry].sort((a, b) => new Date(a.date) - new Date(b.date));
    onUpdateProfile({
      ...profile,
      weightLogs: updatedLogs
    });
    setNewWeight('');
    setNewWeightNote('');
  };

  const handleDeleteWeightLog = (index) => {
    const updated = weightLogs.filter((_, idx) => idx !== index);
    onUpdateProfile({
      ...profile,
      weightLogs: updated
    });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Banner Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            <User size={16} /> Athlete Name
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {profile.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Height: {profile.heightCm} cm</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            <Scale size={16} /> Current Weight
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-ice)', marginTop: '4px' }}>
            {currentWeight} {unit}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Start: {startWeightKg} {unit}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            <Target size={16} /> Target Goal
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '4px' }}>
            {targetWeightKg} {unit}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {totalChange <= 0 ? `${Math.abs(totalChange.toFixed(1))} ${unit} lost` : `${totalChange.toFixed(1)} ${unit} gained`}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            <Activity size={16} /> Body Mass Index
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: bmiColor, marginTop: '4px' }}>
            {bmi} <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>({bmiCategory})</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Target BMI: {targetBmi}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            <TrendingDown size={16} /> Goal Progress
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
            {weightProgressPct}%
          </div>
          <div style={{ marginTop: '6px' }}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${weightProgressPct}%`, background: 'var(--accent-emerald)' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
        
        {/* Left Column: Personal Profile Form & BMI Calculator Advisor (5 Cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Profile Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Personal Profile Metrics</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Update your baseline parameters for your Winter ARC physical transformation.
            </p>

            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', marginTop: '6px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    style={{ width: '100%', marginTop: '6px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{ width: '100%', marginTop: '6px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Baseline Weight ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={startWeightKg}
                    onChange={(e) => setStartWeightKg(e.target.value)}
                    style={{ width: '100%', marginTop: '6px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Target Goal ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(e.target.value)}
                    style={{ width: '100%', marginTop: '6px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Profile Parameters
              </button>
            </form>
          </div>

          {/* BMI Calculator & Healthy Range Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Activity size={20} style={{ color: 'var(--accent-ice)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>BMI & Healthy Range Advisor</h3>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Current Calculated BMI</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: bmiColor }}>{bmi}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Classification</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: bmiColor }}>{bmiCategory}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '6px' }}>
                <span>Ideal Weight Range ({heightCm} cm):</span>
                <strong style={{ color: 'var(--accent-ice)' }}>{minIdealDisplay} – {maxIdealDisplay} {unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '6px' }}>
                <span>BMI Target Range:</span>
                <strong>18.5 – 24.9 kg/m²</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Velocity Trend Rate:</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>{trendRateText}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Weight History & Trends Analysis (7 Cols) */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Weight Trends & Transformation Progress */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Weight Trends & Delta Analysis</h3>
              <span className="badge badge-purple">{weightLogs.length} Check-ins</span>
            </div>

            {/* Visual Interactive ChartJS Line Chart */}
            <div style={{ background: 'var(--bg-app)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px', height: '240px' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>

            {/* Visual Timeline Trend Bar */}
            <div style={{ background: 'var(--bg-app)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Baseline</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{startWeightKg} {unit}</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Current</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-ice)' }}>{currentWeight} {unit}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Target</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{targetWeightKg} {unit}</div>
                </div>
              </div>

              <div className="progress-track" style={{ height: '10px' }}>
                <div className="progress-fill" style={{ width: `${weightProgressPct}%`, background: 'var(--accent-emerald)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                <span>0% Achieved</span>
                <span>{weightProgressPct}% Towards Goal</span>
                <span>100% Target</span>
              </div>
            </div>

            {/* Quick Add Form */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px' }}>Log New Weight Check-in</h4>
            <form onSubmit={handleAddWeightLog} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr auto', gap: '10px', marginBottom: '24px' }}>
              <input
                type="date"
                required
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
              />
              <input
                type="number"
                step="0.1"
                required
                placeholder={`Weight (${unit})`}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
              />
              <input
                type="text"
                placeholder="Note (e.g. Fasted morning)"
                value={newWeightNote}
                onChange={(e) => setNewWeightNote(e.target.value)}
                style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
              />
              <button type="submit" className="btn btn-ice" style={{ whiteSpace: 'nowrap' }}>
                <Plus size={16} /> Log Entry
              </button>
            </form>

            {/* Weight Logs Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {weightLogs.slice().reverse().map((log, idx) => {
                const actualIdx = weightLogs.length - 1 - idx;
                const prevLog = actualIdx > 0 ? weightLogs[actualIdx - 1] : null;
                const delta = prevLog ? (log.weight - prevLog.weight).toFixed(1) : 0;
                
                return (
                  <div
                    key={idx}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ background: 'var(--accent-ice-light)', color: 'var(--accent-ice)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
                        {log.date}
                      </div>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                          {log.weight} {unit}
                        </span>
                        {prevLog && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, marginLeft: '8px', color: delta <= 0 ? 'var(--accent-emerald)' : 'var(--accent-fire)' }}>
                            ({delta <= 0 ? delta : `+${delta}`} {unit})
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '12px' }}>
                          {log.note}
                        </span>
                      </div>
                    </div>

                    <button className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--text-tertiary)' }} onClick={() => handleDeleteWeightLog(actualIdx)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
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
        onClose={() => setDialogInfo({ ...dialogInfo, isOpen: false })}
      />

    </div>
  );
}

