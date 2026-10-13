// src/features/historial/components/FormularioDUBSSModal.tsx
import React, { useState, useEffect } from 'react';
import { FaPrint, FaXmark, FaFilePdf, FaDownload } from 'react-icons/fa6';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import type { Historial } from '../services/historialService';
import FormularioDUBSSPDFDocument from './FormularioDUBSSPDFDocument';
import api from '@/services/api';

interface FormularioDUBSSModalProps {
  isOpen: boolean;
  historial: Historial | null;
  usuario?: any;
  onClose: () => void;
}

const FormularioDUBSSModal: React.FC<FormularioDUBSSModalProps> = ({
  isOpen,
  historial: propHistorial,
  usuario: rawUsuario,
  onClose,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [fetchedHistorial, setFetchedHistorial] = useState<Historial | null>(null);

  const userId = propHistorial?.id_usuario || rawUsuario?.id;

  useEffect(() => {
    if (!isOpen) {
      setFetchedHistorial(null);
      return;
    }
    // If historial prop is provided, we don't need auto-fetch unless missing relations
    if (propHistorial && Array.isArray(propHistorial.antecedentes) && propHistorial.detalles) {
      setFetchedHistorial(null);
      return;
    }

    if (userId) {
      api.get('/historiales')
        .then((res) => {
          const list: Historial[] = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          const found = list.find((h) => Number(h.id_usuario) === Number(userId));
          if (found) {
            setFetchedHistorial(found);
          }
        })
        .catch((err) => {
          console.error('Error al auto-obtener historial del usuario:', err);
        });
    }
  }, [isOpen, propHistorial, userId]);

  if (!isOpen) return null;

  const activeHistorial = propHistorial || fetchedHistorial;

  const user = activeHistorial?.usuario || rawUsuario || {};
  const detalles = activeHistorial?.detalles || [];
  const latestDetalle = detalles.length > 0 ? detalles[0] : null;
  const antecedentes = Array.isArray((activeHistorial as any)?.antecedentes) && (activeHistorial as any).antecedentes.length > 0
    ? (activeHistorial as any).antecedentes[0]
    : null;

  const observacionesGen = (activeHistorial as any)?.observaciones_generales || (activeHistorial as any)?.observaciones || '';

  const pdfDoc = <FormularioDUBSSPDFDocument historial={activeHistorial} usuario={rawUsuario} />;
  const fileName = `Formulario_DUBSS_${user?.ci || user?.nombre || 'FR-03'}.pdf`;

  const handlePrintPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.focus();
      }
    } catch (err) {
      console.error('Error al generar PDF con @react-pdf/renderer, usando print nativo:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

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
  const fechaApertura = formattedDate((activeHistorial as any)?.fecha_apertura || (activeHistorial as any)?.created_at);

  return (
    <div className="modal-print-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .modal-print-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .dubss-printable-document, .dubss-printable-document * {
            visibility: visible !important;
          }
          .dubss-printable-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div style={{
        backgroundColor: '#F8FAFC', borderRadius: '12px', width: '100%', maxWidth: '900px',
        maxHeight: '94vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
        border: '1px solid #CBD5E1', overflow: 'hidden'
      }}>
        {/* MODAL CONTROL BAR */}
        <div className="no-print" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem', backgroundColor: '#0F172A', color: '#FFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaFilePdf style={{ color: '#F59E0B', fontSize: '1.25rem' }} />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                Formulario Oficial DUBSS-FR-03
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Inscripción Gimnasio Universitario UAGRM
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PDFDownloadLink
              document={pdfDoc}
              fileName={fileName}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <button
                  disabled={loading}
                  style={{
                    padding: '0.55rem 1rem', borderRadius: '6px', backgroundColor: '#059669', color: '#FFF',
                    border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)', opacity: loading ? 0.7 : 1
                  }}
                  title="Descargar PDF generado con @react-pdf/renderer"
                >
                  <FaDownload /> {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </button>
              )}
            </PDFDownloadLink>

            <button
              onClick={handlePrintPDF}
              disabled={isGeneratingPdf}
              style={{
                padding: '0.55rem 1.2rem', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFF',
                border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: isGeneratingPdf ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)', opacity: isGeneratingPdf ? 0.7 : 1
              }}
              title="Abrir e imprimir PDF vectorial en nueva pestaña"
            >
              <FaPrint /> {isGeneratingPdf ? 'Abriendo PDF...' : 'Imprimir / Abrir PDF'}
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '0.55rem', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1rem'
              }}
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTENT BODY */}
        <div style={{ overflowY: 'auto', padding: '1.5rem', flex: 1 }}>
          <div className="dubss-printable-document" style={{
            backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid #E2E8F0',
            fontFamily: "'Segoe UI', Arial, sans-serif", color: '#0F172A', fontSize: '12px', lineHeight: '1.4'
          }}>
            {/* INSTITUTIONAL HEADER TABLE */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000', marginBottom: '1.5rem' }}>
              <tbody>
                <tr>
                  <td style={{ width: '22%', borderRight: '1.5px solid #000', padding: '8px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 900, fontSize: '11px', color: '#B91C1C', textTransform: 'uppercase', lineHeight: '1.2' }}>
                      <span style={{ fontSize: '13px', display: 'block', color: '#000' }}>D.U.B.S.S.</span>
                      U.A.G.R.M.
                    </div>
                  </td>
                  <td style={{ width: '56%', borderRight: '1.5px solid #000', padding: '8px', textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#F1F5F9' }}>
                    <div style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}>FORMULARIO</div>
                    <div style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.5px' }}>
                      INSCRIPCIÓN GIMNASIO UNIVERSITARIO
                    </div>
                  </td>
                  <td style={{ width: '22%', padding: '0', verticalAlign: 'top' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '4px 6px', fontWeight: 800 }}>DUBSS-FR-03</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '4px 6px' }}>Versión: <strong>1.0</strong></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '4px 6px' }}>Apertura: <strong>{fechaApertura}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 6px' }}>Aprobado por: <strong>DUBSS</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* SECCIÓN 1: DATOS DEL SOCIO */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000', marginBottom: '1.5rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <td colSpan={2} style={{ padding: '6px 8px' }}>
                    <strong>NOMBRES Y APELLIDOS:</strong> {user.name || [user.nombre, user.apellido].filter(Boolean).join(' ') || '________________________________________'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 8px' }}>
                    <strong>C.I.:</strong> {user.ci || '________________'}
                  </td>
                  <td style={{ width: '50%', padding: '6px 8px' }}>
                    <strong>CÓD. O REGISTRO:</strong> {user.registro_universitario || user.codigo || '________________'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <td colSpan={2} style={{ padding: '6px 8px' }}>
                    <strong>FACULTAD/CARRERA/UNIDAD:</strong> {(activeHistorial as any)?.facultad_carrera || '________________________________________'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <td colSpan={2} style={{ padding: '6px 8px' }}>
                    <strong>DOMICILIO:</strong> {(activeHistorial as any)?.domicilio || '________________________________________'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <td colSpan={2} style={{ padding: '6px 8px' }}>
                    <strong>CORREO ELECTRÓNICO:</strong> {user.email || '________________________________________'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <td style={{ borderRight: '1px solid #000', padding: '6px 8px' }}>
                    <strong>CELULAR / EMERGENCIA:</strong> {user.celular || (activeHistorial as any)?.celular_emergencia || '________________'}
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <strong>FECHA DE NACIMIENTO:</strong> {formattedDate((activeHistorial as any)?.fecha_nacimiento)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <td style={{ borderRight: '1px solid #000', padding: '6px 8px' }}>
                    <strong>SEXO:</strong> F ( {(activeHistorial as any)?.sexo?.toLowerCase() === 'femenino' || (activeHistorial as any)?.sexo === 'F' ? 'X' : ' '} ) &nbsp;&nbsp;&nbsp; M ( {(activeHistorial as any)?.sexo?.toLowerCase() === 'masculino' || (activeHistorial as any)?.sexo === 'M' ? 'X' : ' '} )
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <strong>GRUPO SANGUÍNEO:</strong> {(activeHistorial as any)?.grupo_sanguineo || '________'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <td style={{ borderRight: '1px solid #000', padding: '6px 8px' }}>
                    <strong>ALTURA:</strong> {latestDetalle?.altura ? `${latestDetalle.altura} cm` : '________'} &nbsp;|&nbsp; <strong>PESO:</strong> {latestDetalle?.peso ? `${latestDetalle.peso} kg` : '________'}
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <strong>IMC:</strong> {latestDetalle?.imc ? `${latestDetalle.imc}` : '________'} &nbsp;|&nbsp; <strong>PRESIÓN:</strong> {latestDetalle?.presion ? `${latestDetalle.presion}` : '________'}
                  </td>
                </tr>
                <tr>
                  <td style={{ borderRight: '1px solid #000', padding: '6px 8px' }}>
                    <strong>MES DE EMISIÓN:</strong> {new Date().toLocaleDateString('es-BO', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <strong>HORARIO:</strong> <span style={{ fontWeight: 700, color: '#003B70' }}>{(activeHistorial as any)?.horario || (rawUsuario as any)?.horario || '07:00 - 09:00 (Mañana)'}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* SECCIÓN 2: REGLAS DEL GIMNASIO UNIVERSITARIO */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '11px', textAlign: 'center', marginBottom: '8px', textDecoration: 'underline' }}>
                REGLAS DEL GIMNASIO UNIVERSITARIO
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '10.5px', lineHeight: '1.45', listStyleType: 'disc' }}>
                <li>Ingresar al gimnasio en el horario que se inscribió, Prohibido asistir en otro horario</li>
                <li>Limpiar los equipos después de utilizarlos</li>
                <li>Prohibido el ingreso de alimentos en el área de ejercicio, solamente podrá ingresar con botellas con agua.</li>
                <li>Prohibido el ingreso de niños al área de musculación</li>
                <li>Es obligatorio el uso de zapatillas, ropa deportiva y una toallita</li>
                <li>Uso de discos y mancuernas solo en el área de piso de goma</li>
                <li>Los diferentes implementos y equipos del gimnasio deben ser compartidos por todos los usuarios</li>
                <li>Cuide su pertenencia, en caso de pérdida el gimnasio no se hace responsable</li>
                <li>Prohibido el ingreso en estado de embriaguez y/o bajo efectos de sustancias psicoactivas</li>
                <li>Prohibido realizar rutinas sin la supervisión del instructor, la Universidad no se hace responsable por los accidentes derivados de la mala utilización de las máquinas o implementos deportivos.</li>
                <li>Todo usuario está en el deber de retornar los implementos (mancuernas, discos y barras) que utilice al lugar que corresponda y velar por el buen uso de estos en el gimnasio.</li>
                <li>Si maltratar los implementos y equipos, el gimnasio se reserva el derecho de llamar la atención al usuario que contravenga esta recomendación o hacer la reposición de los daños ocasionados</li>
                <li>Prohibido el ingreso a la sala de ejercicios con bolsones y mochilas, estos deben dejar en los casilleros que brinda el gimnasio.</li>
                <li>El incumplimiento del reglamento puede ocasionar retiro indefinido del uso del gimnasio, además de acarrear sanciones disciplinarias.</li>
              </ul>
            </div>

            {/* SECCIÓN 3: CUESTIONARIO MÉDICO */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '11px', textAlign: 'center', marginBottom: '8px', textDecoration: 'underline' }}>
                CUESTIONARIO MÉDICO – GIMNASIO UNIVERSITARIO
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '10px', marginBottom: '10px' }}>
                Por favor, responda con sinceridad las siguientes preguntas sobre su salud:
              </p>

              {/* 1. ANTECEDENTES MEDICOS GENERALES */}
              <div style={{ marginBottom: '10px' }}>
                <strong>1. Antecedentes médicos generales</strong>
                <div style={{ marginTop: '4px', paddingLeft: '10px' }}>
                  ¿Tiene usted antecedentes de enfermedades cardiovasculares? SI ( {isSi(antecedentes?.tiene_enfermedades_cardiovasculares) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.tiene_enfermedades_cardiovasculares) ? 'X' : ' '} ) en caso sea afirmativo, especifique:
                  <div style={{ borderBottom: '1px dotted #000', minHeight: '16px', marginTop: '2px', fontWeight: 600 }}>
                    {antecedentes?.detalle_enfermedades_cardiovasculares || ''}
                  </div>
                </div>

                <div style={{ marginTop: '6px', paddingLeft: '10px' }}>
                  ¿Se le ha realizado, algún procedimiento cardiovascular (angioplastia, cirugía de bypass, recambio valvular, colocación de marcapasos, colocación de cardio desfibrilador)? SI ( {isSi(antecedentes?.se_realizo_intervencion_cardiovascular) ? 'X' : ' '} ) NO ( {!isSi(antecedentes?.se_realizo_intervencion_cardiovascular) ? 'X' : ' '} ) En caso afirmativo especifique:
                  <div style={{ borderBottom: '1px dotted #000', minHeight: '16px', marginTop: '2px', fontWeight: 600 }}>
                    {antecedentes?.detalle_intervencion_cardiovascular || ''}
                  </div>
                </div>
              </div>

              {/* 2. CONDICIONES ESPECIFICAS */}
              <div style={{ marginBottom: '10px' }}>
                <strong>2. ¿Padece alguna de las siguientes condiciones?</strong> (Marque con una X lo que corresponda)
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px', marginTop: '6px', paddingLeft: '10px' }}>
                  <div>Hipertensión arterial: si ( {isSi(antecedentes?.tiene_hipertension_arterial) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_hipertension_arterial) ? 'X' : ' '} )</div>
                  <div>Enfermedades pulmonares: si ( {isSi(antecedentes?.tiene_enfermedades_pulmonares) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_enfermedades_pulmonares) ? 'X' : ' '} )</div>
                  <div>Diabetes: si ( {isSi(antecedentes?.tiene_diabetes) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_diabetes) ? 'X' : ' '} )</div>
                  <div>Enfermedades osteoarticulares: si ( {isSi(antecedentes?.tiene_enfermedades_osteoarticulares) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_enfermedades_osteoarticulares) ? 'X' : ' '} )</div>
                  <div>Enfermedades neurológicas: si ( {isSi(antecedentes?.tiene_enfermedades_neurologicas) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_enfermedades_neurologicas) ? 'X' : ' '} )</div>
                  <div>Convulsiones: si ( {isSi(antecedentes?.tiene_convulsiones) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_convulsiones) ? 'X' : ' '} )</div>
                  <div>Lesiones articulares/musculares: si ( {isSi(antecedentes?.tiene_lesiones) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_lesiones) ? 'X' : ' '} )</div>
                  <div>Alergias conocidas: si ( {isSi(antecedentes?.tiene_alergias) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_alergias) ? 'X' : ' '} )</div>
                </div>
                <div style={{ marginTop: '6px', paddingLeft: '10px' }}>
                  En caso de respuesta afirmativa a alguna de las preguntas anteriores, detalle:
                  <div style={{ borderBottom: '1px dotted #000', minHeight: '16px', marginTop: '2px', fontWeight: 600 }}>
                    {antecedentes?.detalle_hipertension_arterial || antecedentes?.detalle_enfermedades_pulmonares || antecedentes?.detalle_diabetes || antecedentes?.detalle_enfermedades_osteoarticulares || antecedentes?.detalle_enfermedades_neurologicas || antecedentes?.detalle_convulsiones || antecedentes?.detalle_lesiones || antecedentes?.detalle_alergias || ''}
                  </div>
                </div>
              </div>

              {/* 3. INTERVENCIONES Y ANTECEDENTES DEPORTIVOS */}
              <div style={{ marginBottom: '10px' }}>
                <strong>3. Intervenciones y antecedentes deportivos</strong>
                <div style={{ marginTop: '4px', paddingLeft: '10px' }}>
                  ¿Le realizaron a alguna intervención quirúrgica? si ( {isSi(antecedentes?.tiene_intervencion_quirurgica) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.tiene_intervencion_quirurgica) ? 'X' : ' '} )
                  Si la respuesta es afirmativa, especifique:
                  <div style={{ borderBottom: '1px dotted #000', minHeight: '16px', marginTop: '2px', fontWeight: 600 }}>
                    {antecedentes?.detalle_intervencion_quirurgica || ''}
                  </div>
                </div>

                <div style={{ marginTop: '6px', paddingLeft: '10px' }}>
                  ¿Ha sufrido fracturas óseas? si ( {isSi(antecedentes?.sufrio_fracturas_oseas) ? 'X' : ' '} ) no ( {!isSi(antecedentes?.sufrio_fracturas_oseas) ? 'X' : ' '} )
                  Si la respuesta es afirmativa, especifique:
                  <div style={{ borderBottom: '1px dotted #000', minHeight: '16px', marginTop: '2px', fontWeight: 600 }}>
                    {antecedentes?.detalle_fracturas_oseas || ''}
                  </div>
                </div>

                <div style={{ marginTop: '6px', paddingLeft: '10px' }}>
                  ¿Ha sufrido durante la práctica deportiva alguno de los siguientes síntomas? episodio de deshidratación, mareos, obnubilación (confusión mental), pérdida de conocimiento: si ( {isSi(antecedentes?.sufrio_algun_sintoma_durante_deporte) ? 'X' : ' '} ) No ( {!isSi(antecedentes?.sufrio_algun_sintoma_durante_deporte) ? 'X' : ' '} )
                  En caso de afirmativo detallar el episodio:
                  <div style={{ borderBottom: '1px dotted #000', minHeight: '16px', marginTop: '2px', fontWeight: 600 }}>
                    {antecedentes?.detalle_sintomas_durante_deporte || ''}
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE OBSERVACIONES GENERALES DE LA FICHA MÉDICA */}
            {Boolean(observacionesGen) && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 800, fontSize: '11px', textAlign: 'center', marginBottom: '8px', textDecoration: 'underline' }}>
                  OBSERVACIONES GENERALES DE LA FICHA MÉDICA
                </div>
                <div style={{ borderBottom: '1px dotted #000', minHeight: '20px', fontWeight: 600, padding: '4px 8px', backgroundColor: '#F8FAFC' }}>
                  {observacionesGen}
                </div>
              </div>
            )}

            {/* SECCIÓN 4: DECLARACIÓN JURADA */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '11px', textAlign: 'center', marginBottom: '8px', textDecoration: 'underline' }}>
                DECLARACIÓN JURADA
              </div>
              <p style={{ textAlign: 'justify', fontSize: '10.5px', lineHeight: '1.45', marginBottom: '10px' }}>
                Declaro que los datos proporcionados en esta ficha son verdaderos y completos. Me hago responsable civil y penalmente por los daños emergentes que pudieran ocurrir por causa mía, ya sea por negligencia, omisión o cualquier otra situación, y deslindo de toda responsabilidad al Gimnasio Universitario UAGRM por causas de salud personales, siendo yo responsable absoluto de mis actos.
              </p>
              <p style={{ textAlign: 'justify', fontSize: '10.5px', lineHeight: '1.45', marginBottom: '20px' }}>
                He sido informado/a que, si respondí afirmativamente a alguna pregunta relacionada con mi salud, debo presentar en un plazo de 15 días un certificado de aptitud física emitido por un médico matriculado que autorice mi participación en actividades físicas. También declaro conocer y acatar el reglamento interno del gimnasio.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', fontSize: '11px' }}>
                <div><strong>FECHA:</strong> ____ / ____ / ________</div>
                <div><strong>C.I.:</strong> {user.ci || '________________________'}</div>
              </div>

              <div style={{ width: '260px', marginTop: '30px' }}>
                <div style={{ borderBottom: '1px solid #000', marginBottom: '4px' }}></div>
                <div><strong>Firma:</strong></div>
                <div style={{ marginTop: '2px' }}>
                  <strong>Aclaración firma:</strong> {user.name || [user.nombre, user.apellido].filter(Boolean).join(' ') || '___________________________'}
                </div>
                <div style={{ fontSize: '9px', color: '#64748B' }}>(Nombre completo)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioDUBSSModal;
