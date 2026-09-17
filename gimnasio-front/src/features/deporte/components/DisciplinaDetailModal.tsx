// src/features/deporte/components/DisciplinaDetailModal.tsx
import React from 'react';
import { FaBasketball, FaClock, FaXmark, FaCalendarDays, FaUsers, FaCircleInfo, FaPenToSquare } from 'react-icons/fa6';
import type { Disciplina, DisciplinaHorarioItem } from '../services/deporteService';

interface DisciplinaDetailModalProps {
  isOpen: boolean;
  disciplina: Disciplina | null;
  onClose: () => void;
  onOpenManageHorarios?: (d: Disciplina) => void;
}

const DisciplinaDetailModal: React.FC<DisciplinaDetailModalProps> = ({
  isOpen,
  disciplina,
  onClose,
  onOpenManageHorarios,
}) => {
  if (!isOpen || !disciplina) return null;

  const rawEstado = disciplina.estado ? String(disciplina.estado).toLowerCase() : 'activo';
  const isActive = ['1', 'activo', 'true'].includes(rawEstado);
  const assignedItems: DisciplinaHorarioItem[] =
    disciplina.disciplina_horarios || disciplina.disciplinaHorarios || [];
  const directHorarios = disciplina.horarios || [];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '95%', maxWidth: '640px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#003B70',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
            }}>
              <FaBasketball />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
                {disciplina.nombre}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                Expediente de Disciplina Deportiva UAGRM — ID #{disciplina.id}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: isActive ? '#DCFCE7' : '#FEE2E2',
                color: isActive ? '#15803D' : '#B91C1C',
              }}
            >
              {isActive ? 'ACTIVA' : 'INACTIVA'}
            </span>
            <button
              onClick={onClose}
              style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* FICHA GENERAL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
              <FaUsers style={{ color: '#003B70' }} /> Capacidad Máxima de Cupos:
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#003B70' }}>
              {disciplina.cantidad_cupos ?? 0} Cupos Totales
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
              <FaCircleInfo style={{ color: '#D97706' }} /> Estado de Operación:
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isActive ? '#15803D' : '#DC2626' }}>
              {isActive ? 'Habilitada para inscripciones' : 'Suspendida / Fuera de servicio'}
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div style={{ marginBottom: '1.5rem', backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#003B70', display: 'block', marginBottom: '0.35rem' }}>
            Descripción & Objetivos de la Disciplina:
          </span>
          <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
            {disciplina.descripcion || 'Sin descripción u objetivos registrados al momento.'}
          </p>
        </div>

        {/* HORARIOS ASIGNADOS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0B1727', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaCalendarDays style={{ color: '#003B70' }} /> Franjas Horarias Asignadas
            </h4>
            {onOpenManageHorarios && (
              <button
                onClick={() => {
                  onClose();
                  onOpenManageHorarios(disciplina);
                }}
                style={{
                  padding: '0.35rem 0.75rem', borderRadius: '6px', backgroundColor: '#FEF3C7', color: '#B45309',
                  border: '1px solid #FCD34D', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                }}
              >
                <FaClock /> Gestionar Horarios
              </button>
            )}
          </div>

          {assignedItems.length === 0 && directHorarios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.75rem', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1', fontSize: '0.85rem' }}>
              No existen horarios asignados a esta disciplina deportiva.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Día de la Semana</th>
                    <th>Rango Horario</th>
                    <th>Cupos por Turno</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedItems.length > 0
                    ? assignedItems.map((item) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 700, color: '#0B1727' }}>
                            {item.horario?.dia_semana || 'Día Programado'}
                          </td>
                          <td style={{ color: '#003B70', fontWeight: 700 }}>
                            {item.horario?.hora_inicio || '00:00'} - {item.horario?.hora_fin || '00:00'}
                          </td>
                          <td>
                            <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.75rem' }}>
                              {item.cupo_maximo ?? disciplina.cantidad_cupos ?? 30} cupos
                            </span>
                          </td>
                          <td>
                            <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '0.72rem' }}>
                              Habilitado
                            </span>
                          </td>
                        </tr>
                      ))
                    : directHorarios.map((h) => (
                        <tr key={h.id}>
                          <td style={{ fontWeight: 700, color: '#0B1727' }}>
                            {h.dia_semana || 'Programado'}
                          </td>
                          <td style={{ color: '#003B70', fontWeight: 700 }}>
                            {h.hora_inicio} - {h.hora_fin}
                          </td>
                          <td>
                            <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.75rem' }}>
                              {disciplina.cantidad_cupos ?? 30} cupos
                            </span>
                          </td>
                          <td>
                            <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '0.72rem' }}>
                              Habilitado
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem', borderRadius: '6px', border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisciplinaDetailModal;
