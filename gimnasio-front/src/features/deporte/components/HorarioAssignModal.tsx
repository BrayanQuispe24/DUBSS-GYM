// src/features/deporte/components/HorarioAssignModal.tsx
import React, { useState } from 'react';
import { FaClock, FaPlus, FaTrashCan, FaXmark, FaSpinner, FaCalendarDays } from 'react-icons/fa6';
import { useHorarios, useCreateHorario, useAssignHorario, useRemoveHorarioDisciplina } from '../hooks/useDeporte';
import type { Disciplina, DisciplinaHorarioItem } from '../services/deporteService';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const PRESETS_DIAS = [
  { label: 'Lunes a Viernes', days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] },
  { label: 'L - M - V', days: ['Lunes', 'Miércoles', 'Viernes'] },
  { label: 'M - J', days: ['Martes', 'Jueves'] },
  { label: 'Lunes y Viernes', days: ['Lunes', 'Viernes'] },
  { label: 'Fines de Semana', days: ['Sábado', 'Domingo'] },
  { label: 'Todos los días', days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] },
];

const formatDiasSemana = (dias: string[]): string => {
  if (dias.length === 0) return '';
  const sorted = DIAS_SEMANA.filter((d) => dias.includes(d));
  if (sorted.length === 5 && sorted.every((d, i) => d === ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][i])) {
    return 'Lunes a Viernes';
  }
  if (sorted.length === 7) {
    return 'Lunes a Domingo';
  }
  if (sorted.length === 1) {
    return sorted[0];
  }
  if (sorted.length === 2) {
    return `${sorted[0]} y ${sorted[1]}`;
  }
  return `${sorted.slice(0, -1).join(', ')} y ${sorted[sorted.length - 1]}`;
};

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
  
  // New Horario Fields (Multi-day)
  const [selectedDias, setSelectedDias] = useState<string[]>(['Lunes', 'Miércoles', 'Viernes']);
  const [customDiaString, setCustomDiaString] = useState<string>('Lunes, Miércoles y Viernes');
  const [newHoraInicio, setNewHoraInicio] = useState<string>('08:00');
  const [newHoraFin, setNewHoraFin] = useState<string>('10:00');
  const [cupoMaximo, setCupoMaximo] = useState<number>(30);

  if (!isOpen || !disciplina) return null;

  const assignedItems: DisciplinaHorarioItem[] =
    disciplina.disciplina_horarios || disciplina.disciplinaHorarios || [];

  const handleToggleDia = (dia: string) => {
    const updated = selectedDias.includes(dia)
      ? selectedDias.filter((d) => d !== dia)
      : [...selectedDias, dia];
    setSelectedDias(updated);
    setCustomDiaString(formatDiasSemana(updated));
  };

  const handleSelectPreset = (days: string[]) => {
    setSelectedDias(days);
    setCustomDiaString(formatDiasSemana(days));
  };

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

    const diaFinal = customDiaString.trim() || formatDiasSemana(selectedDias) || 'Programado';

    createHorarioMutation.mutate(
      {
        dia_semana: diaFinal,
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
        backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '1.75rem', width: '95%', maxWidth: '620px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <FaClock style={{ color: 'var(--color-primary-text)' }} />
              Gestión de Horarios — {disciplina.nombre}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
              Asignación de franjas horarias y control de cupos por turno.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
          >
            <FaXmark />
          </button>
        </div>

        {/* SECTION 1: HORARIOS ASIGNADOS */}
        <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-surface-muted)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary-text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FaCalendarDays style={{ color: 'var(--color-warning-text)' }} /> Horarios Asignados Actualmente ({assignedItems.length})
          </h4>

          {assignedItems.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0, textAlign: 'center', padding: '1rem' }}>
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
                      backgroundColor: 'var(--color-surface)',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border-strong)',
                      fontSize: '0.84rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{dia}: </strong>
                      <span style={{ color: 'var(--color-primary-text)', fontWeight: 700 }}>{inicio} - {fin}</span>
                      <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', fontWeight: 700 }}>
                        {cupos} cupos max.
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      title="Desvincular Horario"
                      disabled={removeMutation.isPending}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
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
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              Asignar Franja Horaria
            </h4>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setAssignMode('select')}
                style={{
                  padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)',
                  backgroundColor: assignMode === 'select' ? 'var(--color-primary)' : 'var(--color-surface-muted)',
                  color: assignMode === 'select' ? '#FFF' : 'var(--color-text-secondary)',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                }}
              >
                Seleccionar Existente
              </button>
              <button
                type="button"
                onClick={() => setAssignMode('create')}
                style={{
                  padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)',
                  backgroundColor: assignMode === 'create' ? 'var(--color-primary)' : 'var(--color-surface-muted)',
                  color: assignMode === 'create' ? '#FFF' : 'var(--color-text-secondary)',
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                  Seleccionar Franja Horaria Existente *
                </label>
                {isLoadingHorarios ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cargando franjas...</div>
                ) : (
                  <select
                    value={selectedHorarioId}
                    onChange={(e) => setSelectedHorarioId(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                  Cupo Máximo para este Turno *
                </label>
                <input
                  type="number"
                  min="1"
                  value={cupoMaximo}
                  onChange={(e) => setCupoMaximo(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={assignMutation.isPending || !selectedHorarioId}
                  style={{
                    padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none',
                    backgroundColor: 'var(--color-primary)', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  {assignMutation.isPending ? <FaSpinner className="animate-spin" /> : 'Asignar Horario'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateAndAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* SELECTOR DE DÍAS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                    Día(s) de la Semana / Frecuencia *
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    Presets rápidos o combinación libre
                  </span>
                </div>

                {/* BOTONES PRESETS */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.55rem' }}>
                  {PRESETS_DIAS.map((preset) => {
                    const isSelected = formatDiasSemana(selectedDias) === preset.label ||
                      (preset.days.length === selectedDias.length && preset.days.every(d => selectedDias.includes(d)));
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleSelectPreset(preset.days)}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '4px',
                          border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border-strong)',
                          backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'var(--color-surface-muted)',
                          color: isSelected ? 'var(--color-primary-text)' : 'var(--color-text-secondary)',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* BOTONES DE DÍAS INDIVIDUALES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem', marginBottom: '0.5rem' }}>
                  {DIAS_SEMANA.map((dia) => {
                    const active = selectedDias.includes(dia);
                    const shortName = dia.slice(0, 3);
                    return (
                      <button
                        key={dia}
                        type="button"
                        onClick={() => handleToggleDia(dia)}
                        style={{
                          padding: '0.45rem 0.2rem',
                          borderRadius: '6px',
                          border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                          backgroundColor: active ? 'var(--color-primary)' : 'var(--color-surface)',
                          color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        title={dia}
                      >
                        {shortName}
                      </button>
                    );
                  })}
                </div>

                {/* TEXTO RESULTANTE DE LOS DÍAS */}
                <div style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-surface-muted)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.78rem'
                }}>
                  <FaCalendarDays style={{ color: 'var(--color-primary-text)' }} />
                  <span style={{ color: 'var(--color-text-muted)' }}>Frecuencia asignada:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>
                    {customDiaString || 'Ningún día seleccionado'}
                  </strong>
                </div>
              </div>

              {/* HORAS Y CUPO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                    Hora Inicio *
                  </label>
                  <input
                    type="time"
                    value={newHoraInicio}
                    onChange={(e) => setNewHoraInicio(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.65rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                    Hora Fin *
                  </label>
                  <input
                    type="time"
                    value={newHoraFin}
                    onChange={(e) => setNewHoraFin(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.65rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                    Cupos Máximos *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cupoMaximo}
                    onChange={(e) => setCupoMaximo(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.65rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* CARD DE VISTA PREVIA DEL TURNO */}
              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: 'var(--color-primary-soft)',
                border: '1px solid rgba(220, 38, 38, 0.30)',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ color: 'var(--color-primary-text)', fontWeight: 700 }}>Resumen del nuevo turno: </span>
                  <strong style={{ color: 'var(--color-primary-text)' }}>
                    {customDiaString || 'Días'}: {newHoraInicio} - {newHoraFin}
                  </strong>
                </div>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#DBEAFE', color: 'var(--color-primary-text)', fontWeight: 700, fontSize: '0.72rem' }}>
                  {cupoMaximo} cupos
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <button
                  type="submit"
                  disabled={createHorarioMutation.isPending || assignMutation.isPending || selectedDias.length === 0}
                  style={{
                    padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none',
                    backgroundColor: 'var(--color-primary)', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
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
