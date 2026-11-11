// src/features/landing/services/landingService.ts
import api from '@/services/api';
import type { PublicLandingData } from '../types/landing.types';

export const getPublicLandingData = async (): Promise<PublicLandingData> => {
  const response = await api.get<{ data: PublicLandingData }>('/public/landing');
  return response.data.data;
};
