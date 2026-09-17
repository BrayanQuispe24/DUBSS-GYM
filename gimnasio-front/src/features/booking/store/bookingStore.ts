// src/features/booking/store/bookingStore.ts
import { create } from 'zustand';

interface BookingState {
  isModalOpen: boolean;
  selectedSpot: string | null;
  selectedGymTitle: string;
  selectedPrice: string;
  openModal: (spotName?: string, price?: string, gymTitle?: string) => void;
  closeModal: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  isModalOpen: false,
  selectedSpot: null,
  selectedGymTitle: 'Pase de Entrenamiento FitGo',
  selectedPrice: 'Bs. 25 / día',
  
  openModal: (spotName, price, gymTitle) => set({
    isModalOpen: true,
    selectedSpot: spotName || 'Entrenamiento Libre',
    selectedPrice: price || 'Bs. 25 / día',
    selectedGymTitle: gymTitle || 'Gimnasio Equipetrol Central',
  }),

  closeModal: () => set({ isModalOpen: false, selectedSpot: null }),
}));
