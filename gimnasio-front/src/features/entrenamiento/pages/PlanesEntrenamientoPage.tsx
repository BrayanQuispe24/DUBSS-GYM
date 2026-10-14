// src/features/entrenamiento/pages/PlanesEntrenamientoPage.tsx
import React, { useState, useEffect } from 'react';
import {
  FaCalendarDays, FaPlus, FaTrash, FaUserCheck, FaCheck,
  FaChevronUp, FaChevronDown, FaEye, FaPenToSquare, FaDumbbell,
  FaWandMagicSparkles, FaCamera
} from 'react-icons/fa6';
import {
  usePlanesEntrenamiento,
  useRutinas,
  useCreatePlanEntrenamiento,
  useDeletePlanEntrenamiento,
} from '../hooks/useEntrenamiento';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import ConfirmModal from '@/components/common/ConfirmModal';
import PlanDetailModal from '../components/PlanDetailModal';
import PlanEditModal from '../components/PlanEditModal';
import { GenerarRutinaIAModal } from '../components/GenerarRutinaIAModal';
import { AnalisisCorporalModal } from '../components/AnalisisCorporalModal';
import type { PlanEntrenamiento } from '../services/entrenamientoService';

interface RoutineAssignment {
  id_rutina: number;
  dias: string[];
}

const DAYS_LIST = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const PlanesEntrenamientoPage: React.FC = () => {
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  const { data: planesEntrenamiento = [], isLoading } = usePlanesEntrenamiento();
  const { data: rutinas = [] } = useRutinas();
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; apellido: string }[]>([]);

  const createPlanMutation = useCreatePlanEntrenamiento();
  const deletePlanMutation = useDeletePlanEntrenamiento();

  // Formulario retráctil
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Estados del formulario de creación
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [idUsuario, setIdUsuario] = useState<number | ''>('');
  const [selectedRutinaAssignments, setSelectedRutinaAssignments] = useState<RoutineAssignment[]>([]);

  // Estados para modales de Ver, Editar y Eliminar
  const [viewPlanId, setViewPlanId] = useState<number | null>(null);
  const [editPlan, setEditPlan] = useState<PlanEntrenamiento | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);

  // Modales Módulo IA
  const [isIAModalOpen, setIsIAModalOpen] = useState(false);
  const [isAnalisisModalOpen, setIsAnalisisModalOpen] = useState(false);

  useEffect(() => {
    if (canManage) {
      api.get('/usuarios')
        .then((res) => setUsuarios(res.data.data || res.data || []))
        .catch(() => {});
    }
  }, [canManage]);

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

  const handleConfirmDeletePlan = () => {
    if (deletingPlanId !== null) {
      deletePlanMutation.mutate(deletingPlanId);
      setDeletingPlanId(null);
    }
  };

  const handleCreatePlan = (e: React.FormEvent) => {
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

    createPlanMutation.mutate(
      {
        nombre,
        objetivo,
        id_usuario: Number(idUsuario),
        estado: true,
        rutinas: flatRutinasPayload,
      },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          setNombre('');
          setObjetivo('');
          setIdUsuario('');
          setSelectedRutinaAssignments([]);
        },
      }
    );
  };

  const filteredPlanes = (planesEntrenamiento as PlanEntrenamiento[]).filter((p) => {
    if (!canManage) {
      return (
        Number(p.id_usuario) === Number(user?.id) ||
        Number(p.usuario?.id) === Number(user?.id)
      );
    }
    return true;
  });

  return (
    <section>
      {/* HEADER DE LA PÁGINA */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaCalendarDays style={{ color: '#003B70' }} /> Planes de Entrenamiento Deportivo
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Confección, asignación por atleta y distribución semanal de rutinas con ejercicios, videos y galerías multimedia.
        </p>
      </div>

      {/* FORMULARIO DE REGISTRO RETRÁCTIL */}
      {canManage && (
        <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isFormOpen ? '1rem' : 0 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <FaPlus style={{ color: '#0077D4' }} /> Registrar Nuevo Plan de Entrenamiento
            </h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                style={{
                  background: isFormOpen ? '#F1F5F9' : '#0077D4',
                  color: isFormOpen ? '#0077D4' : '#FFF',
                  border: '1px solid #CBD5E1',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                }}
              >
                {isFormOpen ? <FaChevronUp /> : <FaChevronDown />}
                {isFormOpen ? 'Plegar Formulario' : '+ Desplegar Formulario de Registro'}
              </button>
            </div>
          </div>

          {isFormOpen && (
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Atleta / Usuario *</label>
                  <select
                    value={idUsuario}
                    onChange={(e) => setIdUsuario(e.target.value ? Number(e.target.value) : '')}
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', backgroundColor: '#FFF' }}
                  >
                    <option value="">-- Seleccionar Usuario --</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Nombre del Plan *</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Plan Hipertrofia 4 Días"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Objetivo Deportivo</label>
                  <input
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                    placeholder="Ej: Aumento de masa muscular"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* SELECCIONAR RUTINA DEL CATÁLOGO */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Vincular Rutina al Plan</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddRutinaAssignment(Number(e.target.value));
                      e.target.value = '';
                    }
                  }}
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #0077D4', fontSize: '0.82rem', backgroundColor: '#FFF', fontWeight: 600, cursor: 'pointer', color: '#0077D4' }}
                >
                  <option value="">Seleccionar Rutina del Catálogo ({rutinas.length} disponibles)...</option>
                  {rutinas.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre} ({r.nivel || 'General'})</option>
                  ))}
                </select>
              </div>

              {/* LISTADO DE RUTINAS CON DÍAS Y CHECKBOXES */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '0.85rem', background: '#F8FAFC' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', display: 'block', marginBottom: '0.65rem' }}>
                  Rutinas Asignadas ({selectedRutinaAssignments.length})
                </span>

                {selectedRutinaAssignments.map((item) => {
                  const rObj = rutinas.find((r) => r.id === item.id_rutina);
                  return (
                    <div
                      key={item.id_rutina}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '4px',
                        padding: '0.65rem 0.85rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FaDumbbell style={{ color: '#0077D4' }} /> {rObj?.nombre || 'Rutina'} ({rObj?.nivel || 'General'})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRutinaAssignment(item.id_rutina)}
                          style={{
                            background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626',
                            padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                          }}
                          title="Quitar rutina del plan"
                        >
                          <FaTrash /> Quitar
                        </button>
                      </div>

                      <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Seleccionar Días de la Semana:
                      </span>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {DAYS_LIST.map((dia) => {
                          const isChecked = item.dias.includes(dia);
                          return (
                            <label
                              key={dia}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                background: isChecked ? '#0077D4' : '#F1F5F9',
                                color: isChecked ? '#FFFFFF' : '#475569',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                userSelect: 'none',
                                transition: 'all 0.15s ease',
                                border: isChecked ? '1px solid #0077D4' : '1px solid #E2E8F0',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleDayForRutina(item.id_rutina, dia)}
                                style={{ cursor: 'pointer', accentColor: '#0077D4', width: '13px', height: '13px' }}
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
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#94A3B8', fontSize: '0.80rem', background: '#FFF', borderRadius: '4px', border: '1px dashed #CBD5E1' }}>
                    No hay rutinas vinculadas a este plan. Selecciona una rutina arriba.
                  </div>
                )}
              </div>

              {/* BOTÓN GUARDAR */}
              <div style={{ textAlign: 'right' }}>
                <button
                  type="submit"
                  disabled={createPlanMutation.isPending || selectedRutinaAssignments.length === 0}
                  style={{
                    padding: '0.55rem 1.15rem', borderRadius: '4px', border: 'none',
                    background: '#0077D4', color: '#FFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  }}
                >
                  <FaCheck /> {createPlanMutation.isPending ? 'Guardando...' : 'Guardar Plan de Entrenamiento'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TABLA UNIFICADA DE PLANES DE ENTRENAMIENTO */}
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
        Listado de Planes <span style={{ fontSize: '0.80rem', color: '#64748B', fontWeight: 600 }}>({filteredPlanes.length} en total)</span>
      </h3>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', background: '#FFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>Cargando planes de entrenamiento...</div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '0.65rem 1rem' }}>Plan</th>
                <th style={{ padding: '0.65rem 1rem' }}>Atleta / Usuario</th>
                <th style={{ padding: '0.65rem 1rem' }}>Rutinas Asignadas</th>
                <th style={{ padding: '0.65rem 1rem' }}>Recursos / Multimedia</th>
                <th style={{ padding: '0.65rem 1rem' }}>Objetivo</th>
                {canManage && <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPlanes.map((p) => {
                const rawRutinas = p.plan_entrenamiento_rutinas || (p as any).planEntrenamientoRutinas || [];

                // Agrupar días asignados por rutina para resumen en la tabla
                const groupedRutinas: { [key: string]: { nombre: string; dias: string[] } } = {};
                rawRutinas.forEach((item: any) => {
                  const rName = item.rutina?.nombre || 'Rutina';
                  const dia = item.dia_semana;
                  if (!groupedRutinas[rName]) {
                    groupedRutinas[rName] = { nombre: rName, dias: [] };
                  }
                  if (dia && !groupedRutinas[rName].dias.includes(dia)) {
                    groupedRutinas[rName].dias.push(dia);
                  }
                });

                const groupedList = Object.values(groupedRutinas);
                const totalRutinas = groupedList.length;

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaCalendarDays style={{ color: '#0077D4' }} /> {p.nombre}
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      <span style={{ fontSize: '0.72rem', background: '#E0F2FE', color: '#0077D4', padding: '0.15rem 0.45rem', borderRadius: '2px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FaUserCheck /> {p.usuario?.nombre || 'Usuario'} {p.usuario?.apellido || ''}
                      </span>
                    </td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                        {groupedList.slice(0, 3).map((gr, idx) => (
                          <span key={idx} style={{ fontSize: '0.70rem', background: '#F1F5F9', color: '#334155', padding: '0.12rem 0.4rem', borderRadius: '2px', fontWeight: 600 }}>
                            {gr.nombre} {gr.dias.length > 0 ? `(${gr.dias.join(', ')})` : ''}
                          </span>
                        ))}
                        {groupedList.length > 3 && (
                          <span style={{ fontSize: '0.70rem', color: '#64748B', fontWeight: 600 }}>
                            +{groupedList.length - 3} más
                          </span>
                        )}
                        {groupedList.length === 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Sin rutinas asignadas</span>
                        )}
                      </div>
                    </td>

                    {/* COLUMNA DE RECURSOS / MULTIMEDIA (OPCIÓN VER PLAN EN DETALLE CON VIDEOS E IMÁGENES) */}
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <button
                        onClick={() => setViewPlanId(p.id)}
                        title="Ver detalle completo de rutinas, ejercicios, videos e imágenes"
                        style={{
                          background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '0.35rem 0.65rem', borderRadius: '4px',
                          cursor: 'pointer', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700
                        }}
                      >
                        <FaEye style={{ color: '#0077D4' }} /> Ver Plan ({totalRutinas})
                      </button>
                    </td>

                    <td style={{ padding: '0.65rem 1rem', color: '#64748B', fontSize: '0.80rem' }}>
                      {p.objetivo || 'Sin objetivo especificado'}
                    </td>

                    {canManage && (
                      <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            onClick={() => setEditPlan(p)}
                            title="Editar Plan de Entrenamiento"
                            style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0077D4', cursor: 'pointer', fontSize: '0.80rem', padding: '0.35rem 0.55rem', borderRadius: '4px' }}
                          >
                            <FaPenToSquare />
                          </button>
                          <button
                            onClick={() => setDeletingPlanId(p.id)}
                            title="Eliminar Plan"
                            style={{ background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', cursor: 'pointer', fontSize: '0.80rem', padding: '0.35rem 0.55rem', borderRadius: '4px' }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {filteredPlanes.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B' }}>
                    No hay planes de entrenamiento registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DETALLE DE PLAN DE ENTRENAMIENTO (VER RUTINAS, EJERCICIOS, VIDEOS E IMÁGENES) */}
      {viewPlanId !== null && (
        <PlanDetailModal
          planId={viewPlanId}
          onClose={() => setViewPlanId(null)}
        />
      )}

      {/* MODAL DE EDICIÓN DE PLAN */}
      {editPlan !== null && (
        <PlanEditModal
          plan={editPlan}
          onClose={() => setEditPlan(null)}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN PROPIO */}
      <ConfirmModal
        isOpen={deletingPlanId !== null}
        title="Eliminar Plan de Entrenamiento"
        message="¿Deseas eliminar este plan de entrenamiento? Esta acción no se puede deshacer."
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deletePlanMutation.isPending}
        onConfirm={handleConfirmDeletePlan}
        onClose={() => setDeletingPlanId(null)}
      />
      {/* MODALES MÓDULO IA */}
      <GenerarRutinaIAModal
        isOpen={isIAModalOpen}
        onClose={() => setIsIAModalOpen(false)}
      />

      <AnalisisCorporalModal
        isOpen={isAnalisisModalOpen}
        onClose={() => setIsAnalisisModalOpen(false)}
      />
    </section>
  );
};

export default PlanesEntrenamientoPage;
