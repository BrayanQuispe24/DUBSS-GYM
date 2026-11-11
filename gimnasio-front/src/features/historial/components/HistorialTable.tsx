import React from 'react';
import { FaNotesMedical, FaHeartPulse, FaPenToSquare, FaTrashCan, FaEye, FaFilePdf } from 'react-icons/fa6';
import type { Historial } from '../services/historialService';
import { useAuthStore } from '@/store/authStore';

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
  const { user: currentUser } = useAuthStore();
  const isCliente = currentUser?.rol === 'cliente';
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Cargando historiales clínicos y deportivos...</div>;
  }

  if (historiales.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}>
        No se encontraron historiales registrados.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border-strong)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
              <tr key={h.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  <div>{userName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                    RU: {userRu} {h.facultad_carrera ? `| Carrera: ${h.facultad_carrera}` : `— ${h.usuario?.email || 'N/A'}`}
                  </div>
                </td>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-secondary)' }}>
                  {antecedentesCount > 0 ? (
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.70rem', fontWeight: 700, backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {antecedentesCount} Registrado(s)
                    </span>
                  ) : antecedentesStr.length > 0 ? (
                    <span>{antecedentesStr}</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sin antecedentes</span>
                  )}
                </td>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-secondary)' }}>
                  {h.observaciones_generales || h.observaciones || 'Sin observaciones'}
                </td>
                <td style={{ padding: '0.65rem 0.85rem' }}>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.70rem', fontWeight: 700, backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary-text)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
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
                    backgroundColor: ['1', 'activo', 'true'].includes(String(h.estado).toLowerCase()) ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                    color: ['1', 'activo', 'true'].includes(String(h.estado).toLowerCase()) ? 'var(--color-success-text)' : 'var(--color-danger-text)',
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
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', border: '1px solid rgba(217, 119, 6, 0.35)', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaFilePdf />
                  </button>
                  <button
                    onClick={() => onViewPhysical(h)}
                    title="Ver Ficha Física Completa (Historial)"
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-primary-text)', border: '1px solid var(--color-border-strong)', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaEye />
                  </button>

                  {isCliente && h.id_usuario === currentUser?.id && (
                    <>
                      <button
                        onClick={() => onAddAntecedente(h)}
                        title="Registrar Antecedentes Médicos"
                        style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', border: '1px solid rgba(220, 38, 38, 0.35)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <FaHeartPulse />
                      </button>
                      <button
                        onClick={() => onAddDetalle(h)}
                        title="Agregar Antropometría"
                        style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary-text)', border: '1px solid rgba(220, 38, 38, 0.30)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <FaNotesMedical />
                      </button>
                      <button
                        onClick={() => onEdit(h)}
                        title="Editar Historial"
                        style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-strong)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <FaPenToSquare />
                      </button>
                      <button
                        onClick={() => onDelete(h.id)}
                        title="Eliminar Historial"
                        style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', border: '1px solid rgba(220, 38, 38, 0.35)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <FaTrashCan />
                      </button>
                    </>
                  )}
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
