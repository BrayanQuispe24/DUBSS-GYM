// src/features/historial/components/HistorialTable.tsx
import React from 'react';
import { FaNotesMedical, FaHeartPulse, FaPenToSquare, FaTrashCan, FaEye } from 'react-icons/fa6';
import type { Historial } from '../services/historialService';

interface HistorialTableProps {
  historiales: Historial[];
  isLoading: boolean;
  onEdit: (historial: Historial) => void;
  onDelete: (id: number) => void;
  onAddDetalle: (historial: Historial) => void;
  onAddAntecedente: (historial: Historial) => void;
  onViewPhysical: (historial: Historial) => void;
}

const HistorialTable: React.FC<HistorialTableProps> = ({
  historiales,
  isLoading,
  onEdit,
  onDelete,
  onAddDetalle,
  onAddAntecedente,
  onViewPhysical,
}) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Cargando historiales clínicos y deportivos...</div>;
  }

  if (historiales.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        No se encontraron historiales registrados.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1.25rem' }}>Usuario / Socio</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Antecedentes</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Observaciones Clínicas</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Mediciones</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Estado</th>
            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
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
              <tr key={h.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                  <div>{userName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                    RU: {userRu} — {h.usuario?.email || 'N/A'}
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                  {antecedentesCount > 0 ? (
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                      {antecedentesCount} Registrado(s)
                    </span>
                  ) : antecedentesStr.length > 0 ? (
                    <span>{antecedentesStr}</span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Sin antecedentes</span>
                  )}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                  {h.observaciones_generales || h.observaciones || 'Sin observaciones'}
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                    {h.detalles ? h.detalles.length : 0} Registros
                  </span>
                </td>
              <td style={{ padding: '0.85rem 1.25rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: ['1', 'activo', 'true'].includes(String(h.estado).toLowerCase()) ? '#DCFCE7' : '#FEE2E2',
                    color: ['1', 'activo', 'true'].includes(String(h.estado).toLowerCase()) ? '#15803D' : '#B91C1C',
                  }}
                >
                  {String(h.estado ?? 'activo').toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                  <button
                    onClick={() => onViewPhysical(h)}
                    title="Ver Ficha Física Completa (Historial)"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#F8FAFC', color: '#003B70', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onAddAntecedente(h)}
                    title="Registrar Antecedentes Médicos"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}
                  >
                    <FaHeartPulse />
                  </button>
                  <button
                    onClick={() => onAddDetalle(h)}
                    title="Agregar Antropometría"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#E0F2FE', color: '#0284C7', border: 'none', cursor: 'pointer' }}
                  >
                    <FaNotesMedical />
                  </button>
                  <button
                    onClick={() => onEdit(h)}
                    title="Editar Historial"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer' }}
                  >
                    <FaPenToSquare />
                  </button>
                  <button
                    onClick={() => onDelete(h.id)}
                    title="Eliminar Historial"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}
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
