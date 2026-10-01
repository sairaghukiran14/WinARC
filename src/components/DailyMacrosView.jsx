import React, { useState } from 'react';
import { Utensils, Plus, Trash2, Calendar, PieChart, Flame, Target, Check } from 'lucide-react';
import { getTodayKey } from '../utils/storage';
import CustomDialogModal from './CustomDialogModal';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function DailyMacrosView({ macroLogs = {}, macroTargets = {}, onUpdateMacroLogs, onUpdateMacroTargets }) {
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [fiber, setFiber] = useState('');

  const [dialogInfo, setDialogInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  // Targets (defaults: 2400 kcal, 180g P, 220g C, 65g F, 30g Fiber)
  const targets = {
    calories: macroTargets.calories || 2400,
    protein: macroTargets.protein || 180,
    carbs: macroTargets.carbs || 220,
    fats: macroTargets.fats || 65,
    fiber: macroTargets.fiber || 30,
  };

  const dayMeals = macroLogs[selectedDate] || [];

  // Totals for selected date
  const totalCalories = dayMeals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0);
  const totalProtein = dayMeals.reduce((acc, m) => acc + (Number(m.protein) || 0), 0);
  const totalCarbs = dayMeals.reduce((acc, m) => acc + (Number(m.carbs) || 0), 0);
  const totalFats = dayMeals.reduce((acc, m) => acc + (Number(m.fats) || 0), 0);
  const totalFiber = dayMeals.reduce((acc, m) => acc + (Number(m.fiber) || 0), 0);

  const calPct = Math.min(100, Math.round((totalCalories / targets.calories) * 100));
  const proPct = Math.min(100, Math.round((totalProtein / targets.protein) * 100));
  const carbPct = Math.min(100, Math.round((totalCarbs / targets.carbs) * 100));
  const fatPct = Math.min(100, Math.round((totalFats / targets.fats) * 100));
  const fibPct = Math.min(100, Math.round((totalFiber / targets.fiber) * 100));

  // Doughnut Chart Data for Macro Ratios (Protein, Carbs, Fats, Fiber)
  const macroDoughnutData = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fats (g)', 'Fiber (g)'],
    datasets: [
      {
        data: [totalProtein, totalCarbs, totalFats, totalFiber],
        backgroundColor: ['#10b981', '#38bdf8', '#a855f7', '#84cc16'],
        borderColor: '#121212',
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { size: 11, weight: 'bold' }
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

  // Bar Chart Data for Meal-by-Meal Calories
  const mealBarData = {
    labels: dayMeals.length > 0 ? dayMeals.map(m => m.name.length > 12 ? m.name.substring(0, 12) + '...' : m.name) : ['No Meals'],
    datasets: [
      {
        label: 'Calories (kcal)',
        data: dayMeals.length > 0 ? dayMeals.map(m => m.calories) : [0],
        backgroundColor: '#f97316',
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const barOptions = {
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
        padding: 10
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10, weight: 'bold' } } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10, weight: 'bold' } } }
    }
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const newMeal = {
      id: 'meal_' + Date.now(),
      name: mealName.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      fiber: Number(fiber) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedDateMeals = [newMeal, ...dayMeals];
    const updatedAll = {
      ...macroLogs,
      [selectedDate]: updatedDateMeals
    };

    onUpdateMacroLogs(updatedAll);
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setFiber('');
  };

  const handleDeleteMeal = (id) => {
    const updatedDateMeals = dayMeals.filter(m => m.id !== id);
    const updatedAll = {
      ...macroLogs,
      [selectedDate]: updatedDateMeals
    };
    onUpdateMacroLogs(updatedAll);
  };

  const handleSaveTargets = (e) => {
    e.preventDefault();
    setDialogInfo({
      isOpen: true,
      title: 'Macro Targets Saved',
      message: 'Your daily nutrition targets have been updated successfully!',
      type: 'success'
    });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header & Date Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Utensils size={24} style={{ color: 'var(--accent-fire)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Daily Nutrition & Macros Tracker</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Track daily calories, protein, carbs, fats, and dietary fiber for optimal physical transformation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={18} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', fontWeight: 700 }}
          />
        </div>
      </div>

      {/* 5 Macro Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
        
        {/* Calories */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Calories</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-fire)' }}>{calPct}%</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalCalories} / {targets.calories} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>kcal</span>
          </div>
          <div className="progress-track" style={{ marginTop: '8px' }}>
            <div className="progress-fill" style={{ width: `${calPct}%`, background: 'var(--accent-fire)' }} />
          </div>
        </div>

        {/* Protein */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Protein</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{proPct}%</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalProtein} / {targets.protein} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>g</span>
          </div>
          <div className="progress-track" style={{ marginTop: '8px' }}>
            <div className="progress-fill" style={{ width: `${proPct}%`, background: 'var(--accent-emerald)' }} />
          </div>
        </div>

        {/* Carbs */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Carbs</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-ice)' }}>{carbPct}%</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalCarbs} / {targets.carbs} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>g</span>
          </div>
          <div className="progress-track" style={{ marginTop: '8px' }}>
            <div className="progress-fill" style={{ width: `${carbPct}%`, background: 'var(--accent-ice)' }} />
          </div>
        </div>

        {/* Fats */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Fats</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{fatPct}%</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalFats} / {targets.fats} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>g</span>
          </div>
          <div className="progress-track" style={{ marginTop: '8px' }}>
            <div className="progress-fill" style={{ width: `${fatPct}%`, background: 'var(--accent-purple)' }} />
          </div>
        </div>

        {/* Fiber */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Fiber</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#84cc16' }}>{fibPct}%</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalFiber} / {targets.fiber} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>g</span>
          </div>
          <div className="progress-track" style={{ marginTop: '8px' }}>
            <div className="progress-fill" style={{ width: `${fibPct}%`, background: '#84cc16' }} />
          </div>
        </div>

      </div>

      {/* Interactive Charts Visualizer Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Chart 1: Macro Ratio Doughnut */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>Macro Split Ratio (P / C / F)</h3>
          <div style={{ height: '180px', position: 'relative' }}>
            <Doughnut data={macroDoughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Chart 2: Meal-by-Meal Calories Bar */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>Meal Caloric Breakdown</h3>
          <div style={{ height: '180px' }}>
            <Bar data={mealBarData} options={barOptions} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
        
        {/* Left Column: Log Meal & Target Setup (5 Cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Add Meal Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>Log Meal / Food Entry</h3>

            <form onSubmit={handleAddMeal}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Meal Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken Breast & Rice"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  style={{ width: '100%', marginTop: '4px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="e.g. 550"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Protein (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 48"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 60"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Fats (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Fiber (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 8"
                    value={fiber}
                    onChange={(e) => setFiber(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-ice" style={{ width: '100%' }}>
                <Plus size={16} /> Add Meal to Daily Log
              </button>
            </form>
          </div>

          {/* Daily Macro Targets Form */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px' }}>Daily Target Goals</h3>
            <form onSubmit={handleSaveTargets}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Calories (kcal)</label>
                  <input
                    type="number"
                    value={targets.calories}
                    onChange={(e) => onUpdateMacroTargets({ ...targets, calories: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Protein (g)</label>
                  <input
                    type="number"
                    value={targets.protein}
                    onChange={(e) => onUpdateMacroTargets({ ...targets, protein: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Carbs (g)</label>
                  <input
                    type="number"
                    value={targets.carbs}
                    onChange={(e) => onUpdateMacroTargets({ ...targets, carbs: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Fats (g)</label>
                  <input
                    type="number"
                    value={targets.fats}
                    onChange={(e) => onUpdateMacroTargets({ ...targets, fats: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Fiber (g)</label>
                  <input
                    type="number"
                    value={targets.fiber}
                    onChange={(e) => onUpdateMacroTargets({ ...targets, fiber: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>
                <Target size={14} /> Update Macro Targets
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Logged Meals List (7 Cols) */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Logged Meals for {selectedDate}</h3>
              <span className="badge badge-purple">{dayMeals.length} Meals Logged</span>
            </div>

            {dayMeals.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <Utensils size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No meals logged for this date yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Fill out the meal form on the left to track calories & macros!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {meal.name}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span>🔥 <strong style={{ color: 'var(--accent-fire)' }}>{meal.calories}</strong> kcal</span>
                        <span>🥩 <strong style={{ color: 'var(--accent-emerald)' }}>{meal.protein}g</strong> P</span>
                        <span>🍚 <strong style={{ color: 'var(--accent-ice)' }}>{meal.carbs}g</strong> C</span>
                        <span>🥑 <strong style={{ color: 'var(--accent-purple)' }}>{meal.fats}g</strong> F</span>
                        <span>🌾 <strong style={{ color: '#84cc16' }}>{meal.fiber || 0}g</strong> Fib</span>
                      </div>
                    </div>

                    <button
                      className="btn btn-ghost"
                      style={{ padding: '4px 8px', color: 'var(--text-tertiary)' }}
                      onClick={() => handleDeleteMeal(meal.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
