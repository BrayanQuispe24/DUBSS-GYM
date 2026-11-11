// src/features/landing/hooks/usePublicLanding.ts
import { useQuery } from '@tanstack/react-query';
import { getPublicLandingData } from '../services/landingService';

export const usePublicLanding = () => {
  return useQuery({
    queryKey: ['publicLanding'],
    queryFn: getPublicLandingData,
    staleTime: 60_000,
    retry: 1,
  });
};
