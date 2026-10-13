import React, { useState, useEffect } from 'react';
import { FaPenToSquare, FaXmark, FaCheck, FaTrash } from 'react-icons/fa6';
import type { PlanEntrenamiento } from '../services/entrenamientoService';
import { useRutinas, useUpdatePlanEntrenamiento } from '../hooks/useEntrenamiento';
import api from '@/services/api';

interface RoutineAssignment {
  id_rutina: number;
  dias: string[];
}

interface Props {
  plan: PlanEntrenamiento;
  onClose: () => void;
}

const DAYS_LIST = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const PlanEditModal: React.FC<Props> = ({ plan, onClose }) => {
  const { data: rutinas = [] } = useRutinas();
  const updatePlanMutation = useUpdatePlanEntrenamiento();
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; apellido: string }[]>([]);

  // Extraer las rutinas preexistentes y agrupar sus días asignados
  const rawRutinas = plan.plan_entrenamiento_rutinas || (plan as any).planEntrenamientoRutinas || [];
  const initialAssignments: RoutineAssignment[] = [];

  rawRutinas.forEach((item: any) => {
    const idRutina = item.id_rutina || item.rutina?.id;
    const dia = item.dia_semana;
    if (!idRutina) return;

    const existing = initialAssignments.find((a) => a.id_rutina === idRutina);
    if (existing) {
      if (dia && !existing.dias.includes(dia)) {
        existing.dias.push(dia);
      }
    } else {
      initialAssignments.push({
        id_rutina: idRutina,
        dias: dia ? [dia] : ['Lunes'],
      });
    }
  });

  const [nombre, setNombre] = useState(plan.nombre || '');
  const [objetivo, setObjetivo] = useState(plan.objetivo || '');
  const [idUsuario, setIdUsuario] = useState<number | ''>(plan.id_usuario || '');
  const [selectedRutinaAssignments, setSelectedRutinaAssignments] = useState<RoutineAssignment[]>(initialAssignments);

  useEffect(() => {
    api.get('/usuarios')
      .then((res) => setUsuarios(res.data.data || res.data || []))
      .catch(() => {});
  }, []);

  const handleAddRutinaAssignment = (idRutina: number) => {
    if (!idRutina) return;
    if (selectedRutinaAssignments.some((item) => item.id_rutina === idRutina)) return;
    setSelectedRutinaAssignments([
      ...selectedRutinaAssignments,
      { id_rutina: idRutina, dias: ['Lunes'] },
    ]);
  };

  const handleRemoveRutinaAssignment = (idRutina: number) => {
    setSelectedRutinaAssignments(selectedRutinaAssignments.filter((item) => item.id_rutina !== idRutina));
  };

  const handleToggleDayForRutina = (idRutina: number, dia: string) => {
    setSelectedRutinaAssignments((prev) =>
      prev.map((item) => {
        if (item.id_rutina !== idRutina) return item;
        const currentDays = item.dias;
        const newDays = currentDays.includes(dia)
          ? currentDays.filter((d) => d !== dia)
          : [...currentDays, dia];
        return { ...item, dias: newDays };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !idUsuario) return;

    const flatRutinasPayload: { id_rutina: number; dia_semana: string }[] = [];
    selectedRutinaAssignments.forEach((item) => {
      item.dias.forEach((dia) => {
        flatRutinasPayload.push({
          id_rutina: item.id_rutina,
          dia_semana: dia,
        });
      });
    });

    try {
      await updatePlanMutation.mutateAsync({
        id: plan.id,
        data: {
          nombre,
          objetivo,
          id_usuario: Number(idUsuario),
          estado: plan.estado ?? true,
          rutinas: flatRutinasPayload,
        },
      });
      onClose();
    } catch (err) {
      console.error('Error al actualizar el plan de entrenamiento:', err);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: '#FFFFFF', borderRadius: '16px', maxWidth: '720px', width: '100%',
          maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaPenToSquare style={{ color: '#003B70' }} /> Editar Plan de Entrenamiento: {plan.nombre}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <FaXmark style={{ fontSize: '1.1rem' }} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Atleta / Usuario *</label>
            <select
              value={idUsuario}
              onChange={(e) => setIdUsuario(e.target.value ? Number(e.target.value) : '')}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
            >
              <option value="">-- Seleccionar Usuario del Sistema --</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Nombre del Plan *</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Plan Fuerza Mesociclo 1"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Objetivo Deportivo</label>
              <input
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                placeholder="Ej: Aumento de masa muscular"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* VINCULAR RUTINAS */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Vincular Rutina al Plan</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddRutinaAssignment(Number(e.target.value));
                  e.target.value = '';
                }
              }}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF', cursor: 'pointer' }}
            >
              <option value="">-- Seleccionar Rutina del Catálogo --</option>
              {rutinas.map((r) => (
                <option key={r.id} value={r.id}>{r.nombre} ({r.nivel || 'General'})</option>
              ))}
            </select>
          </div>

          {/* CONTENEDOR DE RUTINAS CON CHECKBOXES PARA DÍAS */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem', background: '#F8FAFC' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.75rem' }}>
              Rutinas Configurada en este Plan ({selectedRutinaAssignments.length})
            </span>

            {selectedRutinaAssignments.map((item) => {
              const rObj = rutinas.find((r) => r.id === item.id_rutina);
              return (
                <div
                  key={item.id_rutina}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    marginBottom: '0.75rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                      {rObj?.nombre || 'Rutina'} ({rObj?.nivel || 'General'})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRutinaAssignment(item.id_rutina)}
                      style={{
                        background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626',
                        padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                      }}
                      title="Quitar rutina del plan"
                    >
                      <FaTrash /> Quitar
                    </button>
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
                    Seleccionar Días de la Semana:
                  </span>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {DAYS_LIST.map((dia) => {
                      const isChecked = item.dias.includes(dia);
                      return (
                        <label
                          key={dia}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: isChecked ? '#003B70' : '#F1F5F9',
                            color: isChecked ? '#FFFFFF' : '#475569',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'all 0.15s ease',
                            border: isChecked ? '1px solid #003B70' : '1px solid #E2E8F0',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleDayForRutina(item.id_rutina, dia)}
                            style={{ cursor: 'pointer', accentColor: '#003B70', width: '14px', height: '14px' }}
                          />
                          {dia}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {selectedRutinaAssignments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.25rem', color: '#94A3B8', fontSize: '0.82rem', background: '#FFF', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                No hay rutinas vinculadas a este plan. Selecciona una rutina arriba.
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updatePlanMutation.isPending || selectedRutinaAssignments.length === 0}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: '6px', border: 'none',
                background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              <FaCheck /> {updatePlanMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanEditModal;
