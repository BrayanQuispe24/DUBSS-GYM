// src/features/tramites/components/BoletaPagoPDFDocument.tsx
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
    backgroundColor: '#E2E8F0',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textTransform: 'uppercase',
  },
  montoBox: {
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#003B70',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  montoTitle: {
    fontSize: 10,
    color: '#003B70',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  montoVal: {
    fontSize: 18,
    color: '#003B70',
    fontWeight: 'bold',
    marginTop: 4,
  },
  instructionsBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    padding: 10,
    marginBottom: 20,
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
  signaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
    paddingHorizontal: 15,
  },
  signatureBox: {
    width: '28%',
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signatureSub: {
    fontSize: 7,
    color: '#64748B',
    textAlign: 'center',
  },
});

interface BoletaPagoPDFDocumentProps {
  pago: any;
}

const BoletaPagoPDFDocument: React.FC<BoletaPagoPDFDocumentProps> = ({ pago }) => {
  const sol = pago?.formulario_solicitud || {};
  const user = sol?.usuario || pago?.usuario || {};
  const disc = sol?.disciplina || {};
  const dh = sol?.disciplina_horario || sol?.disciplinaHorario;
  const h = dh?.horario;

  const formatTime = (t?: string) => (t ? String(t).slice(0, 5) : '');
  const horarioStr = h
    ? `${h.dia_semana ? h.dia_semana + ': ' : ''}${formatTime(h.hora_inicio || h.inicio)} - ${formatTime(h.hora_fin || h.fin)}`
    : 'Horario Asignado';

  const fechaRegistro = pago?.fecha_pago || pago?.created_at
    ? new Date(pago?.fecha_pago || pago?.created_at).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <Document title={`Boleta_Pago_${pago?.numero_boleta || 'UAGRM'}`}>
      <Page size="LETTER" style={styles.page}>
        {/* HEADER TABULAR INSTITUCIONAL */}
        <View style={styles.headerTable}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLeftTitle}>D.U.B.S.S.</Text>
            <Text style={styles.headerLeftSub}>U.A.G.R.M.</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerCenterSub}>UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO</Text>
            <Text style={styles.headerCenterMain}>BOLETA DE PAGO Y ORDEN DE DEPÓSITO - CAJA CAMPUS</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerRightRow}>
              <Text>Código: <Text style={styles.bold}>DUBSS-PAG-01</Text></Text>
            </View>
            <View style={styles.headerRightRow}>
              <Text>Fecha: <Text style={styles.bold}>{fechaRegistro}</Text></Text>
            </View>
            <View style={styles.headerRightRowLast}>
              <Text>Emisión: <Text style={styles.bold}>Oficial</Text></Text>
            </View>
          </View>
        </View>

        {/* DETALLES DE LA BOLETA Y FORMULARIO */}
        <View style={styles.tableBox}>
          <Text style={styles.sectionTitle}>1. DATOS DE IDENTIFICACIÓN DE LA BOLETA DE PAGO</Text>
          <View style={styles.tableRow}>
            <View style={styles.tableCellHalfBorder}>
              <Text>Nº DE BOLETA DE PAGO: <Text style={styles.bold}>{pago?.numero_boleta || 'PAG-2026-XXXX'}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>Nº FORMULARIO SOLICITUD: <Text style={styles.bold}>{sol?.numero_formulario || 'SOL-XXXX'}</Text></Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellHalfBorder}>
              <Text>MÉTODO / LUGAR PAGO: <Text style={styles.bold}>{pago?.metodo_pago || 'Caja Campus UAGRM'}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>ESTADO DEL PAGO: <Text style={styles.bold}>{String(pago?.estado || 'pendiente').toUpperCase()}</Text></Text>
            </View>
          </View>
        </View>

        {/* DATOS DEL SOCIO POSTULANTE */}
        <View style={styles.tableBox}>
          <Text style={styles.sectionTitle}>2. DATOS DEL POSTULANTE / USUARIO GIMNASIO</Text>
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
          <View style={styles.tableRow}>
            <View style={styles.tableCellFull}>
              <Text>CORREO ELECTRÓNICO: <Text style={styles.bold}>{user?.email || 'Sin Email'}</Text></Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={styles.tableCellHalfBorder}>
              <Text>DISCIPLINA: <Text style={styles.bold}>{disc?.nombre || 'Gimnasio Musculación'}</Text></Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text>TURNO / HORARIO: <Text style={styles.bold}>{horarioStr}</Text></Text>
            </View>
          </View>
        </View>

        {/* BOX DE MONTO TOTAL */}
        <View style={styles.montoBox}>
          <Text style={styles.montoTitle}>MONTO TOTAL A CANCELAR EN CAJA CAMPUS UAGRM</Text>
          <Text style={styles.montoVal}>Bs. {Number(pago?.monto || 150).toFixed(2)}</Text>
          <Text style={{ fontSize: 8.5, color: '#475569', marginTop: 2 }}>(Ciento Cincuenta 00/100 Bolivianos)</Text>
        </View>

        {/* INSTRUCCIONES OFICIALES */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>INSTRUCCIONES PARA EL SOCIO Y CAJA CAMPUS UAGRM:</Text>
          <Text style={styles.instructionItem}>1. Presentar esta Boleta de Pago u Orden de Depósito de manera presencial en las ventanillas de Caja Campus UAGRM.</Text>
          <Text style={styles.instructionItem}>2. Realizar el depósito correspondiente de Bs. 150.00 y exigir la emisión de su comprobante de pago oficial de la UAGRM.</Text>
          <Text style={styles.instructionItem}>3. Presentar el comprobante físico timbrado en la Administración del Gimnasio Universitario D.U.B.S.S. para la activación del acceso y la entrega de su Boleta de Inscripción oficial.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BoletaPagoPDFDocument;
