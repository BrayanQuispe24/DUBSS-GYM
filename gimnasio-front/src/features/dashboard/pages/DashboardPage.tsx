// src/features/dashboard/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3, QrCode, TableProperties } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBoletasInscripcion } from '@/features/tramites/hooks/useTramites';
import CodigoQRInscripcionModal from '@/features/tramites/components/CodigoQRInscripcionModal';
import EscanerQRModal from '@/features/accesos/components/EscanerQRModal';
import showToast from '@/utils/toast';
import AforoDisciplinaChart from '../charts/AforoDisciplinaChart';
import IngresosDisciplinaDonut from '../charts/IngresosDisciplinaDonut';
import IngresosEvolucionChart from '../charts/IngresosEvolucionChart';
import InscripcionesDisciplinaChart from '../charts/InscripcionesDisciplinaChart';
import SolicitudesEstadoDonut from '../charts/SolicitudesEstadoDonut';
import BiMovementsTable from '../components/BiMovementsTable';
import ChartCard from '../components/ChartCard';
import ExportButtons from '../components/ExportButtons';
import GlobalFiltersBar from '../components/GlobalFiltersBar';
import HeroIngresosCard from '../components/HeroIngresosCard';
import KpiSummaryGrid from '../components/KpiSummaryGrid';
import SolicitudesStatusSummary from '../components/SolicitudesStatusSummary';
import {
  useBiAforoTiempoReal,
  useBiDistribucion,
  useBiResumen,
  useBiSeries,
} from '../hooks/useBiDashboard';
import { useDashboardFiltersStore } from '../store/dashboardFiltersStore';
import { formatDateTimeShort } from '../utils/biFormatters';

type DashboardTab = 'overview' | 'detail';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const rol = user?.rol || '';
  const canViewBi = rol === 'administrador' || rol === 'recepcionista';

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  const {
    desde,
    hasta,
    id_disciplina,
    metodo_pago,
    estado_solicitud,
    granularidad,
  } = useDashboardFiltersStore();

  const globalFilters = {
    desde,
    hasta,
    id_disciplina,
    metodo_pago,
    estado_solicitud,
    granularidad,
  };

  const resumenQuery = useBiResumen(globalFilters, canViewBi);
  const seriesQuery = useBiSeries(globalFilters, canViewBi);
  const distribucionQuery = useBiDistribucion(globalFilters, canViewBi);
  const aforoLiveQuery = useBiAforoTiempoReal(id_disciplina, canViewBi);

  const { data: rawInscData } = useBoletasInscripcion();

  if (rol === 'cliente') {
    return <Navigate to="/dashboard/planes" replace />;
  }

  if (rol === 'instructor') {
    return <Navigate to="/dashboard/ejercicios" replace />;
  }

  const inscripciones = Array.isArray(rawInscData)
    ? rawInscData
    : Array.isArray((rawInscData as { data?: unknown[] } | undefined)?.data)
      ? ((rawInscData as unknown as { data: unknown[] }).data)
      : [];

  const userBoleta =
    (inscripciones as Array<Record<string, unknown>>).find(
      (b) => String(b.id_usuario) === String(user?.id)
    ) ||
    (inscripciones[0] as Record<string, unknown> | undefined) ||
    null;

  const handleOpenQR = () => {
    if (!userBoleta) {
      showToast.info('Aún no tienes una Boleta de Inscripción activa generada.');
      return;
    }
    setIsQRModalOpen(true);
  };

  const resumen = resumenQuery.data;
  const series = seriesQuery.data;
  const distribucion = distribucionQuery.data;
  const aforoPorDisciplina =
    aforoLiveQuery.data?.por_disciplina ?? series?.aforo_por_disciplina ?? [];

  return (
    <section className="space-y-4">
      {/* Top Action Bar & Enterprise Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-zinc-200 dark:border-[#272732] pb-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-[#990000] dark:border-red-500 text-[#990000] dark:text-red-400'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <BarChart3 size={15} />
            Resumen Ejecutivo BI
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'detail'
                ? 'border-[#990000] dark:border-red-500 text-[#990000] dark:text-red-400'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <TableProperties size={15} />
            Detalle de Registros
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons />

          <button
            type="button"
            onClick={() => setIsScannerModalOpen(true)}
            className="px-3 py-1.5 rounded-sm bg-[#990000] hover:bg-[#B91C1C] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <QrCode size={14} />
            <span>Validar QR</span>
          </button>

          <button
            type="button"
            onClick={handleOpenQR}
            className="px-3 py-1.5 rounded-sm border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] hover:bg-zinc-50 dark:hover:bg-[#21212B] text-zinc-700 dark:text-zinc-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <QrCode size={14} />
            <span>Mi Pase QR</span>
          </button>
        </div>
      </div>

      {/* Global Shared Filters */}
      <GlobalFiltersBar
        disciplinas={resumen?.catalogos.disciplinas ?? []}
        metodosPago={resumen?.catalogos.metodos_pago ?? []}
      />

      {resumenQuery.isError && (
        <div className="p-3 rounded-sm border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/35 text-red-800 dark:text-red-300 text-xs font-semibold">
          No se pudieron cargar los indicadores BI desde el servidor. Verifica tu conexión o sesión.
        </div>
      )}

      {activeTab === 'overview' ? (
        <div className="space-y-4">
          {/* Fila 1: Hero Ingresos + 3 KPIs (8 cols) & Boletas por Disciplina (4 cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-8 space-y-4">
              <HeroIngresosCard
                ingresos={resumen?.ingresos}
                filtros={resumen?.filtros_aplicados}
                isLoading={resumenQuery.isLoading}
              />

              <KpiSummaryGrid
                resumen={resumen}
                aforoLive={aforoLiveQuery.data}
                isLoading={resumenQuery.isLoading}
              />
            </div>

            <div className="xl:col-span-4">
              <ChartCard
                title="Boletas de Inscripción por Disciplina"
                subtitle="Cantidad de inscripciones emitidas en el periodo"
                isLoading={seriesQuery.isLoading}
                isEmpty={(series?.boletas_por_disciplina.length ?? 0) === 0}
                className="h-full"
              >
                <InscripcionesDisciplinaChart
                  data={series?.boletas_por_disciplina ?? []}
                />
              </ChartCard>
            </div>
          </div>

          {/* Fila 2: Evolución de Ingresos (6 cols) & Aforo en Tiempo Real por Disciplina (6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6">
              <ChartCard
                title="Evolución de Ingresos"
                subtitle={`Serie ${granularidad === 'month' ? 'mensual' : 'diaria'} de pagos completados`}
                isLoading={seriesQuery.isLoading}
                isEmpty={(series?.ingresos_evolucion.length ?? 0) === 0}
              >
                <IngresosEvolucionChart data={series?.ingresos_evolucion ?? []} />
              </ChartCard>
            </div>

            <div className="lg:col-span-6">
              <ChartCard
                title="Aforo en Tiempo Real por Disciplina"
                subtitle={`Actualizado: ${formatDateTimeShort(aforoLiveQuery.data?.actualizado_en)}`}
                badge={
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-tiny font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Auto 30s
                  </span>
                }
                isLoading={aforoLiveQuery.isLoading && seriesQuery.isLoading}
                isEmpty={aforoPorDisciplina.length === 0}
              >
                <AforoDisciplinaChart data={aforoPorDisciplina} />
              </ChartCard>
            </div>
          </div>

          {/* Fila 3: Ingresos por Disciplina (4 cols) + Solicitudes por Estado (4 cols) + Pendientes (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <ChartCard
                title="Ingresos por Disciplina"
                subtitle="Participación de recaudación por disciplina"
                isLoading={distribucionQuery.isLoading}
                isEmpty={(distribucion?.ingresos_por_disciplina.length ?? 0) === 0}
              >
                <IngresosDisciplinaDonut
                  data={distribucion?.ingresos_por_disciplina ?? []}
                />
              </ChartCard>
            </div>

            <div className="lg:col-span-4">
              <ChartCard
                title="Solicitudes por Estado"
                subtitle="Aceptadas, pendientes y rechazadas del periodo"
                isLoading={distribucionQuery.isLoading}
                isEmpty={
                  (distribucion?.solicitudes_por_estado ?? []).every(
                    (s) => s.cantidad === 0
                  )
                }
              >
                <SolicitudesEstadoDonut
                  data={distribucion?.solicitudes_por_estado ?? []}
                />
              </ChartCard>
            </div>

            <div className="lg:col-span-4">
              <ChartCard
                title="Solicitudes Pendientes Recientes"
                subtitle="Formularios en espera de aprobación"
                isLoading={distribucionQuery.isLoading}
                isEmpty={
                  (distribucion?.solicitudes_pendientes_recientes.length ?? 0) === 0
                }
                emptyMessage="No hay solicitudes pendientes en el periodo seleccionado"
              >
                <SolicitudesStatusSummary
                  solicitudes={distribucion?.solicitudes_pendientes_recientes ?? []}
                />
              </ChartCard>
            </div>
          </div>
        </div>
      ) : (
        <BiMovementsTable />
      )}

      <CodigoQRInscripcionModal
        isOpen={isQRModalOpen}
        inscripcionId={
          userBoleta?.id !== undefined ? (userBoleta.id as number) : null
        }
        inscripcionFallback={userBoleta as never}
        onClose={() => setIsQRModalOpen(false)}
      />

      <EscanerQRModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
      />
    </section>
  );
};

export default DashboardPage;
