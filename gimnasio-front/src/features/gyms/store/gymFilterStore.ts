// src/features/gyms/store/gymFilterStore.ts
import { create } from 'zustand';

interface GymFilterState {
  activeCategory: string;
  selectedZone: string;
  mapTypeFilter: string;
  setActiveCategory: (category: string) => void;
  setSelectedZone: (zone: string) => void;
  setMapTypeFilter: (filter: string) => void;
}

export const useGymFilterStore = create<GymFilterState>((set) => ({
  activeCategory: 'all',
  selectedZone: 'all',
  mapTypeFilter: 'all',
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setMapTypeFilter: (filter) => set({ mapTypeFilter: filter }),
}));
