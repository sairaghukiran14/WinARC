# ❄️ Winter ARC — Daily Protocol & Transformation Desktop App

> **90 Days of Uncompromising Focus, Discipline & Physical Transformation.**
> A modern, offline-first Desktop application built for tracking daily protocols, physical body metrics, nutrition macros, media progress logs, and real-time activity metrics.

---

## 📥 Download & Quick Start

### 1. Download Desktop App Installer (.dmg)
- **Direct Installer Download**: [Download Winter ARC macOS Installer (.dmg)](https://github.com/sairaghukiran14/WinARC/releases/latest)
- **Built Installer Path**: [`dist_electron/Winter ARC-0.0.0-arm64.dmg`](file:///Users/sairaghukiranavula/Projects/Winter%20ARC/dist_electron/Winter%20ARC-0.0.0-arm64.dmg)

### 2. Installation & How to Use (macOS)
1. **Mount Disk Image**: Double-click the downloaded **`Winter ARC-0.0.0-arm64.dmg`** file.
2. **Install**: Drag and drop the **Winter ARC** icon into your **Applications** folder.
3. **Launch**: Press `Cmd + Space` to open **Spotlight**, search for **Winter ARC**, and launch the app.
4. **Use Offline**: All protocol logs, macros, weight trends, and media logs will save automatically on your device via `localStorage` and `IndexedDB`.

> 💡 **macOS Security Note**: If prompted with a first-time security popup, go to **System Settings > Privacy & Security** and select **Open Anyway**.

---

## 🌟 Key Features

### 1. ⚡ Today's Protocol Dashboard
- **Habit Matrix**: Track daily non-negotiables (Wake Up, Workouts, Reading, Hydration, Deep Work, Clean Eating, Journaling).
- **Hardcore Motivational Quotes**: Centered image posters featuring discipline quotes and harsh reality mindset reminders.
- **90-Day Arc Progress**: Live streak tracking, days remaining countdown, and completion percentages.

### 2. 🍗 Daily Nutrition & Macros Tracker
- **4 Core Macro Metrics**: Track **Calories (kcal)**, **Protein (g)**, **Carbs (g)**, and **Fats (g)** in real-time.
- **Interactive Macro Split Ratio**: Interactive Chart.js Doughnut Chart displaying macro ratios.
- **Meal Calorie Distribution Bar Chart**: Meal-by-meal caloric breakdown chart.
- **Custom Goal Targets**: Easily update daily targets (e.g., 2,400 kcal, 180g Protein).

### 3. 📊 Athlete Profile, Weight Trends & BMI Calculator
- **Automated BMI Calculation**: Computes $\text{BMI} = \frac{\text{Weight (kg)}}{\text{Height (m)}^2}$ with automatic unit handling (`kg` or `lbs`).
- **Category Classification**: Classifies metrics into *Underweight*, *Normal (Optimal)*, *Overweight*, or *Obese*.
- **Height-Tailored Ideal Weight Range**: Recommends ideal body weight targets for your exact height.
- **Interactive Weight Trend Line Chart**: Curved progress visualization comparing baseline weight, logged check-ins, and target goal threshold line.

### 4. ⏱️ Everyday Activity Logger
- **Timestamped Action Logs**: Record real-time activities (Gym, Cardio, Deep Work, Meditation, Cold Shower) with precise timestamps.
- **Filter & History**: Search past action entries with category tags.

### 5. 📸 Everyday Media Vault (100% Local Storage)
- **Multi-Media Recording**: Capture progress photos, record video logs, and record audio voice notes directly inside the app.
- **IndexedDB Storage**: Saves high-volume media locally on your device without external cloud dependencies.
- **Confirmation Modals**: Delete media safely with custom confirmation dialogs.

### 6. 🏆 30 Winter ARC Milestones
- **Structured Transformation Roadmap**: 30 tiered milestones from *Level 1: Ground Zero* (5 AM wakeup, 3L water) to *Level 30: Winter Arc Legend* (100km total run, sub 12% body fat).

### 7. 🎯 Rules, Manifesto & Goals
- **Non-Negotiables**: Define strict lifestyle rules (e.g., *No social media before 12 PM*, *Cold showers*).
- **Seasonal Target Goals**: Track multi-month milestones across Fitness, Career, and Mindset.

### 8. 📈 Interactive Analytics & Velocity Charts
- **Weekly Completion Velocity**: Interactive Chart.js bar chart showing 7-day completion percentages.
- **Category Focus Doughnut**: Category distribution visualizer (*Fitness*, *Discipline*, *Mindset*, *Health*, *Focus*).

### 9. 🎨 Stealth Carbon Theme & Custom Dialog Modals
- **Stealth Carbon Aesthetic**: Pitch black `#050505` base, `#121212` matte dark cards, stark silver `#f8fafc` primary action buttons, zero blue hues.
- **Zero Browser Popups**: Native `alert()` and `confirm()` calls are replaced with dark-themed modal overlays.

### 10. 💾 100% Offline Local Storage & Backup Export/Import
- **Complete Offline Privacy**: All data is stored locally via `localStorage` and `IndexedDB`.
- **Full Backup Package**: Single-click Export and Import of your entire protocol data AND media vault items in a single JSON file.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Desktop Runtime**: [Electron 44](https://www.electronjs.org/)
- **Desktop Installer Builder**: [electron-builder](https://www.electron.build/)
- **Charts & Visualizations**: [Chart.js 4](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Local Storage**: `localStorage` (protocol data) + `IndexedDB` (media assets)
- **Styling**: Vanilla CSS Design System with CSS Custom Properties

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.x` or later
- npm `v9.x` or later

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/winter-arc.git
   cd winter-arc
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run Web Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Run Desktop App in Development**:
   ```bash
   npm run electron:dev
   ```

---

## 📦 Building macOS Desktop Release (.dmg)

To package the application into a standalone macOS Desktop Installer (`.dmg`):

```bash
npm run build:mac
```

The release artifact will be generated in:
```
dist_electron/Winter ARC-0.0.0-arm64.dmg
```

---

## 📂 Project Structure

```
Winter ARC/
├── electron/
│   ├── main.js             # Electron main process entry & window config
│   └── preload.js          # Preload script for IPC bridge
├── src/
│   ├── components/
│   │   ├── TitleBar.jsx          # Mac frameless titlebar
│   │   ├── SidebarNav.jsx        # Left vertical sidebar navigation
│   │   ├── WorkspaceHeader.jsx   # Top workspace title & ribbon stats
│   │   ├── DashboardView.jsx     # Protocol habits & quote posters
│   │   ├── DailyMacrosView.jsx   # Nutrition macros tracker & charts
│   │   ├── ProfileView.jsx       # Weight trends, BMI calculator & line chart
│   │   ├── ActivityLoggerView.jsx# Real-time action logger
│   │   ├── Milestones30View.jsx  # 30 Tiered Arc Milestones
│   │   ├── MediaVaultView.jsx    # Photo, video, and audio gallery
│   │   ├── GoalsView.jsx         # Rules manifesto & goals
│   │   ├── AnalyticsView.jsx     # Weekly velocity & category charts
│   │   ├── SettingsView.jsx      # Backup export/import & theme settings
│   │   └── CustomDialogModal.jsx # Dark custom modal popup overlay
│   ├── utils/
│   │   ├── storage.js      # LocalStorage helper functions
│   │   ├── mediaStore.js   # IndexedDB helper for media items
│   │   ├── quotes.js       # Discipline & harsh reality quotes
│   │   └── themes.js       # Stealth Carbon theme definitions
│   ├── App.jsx             # Root layout & tab router
│   ├── main.jsx            # React root mount
│   └── index.css           # Stealth Carbon design system CSS
├── package.json            # Scripts & build configuration
└── README.md               # Project documentation
```

---

## 📜 License

Distributed under the MIT License. Built for dedicated athletes mastering their Winter ARC.
