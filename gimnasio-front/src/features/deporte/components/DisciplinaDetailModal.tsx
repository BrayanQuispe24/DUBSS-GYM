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

  const totalOcupados = disciplina.total_cupos_ocupados ?? assignedItems.reduce((acc, curr) => acc + (curr.cupos_ocupados ?? 0), 0);
  const totalMax = disciplina.cantidad_cupos ?? (assignedItems.length > 0 ? assignedItems.reduce((acc, curr) => acc + (curr.cupo_maximo ?? 0), 0) : 0);
  const totalDisponibles = disciplina.total_cupos_disponibles ?? Math.max(0, totalMax - totalOcupados);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '1.75rem', width: '95%', maxWidth: '680px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
            }}>
              <FaBasketball />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                {disciplina.nombre}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
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
                backgroundColor: isActive ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                color: isActive ? 'var(--color-success-text)' : 'var(--color-danger-text)',
              }}
            >
              {isActive ? 'ACTIVA' : 'INACTIVA'}
            </span>
            <button
              onClick={onClose}
              style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* FICHA GENERAL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1.35rem' }}>
          <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <FaUsers style={{ color: 'var(--color-primary-text)' }} /> Capacidad Máxima:
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>
              {totalMax} Cupos
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <FaUsers style={{ color: totalDisponibles > 0 ? 'var(--color-success-text)' : 'var(--color-danger-text)' }} /> Ocupados / Libres:
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {totalOcupados} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>ocup.</span> · <span style={{ color: totalDisponibles > 0 ? 'var(--color-success-text)' : 'var(--color-danger-text)' }}>{totalDisponibles} disp.</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <FaCircleInfo style={{ color: 'var(--color-warning-text)' }} /> Estado Operativo:
            </span>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isActive ? 'var(--color-success-text)' : 'var(--color-danger-text)' }}>
              {isActive ? 'Habilitada' : 'Suspendida'}
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary-text)', display: 'block', marginBottom: '0.35rem' }}>
            Descripción & Objetivos de la Disciplina:
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {disciplina.descripcion || 'Sin descripción u objetivos registrados al momento.'}
          </p>
        </div>

        {/* HORARIOS ASIGNADOS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaCalendarDays style={{ color: 'var(--color-primary-text)' }} /> Franjas Horarias Asignadas
            </h4>
            {onOpenManageHorarios && (
              <button
                onClick={() => {
                  onClose();
                  onOpenManageHorarios(disciplina);
                }}
                style={{
                  padding: '0.35rem 0.75rem', borderRadius: '6px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)',
                  border: '1px solid rgba(217, 119, 6, 0.35)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                }}
              >
                <FaClock /> Gestionar Horarios
              </button>
            )}
          </div>

          {assignedItems.length === 0 && directHorarios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.75rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px', border: '1px dashed var(--color-border-strong)', fontSize: '0.85rem' }}>
              No existen horarios asignados a esta disciplina deportiva.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Frecuencia / Día(s)</th>
                    <th>Rango Horario</th>
                    <th>Ocupación / Capacidad</th>
                    <th>Cupos Libres</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedItems.length > 0
                    ? assignedItems.map((item) => {
                        const max = item.cupo_maximo ?? disciplina.cantidad_cupos ?? 30;
                        const ocupados = item.cupos_ocupados ?? 0;
                        const disponibles = item.cupos_disponibles ?? Math.max(0, max - ocupados);
                        const isLleno = disponibles <= 0;

                        return (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                              {item.horario?.dia_semana || 'Día Programado'}
                            </td>
                            <td style={{ color: 'var(--color-primary-text)', fontWeight: 700 }}>
                              {item.horario?.hora_inicio || '00:00'} - {item.horario?.hora_fin || '00:00'}
                            </td>
                            <td>
                              <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.75rem' }}>
                                {ocupados} / {max} cupos
                              </span>
                            </td>
                            <td>
                              <span style={{
                                padding: '0.15rem 0.55rem',
                                borderRadius: '4px',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                backgroundColor: isLleno ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                                color: isLleno ? 'var(--color-danger-text)' : 'var(--color-success-text)'
                              }}>
                                {disponibles} {disponibles === 1 ? 'disponible' : 'disponibles'}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                backgroundColor: isLleno ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                                color: isLleno ? 'var(--color-danger-text)' : 'var(--color-success-text)',
                                fontWeight: 700,
                                fontSize: '0.72rem'
                              }}>
                                {isLleno ? 'Agotado' : 'Habilitado'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    : directHorarios.map((h) => (
                        <tr key={h.id}>
                          <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {h.dia_semana || 'Programado'}
                          </td>
                          <td style={{ color: 'var(--color-primary-text)', fontWeight: 700 }}>
                            {h.hora_inicio} - {h.hora_fin}
                          </td>
                          <td>
                            <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.75rem' }}>
                              0 / {disciplina.cantidad_cupos ?? 30} cupos
                            </span>
                          </td>
                          <td>
                            <span style={{ padding: '0.15rem 0.55rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
                              {disciplina.cantidad_cupos ?? 30} disponibles
                            </span>
                          </td>
                          <td>
                            <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', fontWeight: 700, fontSize: '0.72rem' }}>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)',
              backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
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
