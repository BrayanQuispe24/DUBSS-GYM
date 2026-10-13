// src/features/tramites/components/BoletaInscripcionModal.tsx
import React, { useState } from 'react';
import { FaPrint, FaXmark, FaCheckDouble, FaDownload, FaQrcode } from 'react-icons/fa6';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import BoletaInscripcionPDFDocument from './BoletaInscripcionPDFDocument';
import CodigoQRInscripcionModal from './CodigoQRInscripcionModal';

interface BoletaInscripcionModalProps {
  isOpen: boolean;
  inscripcion: any | null;
  onClose: () => void;
}

const BoletaInscripcionModal: React.FC<BoletaInscripcionModalProps> = ({ isOpen, inscripcion, onClose }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  if (!isOpen || !inscripcion) return null;

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

  const pdfDoc = <BoletaInscripcionPDFDocument inscripcion={inscripcion} />;
  const fileName = `Boleta_Inscripcion_${inscripcion?.numero_boleta || 'UAGRM'}.pdf`;

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
      console.error('Error al generar PDF de Boleta de Inscripción:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
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
            .inscripcion-printable-document, .inscripcion-printable-document * {
              visibility: visible !important;
            }
            .inscripcion-printable-document {
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
          backgroundColor: '#F8FAFC', borderRadius: '12px', width: '100%', maxWidth: '820px',
          maxHeight: '94vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          border: '1px solid #CBD5E1', overflow: 'hidden'
        }}>
          {/* CONTROL BAR */}
          <div className="no-print" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem', backgroundColor: '#003B70', color: '#FFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FaCheckDouble style={{ color: '#86EFAC', fontSize: '1.25rem' }} />
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                  Boleta Oficial de Inscripción UAGRM
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#93C5FD' }}>
                  Nº: {inscripcion?.numero_boleta || 'INS-2026'} | Gimnasio D.U.B.S.S.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setIsQRModalOpen(true)}
                style={{
                  padding: '0.55rem 1rem', borderRadius: '6px', backgroundColor: '#7C3AED', color: '#FFF',
                  border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)'
                }}
                title="Ver e Imprimir Pase Digital de Ingreso QR"
              >
                <FaQrcode /> Código QR
              </button>

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
                    title="Descargar Boleta de Inscripción en PDF"
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
                title="Abrir o Imprimir PDF en pestaña independiente"
              >
                <FaPrint /> {isGeneratingPdf ? 'Abriendo PDF...' : 'Imprimir Boleta'}
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

        {/* PRINTABLE DOCUMENT */}
        <div style={{ overflowY: 'auto', padding: '1.5rem', flex: 1 }}>
          <div className="inscripcion-printable-document" style={{
            backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid #CBD5E1', borderRadius: '8px',
            fontFamily: "'Segoe UI', Arial, sans-serif", color: '#0F172A', fontSize: '12px', lineHeight: '1.5'
          }}>
            {/* HEADER INSTITUCIONAL */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000', marginBottom: '1.5rem' }}>
              <tbody>
                <tr>
                  <td style={{ width: '22%', borderRight: '1.5px solid #000', padding: '8px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 900, fontSize: '12px', color: '#B91C1C', textTransform: 'uppercase', lineHeight: '1.2' }}>
                      <span style={{ fontSize: '14px', display: 'block', color: '#000' }}>D.U.B.S.S.</span>
                      U.A.G.R.M.
                    </div>
                  </td>
                  <td style={{ width: '56%', borderRight: '1.5px solid #000', padding: '8px', textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#F1F5F9' }}>
                    <div style={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', color: '#475569' }}>UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO</div>
                    <div style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', marginTop: '3px', color: '#15803D', letterSpacing: '0.5px' }}>
                      BOLETA OFICIAL DE INSCRIPCIÓN Y REGISTRO DE ACCESO
                    </div>
                  </td>
                  <td style={{ width: '22%', padding: '0', verticalAlign: 'top' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '4px 6px', fontWeight: 800 }}>DUBSS-INS-01</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '4px 6px' }}>Fecha: <strong>{fechaEmision}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 6px' }}>Estado: <strong style={{ color: '#166534' }}>{String(inscripcion?.estado || 'activo').toUpperCase()}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* SECCIÓN 1: DATOS DE LA BOLETA */}
            <div style={{ border: '1.5px solid #000', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', fontWeight: 800, fontSize: '11px', textAlign: 'center', borderBottom: '1px solid #000' }}>
                1. IDENTIFICACIÓN DE LA BOLETA DE INSCRIPCIÓN
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>Nº BOLETA DE INSCRIPCIÓN:</strong> <span style={{ color: '#003B70', fontWeight: 800 }}>{inscripcion?.numero_boleta || 'INS-2026-XXXX'}</span>
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>FECHA DE EMISIÓN:</strong> <span>{fechaEmision}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>ESTADO MEMBRESÍA:</strong> <span style={{ fontWeight: 800, color: '#166534' }}>{String(inscripcion?.estado || 'activo').toUpperCase()}</span>
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>MONTO ABONADO:</strong> <span style={{ fontWeight: 800, color: '#003B70' }}>Bs. {Number(inscripcion?.monto || 150).toFixed(2)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECCIÓN 2: DATOS DEL SOCIO */}
            <div style={{ border: '1.5px solid #000', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', fontWeight: 800, fontSize: '11px', textAlign: 'center', borderBottom: '1px solid #000' }}>
                2. DATOS DEL SOCIO UNIVERSITARIO HABILITADO
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <td colSpan={2} style={{ padding: '6px 10px' }}>
                      <strong>SOCIO INSCRITO:</strong> {user?.nombre || user?.name} {user?.apellido}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>C.I. / DOCUMENTO:</strong> {user?.ci || 'Sin C.I.'}
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>REGISTRO UNIVERSITARIO:</strong> {user?.registro_universitario || user?.codigo || 'S/N'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>CORREO ELECTRÓNICO:</strong> {user?.email || 'Sin Correo'}
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>CELULAR / CONTACTO:</strong> {user?.celular || 'Sin Celular'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECCIÓN 3: DETALLE DE MEMBRESÍA */}
            <div style={{ border: '1.5px solid #000', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', fontWeight: 800, fontSize: '11px', textAlign: 'center', borderBottom: '1px solid #000' }}>
                3. DETALLE DE LA MEMBRESÍA Y DERECHO DE ACCESO
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>DISCIPLINA:</strong> {inscripcion?.disciplina || 'Gimnasio Musculación'}
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>HORARIO AUTORIZADO:</strong> <span style={{ fontWeight: 800, color: '#003B70' }}>{horarioText}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>FECHA INICIO VIGENCIA:</strong> {fechaIni}
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>FECHA VENCIMIENTO:</strong> <span style={{ fontWeight: 800, color: '#B91C1C' }}>{fechaFin}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CAJA VIGENCIA DESTACADA */}
            <div style={{
              margin: '1.25rem 0', padding: '1rem', borderRadius: '8px', backgroundColor: '#F0FDF4',
              border: '2px solid #166534', textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                PERIODO DE ACCESO VIGENTE HABILITADO
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#15803D', margin: '4px 0' }}>
                {fechaIni} &nbsp; AL &nbsp; {fechaFin}
              </div>
              <div style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>
                Turno de Asistencia Autorizado: {horarioText}
              </div>
            </div>

            {/* INSTRUCCIONES */}
            <div style={{
              padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #CBD5E1',
              fontSize: '11px', lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: 800, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                NORMATIVA Y DERECHOS DEL SOCIO INSCRITO:
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569' }}>
                <li>Esta Boleta Oficial de Inscripción acredita el derecho de ingreso al Gimnasio Universitario UAGRM durante el rango de fechas indicado.</li>
                <li>El ingreso al área de máquinas está estrictamente restringido al horario y turno autorizado en esta boleta.</li>
                <li>Es obligatorio el uso de ropa deportiva adecuada, zapatillas deportivas limpias y toalla de mano en las instalaciones.</li>
                <li>Presentar esta boleta digital o impresa en la recepción del gimnasio al ingresar para el registro de entrada.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

      <CodigoQRInscripcionModal
        isOpen={isQRModalOpen}
        inscripcionId={inscripcion?.id || null}
        inscripcionFallback={inscripcion}
        onClose={() => setIsQRModalOpen(false)}
      />
    </>
  );
};

export default BoletaInscripcionModal;
