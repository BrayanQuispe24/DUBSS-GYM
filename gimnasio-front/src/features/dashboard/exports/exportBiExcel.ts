// src/features/dashboard/exports/exportBiExcel.ts
import ExcelJS from 'exceljs';
import type { BiExportPayload } from '../types/bi.types';

const styleHeaderRow = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0077D4' },
    };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    };
  });
  row.height = 22;
};

const autoFitColumns = (sheet: ExcelJS.Worksheet) => {
  sheet.columns.forEach((col) => {
    let maxLen = 14;
    col.eachCell?.({ includeEmpty: false }, (cell) => {
      const val = cell.value ? String(cell.value) : '';
      if (val.length + 4 > maxLen) {
        maxLen = Math.min(val.length + 4, 42);
      }
    });
    col.width = maxLen;
  });
};

export const exportBiExcel = async (payload: BiExportPayload): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DUBSS-GYM BI';
  workbook.created = new Date();

  const { resumen, series, distribucion, movimientos } = payload;

  // Hoja 1: Resumen Ejecutivo KPIs
  const wsResumen = workbook.addWorksheet('Resumen KPIs');
  wsResumen.addRow(['REPORTE EJECUTIVO BI — GIMNASIO UAGRM D.U.B.S.']);
  wsResumen.getRow(1).font = { bold: true, size: 13, color: { argb: 'FF002D5E' } };
  wsResumen.addRow([`Generado el: ${payload.generado_en}`, `Generado por: ${payload.generado_por}`]);
  wsResumen.addRow([
    `Periodo: ${resumen.filtros_aplicados.desde} al ${resumen.filtros_aplicados.hasta}`,
    `Disciplina filtro: ${resumen.filtros_aplicados.id_disciplina ?? 'Todas'}`,
    `Método pago: ${resumen.filtros_aplicados.metodo_pago ?? 'Todos'}`,
  ]);
  wsResumen.addRow([]);

  const resHeader = wsResumen.addRow(['Indicador KPI', 'Valor', 'Detalle / Referencia']);
  styleHeaderRow(resHeader);

  const kpiRows: Array<[string, number | string, string]> = [
    ['Ingresos Totales (Bs.)', resumen.ingresos.total, `Periodo anterior: Bs. ${resumen.ingresos.periodo_anterior.toFixed(2)}`],
    ['Pagos Completados', resumen.ingresos.cantidad_pagos, `Ticket promedio: Bs. ${resumen.ingresos.ticket_promedio.toFixed(2)}`],
    ['Boletas de Inscripción Emitidas', resumen.inscripciones.total, `Activas en periodo: ${resumen.inscripciones.activas}`],
    ['Aforo en Tiempo Real', resumen.aforo_tiempo_real.total_actual, `Cupo total: ${resumen.aforo_tiempo_real.cupo_maximo_total} (${resumen.aforo_tiempo_real.ocupacion_pct}%)`],
    ['Solicitudes Totales', resumen.solicitudes.total, `Tasa aprobación: ${resumen.solicitudes.tasa_aprobacion_pct}%`],
    ['Solicitudes Aceptadas / Aprobadas', resumen.solicitudes.aprobadas, 'Estado: aprobado'],
    ['Solicitudes Pendientes', resumen.solicitudes.pendientes, 'Estado: pendiente'],
    ['Solicitudes Rechazadas', resumen.solicitudes.rechazadas, 'Estado: rechazado'],
  ];

  kpiRows.forEach((r, idx) => {
    const row = wsResumen.addRow(r);
    if (idx === 0) {
      row.getCell(2).numFmt = '#,##0.00';
    }
  });
  autoFitColumns(wsResumen);

  // Hoja 2: Por Disciplina (Ingresos & Boletas)
  const wsDisc = workbook.addWorksheet('Por Disciplina');
  const discHeader = wsDisc.addRow(['Disciplina', 'Boletas de Inscripción', 'Monto Inscrito (Bs.)']);
  styleHeaderRow(discHeader);
  series.boletas_por_disciplina.forEach((item) => {
    const row = wsDisc.addRow([item.disciplina, item.cantidad_boletas, item.monto_total]);
    row.getCell(3).numFmt = '#,##0.00';
  });

  wsDisc.addRow([]);
  const ingHeader = wsDisc.addRow(['Disciplina (Ingresos)', 'Pagos Validados', 'Ingresos (Bs.)', '% Participación']);
  styleHeaderRow(ingHeader);
  distribucion.ingresos_por_disciplina.forEach((item) => {
    const row = wsDisc.addRow([item.disciplina, item.cantidad_pagos, item.monto, `${item.porcentaje}%`]);
    row.getCell(3).numFmt = '#,##0.00';
  });
  autoFitColumns(wsDisc);

  // Hoja 3: Aforo en Tiempo Real
  const wsAforo = workbook.addWorksheet('Aforo en Tiempo Real');
  const aforoHeader = wsAforo.addRow(['Disciplina', 'Personas Dentro Ahora', 'Cupo Máximo', 'Ocupación (%)']);
  styleHeaderRow(aforoHeader);
  series.aforo_por_disciplina.forEach((a) => {
    wsAforo.addRow([a.disciplina, a.aforo_actual, a.cupo_maximo, `${a.ocupacion_pct}%`]);
  });
  autoFitColumns(wsAforo);

  // Hoja 4: Solicitudes por Estado
  const wsSol = workbook.addWorksheet('Solicitudes');
  const solHeader = wsSol.addRow(['Estado', 'Cantidad', 'Porcentaje']);
  styleHeaderRow(solHeader);
  distribucion.solicitudes_por_estado.forEach((s) => {
    wsSol.addRow([s.label, s.cantidad, `${s.porcentaje}%`]);
  });
  autoFitColumns(wsSol);

  // Hoja 5: Detalle Completo de Movimientos
  const wsMov = workbook.addWorksheet('Detalle Movimientos');
  const movHeader = wsMov.addRow([
    'Tipo Registro',
    'Fecha',
    'Referencia / Nro',
    'Socio / Usuario',
    'Disciplina',
    'Método / Plan',
    'Estado',
    'Monto (Bs.)',
  ]);
  styleHeaderRow(movHeader);
  movimientos.forEach((m) => {
    const row = wsMov.addRow([
      m.tipo_registro.toUpperCase(),
      m.fecha,
      m.referencia,
      m.usuario,
      m.disciplina,
      m.metodo_pago,
      m.estado,
      m.monto,
    ]);
    row.getCell(8).numFmt = '#,##0.00';
  });
  autoFitColumns(wsMov);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-bi-dubss_${resumen.filtros_aplicados.desde}_${resumen.filtros_aplicados.hasta}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
