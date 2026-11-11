// src/features/dashboard/utils/biFormatters.ts

export const formatBs = (amount: number): string => {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `Bs. ${safe.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCompactNumber = (value: number): string => {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString('es-BO');
};

export const formatDateTimeShort = (raw?: string | null): string => {
  if (!raw) return '—';
  const parsed = new Date(raw.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) {
    return raw.slice(0, 16);
  }
  return parsed.toLocaleString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

