// src/features/dashboard/components/BiMovementsTable.tsx
import React, { useMemo } from 'react';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useBiMovimientos } from '../hooks/useBiDashboard';
import { useDashboardFiltersStore } from '../store/dashboardFiltersStore';
import type { BiMovimientoRow, BiTipoDetalle } from '../types/bi.types';
import { formatBs, formatDateTimeShort } from '../utils/biFormatters';

const TIPO_BADGE: Record<BiMovimientoRow['tipo_registro'], { label: string; cls: string }> = {
  ingreso: {
    label: 'INGRESO',
    cls: 'bg-red-50 dark:bg-red-950/40 text-[#990000] dark:text-red-400 border-red-200 dark:border-red-900/50',
  },
  inscripcion: {
    label: 'INSCRIPCIÓN',
    cls: 'bg-zinc-100 dark:bg-[#23232D] text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-[#383846]',
  },
  solicitud: {
    label: 'SOLICITUD',
    cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  },
};

const ESTADO_BADGE: Record<string, string> = {
  completado: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
  activo: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
  aprobado: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
  pendiente: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  rechazado: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
};

const BiMovementsTable: React.FC = () => {
  const {
    desde,
    hasta,
    id_disciplina,
    metodo_pago,
    estado_solicitud,
    granularidad,
    tipo_detalle,
    search,
    sort_by,
    sort_dir,
    page,
    per_page,
    setTipoDetalle,
    setSearch,
    setSorting,
    setPage,
    setPerPage,
  } = useDashboardFiltersStore();

  const { data, isLoading, isFetching } = useBiMovimientos({
    desde,
    hasta,
    id_disciplina,
    metodo_pago,
    estado_solicitud,
    granularidad,
    tipo_detalle,
    search,
    sort_by,
    sort_dir,
    page,
    per_page,
  });

  const rows = data?.data ?? [];
  const meta = data?.meta ?? {
    current_page: 1,
    last_page: 1,
    per_page,
    total: 0,
    from: 0,
    to: 0,
  };

  const sorting: SortingState = useMemo(
    () => [{ id: sort_by, desc: sort_dir === 'desc' }],
    [sort_by, sort_dir]
  );

  const columns = useMemo<ColumnDef<BiMovimientoRow>[]>(
    () => [
      {
        accessorKey: 'tipo_registro',
        header: 'TIPO',
        cell: ({ row }) => {
          const cfg = TIPO_BADGE[row.original.tipo_registro];
          return (
            <span className={`inline-flex px-1.5 py-0.5 rounded-sm border text-tiny font-bold ${cfg.cls}`}>
              {cfg.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'fecha',
        header: 'FECHA',
        cell: ({ row }) => (
          <span className="text-zinc-600 dark:text-zinc-400 font-mono text-small">
            {formatDateTimeShort(row.original.fecha)}
          </span>
        ),
      },
      {
        accessorKey: 'referencia',
        header: 'REFERENCIA',
        cell: ({ row }) => (
          <span className="font-bold text-zinc-950 dark:text-white">{row.original.referencia}</span>
        ),
      },
      {
        accessorKey: 'usuario',
        header: 'SOCIO / USUARIO',
        cell: ({ row }) => <span className="text-zinc-700 dark:text-zinc-300">{row.original.usuario}</span>,
      },
      {
        accessorKey: 'disciplina',
        header: 'DISCIPLINA',
        cell: ({ row }) => (
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{row.original.disciplina}</span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'ESTADO',
        cell: ({ row }) => {
          const est = row.original.estado.toLowerCase();
          const cls = ESTADO_BADGE[est] ?? 'bg-zinc-100 dark:bg-[#23232D] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#383846]';
          return (
            <span className={`inline-flex px-1.5 py-0.5 rounded-sm border text-tiny font-bold uppercase ${cls}`}>
              {row.original.estado}
            </span>
          );
        },
      },
      {
        accessorKey: 'monto',
        header: () => <div className="text-right">MONTO</div>,
        cell: ({ row }) => (
          <div className="text-right font-bold text-zinc-950 dark:text-white">
            {formatBs(row.original.monto)}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    manualSorting: true,
    manualPagination: true,
    pageCount: meta.last_page,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      if (next.length > 0) {
        setSorting(next[0].id, next[0].desc ? 'desc' : 'asc');
      }
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white dark:bg-[#141419] rounded-sm border border-zinc-200 dark:border-[#272732] shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-zinc-200 dark:border-[#272732] bg-white dark:bg-[#141419] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por boleta, socio, disciplina o estado..."
            className="w-full pl-9 pr-8 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#990000] dark:focus:border-red-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-small text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
              Origen:
            </span>
            <select
              value={tipo_detalle}
              onChange={(e) => setTipoDetalle(e.target.value as BiTipoDetalle)}
              className="px-2.5 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#990000] dark:focus:border-red-500 cursor-pointer"
            >
              <option value="todos">Todos los registros</option>
              <option value="ingresos">Ingresos (Boletas Pago)</option>
              <option value="inscripciones">Boletas de Inscripción</option>
              <option value="solicitudes">Solicitudes de Trámite</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-small text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
              Filas:
            </span>
            <select
              value={per_page}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="px-2 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#990000] dark:focus:border-red-500 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                className="bg-zinc-50 dark:bg-[#1A1A22] border-b border-zinc-200 dark:border-[#272732] text-small font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 select-none"
              >
                {hg.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="py-3 px-4 cursor-pointer hover:text-[#990000] dark:hover:text-red-400 transition-colors"
                    >
                      <div className="inline-flex items-center gap-1.5">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === 'asc' ? (
                          <ArrowUp size={12} className="text-[#990000] dark:text-red-400" />
                        ) : sorted === 'desc' ? (
                          <ArrowDown size={12} className="text-[#990000] dark:text-red-400" />
                        ) : (
                          <ArrowUpDown size={11} className="text-zinc-300 dark:text-zinc-600" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-[#272732] text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-zinc-400 dark:text-zinc-500">
                  Cargando registros analíticos desde servidor...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-zinc-400 dark:text-zinc-500">
                  No se encontraron registros para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="bg-white dark:bg-[#141419] hover:bg-zinc-50 dark:hover:bg-[#1C1C24] transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2.5 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="block md:hidden p-3 space-y-2.5 bg-zinc-50 dark:bg-[#0B0B0D]">
        {rows.map((item) => {
          const cfg = TIPO_BADGE[item.tipo_registro];
          return (
            <div
              key={item.id}
              className="p-3 rounded-sm border border-zinc-200 dark:border-[#272732] bg-white dark:bg-[#141419] space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-1.5 py-0.5 rounded-sm border text-tiny font-bold ${cfg.cls}`}>
                  {cfg.label}
                </span>
                <span className="font-bold text-zinc-950 dark:text-white text-xs">{formatBs(item.monto)}</span>
              </div>
              <div className="font-bold text-zinc-950 dark:text-white text-xs">
                {item.referencia} — {item.usuario}
              </div>
              <div className="flex items-center justify-between text-small text-zinc-500 dark:text-zinc-400">
                <span>{item.disciplina}</span>
                <span>{formatDateTimeShort(item.fecha)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-zinc-200 dark:border-[#272732] bg-zinc-50 dark:bg-[#1A1A22] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <div>
          Mostrando <strong>{meta.from}</strong> - <strong>{meta.to}</strong> de{' '}
          <strong>{meta.total}</strong> registros
          {isFetching && !isLoading && (
            <span className="ml-2 text-[#990000] dark:text-red-400 font-semibold">Actualizando...</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-sm border border-zinc-200 dark:border-[#383846] bg-white dark:bg-[#141419] text-zinc-700 dark:text-zinc-200 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="min-w-[28px] h-7 px-2 rounded-sm text-xs font-bold flex items-center justify-center bg-[#990000] text-white">
            {meta.current_page} / {meta.last_page}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(meta.last_page, page + 1))}
            disabled={page >= meta.last_page}
            className="p-1.5 rounded-sm border border-zinc-200 dark:border-[#383846] bg-white dark:bg-[#141419] text-zinc-700 dark:text-zinc-200 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiMovementsTable;
