// src/features/dashboard/components/ExportButtons.tsx
import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import showToast from '@/utils/toast';
import { exportBiExcel } from '../exports/exportBiExcel';
import BiReportPdfDocument from '../exports/BiReportPdfDocument';
import { getBiExportDatos } from '../services/biDashboardService';
import { useDashboardFiltersStore } from '../store/dashboardFiltersStore';

const ExportButtons: React.FC = () => {
  const {
    desde,
    hasta,
    id_disciplina,
    metodo_pago,
    estado_solicitud,
    granularidad,
    tipo_detalle,
    search,
  } = useDashboardFiltersStore();

  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const filters = {
    desde,
    hasta,
    id_disciplina,
    metodo_pago,
    estado_solicitud,
    granularidad,
  };

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      const payload = await getBiExportDatos(filters, tipo_detalle, search);
      await exportBiExcel(payload);
      showToast.success('Reporte Excel (.xlsx) generado con todos los datos filtrados.');
    } catch {
      showToast.error('No se pudo generar la exportación Excel.');
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      const payload = await getBiExportDatos(filters, tipo_detalle, search);
      const blob = await pdf(<BiReportPdfDocument payload={payload} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-bi-dubss_${desde}_${hasta}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast.success('Reporte PDF ejecutivo descargado.');
    } catch {
      showToast.error('No se pudo generar el reporte PDF.');
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportExcel}
        disabled={exportingExcel || exportingPdf}
        className="px-3 py-1.5 rounded-sm border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/35 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
      >
        {exportingExcel ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
        <span>Excel (.xlsx)</span>
      </button>

      <button
        type="button"
        onClick={handleExportPdf}
        disabled={exportingExcel || exportingPdf}
        className="px-3 py-1.5 rounded-sm border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/35 hover:bg-red-100 dark:hover:bg-red-900/40 text-[#990000] dark:text-red-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
      >
        {exportingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
        <span>PDF Ejecutivo</span>
      </button>
    </div>
  );
};

export default ExportButtons;

