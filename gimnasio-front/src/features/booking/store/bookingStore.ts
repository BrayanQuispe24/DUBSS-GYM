// src/features/booking/store/bookingStore.ts
import { create } from 'zustand';

export interface OpenBookingOptions {
  spotName?: string;
  price?: string;
  gymTitle?: string;
  disciplinaId?: number;
  horarioId?: number;
  planId?: number;
  prefillRu?: string;
  prefillCi?: string;
  prefillUserType?: 'estudiante' | 'docente' | 'administrativo' | 'particular';
}

interface BookingState {
  isModalOpen: boolean;
  selectedSpot: string | null;
  selectedGymTitle: string;
  selectedPrice: string;
  selectedDisciplinaId?: number;
  selectedHorarioId?: number;
  selectedPlanId?: number;
  prefillRu?: string;
  prefillCi?: string;
  prefillUserType?: 'estudiante' | 'docente' | 'administrativo' | 'particular';
  openModal: (
    spotNameOrOptions?: string | OpenBookingOptions,
    price?: string,
    gymTitle?: string
  ) => void;
  closeModal: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  isModalOpen: false,
  selectedSpot: null,
  selectedGymTitle: 'Gimnasio Universitario D.U.B.S.',
  selectedPrice: 'Tarifa Universitaria UAGRM',
  selectedDisciplinaId: undefined,
  selectedHorarioId: undefined,
  selectedPlanId: undefined,
  prefillRu: undefined,
  prefillCi: undefined,
  prefillUserType: undefined,

  openModal: (spotNameOrOptions, price, gymTitle) => {
    if (typeof spotNameOrOptions === 'object' && spotNameOrOptions !== null) {
      set({
        isModalOpen: true,
        selectedSpot: spotNameOrOptions.spotName || 'Inscripción Gimnasio D.U.B.S.',
        selectedPrice: spotNameOrOptions.price || 'Tarifa Universitaria UAGRM',
        selectedGymTitle: spotNameOrOptions.gymTitle || 'Gimnasio Universitario D.U.B.S.',
        selectedDisciplinaId: spotNameOrOptions.disciplinaId,
        selectedHorarioId: spotNameOrOptions.horarioId,
        selectedPlanId: spotNameOrOptions.planId,
        prefillRu: spotNameOrOptions.prefillRu,
        prefillCi: spotNameOrOptions.prefillCi,
        prefillUserType: spotNameOrOptions.prefillUserType,
      });
      return;
    }

    set({
      isModalOpen: true,
      selectedSpot: spotNameOrOptions || 'Inscripción Gimnasio D.U.B.S.',
      selectedPrice: price || 'Tarifa Universitaria UAGRM',
      selectedGymTitle: gymTitle || 'Gimnasio Universitario D.U.B.S.',
      selectedDisciplinaId: undefined,
      selectedHorarioId: undefined,
      selectedPlanId: undefined,
      prefillRu: undefined,
      prefillCi: undefined,
      prefillUserType: undefined,
    });
  },

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedSpot: null,
      selectedDisciplinaId: undefined,
      selectedHorarioId: undefined,
      selectedPlanId: undefined,
      prefillRu: undefined,
      prefillCi: undefined,
      prefillUserType: undefined,
    }),
}));
