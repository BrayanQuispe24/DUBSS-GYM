// src/store/uiStore.ts
import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';
export type FontScaleKey = 'sm' | 'md' | 'lg' | 'xl';

export const FONT_SCALES: Record<FontScaleKey, { label: string; px: number; pct: number }> = {
  sm: { label: '90%', px: 14.5, pct: 90 },
  md: { label: '100%', px: 16, pct: 100 },
  lg: { label: '112%', px: 18, pct: 112.5 },
  xl: { label: '125%', px: 20, pct: 125 },
};

export const FONT_SCALE_ORDER: FontScaleKey[] = ['sm', 'md', 'lg', 'xl'];

const THEME_STORAGE_KEY = 'fitgo_theme';
const FONT_STORAGE_KEY = 'fitgo_font_scale';

function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

function readStoredFontScale(): FontScaleKey {
  if (typeof window === 'undefined') return 'md';
  const stored = window.localStorage.getItem(FONT_STORAGE_KEY) as FontScaleKey | null;
  return stored && stored in FONT_SCALES ? stored : 'md';
}

export function applyDocumentPreferences(theme: ThemeMode, fontScale: FontScaleKey): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
  root.style.fontSize = `${FONT_SCALES[fontScale].px}px`;
}

const initialTheme = readStoredTheme();
const initialFontScale = readStoredFontScale();
applyDocumentPreferences(initialTheme, initialFontScale);

interface UIState {
  isUserMenuOpen: boolean;
  toggleUserMenu: () => void;
  closeUserMenu: () => void;
  activeRoleTab: 'socio' | 'gimnasio' | 'entrenador' | 'instructor';
  setActiveRoleTab: (role: 'socio' | 'gimnasio' | 'entrenador' | 'instructor') => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  fontScale: FontScaleKey;
  setFontScale: (scale: FontScaleKey) => void;
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
  resetFontScale: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isUserMenuOpen: false,
  toggleUserMenu: () => set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
  closeUserMenu: () => set({ isUserMenuOpen: false }),

  activeRoleTab: 'socio',
  setActiveRoleTab: (role) => set({ activeRoleTab: role }),

  theme: initialTheme,
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    applyDocumentPreferences(theme, get().fontScale);
    set({ theme });
  },
  toggleTheme: () => {
    const next: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  fontScale: initialFontScale,
  setFontScale: (fontScale) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(FONT_STORAGE_KEY, fontScale);
    }
    applyDocumentPreferences(get().theme, fontScale);
    set({ fontScale });
  },
  increaseFontScale: () => {
    const idx = FONT_SCALE_ORDER.indexOf(get().fontScale);
    if (idx < FONT_SCALE_ORDER.length - 1) {
      get().setFontScale(FONT_SCALE_ORDER[idx + 1]);
    }
  },
  decreaseFontScale: () => {
    const idx = FONT_SCALE_ORDER.indexOf(get().fontScale);
    if (idx > 0) {
      get().setFontScale(FONT_SCALE_ORDER[idx - 1]);
    }
  },
  resetFontScale: () => {
    get().setFontScale('md');
  },
}));
