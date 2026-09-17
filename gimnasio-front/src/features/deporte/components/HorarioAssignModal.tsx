// src/features/deporte/components/HorarioAssignModal.tsx
import React, { useState } from 'react';
import { FaClock, FaPlus, FaTrashCan, FaXmark, FaSpinner, FaCalendarDays } from 'react-icons/fa6';
import { useHorarios, useCreateHorario, useAssignHorario, useRemoveHorarioDisciplina } from '../hooks/useDeporte';
import type { Disciplina, DisciplinaHorarioItem } from '../services/deporteService';

interface HorarioAssignModalProps {
  isOpen: boolean;
  disciplina: Disciplina | null;
  onClose: () => void;
}

const HorarioAssignModal: React.FC<HorarioAssignModalProps> = ({
  isOpen,
  disciplina,
  onClose,
}) => {
  const { data: horariosList = [], isLoading: isLoadingHorarios } = useHorarios();
  const createHorarioMutation = useCreateHorario();
  const assignMutation = useAssignHorario();
  const removeMutation = useRemoveHorarioDisciplina();

  // Mode: 'select' (existing horario) or 'create' (new horario)
  const [assignMode, setAssignMode] = useState<'select' | 'create'>('select');
  const [selectedHorarioId, setSelectedHorarioId] = useState<number | ''>('');
  
  // New Horario Fields
  const [newDia, setNewDia] = useState<string>('Lunes');
  const [newHoraInicio, setNewHoraInicio] = useState<string>('08:00');
  const [newHoraFin, setNewHoraFin] = useState<string>('10:00');
  const [cupoMaximo, setCupoMaximo] = useState<number>(30);

  if (!isOpen || !disciplina) return null;

  const assignedItems: DisciplinaHorarioItem[] =
    disciplina.disciplina_horarios || disciplina.disciplinaHorarios || [];

  const handleAssignExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHorarioId) return;

    assignMutation.mutate(
      {
        id_disciplina: disciplina.id,
        id_horario: Number(selectedHorarioId),
        cupo_maximo: cupoMaximo,
        estado: true,
      },
      {
        onSuccess: () => {
          setSelectedHorarioId('');
        },
      }
    );
  };

  const handleCreateAndAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoraInicio || !newHoraFin) return;

    createHorarioMutation.mutate(
      {
        dia_semana: newDia,
        hora_inicio: newHoraInicio,
        hora_fin: newHoraFin,
      },
      {
        onSuccess: (newHorario) => {
          assignMutation.mutate({
            id_disciplina: disciplina.id,
            id_horario: newHorario.id,
            cupo_maximo: cupoMaximo,
            estado: true,
          });
          setAssignMode('select');
        },
      }
    );
  };

  const handleRemove = (relationId: number) => {
    if (window.confirm('¿Desea desvincular este horario de la disciplina?')) {
      removeMutation.mutate(relationId);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '95%', maxWidth: '620px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <FaClock style={{ color: '#003B70' }} />
              Gestión de Horarios — {disciplina.nombre}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Asignación de franjas horarias y control de cupos por turno.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
          >
            <FaXmark />
          </button>
        </div>

        {/* SECTION 1: HORARIOS ASIGNADOS */}
        <div style={{ marginBottom: '1.5rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#003B70', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FaCalendarDays style={{ color: '#D97706' }} /> Horarios Asignados Actualmente ({assignedItems.length})
          </h4>

          {assignedItems.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic', margin: 0, textAlign: 'center', padding: '1rem' }}>
              No existen franjas horarias asignadas a esta disciplina deportiva.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {assignedItems.map((item) => {
                const dia = item.horario?.dia_semana || 'Día Programado';
                const inicio = item.horario?.hora_inicio || '00:00';
                const fin = item.horario?.hora_fin || '00:00';
                const cupos = item.cupo_maximo ?? disciplina.cantidad_cupos ?? 30;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FFFFFF',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.84rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#0B1727' }}>{dia}: </strong>
                      <span style={{ color: '#003B70', fontWeight: 700 }}>{inicio} - {fin}</span>
                      <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 700 }}>
                        {cupos} cupos max.
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      title="Desvincular Horario"
                      disabled={removeMutation.isPending}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: '4px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 2: ASIGNAR NUEVO HORARIO */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
              Asignar Franja Horaria
            </h4>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setAssignMode('select')}
                style={{
                  padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1',
                  backgroundColor: assignMode === 'select' ? '#003B70' : '#F1F5F9',
                  color: assignMode === 'select' ? '#FFF' : '#475569',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                }}
              >
                Seleccionar Existente
              </button>
              <button
                type="button"
                onClick={() => setAssignMode('create')}
                style={{
                  padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1',
                  backgroundColor: assignMode === 'create' ? '#003B70' : '#F1F5F9',
                  color: assignMode === 'create' ? '#FFF' : '#475569',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem'
                }}
              >
                <FaPlus /> Crear Nuevo Horario
              </button>
            </div>
          </div>

          {assignMode === 'select' ? (
            <form onSubmit={handleAssignExisting} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Seleccionar Franja Horaria Existente *
                </label>
                {isLoadingHorarios ? (
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Cargando franjas...</div>
                ) : (
                  <select
                    value={selectedHorarioId}
                    onChange={(e) => setSelectedHorarioId(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    <option value="">-- Seleccionar horario del catálogo --</option>
                    {horariosList.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.dia_semana ? `${h.dia_semana}: ` : ''}{h.hora_inicio} - {h.hora_fin}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Cupo Máximo para este Turno *
                </label>
                <input
                  type="number"
                  min="1"
                  value={cupoMaximo}
                  onChange={(e) => setCupoMaximo(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={assignMutation.isPending || !selectedHorarioId}
                  style={{
                    padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none',
                    backgroundColor: '#003B70', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  {assignMutation.isPending ? <FaSpinner className="animate-spin" /> : 'Asignar Horario'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateAndAssign} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Día de la Semana *
                  </label>
                  <select
                    value={newDia}
                    onChange={(e) => setNewDia(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Lunes a Viernes">Lunes a Viernes</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Hora Inicio *
                  </label>
                  <input
                    type="time"
                    value={newHoraInicio}
                    onChange={(e) => setNewHoraInicio(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Hora Fin *
                  </label>
                  <input
                    type="time"
                    value={newHoraFin}
                    onChange={(e) => setNewHoraFin(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Cupo Máximo para este Turno *
                </label>
                <input
                  type="number"
                  min="1"
                  value={cupoMaximo}
                  onChange={(e) => setCupoMaximo(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={createHorarioMutation.isPending || assignMutation.isPending}
                  style={{
                    padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none',
                    backgroundColor: '#003B70', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  {(createHorarioMutation.isPending || assignMutation.isPending) ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    'Crear y Asignar Horario'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorarioAssignModal;
