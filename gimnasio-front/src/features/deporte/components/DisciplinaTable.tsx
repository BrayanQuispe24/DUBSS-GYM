// src/features/deporte/components/DisciplinaTable.tsx
import React from 'react';
import { FaClock, FaPenToSquare, FaTrashCan, FaEye } from 'react-icons/fa6';
import type { Disciplina } from '../services/deporteService';

interface DisciplinaTableProps {
  disciplinas: Disciplina[];
  isLoading: boolean;
  onView: (d: Disciplina) => void;
  onEdit: (d: Disciplina) => void;
  onDelete: (id: number) => void;
  onAssignHorario: (d: Disciplina) => void;
}

const DisciplinaTable: React.FC<DisciplinaTableProps> = ({
  disciplinas,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAssignHorario,
}) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Cargando disciplinas deportivas y horarios...</div>;
  }

  if (disciplinas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        No hay disciplinas deportivas registradas.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1.25rem' }}>Disciplina</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Capacidad / Cupos</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Descripción</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Horarios Asignados</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Estado</th>
            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((d) => (
            <tr key={d.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                {d.nombre}
              </td>
              <td style={{ padding: '0.85rem 1.25rem' }}>
                <span style={{ padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                  {d.cantidad_cupos ?? 0} cupos
                </span>
              </td>
              <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                {d.descripcion || 'Sin descripción'}
              </td>
              <td style={{ padding: '0.85rem 1.25rem' }}>
                {(() => {
                  const assignedItems = d.disciplina_horarios || d.disciplinaHorarios || [];
                  const directHorarios = d.horarios || [];
                  if (assignedItems.length > 0) {
                    return (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {assignedItems.map((item) => (
                          <span key={item.id} style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 700 }}>
                            {item.horario?.dia_semana ? `${item.horario.dia_semana}: ` : ''}
                            {item.horario?.hora_inicio || '00:00'} - {item.horario?.hora_fin || '00:00'}
                          </span>
                        ))}
                      </div>
                    );
                  }
                  if (directHorarios.length > 0) {
                    return (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {directHorarios.map((h) => (
                          <span key={h.id} style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 700 }}>
                            {h.dia_semana ? `${h.dia_semana}: ` : ''}{h.hora_inicio} - {h.hora_fin}
                          </span>
                        ))}
                      </div>
                    );
                  }
                  return <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Sin horario asignado</span>;
                })()}
              </td>
              <td style={{ padding: '0.85rem 1.25rem' }}>
                {(() => {
                  const rawEst = d.estado ? String(d.estado).toLowerCase() : 'activo';
                  const isAct = ['1', 'activo', 'true'].includes(rawEst);
                  return (
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: isAct ? '#DCFCE7' : '#FEE2E2',
                        color: isAct ? '#15803D' : '#B91C1C',
                      }}
                    >
                      {rawEst.toUpperCase()}
                    </span>
                  );
                })()}
              </td>
              <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                  <button
                    onClick={() => onView(d)}
                    title="Ver Detalles de la Disciplina"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#F8FAFC', color: '#003B70', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onAssignHorario(d)}
                    title="Asignar Horario"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#FEF3C7', color: '#D97706', border: 'none', cursor: 'pointer' }}
                  >
                    <FaClock />
                  </button>
                  <button
                    onClick={() => onEdit(d)}
                    title="Editar Disciplina"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer' }}
                  >
                    <FaPenToSquare />
                  </button>
                  <button
                    onClick={() => onDelete(d.id)}
                    title="Eliminar Disciplina"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}
                  >
                    <FaTrashCan />
                  </button>
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
