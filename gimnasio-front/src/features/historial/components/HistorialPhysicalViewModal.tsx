// src/features/historial/components/HistorialPhysicalViewModal.tsx
import React, { useState } from 'react';
import { FaPrint, FaDumbbell, FaXmark, FaFileMedical, FaHeartPulse, FaWeightScale, FaFilePdf } from 'react-icons/fa6';
import type { Historial } from '../services/historialService';
import FormularioDUBSSModal from './FormularioDUBSSModal';

interface HistorialPhysicalViewModalProps {
  isOpen: boolean;
  historial: Historial | null;
  onClose: () => void;
}

const HistorialPhysicalViewModal: React.FC<HistorialPhysicalViewModalProps> = ({
  isOpen,
  historial,
  onClose,
}) => {
  const [showDubssModal, setShowDubssModal] = useState(false);

  if (!isOpen || !historial) return null;

  const handlePrint = () => {
    window.print();
  };

  const getIMCClass = (imc?: number) => {
    if (!imc) return { text: 'N/A', color: '#64748B', bg: '#F1F5F9' };
    if (imc < 18.5) return { text: 'Bajo Peso', color: '#D97706', bg: '#FEF3C7' };
    if (imc < 25) return { text: 'Peso Normal', color: '#15803D', bg: '#DCFCE7' };
    if (imc < 30) return { text: 'Sobrepeso', color: '#D97706', bg: '#FEF3C7' };
    return { text: 'Obesidad', color: '#DC2626', bg: '#FEE2E2' };
  };

  const formatDateOnly = (val?: any): string => {
    if (!val) return 'N/A';
    const str = String(val);
    return str.split(' ')[0].split('T')[0];
  };

  const antecedentesList = (historial as any).antecedentes || historial.antecedentes_medicos || [];

  return (
    <div className="modal-print-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div className="printable-card-modal" style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '800px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '92vh', overflowY: 'auto', border: '1px solid #CBD5E1'
      }}>
        {/* HEADER BAR FOR MODAL ACTIONS */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>
            Vista Previa de Ficha Clínica Física — UAGRM
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowDubssModal(true)}
              style={{
                padding: '0.5rem 1.1rem', borderRadius: '6px', backgroundColor: '#D97706', color: '#FFF',
                border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <FaFilePdf /> Formulario DUBSS-FR-03
            </button>
            <button
              onClick={handlePrint}
              style={{
                padding: '0.5rem 1.1rem', borderRadius: '6px', backgroundColor: '#003B70', color: '#FFF',
                border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <FaPrint /> Imprimir Ficha
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569',
                border: 'none', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT CANVAS */}
        <div id="physical-history-sheet" style={{ fontFamily: 'Arial, sans-serif', color: '#0B1727' }}>
          {/* INSTITUTIONAL HEADER */}
          <div style={{ borderBottom: '3px double #003B70', paddingBottom: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '10px', backgroundColor: '#003B70', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '1.75rem' }}>
                <FaDumbbell />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#003B70', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
                </h2>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#D97706', margin: '2px 0 0 0' }}>
                  DIRECCIÓN DE INFRAESTRUCTURA Y BIENESTAR SOCIAL — GIMNASIO UAGRM
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  FICHA CLÍNICO - DEPORTIVA EXPEDIENTE Nº #{historial.id.toString().padStart(6, '0')}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '6px', backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                ESTADO: {String(historial.estado ?? 'ACTIVO').toUpperCase()}
              </span>
            </div>
          </div>

          {/* DATOS DEL SOCIO / ESTUDIANTE */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#003B70', marginBottom: '0.6rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaFileMedical /> DATOS PERSONALES DEL SOCIO DEPORTISTA
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Nombre Completo:</span>
                <strong>
                  {historial.usuario?.name || [historial.usuario?.nombre, historial.usuario?.apellido].filter(Boolean).join(' ') || historial.usuario?.email || `Usuario #${historial.id_usuario}`}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Registro Universitario (R.U.):</span>
                <strong>{historial.usuario?.registro_universitario || historial.usuario?.codigo || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Facultad / Carrera:</span>
                <strong style={{ color: '#003B70' }}>{historial.facultad_carrera || 'No registrada'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Fecha de Nacimiento:</span>
                <strong style={{ color: '#D97706' }}>
                  {historial.fecha_nacimiento ? formatDateOnly(historial.fecha_nacimiento) : 'No registrada'}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Sexo & Grupo Sanguíneo:</span>
                <strong>{historial.sexo || 'N/A'} | {historial.grupo_sanguineo || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Celular / Emergencia:</span>
                <strong>{historial.usuario?.celular || historial.celular_emergencia || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Domicilio:</span>
                <strong>{historial.domicilio || 'No registrado'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Correo Electrónico:</span>
                <strong>{historial.usuario?.email || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>Fecha Apertura Expediente:</span>
                <strong>{formatDateOnly(historial.fecha_apertura || historial.created_at)}</strong>
              </div>
            </div>
          </div>

          {/* OBSERVACIONES GENERALES Y ANTECEDENTES PATOLOGICOS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', backgroundColor: '#FFF' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#003B70', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaHeartPulse style={{ color: '#DC2626' }} /> ANTECEDENTES MÉDICOS
              </h4>
              {antecedentesList && antecedentesList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                  {antecedentesList.map((ant: any, idx: number) => (
                    <div key={idx} style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                      {ant.tiene_enfermedades_cardiovasculares && <div>• Cardio: {ant.detalle_enfermedades_cardiovasculares || 'Si'}</div>}
                      {ant.tiene_hipertension_arterial && <div>• Hipertensión: {ant.detalle_hipertension_arterial || 'Si'}</div>}
                      {ant.tiene_enfermedades_pulmonares && <div>• Pulmonar/Asma: {ant.detalle_enfermedades_pulmonares || 'Si'}</div>}
                      {ant.tiene_diabetes && <div>• Diabetes: {ant.detalle_diabetes || 'Si'}</div>}
                      {ant.tiene_lesiones && <div>• Lesiones: {ant.detalle_lesiones || 'Si'}</div>}
                      {ant.tiene_alergias && <div>• Alergias: {ant.detalle_alergias || 'Si'}</div>}
                      {ant.observaciones && <div style={{ marginTop: '0.2rem', fontStyle: 'italic' }}>Obs: {ant.observaciones}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic', margin: 0 }}>
                  {typeof historial.antecedentes === 'string' ? historial.antecedentes : 'Sin antecedentes patológicos declarados.'}
                </p>
              )}
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', backgroundColor: '#FFF' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#003B70', marginBottom: '0.5rem' }}>
                DIAGNÓSTICO & OBSERVACIONES CLÍNICAS
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.4', margin: 0 }}>
                {historial.observaciones_generales || historial.observaciones || 'Sin observaciones médicas registradas al momento.'}
              </p>
            </div>
          </div>

          {/* HISTÓRICO DE CONTROL FISICO Y ANTROPOMETRÍA */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#003B70', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaWeightScale style={{ color: '#0369A1' }} /> CONTROL ANTROPOMÉTRICO Y EVALUACIONES FÍSICAS
            </h4>

            {!historial.detalles || historial.detalles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                No existen evaluaciones antropométricas registradas en este expediente.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', border: '1px solid #E2E8F0' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', color: '#334155', fontWeight: 700, borderBottom: '1px solid #CBD5E1' }}>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Fecha</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Peso (kg)</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Altura</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>IMC (kg/m²)</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Clasificación</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>% Grasa</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Presión</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.detalles.map((det: any, idx: number) => {
                    const imcClass = getIMCClass(det.imc);
                    return (
                      <tr key={det.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.6rem 0.8rem', fontWeight: 700 }}>{formatDateOnly(det.fecha_registro || det.fecha)}</td>
                        <td style={{ padding: '0.6rem 0.8rem' }}>{det.peso ? `${det.peso} kg` : '-'}</td>
                        <td style={{ padding: '0.6rem 0.8rem' }}>{det.altura ? `${det.altura} cm` : '-'}</td>
                        <td style={{ padding: '0.6rem 0.8rem', fontWeight: 800 }}>{det.imc || '-'}</td>
                        <td style={{ padding: '0.6rem 0.8rem' }}>
                          <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: imcClass.bg, color: imcClass.color }}>
                            {imcClass.text}
                          </span>
                        </td>
                        <td style={{ padding: '0.6rem 0.8rem' }}>{det.porcentaje_grasa ? `${det.porcentaje_grasa}%` : '-'}</td>
                        <td style={{ padding: '0.6rem 0.8rem' }}>{det.presion || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* FOOTER SIGNATURES FOR PRINT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #CBD5E1', textAlign: 'center', fontSize: '0.78rem', color: '#475569' }}>
            <div>
              <div style={{ borderTop: '1px solid #000', width: '70%', margin: '0 auto 0.4rem auto' }}></div>
              <strong>Firma / Sello Médico o Instructor DUBS</strong>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #000', width: '70%', margin: '0 auto 0.4rem auto' }}></div>
              <strong>Firma del Universitario / Socio</strong>
            </div>
          </div>
        </div>
      </div>

      {/* FORMULARIO DUBSS-FR-03 MODAL */}
      <FormularioDUBSSModal
        isOpen={showDubssModal}
        historial={historial}
        onClose={() => setShowDubssModal(false)}
      />
    </div>
  );
};

export default HistorialPhysicalViewModal;
