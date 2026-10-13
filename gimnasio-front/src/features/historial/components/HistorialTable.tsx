// src/features/historial/components/HistorialTable.tsx
import React from 'react';
import { FaNotesMedical, FaHeartPulse, FaPenToSquare, FaTrashCan, FaEye, FaFilePdf } from 'react-icons/fa6';
import type { Historial } from '../services/historialService';

interface HistorialTableProps {
  historiales: Historial[];
  isLoading: boolean;
  onEdit: (historial: Historial) => void;
  onDelete: (id: number) => void;
  onAddDetalle: (historial: Historial) => void;
  onAddAntecedente: (historial: Historial) => void;
  onViewPhysical: (historial: Historial) => void;
  onViewDubssForm: (historial: Historial) => void;
}

const HistorialTable: React.FC<HistorialTableProps> = ({
  historiales,
  isLoading,
  onEdit,
  onDelete,
  onAddDetalle,
  onAddAntecedente,
  onViewPhysical,
  onViewDubssForm,
}) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Cargando historiales clínicos y deportivos...</div>;
  }

  if (historiales.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}>
        No se encontraron historiales registrados.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 0.85rem' }}>Usuario / Socio</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Antecedentes</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Observaciones Clínicas</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Mediciones</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Estado</th>
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historiales.map((h) => {
            const userName = h.usuario?.name || [h.usuario?.nombre, h.usuario?.apellido].filter(Boolean).join(' ') || h.usuario?.email || `Usuario #${h.id_usuario}`;
            const userRu = h.usuario?.registro_universitario || h.usuario?.codigo || 'N/A';
            const antecedentesArr = Array.isArray(h.antecedentes) ? h.antecedentes : Array.isArray(h.antecedentes_medicos) ? h.antecedentes_medicos : null;
            const antecedentesCount = antecedentesArr ? antecedentesArr.length : 0;
            const antecedentesStr = typeof h.antecedentes === 'string' ? h.antecedentes : '';

            return (
              <tr key={h.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0B1727' }}>
                  <div>{userName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 400 }}>
                    RU: {userRu} {h.facultad_carrera ? `| Carrera: ${h.facultad_carrera}` : `— ${h.usuario?.email || 'N/A'}`}
                  </div>
                </td>
                <td style={{ padding: '0.65rem 0.85rem', color: '#475569' }}>
                  {antecedentesCount > 0 ? (
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.70rem', fontWeight: 700, backgroundColor: '#FEE2E2', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {antecedentesCount} Registrado(s)
                    </span>
                  ) : antecedentesStr.length > 0 ? (
                    <span>{antecedentesStr}</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Sin antecedentes</span>
                  )}
                </td>
                <td style={{ padding: '0.65rem 0.85rem', color: '#475569' }}>
                  {h.observaciones_generales || h.observaciones || 'Sin observaciones'}
                </td>
                <td style={{ padding: '0.65rem 0.85rem' }}>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.70rem', fontWeight: 700, backgroundColor: '#E0F2FE', color: '#0077D4', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {h.detalles ? h.detalles.length : 0} Registros
                  </span>
                </td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                <span
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '2px',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    backgroundColor: ['1', 'activo', 'true'].includes(String(h.estado).toLowerCase()) ? '#DCFCE7' : '#FEE2E2',
                    color: ['1', 'activo', 'true'].includes(String(h.estado).toLowerCase()) ? '#15803D' : '#B91C1C',
                  }}
                >
                  {String(h.estado ?? 'activo').toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                  <button
                    onClick={() => onViewDubssForm(h)}
                    title="Imprimir Formulario Oficial DUBSS-FR-03"
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaFilePdf />
                  </button>
                  <button
                    onClick={() => onViewPhysical(h)}
                    title="Ver Ficha Física Completa (Historial)"
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#F8FAFC', color: '#0077D4', border: '1px solid #CBD5E1', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onAddAntecedente(h)}
                    title="Registrar Antecedentes Médicos"
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaHeartPulse />
                  </button>
                  <button
                    onClick={() => onAddDetalle(h)}
                    title="Agregar Antropometría"
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#E0F2FE', color: '#0077D4', border: '1px solid #BAE6FD', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaNotesMedical />
                  </button>
                  <button
                    onClick={() => onEdit(h)}
                    title="Editar Historial"
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaPenToSquare />
                  </button>
                  <button
                    onClick={() => onDelete(h.id)}
                    title="Eliminar Historial"
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaTrashCan />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialTable;
