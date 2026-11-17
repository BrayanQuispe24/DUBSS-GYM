// src/features/auditoria/services/auditService.ts
import api from '@/services/api';
import type { AuditFilterParams, AuditStats, PaginatedAuditsResponse } from '../types/audit.types';

export const auditService = {
  getAudits: async (params?: AuditFilterParams): Promise<PaginatedAuditsResponse> => {
    const response = await api.get('/audits', { params });
    // Normalize format
    if (response.data?.data && Array.isArray(response.data.data)) {
      return {
        data: response.data.data,
        current_page: response.data.current_page || 1,
        last_page: response.data.last_page || 1,
        per_page: response.data.per_page || 25,
        total: response.data.total ?? response.data.data.length,
        from: response.data.from || 1,
        to: response.data.to || response.data.data.length,
      };
    }
    const arr = Array.isArray(response.data) ? response.data : [];
    return {
      data: arr,
      current_page: 1,
      last_page: 1,
      per_page: arr.length || 25,
      total: arr.length,
      from: 1,
      to: arr.length,
    };
  },

  getAuditStats: async (): Promise<AuditStats> => {
    const response = await api.get('/audits/stats');
    return response.data?.data ?? response.data;
  },

  exportAuditsUrl: (params?: AuditFilterParams): string => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    return `/api/audits/export?${query.toString()}`;
  },
};

