// src/features/gyms/hooks/useGyms.ts
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGymCroquis, mapDisciplinaToGymService } from '../services/gymService';
import { usePublicLanding } from '@/features/landing/hooks/usePublicLanding';
import type { GymServiceItem } from '@/types';

export const useGymServices = (category?: string) => {
  const landingQuery = usePublicLanding();

  const services = useMemo<GymServiceItem[] | undefined>(() => {
    if (!landingQuery.data) return undefined;

    const mapped = landingQuery.data.disciplinas.map((d) =>
      mapDisciplinaToGymService(d, landingQuery.data.planes)
    );

    if (!category || category === 'all') {
      return mapped;
    }

    return mapped.filter((item) => item.category === category);
  }, [landingQuery.data, category]);

  return {
    data: services,
    isLoading: landingQuery.isLoading,
    isError: landingQuery.isError,
  };
};

export const useGymCroquis = () => {
  return useQuery({
    queryKey: ['gymCroquis'],
    queryFn: getGymCroquis,
  });
};
