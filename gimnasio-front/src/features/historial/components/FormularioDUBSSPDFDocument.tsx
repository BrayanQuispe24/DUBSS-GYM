// src/features/historial/components/FormularioDUBSSPDFDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0F172A',
    lineHeight: 1.3,
  },
  // Table Header Institucional
  headerTable: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#000',
    marginBottom: 10,
  },
  headerLeft: {
    width: '24%',
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
    width: '52%',
    borderRightWidth: 1.5,
    borderRightColor: '#000',
    backgroundColor: '#F1F5F9',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenterSub: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  headerCenterMain: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 2,
    textAlign: 'center',
  },
  headerRight: {
    width: '24%',
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
  // Section Box / Table
  tableBox: {
    borderWidth: 1.5,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 18,
    alignItems: 'center',
  },
  tableRowLast: {
    flexDirection: 'row',
    minHeight: 18,
    alignItems: 'center',
  },
  tableCellFull: {
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tableCellHalf: {
    width: '50%',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tableCellBorderRight: {
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  bold: {
    fontWeight: 'bold',
  },
  // Sections Title
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    textDecoration: 'underline',
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 8,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  // Rules List
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  ruleBullet: {
    width: 10,
    fontSize: 8,
  },
  ruleText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.25,
  },
  // Medical Section
  medSection: {
    marginBottom: 8,
  },
  medQuestionGroup: {
    marginTop: 3,
    paddingLeft: 6,
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dotted',
    minHeight: 14,
    marginTop: 2,
    fontSize: 8,
    paddingHorizontal: 4,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    paddingLeft: 6,
  },
  gridItem: {
    width: '50%',
    fontSize: 8,
    marginBottom: 3,
  },
  // Declaration
  declarationText: {
    fontSize: 8.5,
    textAlign: 'justify',
    lineHeight: 1.35,
    marginBottom: 6,
  },
  declarationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 9,
  },
  signatureBox: {
    width: 220,
    marginTop: 15,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 4,
  },
  smallNote: {
    fontSize: 7.5,
    color: '#64748B',
  },
});

interface FormularioDUBSSPDFDocumentProps {
  historial?: any;
  usuario?: any;
}

const FormularioDUBSSPDFDocument: React.FC<FormularioDUBSSPDFDocumentProps> = ({
  historial,
  usuario: rawUsuario,
}) => {
  const user = historial?.usuario || rawUsuario || {};
  const detalles = historial?.detalles || [];
  const latestDetalle = detalles.length > 0 ? detalles[0] : null;
  const antecedentes = Array.isArray(historial?.antecedentes) && historial.antecedentes.length > 0
    ? historial.antecedentes[0]
    : null;

  const formattedDate = (dateStr?: string) => {
    if (!dateStr) return '__ / __ / ____';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr).split('T')[0];
      return d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return String(dateStr);
    }
  };

  const isSi = (val: any) => Boolean(val);
  const nombreCompleto = user.name || [user.nombre, user.apellido].filter(Boolean).join(' ') || '________________________________________';
  const observacionesGen = historial?.observaciones_generales || historial?.observaciones || '';
  const fechaApertura = formattedDate(historial?.fecha_apertura || historial?.created_at);

  return (
    <Document title={`Formulario_DUBSS_${user.ci || 'FR-03'}.pdf`}>
      <Page size="A4" style={styles.page}>
        {/* ENCABEZADO INSTITUCIONAL */}
        <View style={styles.headerTable}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLeftTitle}>D.U.B.S.S.</Text>
            <Text style={styles.headerLeftSub}>U.A.G.R.M.</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerCenterSub}>FORMULARIO</Text>
            <Text style={styles.headerCenterMain}>INSCRIPCIÓN GIMNASIO UNIVERSITARIO</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerRightRow}>
              <Text style={{ fontWeight: 'bold' }}>DUBSS-FR-03</Text>
            </View>
            <View style={styles.headerRightRow}>
              <Text>Versión: 1.0</Text>
            </View>
            <View style={styles.headerRightRow}>
              <Text>Apertura: {fechaApertura}</Text>
            </View>
            <View style={styles.headerRightRowLast}>
              <Text>Aprobado por: DUBSS</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN 1: DATOS DEL SOCIO */}
        <View style={styles.tableBox}>
          <View style={styles.tableRow}>
            <View style={styles.tableCellFull}>
              <Text><Text style={styles.bold}>NOMBRES Y APELLIDOS: </Text>{nombreCompleto}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCellHalf, styles.tableCellBorderRight]}>
              <Text><Text style={styles.bold}>C.I.: </Text>{user.ci || '________________'}</Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text><Text style={styles.bold}>CÓD. O REGISTRO: </Text>{user.registro_universitario || user.codigo || '________________'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellFull}>
              <Text><Text style={styles.bold}>FACULTAD/CARRERA/UNIDAD: </Text>{historial?.facultad_carrera || '________________________________________'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellFull}>
              <Text><Text style={styles.bold}>DOMICILIO: </Text>{historial?.domicilio || '________________________________________'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellFull}>
              <Text><Text style={styles.bold}>CORREO ELECTRÓNICO: </Text>{user.email || '________________________________________'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCellHalf, styles.tableCellBorderRight]}>
              <Text><Text style={styles.bold}>CELULAR / EMERGENCIA: </Text>{user.celular || historial?.celular_emergencia || '________________'}</Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text><Text style={styles.bold}>FECHA DE NACIMIENTO: </Text>{formattedDate(historial?.fecha_nacimiento)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCellHalf, styles.tableCellBorderRight]}>
              <Text>
                <Text style={styles.bold}>SEXO: </Text>
                F ( {historial?.sexo?.toLowerCase() === 'femenino' || historial?.sexo === 'F' ? 'X' : ' '} )   M ( {historial?.sexo?.toLowerCase() === 'masculino' || historial?.sexo === 'M' ? 'X' : ' '} )
              </Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text><Text style={styles.bold}>GRUPO SANGUÍNEO: </Text>{historial?.grupo_sanguineo || '________'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCellHalf, styles.tableCellBorderRight]}>
              <Text><Text style={styles.bold}>ALTURA: </Text>{latestDetalle?.altura ? `${latestDetalle.altura} cm` : '________'} | <Text style={styles.bold}>PESO: </Text>{latestDetalle?.peso ? `${latestDetalle.peso} kg` : '________'}</Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text><Text style={styles.bold}>IMC: </Text>{latestDetalle?.imc ? `${latestDetalle.imc}` : '________'} | <Text style={styles.bold}>PRESIÓN: </Text>{latestDetalle?.presion ? `${latestDetalle.presion}` : '________'}</Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={[styles.tableCellHalf, styles.tableCellBorderRight]}>
              <Text><Text style={styles.bold}>MES DE EMISIÓN: </Text>{new Date().toLocaleDateString('es-BO', { month: 'long', year: 'numeric' }).toUpperCase()}</Text>
            </View>
            <View style={styles.tableCellHalf}>
              <Text><Text style={styles.bold}>HORARIO: </Text>{historial?.horario || rawUsuario?.horario || '07:00 - 09:00 (Mañana)'}</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN 2: REGLAS DEL GIMNASIO */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>REGLAS DEL GIMNASIO UNIVERSITARIO</Text>
          {[
            'Ingresar al gimnasio en el horario que se inscribió, Prohibido asistir en otro horario',
            'Limpiar los equipos después de utilizarlos',
            'Prohibido el ingreso de alimentos en el área de ejercicio, solamente podrá ingresar con botellas con agua.',
            'Prohibido el ingreso de niños al área de musculación',
            'Es obligatorio el uso de zapatillas, ropa deportiva y una toallita',
            'Uso de discos y mancuernas solo en el área de piso de goma',
            'Los diferentes implementos y equipos del gimnasio deben ser compartidos por todos los usuarios',
            'Cuide su pertenencia, en caso de pérdida el gimnasio no se hace responsable',
            'Prohibido el ingreso en estado de embriaguez y/o bajo efectos de sustancias psicoactivas',
            'Prohibido realizar rutinas sin la supervisión del instructor, la Universidad no se hace responsable por los accidentes derivados de la mala utilización de las máquinas o implementos deportivos.',
            'Todo usuario está en el deber de retornar los implementos (mancuernas, discos y barras) que utilice al lugar que corresponda y velar por el buen uso de estos en el gimnasio.',
            'Si maltratar los implementos y equipos, el gimnasio se reserva el derecho de llamar la atención al usuario que contravenga esta recomendación o hacer la reposición de los daños ocasionados',
            'Prohibido el ingreso a la sala de ejercicios con bolsones y mochilas, estos deben dejar en los casilleros que brinda el gimnasio.',
            'El incumplimiento del reglamento puede ocasionar retiro indefinido del uso del gimnasio, además de acarrear sanciones disciplinarias.',
          ].map((rule, idx) => (
            <View key={idx} style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* SECCIÓN 3: CUESTIONARIO MÉDICO */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>CUESTIONARIO MÉDICO – GIMNASIO UNIVERSITARIO</Text>
          <Text style={styles.sectionSubtitle}>
            Por favor, responda con sinceridad las siguientes preguntas sobre su salud:
          </Text>

          {/* 1. Antecedentes médicos */}
          <View style={styles.medSection}>
            <Text style={styles.bold}>1. Antecedentes médicos generales</Text>
            <View style={styles.medQuestionGroup}>
              <Text>
                ¿Tiene usted antecedentes de enfermedades cardiovasculares? SI ( {isSi(antecedentes?.tiene_enfermedades_cardiovasculares) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_enfermedades_cardiovasculares) ? 'X' : ' '} ) en caso sea afirmativo, especifique:
              </Text>
              <View style={styles.dottedLine}>
                <Text>{antecedentes?.detalle_enfermedades_cardiovasculares || ''}</Text>
              </View>
            </View>
            <View style={styles.medQuestionGroup}>
              <Text>
                ¿Se le ha realizado algún procedimiento cardiovascular (angioplastia, cirugía de bypass, recambio valvular, marcapasos, cardiodesfibrilador)? SI ( {isSi(antecedentes?.se_realizo_intervencion_cardiovascular) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.se_realizo_intervencion_cardiovascular) ? 'X' : ' '} ) En caso afirmativo especifique:
              </Text>
              <View style={styles.dottedLine}>
                <Text>{antecedentes?.detalle_intervencion_cardiovascular || ''}</Text>
              </View>
            </View>
          </View>

          {/* 2. Condiciones específicas */}
          <View style={styles.medSection}>
            <Text style={styles.bold}>2. ¿Padece alguna de las siguientes condiciones? (Marque con X)</Text>
            <View style={styles.grid2Col}>
              <Text style={styles.gridItem}>Hipertensión arterial: SI ( {isSi(antecedentes?.tiene_hipertension_arterial) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_hipertension_arterial) ? 'X' : ' '} )</Text>
              <Text style={styles.gridItem}>Enfermedades pulmonares: SI ( {isSi(antecedentes?.tiene_enfermedades_pulmonares) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_enfermedades_pulmonares) ? 'X' : ' '} )</Text>
              <Text style={styles.gridItem}>Diabetes: SI ( {isSi(antecedentes?.tiene_diabetes) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_diabetes) ? 'X' : ' '} )</Text>
              <Text style={styles.gridItem}>Osteoarticulares: SI ( {isSi(antecedentes?.tiene_enfermedades_osteoarticulares) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_enfermedades_osteoarticulares) ? 'X' : ' '} )</Text>
              <Text style={styles.gridItem}>Neurológicas: SI ( {isSi(antecedentes?.tiene_enfermedades_neurologicas) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_enfermedades_neurologicas) ? 'X' : ' '} )</Text>
              <Text style={styles.gridItem}>Convulsiones: SI ( {isSi(antecedentes?.tiene_convulsiones) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_convulsiones) ? 'X' : ' '} )</Text>
              <Text style={styles.gridItem}>Lesiones articulares/musculares: SI ( {isSi(antecedentes?.tiene_lesiones) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_lesiones) ? 'X' : ' '} )</Text>
              <Text style={styles.gridItem}>Alergias conocidas: SI ( {isSi(antecedentes?.tiene_alergias) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_alergias) ? 'X' : ' '} )</Text>
            </View>
            <View style={styles.medQuestionGroup}>
              <Text>En caso de respuesta afirmativa a alguna de las preguntas anteriores, detalle:</Text>
              <View style={styles.dottedLine}>
                <Text>
                  {antecedentes?.detalle_hipertension_arterial || antecedentes?.detalle_enfermedades_pulmonares || antecedentes?.detalle_diabetes || antecedentes?.detalle_enfermedades_osteoarticulares || antecedentes?.detalle_enfermedades_neurologicas || antecedentes?.detalle_convulsiones || antecedentes?.detalle_lesiones || antecedentes?.detalle_alergias || ''}
                </Text>
              </View>
            </View>
          </View>

          {/* 3. Intervenciones y antecedentes deportivos */}
          <View style={styles.medSection}>
            <Text style={styles.bold}>3. Intervenciones y antecedentes deportivos</Text>
            <View style={styles.medQuestionGroup}>
              <Text>
                ¿Le realizaron alguna intervención quirúrgica? SI ( {isSi(antecedentes?.tiene_intervencion_quirurgica) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_intervencion_quirurgica) ? 'X' : ' '} ) Especifique:
              </Text>
              <View style={styles.dottedLine}>
                <Text>{antecedentes?.detalle_intervencion_quirurgica || ''}</Text>
              </View>
            </View>
            <View style={styles.medQuestionGroup}>
              <Text>
                ¿Ha sufrido fracturas óseas? SI ( {isSi(antecedentes?.sufrio_fracturas_oseas) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.sufrio_fracturas_oseas) ? 'X' : ' '} ) Especifique:
              </Text>
              <View style={styles.dottedLine}>
                <Text>{antecedentes?.detalle_fracturas_oseas || ''}</Text>
              </View>
            </View>
            <View style={styles.medQuestionGroup}>
              <Text>
                ¿Ha sufrido mareos, deshidratación o pérdida de conocimiento en la práctica deportiva? SI ( {isSi(antecedentes?.sufrio_algun_sintoma_durante_deporte) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.sufrio_algun_sintoma_durante_deporte) ? 'X' : ' '} ) Detalle:
              </Text>
              <View style={styles.dottedLine}>
                <Text>{antecedentes?.detalle_sintomas_durante_deporte || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECCIÓN DE OBSERVACIONES GENERALES DE LA FICHA MÉDICA */}
        {Boolean(observacionesGen) && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>OBSERVACIONES GENERALES DE LA FICHA MÉDICA</Text>
            <View style={styles.dottedLine}>
              <Text>{observacionesGen}</Text>
            </View>
          </View>
        )}

        {/* SECCIÓN DE VERIFICACIÓN DE DOCUMENTOS ADJUNTOS */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>VERIFICACIÓN DE DOCUMENTACIÓN Y REQUISITOS ADJUNTOS</Text>
          <View style={styles.grid2Col}>
            <Text style={styles.gridItem}>[ X ] Cédula de Identidad (Fotocopia)</Text>
            <Text style={styles.gridItem}>[ X ] Matrícula / Registro Universitario</Text>
            <Text style={styles.gridItem}>[   ] Certificado de Aptitud Física (en plazo de 15 días)</Text>
            <Text style={styles.gridItem}>[ X ] Formulario Ficha y Declaración Jurada DUBSS-FR-03</Text>
          </View>
        </View>

        {/* SECCIÓN 4: DECLARACIÓN JURADA */}
        <View style={{ marginTop: 4 }}>
          <Text style={styles.sectionTitle}>DECLARACIÓN JURADA</Text>
          <Text style={styles.declarationText}>
            Declaro que los datos proporcionados en esta ficha son verdaderos y completos. Me hago responsable civil y penalmente por los daños emergentes que pudieran ocurrir por causa mía, ya sea por negligencia, omisión o cualquier otra situación, y deslindo de toda responsabilidad al Gimnasio Universitario UAGRM por causas de salud personales, siendo yo responsable absoluto de mis actos.
          </Text>
          <Text style={styles.declarationText}>
            He sido informado/a que, si respondí afirmativamente a alguna pregunta relacionada con mi salud, debo presentar en un plazo de 15 días un certificado de aptitud física emitido por un médico matriculado que autorice mi participación en actividades físicas. También declaro conocer y acatar el reglamento interno del gimnasio.
          </Text>

          <View style={styles.declarationFooter}>
            <Text><Text style={styles.bold}>FECHA: </Text>____ / ____ / ________</Text>
            <Text><Text style={styles.bold}>C.I.: </Text>{user.ci || '________________________'}</Text>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text><Text style={styles.bold}>Firma:</Text></Text>
            <Text><Text style={styles.bold}>Aclaración firma: </Text>{nombreCompleto}</Text>
            <Text style={styles.smallNote}>(Nombre completo)</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FormularioDUBSSPDFDocument;
