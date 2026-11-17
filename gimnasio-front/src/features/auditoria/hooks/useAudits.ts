// src/features/auditoria/hooks/useAudits.ts
import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/auditService';
import type { AuditFilterParams } from '../types/audit.types';

export const useAudits = (params?: AuditFilterParams) => {
  return useQuery({
    queryKey: ['audits', params],
    queryFn: () => auditService.getAudits(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useAuditStats = () => {
  return useQuery({
    queryKey: ['audits', 'stats'],
    queryFn: () => auditService.getAuditStats(),
    staleTime: 1000 * 60, // 1 minute
  });
};

