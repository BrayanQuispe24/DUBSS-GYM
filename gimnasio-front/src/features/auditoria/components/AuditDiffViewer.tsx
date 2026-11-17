// src/features/auditoria/components/AuditDiffViewer.tsx
import React from 'react';
import { ArrowRight, Plus, Minus, Edit3 } from 'lucide-react';

interface AuditDiffViewerProps {
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
  event: string;
}

export const AuditDiffViewer: React.FC<AuditDiffViewerProps> = ({ oldValues, newValues, event }) => {
  const oldObj = oldValues || {};
  const newObj = newValues || {};

  // Combine unique keys from both objects
  const allKeys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)])).sort();

  if (allKeys.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-200 dark:border-slate-800">
        No se registraron diferencias de atributos específicos para este evento ({event}).
      </div>
    );
  }

  const formatVal = (val: any): string => {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  return (
    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-sm">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="py-2 px-3 font-semibold w-1/4">Campo / Atributo</th>
            <th className="py-2 px-3 font-semibold w-5/12">Valor Anterior (Old)</th>
            <th className="py-2 px-3 font-semibold w-1/12 text-center"></th>
            <th className="py-2 px-3 font-semibold w-5/12">Valor Nuevo (New)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#141419]">
          {allKeys.map((key) => {
            const hasOld = key in oldObj;
            const hasNew = key in newObj;
            const valOld = oldObj[key];
            const valNew = newObj[key];
            const isChanged = hasOld && hasNew && JSON.stringify(valOld) !== JSON.stringify(valNew);
            const isAdded = !hasOld && hasNew;
            const isRemoved = hasOld && !hasNew;

            let rowBg = '';
            let icon = <Edit3 size={12} className="text-amber-500 mx-auto" />;

            if (isAdded) {
              rowBg = 'bg-emerald-50/50 dark:bg-emerald-950/20';
              icon = <Plus size={12} className="text-emerald-500 mx-auto" />;
            } else if (isRemoved) {
              rowBg = 'bg-rose-50/50 dark:bg-rose-950/20';
              icon = <Minus size={12} className="text-rose-500 mx-auto" />;
            } else if (isChanged) {
              rowBg = 'bg-amber-50/40 dark:bg-amber-950/15';
            }

            return (
              <tr key={key} className={`${rowBg} transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40`}>
                <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-white">{key}</span>
                </td>
                <td className="py-2 px-3 break-all">
                  {hasOld ? (
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                        isChanged || isRemoved
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 line-through'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {formatVal(valOld)}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">«vacío»</span>
                  )}
                </td>
                <td className="py-2 px-1 text-center">{icon}</td>
                <td className="py-2 px-3 break-all">
                  {hasNew ? (
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        isChanged || isAdded
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {formatVal(valNew)}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">«eliminado»</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

