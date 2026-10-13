// src/features/tramites/components/BoletaPagoModal.tsx
import React, { useState } from 'react';
import { FaPrint, FaXmark, FaFilePdf, FaDownload, FaReceipt } from 'react-icons/fa6';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import BoletaPagoPDFDocument from './BoletaPagoPDFDocument';

interface BoletaPagoModalProps {
  isOpen: boolean;
  pago: any | null;
  onClose: () => void;
}

const BoletaPagoModal: React.FC<BoletaPagoModalProps> = ({ isOpen, pago, onClose }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen || !pago) return null;

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

  const pdfDoc = <BoletaPagoPDFDocument pago={pago} />;
  const fileName = `Boleta_Pago_${pago?.numero_boleta || 'UAGRM'}.pdf`;

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
      console.error('Error al generar PDF de Boleta de Pago, usando ventana de impresión nativa:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

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
          .boleta-printable-document, .boleta-printable-document * {
            visibility: visible !important;
          }
          .boleta-printable-document {
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
        backgroundColor: '#F8FAFC', borderRadius: '12px', width: '100%', maxWidth: '800px',
        maxHeight: '94vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
        border: '1px solid #CBD5E1', overflow: 'hidden'
      }}>
        {/* CONTROL BAR */}
        <div className="no-print" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem', backgroundColor: '#003B70', color: '#FFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaReceipt style={{ color: '#F59E0B', fontSize: '1.25rem' }} />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                Boleta de Pago & Orden de Depósito UAGRM
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#93C5FD' }}>
                Nº: {pago?.numero_boleta || 'PAG-2026'} | Caja Campus UAGRM
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
                  title="Descargar Boleta de Pago en PDF"
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
          <div className="boleta-printable-document" style={{
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
                    <div style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', marginTop: '3px', color: '#003B70', letterSpacing: '0.5px' }}>
                      BOLETA DE PAGO Y ORDEN DE DEPÓSITO - CAJA CAMPUS
                    </div>
                  </td>
                  <td style={{ width: '22%', padding: '0', verticalAlign: 'top' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '4px 6px', fontWeight: 800 }}>DUBSS-PAG-01</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '4px 6px' }}>Fecha: <strong>{fechaRegistro}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 6px' }}>Versión: <strong>1.0</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* SECCIÓN 1: DATOS DE LA BOLETA */}
            <div style={{ border: '1.5px solid #000', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#E2E8F0', padding: '4px 8px', fontWeight: 800, fontSize: '11px', textAlign: 'center', borderBottom: '1px solid #000' }}>
                1. DATOS DE IDENTIFICACIÓN DE LA BOLETA DE PAGO
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>Nº BOLETA DE PAGO:</strong> <span style={{ color: '#003B70', fontWeight: 800 }}>{pago?.numero_boleta || 'PAG-2026-XXXX'}</span>
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>Nº FORMULARIO SOLICITUD:</strong> <span>{sol?.numero_formulario || 'SOL-XXXX'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>MÉTODO / DESTINO PAGO:</strong> <span>{pago?.metodo_pago || 'Caja Campus UAGRM'}</span>
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>ESTADO ACTUAL:</strong> <span style={{ fontWeight: 800, color: String(pago?.estado).toLowerCase() === 'completado' ? '#166534' : '#B45309' }}>{String(pago?.estado || 'pendiente').toUpperCase()}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECCIÓN 2: DATOS DEL SOCIO */}
            <div style={{ border: '1.5px solid #000', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#E2E8F0', padding: '4px 8px', fontWeight: 800, fontSize: '11px', textAlign: 'center', borderBottom: '1px solid #000' }}>
                2. DATOS DEL POSTULANTE / SOCIO DEL GIMNASIO
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <td colSpan={2} style={{ padding: '6px 10px' }}>
                      <strong>POSTULANTE:</strong> {user?.nombre || user?.name} {user?.apellido}
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
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <td colSpan={2} style={{ padding: '6px 10px' }}>
                      <strong>CORREO ELECTRÓNICO:</strong> {user?.email || 'Sin Correo'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '50%', borderRight: '1px solid #000', padding: '6px 10px' }}>
                      <strong>DISCIPLINA:</strong> {disc?.nombre || 'Gimnasio Musculación'}
                    </td>
                    <td style={{ width: '50%', padding: '6px 10px' }}>
                      <strong>TURNO / HORARIO:</strong> {horarioStr}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CAJA MONTO TOTAL */}
            <div style={{
              margin: '1.25rem 0', padding: '1rem', borderRadius: '8px', backgroundColor: '#F0F9FF',
              border: '2px solid #003B70', textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#003B70', textTransform: 'uppercase' }}>
                MONTO TOTAL A CANCELAR EN CAJA CAMPUS UAGRM
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#003B70', margin: '4px 0' }}>
                Bs. {Number(pago?.monto || 150).toFixed(2)}
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', fontStyle: 'italic' }}>
                (Ciento Cincuenta 00/100 Bolivianos)
              </div>
            </div>

            {/* INSTRUCCIONES */}
            <div style={{
              padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #CBD5E1',
              fontSize: '11px', lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: 800, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                INSTRUCCIONES PARA EL SOCIO Y CAJA CAMPUS UAGRM:
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569' }}>
                <li>Imprimir esta Boleta de Pago u Orden de Depósito y apersonarse por las ventanillas de <strong>Caja Campus UAGRM</strong>.</li>
                <li>Cancelar el importe de <strong>Bs. 150.00</strong> exigiendo la entrega de su comprobante oficial de pago timbrado por la universidad.</li>
                <li>Presentar el comprobante físico sellado en la Administración del Gimnasio Universitario para la emisión de su <strong>Boleta de Inscripción</strong> oficial y la habilitación de acceso.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoletaPagoModal;
