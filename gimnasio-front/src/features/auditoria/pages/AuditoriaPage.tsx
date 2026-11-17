// src/features/auditoria/pages/AuditoriaPage.tsx
import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Calendar,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Activity,
  Layers,
  User,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Database
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { useAudits, useAuditStats } from '../hooks/useAudits';
import type { AuditItem, AuditFilterParams } from '../types/audit.types';
import { AuditDetailDrawer } from '../components/AuditDetailDrawer';
import { useAuthStore } from '@/store/authStore';
import ExcelJS from 'exceljs';
import showToast from '@/utils/toast';

const AuditoriaPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'trail' | 'stats'>('trail');

  // Filter state
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(25);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterEvent, setFilterEvent] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  // Selected audit for drawer
  const [selectedAudit, setSelectedAudit] = useState<AuditItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Queries
  const filterParams: AuditFilterParams = useMemo(
    () => ({
      page,
      per_page: perPage,
      search: searchTerm.trim() || undefined,
      event: filterEvent || undefined,
      auditable_type: filterType || undefined,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
    }),
    [page, perPage, searchTerm, filterEvent, filterType, fechaDesde, fechaHasta]
  );

  const { data: auditsData, isLoading, isFetching, refetch } = useAudits(filterParams);
  const { data: statsData, isLoading: isLoadingStats } = useAuditStats();

  const audits = auditsData?.data || [];
  const totalRecords = auditsData?.total || 0;
  const lastPage = auditsData?.last_page || 1;

  // Handle row selection
  const handleViewDetail = (item: AuditItem) => {
    setSelectedAudit(item);
    setIsDrawerOpen(true);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterEvent('');
    setFilterType('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(1);
  };

  // Export to Excel using exceljs
  const handleExportExcel = async () => {
    try {
      showToast.info('Generando libro de auditoría Excel...');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Bitácora de Auditoría');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Fecha y Hora', key: 'fecha', width: 22 },
        { header: 'Evento', key: 'evento', width: 15 },
        { header: 'Usuario', key: 'usuario', width: 28 },
        { header: 'Rol', key: 'rol', width: 18 },
        { header: 'Módulo / Entidad', key: 'modulo', width: 25 },
        { header: 'ID Registro', key: 'entidad_id', width: 14 },
        { header: 'IP Origen', key: 'ip', width: 18 },
        { header: 'Endpoint URL', key: 'url', width: 35 },
      ];

      // Styling header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF990000' }, // UAGRM Crimson
      };

      audits.forEach((item) => {
        const u = item.user;
        const modName = item.auditable_type ? item.auditable_type.split('\\').pop() : 'Sistema';
        worksheet.addRow({
          id: item.id,
          fecha: new Date(item.created_at).toLocaleString('es-BO'),
          evento: item.event.toUpperCase(),
          usuario: u ? `${u.nombre} ${u.apellido} (${u.email})` : 'Sistema',
          rol: u?.rol || 'N/A',
          modulo: modName,
          entidad_id: item.auditable_id || 'N/A',
          ip: item.ip_address || '127.0.0.1',
          url: item.url || '/api',
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bitacora_auditoria_dubss_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast.success('Libro de auditoría exportado exitosamente');
    } catch (err) {
      console.error(err);
      showToast.error('Error al exportar la bitácora');
    }
  };

  const getEventBadge = (event: string) => {
    switch (event.toLowerCase()) {
      case 'created':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'updated':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'deleted':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'login':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'logout':
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  // ECharts Options
  const dailyVolumeChartOption = useMemo(() => {
    const list = statsData?.daily_volume || [];
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: list.map((item) => item.date),
        axisLine: { lineStyle: { color: '#64748B' } },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#64748B' } },
        splitLine: { lineStyle: { color: 'rgba(100, 116, 139, 0.15)' } },
      },
      series: [
        {
          name: 'Operaciones',
          type: 'line',
          smooth: true,
          data: list.map((item) => item.count),
          itemStyle: { color: '#DC2626' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(220, 38, 38, 0.35)' },
                { offset: 1, color: 'rgba(220, 38, 38, 0.02)' },
              ],
            },
          },
        },
      ],
    };
  }, [statsData]);

  const eventDistributionOption = useMemo(() => {
    const types = statsData?.events_by_type || { created: 0, updated: 0, deleted: 0, login: 0, logout: 0, other: 0 };
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: '0', textStyle: { color: '#94A3B8' } },
      series: [
        {
          name: 'Distribución',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#141419',
            borderWidth: 2,
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 13, fontWeight: 'bold' },
          },
          data: [
            { value: types.created, name: 'Creaciones (Insert)', itemStyle: { color: '#22C55E' } },
            { value: types.updated, name: 'Modificaciones (Update)', itemStyle: { color: '#3B82F6' } },
            { value: types.deleted, name: 'Eliminaciones (Delete)', itemStyle: { color: '#EF4444' } },
            { value: types.login, name: 'Inicios de Sesión', itemStyle: { color: '#A855F7' } },
            { value: types.other, name: 'Otros / Seguridad', itemStyle: { color: '#F59E0B' } },
          ],
        },
      ],
    };
  }, [statsData]);

  return (
    <div className="space-y-5">
      {/* Page Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="text-[#990000] dark:text-[#DC2626]" size={22} />
            Módulo de Auditoría & Bitácora Forense
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registro cronológico inmutable de operaciones, autenticaciones y mutaciones en DUBSS-GYM.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#141419] p-1 rounded-sm border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('trail')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 ${activeTab === 'trail'
                ? 'bg-white dark:bg-[#272732] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Layers size={13} /> Bitácora de Eventos
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 ${activeTab === 'stats'
                ? 'bg-white dark:bg-[#272732] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Activity size={13} /> Analítica & Métricas
          </button>
        </div>
      </div>

      {activeTab === 'trail' ? (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white dark:bg-[#141419] p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="md:col-span-4 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por usuario, C.I., IP o ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1A1A22] text-slate-900 dark:text-white focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Event filter */}
              <div className="md:col-span-2">
                <select
                  value={filterEvent}
                  onChange={(e) => {
                    setFilterEvent(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1A1A22] text-slate-900 dark:text-white focus:outline-none focus:border-[#990000]"
                >
                  <option value="">Todos los Eventos</option>
                  <option value="created">Creación (Created)</option>
                  <option value="updated">Actualización (Updated)</option>
                  <option value="deleted">Eliminación (Deleted)</option>
                  <option value="login">Inicio de Sesión (Login)</option>
                  <option value="logout">Cierre de Sesión (Logout)</option>
                </select>
              </div>

              {/* Module filter */}
              <div className="md:col-span-2">
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1A1A22] text-slate-900 dark:text-white focus:outline-none focus:border-[#990000]"
                >
                  <option value="">Todas las Entidades</option>
                  <option value="Usuario">Usuarios</option>
                  <option value="BoletaPago">Boletas de Pago</option>
                  <option value="BoletaInscripcion">Inscripciones</option>
                  <option value="Tarifa">Tarifas y Planes</option>
                  <option value="Equipo">Equipos / Inventario</option>
                  <option value="RegistroEntradaSalida">Control de Garita QR</option>
                </select>
              </div>

              {/* Dates */}
              <div className="md:col-span-2">
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-2 py-1.5 text-xs rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1A1A22] text-slate-900 dark:text-white focus:outline-none"
                  title="Fecha Desde"
                />
              </div>

              <div className="md:col-span-2">
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-2 py-1.5 text-xs rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1A1A22] text-slate-900 dark:text-white focus:outline-none"
                  title="Fecha Hasta"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Limpiar Filtros
                </button>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <RefreshCw size={11} className={isFetching ? 'animate-spin' : ''} />
                  Actualizar
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  className="btn-enterprise-primary text-[11px] px-3 py-1 flex items-center gap-1.5"
                  title="Exportar registros filtrados a formato Excel"
                >
                  <FileSpreadsheet size={13} />
                  Exportar a Excel
                </button>
              </div>
            </div>
          </div>

          {/* Enterprise High-Density Table */}
          <div className="bg-white dark:bg-[#141419] rounded-sm border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0B0B0D] text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3">Fecha / Hora</th>
                    <th className="py-2.5 px-3">Usuario Responsable</th>
                    <th className="py-2.5 px-3">Acción</th>
                    <th className="py-2.5 px-3">Entidad Afectada</th>
                    <th className="py-2.5 px-3">ID Reg.</th>
                    <th className="py-2.5 px-3">IP Origen</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#990000]" />
                        Cargando registros de auditoría...
                      </td>
                    </tr>
                  ) : audits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-500">
                        No se encontraron registros de auditoría con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    audits.map((item) => {
                      const modName = item.auditable_type
                        ? item.auditable_type.split('\\').pop()
                        : 'Sistema / General';
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          {/* Fecha */}
                          <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            {new Date(item.created_at).toLocaleString('es-BO', {
                              dateStyle: 'short',
                              timeStyle: 'medium',
                            })}
                          </td>

                          {/* Usuario */}
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {item.user ? `${item.user.nombre} ${item.user.apellido}` : 'Sistema'}
                            </div>
                            {item.user && (
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {item.user.email}
                              </div>
                            )}
                          </td>

                          {/* Evento */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-sm border uppercase ${getEventBadge(
                                item.event
                              )}`}
                            >
                              {item.event}
                            </span>
                          </td>

                          {/* Entidad */}
                          <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                            {modName}
                          </td>

                          {/* ID Registro */}
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                            {item.auditable_id || '—'}
                          </td>

                          {/* IP */}
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {item.ip_address || '127.0.0.1'}
                          </td>

                          {/* Botón Ver Detalle */}
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleViewDetail(item)}
                              className="px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-white hover:bg-[#990000] dark:hover:bg-[#DC2626] rounded-sm border border-slate-200 dark:border-slate-800 transition-colors inline-flex items-center gap-1"
                            >
                              <Eye size={12} /> Detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0B0D] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
              <span className="text-slate-500 dark:text-slate-400">
                Mostrando <strong className="text-slate-800 dark:text-white">{audits.length}</strong> de{' '}
                <strong className="text-slate-800 dark:text-white">{totalRecords}</strong> registros
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 text-xs rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141419] text-slate-900 dark:text-white"
                >
                  <option value={15}>15 por pág.</option>
                  <option value={25}>25 por pág.</option>
                  <option value={50}>50 por pág.</option>
                  <option value={100}>100 por pág.</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="px-2.5 py-1 text-xs rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141419] text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Anterior
                  </button>
                  <span className="px-2 font-semibold text-slate-800 dark:text-white">
                    {page} / {lastPage}
                  </span>
                  <button
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
                    className="px-2.5 py-1 text-xs rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141419] text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: BI & Stats */
        <div className="space-y-5">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-sm bg-white dark:bg-[#141419] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Operaciones Registradas
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {statsData?.total_events ?? totalRecords}
              </p>
            </div>

            <div className="p-4 rounded-sm bg-white dark:bg-[#141419] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Operaciones Hoy
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {statsData?.events_today ?? 0}
              </p>
            </div>

            <div className="p-4 rounded-sm bg-white dark:bg-[#141419] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Inicios de Sesión
              </span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {statsData?.events_by_type?.login ?? 0}
              </p>
            </div>

            <div className="p-4 rounded-sm bg-white dark:bg-[#141419] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Alertas / Fallos de Seguridad
              </span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {statsData?.recent_alerts ?? 0}
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 p-4 rounded-sm bg-white dark:bg-[#141419] border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Volumen Cronológico de Modificaciones
              </h3>
              <ReactECharts option={dailyVolumeChartOption} style={{ height: '280px' }} />
            </div>

            <div className="lg:col-span-4 p-4 rounded-sm bg-white dark:bg-[#141419] border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Distribución por Tipo de Acción
              </h3>
              <ReactECharts option={eventDistributionOption} style={{ height: '280px' }} />
            </div>
          </div>

          {/* Top Users Table */}
          <div className="p-4 rounded-sm bg-white dark:bg-[#141419] border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Usuarios con Mayor Actividad Registrada
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <th className="py-2 px-3">Usuario</th>
                    <th className="py-2 px-3">Correo</th>
                    <th className="py-2 px-3">Rol</th>
                    <th className="py-2 px-3 text-right">Total Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {(statsData?.top_users || []).map((u) => (
                    <tr key={u.user_id}>
                      <td className="py-2 px-3 font-semibold text-slate-800 dark:text-white">
                        {u.user_name}
                      </td>
                      <td className="py-2 px-3 text-slate-500 dark:text-slate-400 font-mono">
                        {u.user_email}
                      </td>
                      <td className="py-2 px-3 uppercase text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {u.role}
                      </td>
                      <td className="py-2 px-3 text-right font-black text-[#990000] dark:text-[#DC2626]">
                        {u.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <AuditDetailDrawer
        audit={selectedAudit}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedAudit(null);
        }}
      />
    </div>
  );
};

export default AuditoriaPage;
