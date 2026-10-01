import React, { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import SidebarNav from './components/SidebarNav';
import WorkspaceHeader from './components/WorkspaceHeader';
import DashboardView from './components/DashboardView';
import JournalView from './components/JournalView';
import ActivityLoggerView from './components/ActivityLoggerView';
import DailyMacrosView from './components/DailyMacrosView';
import Milestones30View from './components/Milestones30View';
import HeatmapView from './components/HeatmapView';
import ProfileView from './components/ProfileView';
import MediaVaultView from './components/MediaVaultView';
import GoalsView from './components/GoalsView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import MediaCaptureModal from './components/MediaCaptureModal';
import { loadAppData, saveAppData, calculateArcInfo, getTodayKey, INITIAL_HABITS, INITIAL_RULES, INITIAL_GOALS, INITIAL_PROFILE, INITIAL_MACRO_TARGETS } from './utils/storage';
import { getSavedTheme, applyTheme } from './utils/themes';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTheme, setCurrentTheme] = useState(getSavedTheme());
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [habits, setHabits] = useState([]);
  const [rules, setRules] = useState([]);
  const [goals, setGoals] = useState([]);
  const [logs, setLogs] = useState({});
  const [milestones, setMilestones] = useState({});
  const [activityLogs, setActivityLogs] = useState({});
  const [macroLogs, setMacroLogs] = useState({});
  const [macroTargets, setMacroTargets] = useState(INITIAL_MACRO_TARGETS);
  const [journalLogs, setJournalLogs] = useState({});
  const [showGlobalMediaModal, setShowGlobalMediaModal] = useState(false);

  // Apply theme on load and change
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Initialize data
  useEffect(() => {
    const data = loadAppData();
    setProfile(data.profile);
    setHabits(data.habits);
    setRules(data.rules);
    setGoals(data.goals);
    setLogs(data.logs);
    setMilestones(data.milestones || {});
    setActivityLogs(data.activityLogs || {});
    setMacroLogs(data.macroLogs || {});
    setMacroTargets(data.macroTargets || INITIAL_MACRO_TARGETS);
    setJournalLogs(data.journalLogs || {});
  }, []);

  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
  };

  const handleUpdateProfile = (newProfile) => {
    setProfile(newProfile);
    saveAppData({ profile: newProfile, habits, rules, goals, logs, milestones, activityLogs, macroLogs, macroTargets, journalLogs });
  };

  const handleUpdateHabits = (newHabits) => {
    setHabits(newHabits);
    saveAppData({ profile, habits: newHabits, rules, goals, logs, milestones, activityLogs, macroLogs, macroTargets, journalLogs });
  };

  const handleUpdateRules = (newRules) => {
    setRules(newRules);
    saveAppData({ profile, habits, rules: newRules, goals, logs, milestones, activityLogs, macroLogs, macroTargets, journalLogs });
  };

  const handleUpdateGoals = (newGoals) => {
    setGoals(newGoals);
    saveAppData({ profile, habits, rules, goals: newGoals, logs, milestones, activityLogs, macroLogs, macroTargets, journalLogs });
  };

  const handleUpdateLogs = (newLogs) => {
    setLogs(newLogs);
    saveAppData({ profile, habits, rules, goals, logs: newLogs, milestones, activityLogs, macroLogs, macroTargets, journalLogs });
  };

  const handleUpdateMilestones = (newMilestones) => {
    setMilestones(newMilestones);
    saveAppData({ profile, habits, rules, goals, logs, milestones: newMilestones, activityLogs, macroLogs, macroTargets, journalLogs });
  };

  const handleUpdateActivityLogs = (newActivityLogs) => {
    setActivityLogs(newActivityLogs);
    saveAppData({ profile, habits, rules, goals, logs, milestones, activityLogs: newActivityLogs, macroLogs, macroTargets, journalLogs });
  };

  const handleUpdateMacroLogs = (newMacroLogs) => {
    setMacroLogs(newMacroLogs);
    saveAppData({ profile, habits, rules, goals, logs, milestones, activityLogs, macroLogs: newMacroLogs, macroTargets, journalLogs });
  };

  const handleUpdateMacroTargets = (newMacroTargets) => {
    setMacroTargets(newMacroTargets);
    saveAppData({ profile, habits, rules, goals, logs, milestones, activityLogs, macroLogs, macroTargets: newMacroTargets, journalLogs });
  };

  const handleUpdateJournalLogs = (newJournalLogs) => {
    setJournalLogs(newJournalLogs);
    saveAppData({ profile, habits, rules, goals, logs, milestones, activityLogs, macroLogs, macroTargets, journalLogs: newJournalLogs });
  };

  const handleAddHabit = (newHabit) => {
    const updated = [...habits, newHabit];
    handleUpdateHabits(updated);
  };

  const handleResetAll = () => {
    setProfile(INITIAL_PROFILE);
    setHabits(INITIAL_HABITS);
    setRules(INITIAL_RULES);
    setGoals(INITIAL_GOALS);
    setLogs({});
    setMilestones({});
    setActivityLogs({});
    setMacroLogs({});
    setMacroTargets(INITIAL_MACRO_TARGETS);
    setJournalLogs({});
    saveAppData({ profile: INITIAL_PROFILE, habits: INITIAL_HABITS, rules: INITIAL_RULES, goals: INITIAL_GOALS, logs: {}, milestones: {}, activityLogs: {}, macroLogs: {}, macroTargets: INITIAL_MACRO_TARGETS, journalLogs: {} });
  };

  // Compute stats for header
  const todayKey = getTodayKey();
  const todayLog = logs[todayKey] || { completedHabits: [] };
  const todayCompleted = todayLog.completedHabits ? todayLog.completedHabits.length : 0;
  const todayTotal = habits.length;

  let streak = 0;
  const todayDate = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    
    if (logs[key] && logs[key].completedHabits && logs[key].completedHabits.length > 0) {
      streak += 1;
    } else if (i > 0) {
      break;
    }
  }

  const arcInfo = calculateArcInfo();
  const daysLeft = arcInfo.totalDays - arcInfo.currentDay;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', transition: 'background-color 0.3s ease' }}>
      {/* Desktop App Header TitleBar */}
      <TitleBar currentTheme={currentTheme} onSelectTheme={handleSelectTheme} />

      {/* Main Layout Container (Left Vertical Sidebar + Main Workspace) */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 42px)' }}>
        
        {/* Left Vertical Sidebar */}
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          stats={{
            streak,
            todayCompleted,
            todayTotal,
            daysLeft
          }}
          onOpenMediaModal={() => setShowGlobalMediaModal(true)}
        />

        {/* Main Workspace Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          
          {/* Workspace Header */}
          <WorkspaceHeader
            activeTab={activeTab}
            stats={{
              streak,
              todayCompleted,
              todayTotal,
              daysLeft
            }}
          />

          {/* Active View Container */}
          <main style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'dashboard' && (
              <DashboardView
                habits={habits}
                rules={rules}
                logs={logs}
                onUpdateLogs={handleUpdateLogs}
                onAddHabit={handleAddHabit}
              />
            )}

            {activeTab === 'journal' && (
              <JournalView
                journalLogs={journalLogs}
                onUpdateJournalLogs={handleUpdateJournalLogs}
              />
            )}

            {activeTab === 'activity' && (
              <ActivityLoggerView
                activityLogs={activityLogs}
                onUpdateActivityLogs={handleUpdateActivityLogs}
              />
            )}

            {activeTab === 'macros' && (
              <DailyMacrosView
                macroLogs={macroLogs}
                macroTargets={macroTargets}
                onUpdateMacroLogs={handleUpdateMacroLogs}
                onUpdateMacroTargets={handleUpdateMacroTargets}
              />
            )}

            {activeTab === 'milestones' && (
              <Milestones30View
                milestoneProgress={milestones}
                onUpdateMilestoneProgress={handleUpdateMilestones}
              />
            )}

            {activeTab === 'heatmap' && (
              <HeatmapView
                habits={habits}
                logs={logs}
                onUpdateLogs={handleUpdateLogs}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'media' && (
              <MediaVaultView />
            )}

            {activeTab === 'goals' && (
              <GoalsView
                rules={rules}
                goals={goals}
                onUpdateRules={handleUpdateRules}
                onUpdateGoals={handleUpdateGoals}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                habits={habits}
                logs={logs}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                habits={habits}
                rules={rules}
                goals={goals}
                logs={logs}
                currentTheme={currentTheme}
                onSelectTheme={handleSelectTheme}
                onUpdateHabits={handleUpdateHabits}
                onUpdateLogs={handleUpdateLogs}
                onResetAll={handleResetAll}
              />
            )}
          </main>
        </div>

      </div>

      {/* Global Media Capture Modal */}
      {showGlobalMediaModal && (
        <MediaCaptureModal
          dateKey={todayKey}
          onClose={() => setShowGlobalMediaModal(false)}
          onSaved={() => {}}
        />
      )}
    </div>
  );
}
