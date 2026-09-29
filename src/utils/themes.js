// Stealth Carbon — The Exclusive & Default Theme for Winter ARC

export const THEMES = {
  stealth: {
    id: 'stealth',
    name: 'Stealth Carbon',
    type: 'dark',
    colors: {
      bgApp: '#050505',
      bgCard: '#121212',
      bgCardHover: '#1a1a1a',
      bgHeader: '#0a0a0a',
      bgInput: '#1c1c1c',
      borderSubtle: '#262626',
      borderStrong: '#404040',
      textPrimary: '#f8fafc',
      textSecondary: '#a1a1aa',
      textTertiary: '#71717a',
      accentIce: '#e2e8f0',
      accentIceLight: '#27272a',
      accentIceBorder: '#52525b',
      accentFire: '#f97316',
      accentFireLight: '#3b1406',
      accentEmerald: '#10b981',
      accentEmeraldLight: '#063726',
      accentPurple: '#d8b4fe',
      accentPurpleLight: '#3b0764',
    }
  }
};

export function applyTheme(themeId) {
  const theme = THEMES.stealth;
  const root = document.documentElement;

  Object.entries({
    '--bg-app': theme.colors.bgApp,
    '--bg-card': theme.colors.bgCard,
    '--bg-card-hover': theme.colors.bgCardHover,
    '--bg-header': theme.colors.bgHeader,
    '--bg-input': theme.colors.bgInput,
    '--border-subtle': theme.colors.borderSubtle,
    '--border-strong': theme.colors.borderStrong,
    '--text-primary': theme.colors.textPrimary,
    '--text-secondary': theme.colors.textSecondary,
    '--text-tertiary': theme.colors.textTertiary,
    '--accent-ice': theme.colors.accentIce,
    '--accent-ice-light': theme.colors.accentIceLight,
    '--accent-ice-border': theme.colors.accentIceBorder,
    '--accent-fire': theme.colors.accentFire,
    '--accent-fire-light': theme.colors.accentFireLight,
    '--accent-emerald': theme.colors.accentEmerald,
    '--accent-emerald-light': theme.colors.accentEmeraldLight,
    '--accent-purple': theme.colors.accentPurple,
    '--accent-purple-light': theme.colors.accentPurpleLight,
  }).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });

  try {
    localStorage.setItem('winter_arc_theme', 'stealth');
  } catch (err) {
    console.error('Error saving theme:', err);
  }
}

export function getSavedTheme() {
  return 'stealth';
}
