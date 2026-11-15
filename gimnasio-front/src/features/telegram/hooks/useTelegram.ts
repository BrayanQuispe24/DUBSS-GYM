// src/features/telegram/hooks/useTelegram.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { telegramService } from '../services/telegramService';
import showToast from '@/utils/toast';

export const useTelegramEstado = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['telegram-estado'],
    queryFn: () => telegramService.getEstado(),
    enabled,
    staleTime: 1000 * 30, // 30s
  });
};

export const useSolicitarTelegramToken = () => {
  return useMutation({
    mutationFn: () => telegramService.solicitarToken(),
    onError: (err: any) => {
      showToast.error(
        err.response?.data?.mensaje || err.response?.data?.message || 'Error al generar código de vinculación.',
        'Telegram'
      );
    },
  });
};

export const useDesvincularTelegram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => telegramService.desvincular(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['telegram-estado'] });
      showToast.success(data.mensaje || 'Cuenta de Telegram desvinculada exitosamente.', 'Telegram');
    },
    onError: (err: any) => {
      showToast.error(
        err.response?.data?.mensaje || err.response?.data?.message || 'Error al desvincular cuenta.',
        'Telegram'
      );
    },
  });
};

