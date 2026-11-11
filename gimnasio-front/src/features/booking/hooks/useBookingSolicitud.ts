// src/features/booking/hooks/useBookingSolicitud.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  submitAuthenticatedSolicitud,
  submitGuestSolicitud,
} from '../services/bookingService';

export const useBookingSolicitud = () => {
  const queryClient = useQueryClient();

  const authMutation = useMutation({
    mutationFn: submitAuthenticatedSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicLanding'] });
      queryClient.invalidateQueries({ queryKey: ['formulariosSolicitud'] });
    },
  });

  const guestMutation = useMutation({
    mutationFn: submitGuestSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicLanding'] });
      queryClient.invalidateQueries({ queryKey: ['formulariosSolicitud'] });
    },
  });

  return {
    submitAuthenticated: authMutation,
    submitGuest: guestMutation,
    isPending: authMutation.isPending || guestMutation.isPending,
  };
};
