// Storage utility for Winter ARC Desktop App

export const INITIAL_PROFILE = {
  name: 'Alex Mercer',
  heightCm: 180,
  startWeightKg: 85.0,
  targetWeightKg: 78.0,
  unit: 'kg',
  weightLogs: [
    { date: '2026-09-15', weight: 85.0, note: 'Initial baseline' },
    { date: '2026-09-22', weight: 83.8, note: 'Week 1 check-in' },
    { date: '2026-09-29', weight: 82.5, note: 'Current weight' }
  ]
};

export const INITIAL_HABITS = [
  { id: 'h1', title: '5:00 AM Wake Up', category: 'Discipline', icon: 'Sun', targetPerWeek: 7 },
  { id: 'h2', title: '45+ Min Workout / Gym', category: 'Fitness', icon: 'Dumbbell', targetPerWeek: 6 },
  { id: 'h3', title: 'Read 10 Pages', category: 'Mindset', icon: 'BookOpen', targetPerWeek: 7 },
  { id: 'h4', title: '3L+ Water Intake', category: 'Health', icon: 'Droplets', targetPerWeek: 7 },
  { id: 'h5', title: '2 Hrs Deep Work / Code', category: 'Focus', icon: 'Code', targetPerWeek: 6 },
  { id: 'h6', title: 'Clean Eating (No Junk)', category: 'Health', icon: 'Apple', targetPerWeek: 7 },
  { id: 'h7', title: '10 Min Daily Journaling', category: 'Mindset', icon: 'Feather', targetPerWeek: 7 }
];

export const INITIAL_RULES = [
  { id: 'r1', text: 'No social media before 12 PM', active: true },
  { id: 'r2', text: 'Cold shower after morning workout', active: true },
  { id: 'r3', text: 'Phone out of bedroom by 10:00 PM', active: true },
  { id: 'r4', text: 'Zero excuses, zero compromise', active: true }
];

export const INITIAL_GOALS = [
  { id: 'g1', category: 'Fitness', title: 'Reach sub 12% Body Fat & 100km run total', target: '100 km', current: '32 km' },
  { id: 'g2', category: 'Career', title: 'Ship Winter ARC Desktop App & launch portfolio project', target: '1 App', current: '1 App' },
  { id: 'g3', category: 'Mindset', title: 'Read 3 books cover-to-cover', target: '3 Books', current: '1 Book' }
];

export function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateArcInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const arcStart = new Date(year, 9, 1); // Oct 1
  const arcEnd = new Date(year, 11, 31); // Dec 31
  const totalDays = 92;
  
  if (now < arcStart) {
    const diffTime = arcStart - now;
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { status: 'upcoming', daysUntil, currentDay: 1, totalDays, percentage: 0 };
  } else if (now > arcEnd) {
    return { status: 'completed', currentDay: 92, totalDays, percentage: 100 };
  } else {
    const diffTime = Math.abs(now - arcStart);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const currentDayNum = Math.min(diffDays, totalDays);
    const percentage = Math.round((currentDayNum / totalDays) * 100);
    return { status: 'active', currentDay: currentDayNum, totalDays, percentage };
  }
}

export function loadAppData() {
  try {
    const profile = JSON.parse(localStorage.getItem('winter_arc_profile')) || INITIAL_PROFILE;
    const habits = JSON.parse(localStorage.getItem('winter_arc_habits')) || INITIAL_HABITS;
    const rules = JSON.parse(localStorage.getItem('winter_arc_rules')) || INITIAL_RULES;
    const goals = JSON.parse(localStorage.getItem('winter_arc_goals')) || INITIAL_GOALS;
    const logs = JSON.parse(localStorage.getItem('winter_arc_logs')) || {};
    const milestones = JSON.parse(localStorage.getItem('winter_arc_milestones')) || {};
    const activityLogs = JSON.parse(localStorage.getItem('winter_arc_activity_logs')) || {};
    const macroLogs = JSON.parse(localStorage.getItem('winter_arc_macro_logs')) || {};
    const macroTargets = JSON.parse(localStorage.getItem('winter_arc_macro_targets')) || { calories: 2400, protein: 180, carbs: 220, fats: 65 };
    return { profile, habits, rules, goals, logs, milestones, activityLogs, macroLogs, macroTargets };
  } catch (err) {
    console.error('Error loading Winter Arc data', err);
    return { profile: INITIAL_PROFILE, habits: INITIAL_HABITS, rules: INITIAL_RULES, goals: INITIAL_GOALS, logs: {}, milestones: {}, activityLogs: {}, macroLogs: {}, macroTargets: { calories: 2400, protein: 180, carbs: 220, fats: 65 } };
  }
}

export function saveAppData(data) {
  try {
    if (data.profile) localStorage.setItem('winter_arc_profile', JSON.stringify(data.profile));
    if (data.habits) localStorage.setItem('winter_arc_habits', JSON.stringify(data.habits));
    if (data.rules) localStorage.setItem('winter_arc_rules', JSON.stringify(data.rules));
    if (data.goals) localStorage.setItem('winter_arc_goals', JSON.stringify(data.goals));
    if (data.logs) localStorage.setItem('winter_arc_logs', JSON.stringify(data.logs));
    if (data.milestones) localStorage.setItem('winter_arc_milestones', JSON.stringify(data.milestones));
    if (data.activityLogs) localStorage.setItem('winter_arc_activity_logs', JSON.stringify(data.activityLogs));
    if (data.macroLogs) localStorage.setItem('winter_arc_macro_logs', JSON.stringify(data.macroLogs));
    if (data.macroTargets) localStorage.setItem('winter_arc_macro_targets', JSON.stringify(data.macroTargets));
  } catch (err) {
    console.error('Error saving Winter Arc data', err);
  }
}
