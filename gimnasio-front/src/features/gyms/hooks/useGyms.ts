// src/features/gyms/hooks/useGyms.ts
import { useQuery } from '@tanstack/react-query';
import { getGymServices, getGymCroquis } from '../services/gymService';

export const useGymServices = (category?: string) => {
  return useQuery({
    queryKey: ['gymServices', category],
    queryFn: () => getGymServices(category),
  });
};

export const useGymCroquis = () => {
  return useQuery({
    queryKey: ['gymCroquis'],
    queryFn: getGymCroquis,
  });
};
