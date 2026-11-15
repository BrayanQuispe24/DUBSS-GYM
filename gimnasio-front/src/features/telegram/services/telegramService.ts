// src/features/telegram/services/telegramService.ts
import api from '@/services/api';

export interface TelegramEstadoResponse {
  success: boolean;
  vinculado: boolean;
  telegram_chat_id: string | null;
  mensaje: string;
}

export interface TelegramTokenData {
  token: string;
  expires_at: string;
  expires_in_minutes: number;
  bot_username: string;
  deep_link: string;
}

export interface TelegramTokenResponse {
  success: boolean;
  mensaje: string;
  data: TelegramTokenData;
}

export interface TelegramDesvincularResponse {
  success: boolean;
  mensaje: string;
}

export const telegramService = {
  async getEstado(): Promise<TelegramEstadoResponse> {
    const res = await api.get<TelegramEstadoResponse>('/cliente/telegram/estado');
    return res.data;
  },

  async solicitarToken(): Promise<TelegramTokenResponse> {
    const res = await api.post<TelegramTokenResponse>('/cliente/telegram/solicitar-token');
    return res.data;
  },

  async desvincular(): Promise<TelegramDesvincularResponse> {
    const res = await api.delete<TelegramDesvincularResponse>('/cliente/telegram/desvincular');
    return res.data;
  },
};

