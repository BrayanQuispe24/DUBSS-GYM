// src/features/dashboard/components/ChartCard.tsx
import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'Sin datos para los filtros seleccionados',
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm shadow-sm flex flex-col overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-[#272732] flex items-start justify-between gap-2 bg-zinc-50/70 dark:bg-[#1A1A22]">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-small text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-center min-h-[260px]">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-zinc-100 dark:bg-[#1C1C24] rounded-sm w-1/3" />
            <div className="h-44 bg-zinc-100 dark:bg-[#1C1C24] rounded-sm w-full" />
          </div>
        ) : isEmpty ? (
          <div className="py-12 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;
