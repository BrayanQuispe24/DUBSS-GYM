// src/features/auditoria/types/audit.types.ts

export interface AuditItem {
  id: number;
  user_type?: string | null;
  user_id?: number | null;
  event: 'created' | 'updated' | 'deleted' | 'restored' | 'login' | 'logout' | 'failed_attempt' | 'qr_scan_rejected' | string;
  auditable_type?: string | null;
  auditable_id?: number | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  url?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  tags?: string | null;
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol?: string;
    registro_universitario?: string;
    ci?: string;
  } | null;
}

export interface AuditFilterParams {
  page?: number;
  per_page?: number;
  user_id?: number | string;
  event?: string;
  auditable_type?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
  tags?: string;
}

export interface AuditStats {
  total_events: number;
  events_today: number;
  events_by_type: {
    created: number;
    updated: number;
    deleted: number;
    login: number;
    logout: number;
    other: number;
  };
  daily_volume: Array<{
    date: string;
    count: number;
  }>;
  top_users: Array<{
    user_id: number;
    user_name: string;
    user_email: string;
    role: string;
    count: number;
  }>;
  recent_alerts: number;
}

export interface PaginatedAuditsResponse {
  data: AuditItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

