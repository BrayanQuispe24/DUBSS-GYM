// src/store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isUserMenuOpen: boolean;
  toggleUserMenu: () => void;
  closeUserMenu: () => void;
  activeRoleTab: 'socio' | 'gimnasio' | 'entrenador' | 'instructor';
  setActiveRoleTab: (role: 'socio' | 'gimnasio' | 'entrenador' | 'instructor') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isUserMenuOpen: false,
  toggleUserMenu: () => set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
  closeUserMenu: () => set({ isUserMenuOpen: false }),

  activeRoleTab: 'socio',
  setActiveRoleTab: (role) => set({ activeRoleTab: role }),
}));
