// src/features/entrenamiento/pages/PlanesEntrenamientoPage.tsx
import React, { useState, useEffect } from 'react';
import {
  FaCalendarDays, FaPlus, FaTrash, FaUserCheck, FaCheck,
  FaChevronUp, FaChevronDown, FaEye, FaPenToSquare, FaDumbbell,
  FaWandMagicSparkles, FaCamera, FaMagnifyingGlass, FaXmark
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

  // Enterprise Tab: 'list' (Listado) o 'form' (Confeccionar Plan)
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

  // Filtros de búsqueda en toolbar
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('todos');

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
          setActiveTab('list');
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
      const isOwner = Number(p.id_usuario) === Number(user?.id) || Number(p.usuario?.id) === Number(user?.id);
      if (!isOwner) return false;
    }
    if (selectedUserFilter !== 'todos' && String(p.id_usuario) !== selectedUserFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchNombre = p.nombre?.toLowerCase().includes(term);
      const matchAtleta = `${p.usuario?.nombre || ''} ${p.usuario?.apellido || ''}`.toLowerCase().includes(term);
      const matchObj = p.objetivo?.toLowerCase().includes(term);
      if (!matchNombre && !matchAtleta && !matchObj) return false;
    }
    return true;
  });

  return (
    <section>
      {/* ENTERPRISE TAB NAVIGATION BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E2E8F0',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'list' ? '2px solid #0077D4' : '2px solid transparent',
              color: activeTab === 'list' ? '#0077D4' : '#64748B',
              marginBottom: '-1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            <FaCalendarDays size={14} /> Listado de Planes ({filteredPlanes.length})
          </button>

          {canManage && (
            <button
              onClick={() => setActiveTab('form')}
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'form' ? '2px solid #0077D4' : '2px solid transparent',
                color: activeTab === 'form' ? '#0077D4' : '#64748B',
                marginBottom: '-1px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease',
              }}
            >
              <FaPlus size={14} /> Confeccionar Nuevo Plan
            </button>
          )}

          <button
            onClick={() => setIsIAModalOpen(true)}
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              borderBottom: '2px solid transparent',
              color: '#0077D4',
              marginBottom: '-1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
            title="Generación automatizada de planes con Sistema Experto ACSM/NSCA"
          >
            <FaWandMagicSparkles size={14} /> Sistema Experto IA
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingBottom: '0.25rem' }}>
          <button
            type="button"
            onClick={() => setIsAnalisisModalOpen(true)}
            style={{
              padding: '0.45rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#0F172A',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
            title="Evaluación corporal y alineación articular con MediaPipe Pose"
          >
            <FaCamera size={13} style={{ color: '#0077D4' }} /> Análisis Postural (MediaPipe)
          </button>
        </div>
      </div>

      {/* TAB 1: LISTADO DE PLANES */}
      {activeTab === 'list' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '4px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}>
          {/* TOOLBAR */}
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '420px', minWidth: '240px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por plan, atleta u objetivo..."
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  fontSize: '0.80rem',
                  fontWeight: 500,
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  outline: 'none',
                }}
              />
              <FaMagnifyingGlass style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.75rem' }} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  <FaXmark />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.70rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
                Atleta:
              </span>
              <select
                value={selectedUserFilter}
                onChange={(e) => setSelectedUserFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.80rem',
                  fontWeight: 600,
                  background: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                  minWidth: '180px',
                }}
              >
                <option value="todos">Todos los Atletas ({usuarios.length})</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={String(u.id)}>{u.nombre} {u.apellido}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLA DESKTOP */}
          {isLoading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
              Cargando planes de entrenamiento UAGRM...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <tr>
                    <th style={{ padding: '0.65rem 1rem' }}>IDENTIFICADOR DEL PLAN</th>
                    <th style={{ padding: '0.65rem 1rem' }}>ATLETA / SOCIO</th>
                    <th style={{ padding: '0.65rem 1rem' }}>DISTRIBUCIÓN DE RUTINAS</th>
                    <th style={{ padding: '0.65rem 1rem' }}>RECURSOS MULTIMEDIA</th>
                    <th style={{ padding: '0.65rem 1rem' }}>OBJETIVO</th>
                    {canManage && <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>ACCIONES</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredPlanes.map((p) => {
                    const rawRutinas = p.plan_entrenamiento_rutinas || (p as any).planEntrenamientoRutinas || [];

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

                        <td style={{ padding: '0.65rem 1rem' }}>
                          <button
                            onClick={() => setViewPlanId(p.id)}
                            title="Ver detalle completo de rutinas, ejercicios, videos e imágenes"
                            style={{
                              background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '0.35rem 0.65rem', borderRadius: '4px',
                              cursor: 'pointer', color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700
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
                            <div style={{ display: 'inline-flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
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
                      <td colSpan={canManage ? 6 : 5} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B' }}>
                        No hay planes de entrenamiento que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION FOOTER */}
          <div style={{
            padding: '0.65rem 1rem',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748B',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <div>
              Mostrando <strong>{filteredPlanes.length}</strong> {filteredPlanes.length === 1 ? 'plan registrado' : 'planes registrados'} en plataforma
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#0077D4', color: '#FFF', fontWeight: 700, fontSize: '0.72rem' }}>
                Página 1
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PANEL DE FORMULARIO CENTRADO ENTERPRISE */}
      {canManage && activeTab === 'form' && (
        <div style={{ maxWidth: '850px', margin: '0 auto 2rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {/* Header del Panel */}
            <div style={{
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid #E2E8F0',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <FaCalendarDays style={{ color: '#0077D4' }} /> Confeccionar Nuevo Plan de Entrenamiento
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                style={{
                  background: 'none', border: 'none', color: '#64748B', cursor: 'pointer',
                  fontSize: '0.80rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px',
                }}
              >
                Volver al Listado ✕
              </button>
            </div>

            {/* Asistencia con Sistema Experto IA */}
            <div style={{
              margin: '1.25rem 1.25rem 0',
              padding: '0.75rem 1rem',
              background: '#F4F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FaWandMagicSparkles style={{ color: '#0077D4', fontSize: '1.1rem' }} />
                <div>
                  <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#003B70' }}>
                    ¿Prefieres que el Sistema Experto elabore este plan automáticamente?
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284C7' }}>
                    Aplica reglas biomecánicas deterministas ACSM/NSCA según objetivo, material y restricciones.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIAModalOpen(true)}
                style={{
                  background: '#0077D4',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <FaWandMagicSparkles /> Configurar con Sistema Experto
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreatePlan} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.35rem' }}>Atleta / Usuario *</label>
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
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.35rem' }}>Nombre del Plan *</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Plan Hipertrofia 4 Días"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.35rem' }}>Objetivo Deportivo</label>
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
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.35rem' }}>Vincular Rutina al Plan</label>
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
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', display: 'block', marginBottom: '0.65rem' }}>
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

                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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

              {/* FOOTER DE ACCIONES */}
              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.80rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar y Volver
                </button>
                <button
                  type="submit"
                  disabled={createPlanMutation.isPending || selectedRutinaAssignments.length === 0}
                  style={{
                    padding: '0.55rem 1.35rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#0077D4',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  <FaCheck /> {createPlanMutation.isPending ? 'Guardando Plan...' : 'Guardar Plan de Entrenamiento'}
                </button>
              </div>
            </form>
          </div>
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
