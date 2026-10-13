// src/features/tramites/components/BoletaInscripcionPDFDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0F172A',
    lineHeight: 1.4,
  },
  headerTable: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#000',
    marginBottom: 12,
  },
  headerLeft: {
    width: '25%',
    borderRightWidth: 1.5,
    borderRightColor: '#000',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeftTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  headerLeftSub: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B91C1C',
    textAlign: 'center',
  },
  headerCenter: {
    width: '50%',
    borderRightWidth: 1.5,
    borderRightColor: '#000',
    backgroundColor: '#F1F5F9',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenterSub: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  headerCenterMain: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 2,
    textAlign: 'center',
  },
  headerRight: {
    width: '25%',
    padding: 4,
  },
  headerRightRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    marginBottom: 2,
    fontSize: 8,
  },
  headerRightRowLast: {
    fontSize: 8,
  },
  tableBox: {
    borderWidth: 1.5,
    borderColor: '#000',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 20,
    alignItems: 'center',
  },
  tableRowLast: {
    flexDirection: 'row',
    minHeight: 20,
    alignItems: 'center',
  },
  tableCellFull: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tableCellHalf: {
    width: '50%',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tableCellHalfBorder: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#DCFCE7',
    color: '#166534',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textTransform: 'uppercase',
  },
  vigenciaBox: {
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#15803D',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vigenciaTitle: {
    fontSize: 10,
    color: '#15803D',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  vigenciaVal: {
    fontSize: 14,
    color: '#166534',
    fontWeight: 'bold',
    marginTop: 4,
  },
  instructionsBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 4,
  },
  instructionsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  instructionItem: {
    fontSize: 8.5,
    color: '#475569',
    marginBottom: 3,
  },
});

interface BoletaInscripcionPDFDocumentProps {
  inscripcion: any;
}

const BoletaInscripcionPDFDocument: React.FC<BoletaInscripcionPDFDocumentProps> = ({ inscripcion }) => {
  const user = inscripcion?.usuario || {};
  const formatTime = (t?: string) => (t ? String(t).slice(0, 5) : '');
  const horaInicioStr = formatTime(inscripcion?.hora_inicio);
  const horaSalidaStr = formatTime(inscripcion?.hora_salida);
  const horarioText = horaInicioStr && horaSalidaStr ? `${horaInicioStr} - ${horaSalidaStr}` : 'Horario Asignado';

  const fechaEmision = inscripcion?.fecha_inscripcion || inscripcion?.created_at
    ? new Date(inscripcion?.fecha_inscripcion || inscripcion?.created_at).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const fechaIni = inscripcion?.fecha_inicio
    ? new Date(inscripcion.fecha_inicio).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'Desde Emisión';

  const fechaFin = inscripcion?.fecha_fin
    ? new Date(inscripcion.fecha_fin).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '30 Días';

  return (
    <Document title={`Boleta_Inscripcion_${inscripcion?.numero_boleta || 'UAGRM'}`}>
      <Page size="LETTER" style={styles.page}>
        {/* HEADER TABULAR INSTITUCIONAL */}
        <View style={styles.headerTable}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLeftTitle}>D.U.B.S.S.</Text>
            <Text style={styles.headerLeftSub}>U.A.G.R.M.</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerCenterSub}>UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO</Text>
            <Text style={styles.headerCenterMain}>BOLETA OFICIAL DE INSCRIPCIÓN Y REGISTRO DE ACCESO</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerRightRow}>
              <Text>Código: <Text style={styles.bold}>DUBSS-INS-01</Text></Text>
            </View>
            <View style={styles.headerRightRow}>
              <Text>Fecha: <Text style={styles.bold}>{fechaEmision}</Text></Text>
            </View>
            <View style={styles.headerRightRowLast}>
              <Text>Estado: <Text style={styles.bold}>{String(inscripcion?.estado || 'activo').toUpperCase()}</Text></Text>
            </View>
          </View>
        </View>

        {/* DETALLES DE LA BOLETA */}
        <View style={styles.tableBox}>
          <Text style={styles.sectionTitle}>1. IDENTIFICACIÓN DE LA BOLETA DE INSCRIPCIÓN</Text>
          <View style={styles.tableRow}>
            <View style={styles.tableCellHalfBorder}>
              <Text>Nº DE BOLETA INSCRIPCIÓN: <Text style={styles.bold}>{inscripcion?.numero_boleta || 'INS-2026-XXXX'}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>FECHA EMISIÓN: <Text style={styles.bold}>{fechaEmision}</Text></Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={styles.tableCellHalfBorder}>
              <Text>ESTADO MEMBRESÍA: <Text style={styles.bold}>{String(inscripcion?.estado || 'activo').toUpperCase()}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>MONTO ABONADO: <Text style={styles.bold}>Bs. {Number(inscripcion?.monto || 150).toFixed(2)}</Text></Text>
            </View>
          </View>
        </View>

        {/* DATOS DEL SOCIO / USUARIO */}
        <View style={styles.tableBox}>
          <Text style={styles.sectionTitle}>2. DATOS DEL SOCIO UNIVERSITARIO HABILITADO</Text>
          <View style={styles.tableRow}>
            <View style={styles.tableCellFull}>
              <Text>NOMBRES Y APELLIDOS: <Text style={styles.bold}>{user?.nombre || user?.name} {user?.apellido}</Text></Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellHalfBorder}>
              <Text>CÉDULA DE IDENTIDAD (C.I.): <Text style={styles.bold}>{user?.ci || 'Sin C.I.'}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>REGISTRO / CÓDIGO: <Text style={styles.bold}>{user?.registro_universitario || user?.codigo || 'S/N'}</Text></Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={styles.tableCellHalfBorder}>
              <Text>CORREO ELECTRÓNICO: <Text style={styles.bold}>{user?.email || 'Sin Email'}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>TELÉFONO / CELULAR: <Text style={styles.bold}>{user?.celular || 'Sin Celular'}</Text></Text>
            </View>
          </View>
        </View>

        {/* DETALLE DE LA MEMBRESÍA */}
        <View style={styles.tableBox}>
          <Text style={styles.sectionTitle}>3. DETALLE DE LA MEMBRESÍA Y DERECHO DE ACCESO</Text>
          <View style={styles.tableRow}>
            <View style={styles.tableCellHalfBorder}>
              <Text>DISCIPLINA HABILITADA: <Text style={styles.bold}>{inscripcion?.disciplina || 'Gimnasio Musculación'}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>HORARIO AUTORIZADO: <Text style={styles.bold}>{horarioText}</Text></Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={styles.tableCellHalfBorder}>
              <Text>DESDE (FECHA INICIO): <Text style={styles.bold}>{fechaIni}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>HASTA (FECHA VENCIMIENTO): <Text style={styles.bold}>{fechaFin}</Text></Text>
            </View>
          </View>
        </View>

        {/* VIGENCIA DESTACADA */}
        <View style={styles.vigenciaBox}>
          <Text style={styles.vigenciaTitle}>PERIODO DE ACCESO VIGENTE HABILITADO</Text>
          <Text style={styles.vigenciaVal}>{fechaIni} &nbsp; AL &nbsp; {fechaFin}</Text>
          <Text style={{ fontSize: 8.5, color: '#166534', marginTop: 2 }}>Turno Autorizado: {horarioText}</Text>
        </View>

        {/* DISPOSICIONES INSTITUCIONALES */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>NORMATIVA Y DERECHOS DEL SOCIO INSCRITO:</Text>
          <Text style={styles.instructionItem}>1. Esta Boleta Oficial de Inscripción acredita el derecho de ingreso al Gimnasio Universitario UAGRM durante el rango de fechas indicado.</Text>
          <Text style={styles.instructionItem}>2. El ingreso al área de máquinas está estrictamente restringido al horario y turno autorizado en esta boleta.</Text>
          <Text style={styles.instructionItem}>3. Es obligatorio el uso de ropa deportiva adecuada, zapatillas deportivas limpias y toalla de mano en las instalaciones.</Text>
          <Text style={styles.instructionItem}>4. Presentar esta boleta digital o impresa en la recepción del gimnasio al ingresar para el registro de entrada.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BoletaInscripcionPDFDocument;
