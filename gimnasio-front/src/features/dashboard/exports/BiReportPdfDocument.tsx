// src/features/dashboard/exports/BiReportPdfDocument.tsx
import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { BiExportPayload } from '../types/bi.types';
import { formatBs, formatCompactNumber } from '../utils/biFormatters';

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#990000',
    paddingBottom: 10,
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#18181B',
  },
  subtitle: {
    fontSize: 8.5,
    color: '#475569',
    marginTop: 2,
  },
  metaBox: {
    textAlign: 'right',
    fontSize: 8,
    color: '#475569',
  },
  filterBar: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderLeftWidth: 3,
    borderLeftColor: '#990000',
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  kpiLabel: {
    fontSize: 7.5,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 4,
  },
  kpiSub: {
    fontSize: 7.5,
    color: '#475569',
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#18181B',
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 3,
  },
  table: {
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#18181B',
    color: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    fontSize: 8,
  },
  col1: { flex: 2.2 },
  col2: { flex: 1, textAlign: 'right' },
  col3: { flex: 1.2, textAlign: 'right' },
  col4: { flex: 1, textAlign: 'right' },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 28,
    right: 28,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: '#64748B',
  },
});

interface BiReportPdfDocumentProps {
  payload: BiExportPayload;
}

const BiReportPdfDocument: React.FC<BiReportPdfDocumentProps> = ({ payload }) => {
  const { resumen, series, distribucion, movimientos } = payload;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>REPORTE EJECUTIVO BI — GIMNASIO UAGRM D.U.B.S.</Text>
            <Text style={styles.subtitle}>
              Indicadores consolidados de ingresos, inscripciones, aforo y solicitudes
            </Text>
          </View>
          <View style={styles.metaBox}>
            <Text>Emitido: {payload.generado_en}</Text>
            <Text>Por: {payload.generado_por}</Text>
          </View>
        </View>

        {/* Active Filters */}
        <View style={styles.filterBar}>
          <Text>
            Periodo: {resumen.filtros_aplicados.desde} al {resumen.filtros_aplicados.hasta}
          </Text>
          <Text>
            Disciplina ID: {resumen.filtros_aplicados.id_disciplina ?? 'Todas'}
          </Text>
          <Text>
            Método Pago: {resumen.filtros_aplicados.metodo_pago ?? 'Todos'}
          </Text>
        </View>

        {/* 4 KPIs */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Ingresos Totales</Text>
            <Text style={styles.kpiValue}>{formatBs(resumen.ingresos.total)}</Text>
            <Text style={styles.kpiSub}>
              {resumen.ingresos.cantidad_pagos} pagos validados
            </Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Boletas Inscripción</Text>
            <Text style={styles.kpiValue}>
              {formatCompactNumber(resumen.inscripciones.total)}
            </Text>
            <Text style={styles.kpiSub}>
              {resumen.inscripciones.activas} activas
            </Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Aforo en Vivo</Text>
            <Text style={styles.kpiValue}>
              {resumen.aforo_tiempo_real.total_actual} / {resumen.aforo_tiempo_real.cupo_maximo_total}
            </Text>
            <Text style={styles.kpiSub}>
              Ocupación: {resumen.aforo_tiempo_real.ocupacion_pct}%
            </Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Solicitudes</Text>
            <Text style={styles.kpiValue}>
              {formatCompactNumber(resumen.solicitudes.total)}
            </Text>
            <Text style={styles.kpiSub}>
              Aprob: {resumen.solicitudes.aprobadas} | Pend: {resumen.solicitudes.pendientes} | Rech: {resumen.solicitudes.rechazadas}
            </Text>
          </View>
        </View>

        {/* Boletas e Ingresos por Disciplina */}
        <Text style={styles.sectionTitle}>Boletas de Inscripción por Disciplina</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Disciplina</Text>
            <Text style={styles.col2}>Boletas</Text>
            <Text style={styles.col3}>Monto Inscrito</Text>
          </View>
          {series.boletas_por_disciplina.map((item) => (
            <View key={item.disciplina} style={styles.tableRow}>
              <Text style={styles.col1}>{item.disciplina}</Text>
              <Text style={styles.col2}>{item.cantidad_boletas}</Text>
              <Text style={styles.col3}>{formatBs(item.monto_total)}</Text>
            </View>
          ))}
        </View>

        {/* Aforo en Tiempo Real por Disciplina */}
        <Text style={styles.sectionTitle}>Aforo en Tiempo Real por Disciplina</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Disciplina</Text>
            <Text style={styles.col2}>Dentro Ahora</Text>
            <Text style={styles.col3}>Cupo Máximo</Text>
            <Text style={styles.col4}>Ocupación</Text>
          </View>
          {series.aforo_por_disciplina.map((a) => (
            <View key={a.disciplina} style={styles.tableRow}>
              <Text style={styles.col1}>{a.disciplina}</Text>
              <Text style={styles.col2}>{a.aforo_actual}</Text>
              <Text style={styles.col3}>{a.cupo_maximo}</Text>
              <Text style={styles.col4}>{a.ocupacion_pct}%</Text>
            </View>
          ))}
        </View>

        {/* Solicitudes por Estado */}
        <Text style={styles.sectionTitle}>Solicitudes (Aceptadas, Pendientes y Rechazadas)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Estado</Text>
            <Text style={styles.col2}>Cantidad</Text>
            <Text style={styles.col3}>Porcentaje</Text>
          </View>
          {distribucion.solicitudes_por_estado.map((s) => (
            <View key={s.estado} style={styles.tableRow}>
              <Text style={styles.col1}>{s.label}</Text>
              <Text style={styles.col2}>{s.cantidad}</Text>
              <Text style={styles.col3}>{s.porcentaje}%</Text>
            </View>
          ))}
        </View>

        {/* Movimientos Recientes */}
        <Text style={styles.sectionTitle}>
          Detalle de Registros Filtrados (mostrando hasta 20 de {movimientos.length})
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ flex: 1 }}>Tipo</Text>
            <Text style={{ flex: 1.4 }}>Referencia</Text>
            <Text style={{ flex: 2 }}>Usuario</Text>
            <Text style={{ flex: 1.4 }}>Disciplina</Text>
            <Text style={{ flex: 1 }}>Estado</Text>
            <Text style={{ flex: 1.2, textAlign: 'right' }}>Monto</Text>
          </View>
          {movimientos.slice(0, 20).map((m) => (
            <View key={m.id} style={styles.tableRow}>
              <Text style={{ flex: 1 }}>{m.tipo_registro.toUpperCase()}</Text>
              <Text style={{ flex: 1.4 }}>{m.referencia}</Text>
              <Text style={{ flex: 2 }}>{m.usuario}</Text>
              <Text style={{ flex: 1.4 }}>{m.disciplina}</Text>
              <Text style={{ flex: 1 }}>{m.estado}</Text>
              <Text style={{ flex: 1.2, textAlign: 'right' }}>{formatBs(m.monto)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text>UAGRM — Dirección Universitaria de Bienestar Social (D.U.B.S.)</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default BiReportPdfDocument;
