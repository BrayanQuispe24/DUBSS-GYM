// src/features/auditoria/components/AuditDetailDrawer.tsx
import React from 'react';
import { X, User, Globe, Laptop, Calendar, Tag, Shield, Database, ExternalLink } from 'lucide-react';
import type { AuditItem } from '../types/audit.types';
import { AuditDiffViewer } from './AuditDiffViewer';

interface AuditDetailDrawerProps {
  audit: AuditItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ audit, isOpen, onClose }) => {
  if (!isOpen || !audit) return null;

  const getEventBadge = (event: string) => {
    switch (event.toLowerCase()) {
      case 'created':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300';
      case 'updated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300';
      case 'deleted':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300';
      case 'login':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300';
      case 'logout':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
      case 'failed_attempt':
      case 'qr_scan_rejected':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  const getModelName = (fullClass?: string | null) => {
    if (!fullClass) return 'Sistema / Evento General';
    const parts = fullClass.split('\\');
    return parts[parts.length - 1];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white dark:bg-[#101014] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-200 ease-in-out">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#141419]">
          <div className="flex items-center gap-2">
            <Shield className="text-[#990000] dark:text-[#DC2626]" size={18} />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Detalle de Registro Forense #{audit.id}
            </h3>
            <span
              className={`px-2 py-0.5 text-[11px] font-bold rounded-sm border uppercase ${getEventBadge(
                audit.event
              )}`}
            >
              {audit.event}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-sm bg-slate-50 dark:bg-[#141419] border border-slate-200 dark:border-slate-800 text-xs">
            {/* Responsable */}
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                <User size={13} /> Usuario Responsable
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {audit.user ? `${audit.user.nombre} ${audit.user.apellido}` : 'Sistema / Tarea Automática'}
              </p>
              {audit.user && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {audit.user.email} • Rol: <span className="uppercase font-semibold">{audit.user.rol || 'N/A'}</span>
                </p>
              )}
            </div>

            {/* Fecha / Hora */}
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                <Calendar size={13} /> Fecha y Hora
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {new Date(audit.created_at).toLocaleString('es-BO', {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                })}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ID Auditoría: {audit.id}
              </p>
            </div>

            {/* Entidad / Modelo */}
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                <Database size={13} /> Entidad Afectada
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {getModelName(audit.auditable_type)}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Registro ID: <span className="font-mono">{audit.auditable_id || 'N/A'}</span>
              </p>
            </div>

            {/* IP y Etiquetas */}
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                <Globe size={13} /> Dirección IP & Tags
              </span>
              <p className="font-mono text-slate-800 dark:text-slate-100 font-bold">
                {audit.ip_address || '127.0.0.1'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Tag size={10} /> Categoría: <span className="font-semibold uppercase">{audit.tags || 'General'}</span>
              </p>
            </div>
          </div>

          {/* Endpoint URL & User Agent */}
          <div className="p-3 rounded-sm bg-slate-50 dark:bg-[#141419] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[11px] mb-0.5">
                Ruta / Endpoint HTTP:
              </span>
              <code className="text-slate-800 dark:text-slate-200 font-mono text-[11px] bg-slate-200/50 dark:bg-slate-800/80 px-1.5 py-0.5 rounded break-all">
                {audit.url || '/api/action'}
              </code>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[11px] mb-0.5">
                User Agent / Navegador:
              </span>
              <p className="text-slate-600 dark:text-slate-400 font-mono text-[10px] break-all">
                {audit.user_agent || 'Unknown Client'}
              </p>
            </div>
          </div>

          {/* Diff Viewer (Antes y Después) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Comparación de Cambios (Audit Diff)</span>
            </h4>
            <AuditDiffViewer oldValues={audit.old_values} newValues={audit.new_values} event={audit.event} />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141419] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-colors"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};

