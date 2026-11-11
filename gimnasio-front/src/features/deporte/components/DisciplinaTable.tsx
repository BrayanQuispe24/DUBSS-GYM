// src/features/deporte/components/DisciplinaTable.tsx
import React from 'react';
import { FaClock, FaPenToSquare, FaTrashCan, FaEye } from 'react-icons/fa6';
import type { Disciplina } from '../services/deporteService';

interface DisciplinaTableProps {
  disciplinas: Disciplina[];
  isLoading: boolean;
  isAdmin?: boolean;
  onView: (d: Disciplina) => void;
  onEdit: (d: Disciplina) => void;
  onDelete: (id: number) => void;
  onAssignHorario: (d: Disciplina) => void;
}

const DisciplinaTable: React.FC<DisciplinaTableProps> = ({
  disciplinas,
  isLoading,
  isAdmin = false,
  onView,
  onEdit,
  onDelete,
  onAssignHorario,
}) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Cargando disciplinas deportivas y horarios...</div>;
  }

  if (disciplinas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}>
        No hay disciplinas deportivas registradas.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border-strong)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 0.85rem' }}>Disciplina</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Capacidad / Cupos</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Descripción</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Horarios Asignados</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Estado</th>
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((d) => (
            <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {d.nombre}
              </td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.70rem', fontWeight: 700, backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary-text)', width: 'fit-content' }}>
                    {d.cantidad_cupos ?? 0} cupos
                  </span>
                  {d.total_cupos_ocupados !== undefined && (
                    <span style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {d.total_cupos_ocupados} ocup. · {d.total_cupos_disponibles ?? 0} libres
                    </span>
                  )}
                </div>
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-secondary)' }}>
                {d.descripcion || 'Sin descripción'}
              </td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                {(() => {
                  const assignedItems = d.disciplina_horarios || d.disciplinaHorarios || [];
                  const directHorarios = d.horarios || [];
                  if (assignedItems.length > 0) {
                    return (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {assignedItems.map((item) => (
                          <span key={item.id} style={{ padding: '0.15rem 0.45rem', borderRadius: '2px', fontSize: '0.70rem', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', fontWeight: 700 }}>
                            {item.horario?.dia_semana ? `${item.horario.dia_semana}: ` : ''}
                            {item.horario?.hora_inicio || '00:00'} - {item.horario?.hora_fin || '00:00'}
                          </span>
                        ))}
                      </div>
                    );
                  }
                  if (directHorarios.length > 0) {
                    return (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {directHorarios.map((h) => (
                          <span key={h.id} style={{ padding: '0.15rem 0.45rem', borderRadius: '2px', fontSize: '0.70rem', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', fontWeight: 700 }}>
                            {h.dia_semana ? `${h.dia_semana}: ` : ''}{h.hora_inicio} - {h.hora_fin}
                          </span>
                        ))}
                      </div>
                    );
                  }
                  return <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sin horario asignado</span>;
                })()}
              </td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                {(() => {
                  const rawEst = d.estado ? String(d.estado).toLowerCase() : 'activo';
                  const isAct = ['1', 'activo', 'true'].includes(rawEst);
                  return (
                    <span
                      style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '2px',
                        fontSize: '0.70rem',
                        fontWeight: 700,
                        backgroundColor: isAct ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                        color: isAct ? 'var(--color-success-text)' : 'var(--color-danger-text)',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {rawEst.toUpperCase()}
                    </span>
                  );
                })()}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                  <button
                    onClick={() => onView(d)}
                    title="Ver Detalles de la Disciplina"
                    style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-primary-text)', border: '1px solid var(--color-border-strong)', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    <FaEye />
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onAssignHorario(d)}
                        title="Asignar Horario"
                        style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', border: '1px solid rgba(217, 119, 6, 0.35)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <FaClock />
                      </button>
                      <button
                        onClick={() => onEdit(d)}
                        title="Editar Disciplina"
                        style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-strong)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <FaPenToSquare />
                      </button>
                      <button
                        onClick={() => onDelete(d.id)}
                        title="Eliminar Disciplina"
                        style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', border: '1px solid rgba(220, 38, 38, 0.35)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <FaTrashCan />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisciplinaTable;
