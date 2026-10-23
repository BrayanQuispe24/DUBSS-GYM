// src/features/entrenamiento/pages/RutinasPage.tsx
import React, { useState } from 'react';
import {
  FaListCheck, FaPlus, FaTrash, FaDumbbell, FaMagnifyingGlass, FaFilter,
  FaClock, FaRepeat, FaEye, FaPenToSquare, FaWandMagicSparkles, FaCamera,
  FaXmark
} from 'react-icons/fa6';
import {
  useRutinas,
  useEjercicios,
  useTiposEjercicio,
  useGruposMusculares,
  useCreateRutina,
  useDeleteRutina,
} from '../hooks/useEntrenamiento';
import { useAuthStore } from '@/store/authStore';
import type { Rutina } from '../services/entrenamientoService';
import ConfirmModal from '@/components/common/ConfirmModal';
import RutinaDetailModal from '../components/RutinaDetailModal';
import RutinaEditModal from '../components/RutinaEditModal';
import { GenerarRutinaIAModal } from '../components/GenerarRutinaIAModal';
import { AnalisisCorporalModal } from '../components/AnalisisCorporalModal';

const RutinasPage: React.FC = () => {
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  const { data: rutinas = [], isLoading } = useRutinas();
  const { data: responseEjercicios } = useEjercicios({ all: true });
  const ejercicios = responseEjercicios?.data || [];
  const { data: tipos = [] } = useTiposEjercicio();
  const { data: grupos = [] } = useGruposMusculares();

  const createRutinaMutation = useCreateRutina();
  const deleteRutinaMutation = useDeleteRutina();

  // Navegación por Tabs Enterprise
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

  // Filtros del Listado de Rutinas
  const [listSearch, setListSearch] = useState('');
  const [listNivelFilter, setListNivelFilter] = useState('todos');

  // Estados del formulario de creación
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('Intermedio');

  // Filtros de búsqueda de ejercicios para agregar a la rutina
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipoId, setFilterTipoId] = useState<number | ''>('');
  const [filterGrupoId, setFilterGrupoId] = useState<number | ''>('');

  // Ejercicios seleccionados para la rutina con Series, Repeticiones y Descanso
  const [selectedEjercicios, setSelectedEjercicios] = useState<{
    id_ejercicio: number;
    series: number;
    repeticiones: number;
    descanso_segundos: number;
  }[]>([]);

  // Estado para modal de detalle de la rutina (Ver Rutina)
  const [viewRutinaDetail, setViewRutinaDetail] = useState<Rutina | null>(null);

  // Estado para modal de edición de la rutina (Editar Rutina)
  const [editRutina, setEditRutina] = useState<Rutina | null>(null);

  // Estado para ConfirmModal de eliminación de rutina
  const [deletingRutinaId, setDeletingRutinaId] = useState<number | null>(null);

  // Modales Módulo IA
  const [isIAModalOpen, setIsIAModalOpen] = useState(false);
  const [isAnalisisModalOpen, setIsAnalisisModalOpen] = useState(false);

  // Filtrado de rutinas para la tabla
  const filteredRutinas = rutinas.filter((r: Rutina) => {
    if (listNivelFilter !== 'todos' && r.nivel?.toLowerCase() !== listNivelFilter.toLowerCase()) {
      return false;
    }
    if (listSearch.trim()) {
      const term = listSearch.toLowerCase();
      const matchNombre = r.nombre?.toLowerCase().includes(term);
      const matchDesc = r.descripcion?.toLowerCase().includes(term);
      if (!matchNombre && !matchDesc) return false;
    }
    return true;
  });

  // Filtrar catálogo de ejercicios disponibles para agregar
  const filteredCatalogEjercicios = ejercicios.filter((ex) => {
    const matchesQuery = searchQuery === '' || ex.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = filterTipoId === '' || ex.id_tipo_ejercicio === Number(filterTipoId);
    const matchesGrupo =
      filterGrupoId === '' ||
      ex.ejercicio_grupo_musculares?.some(
        (gm: any) => (gm.grupo_muscular?.id || gm.id_grupo_muscular) === Number(filterGrupoId)
      );
    return matchesQuery && matchesTipo && matchesGrupo;
  });

  const handleAddEjercicioRow = (idEjercicio: number) => {
    if (!idEjercicio) return;
    if (selectedEjercicios.some((e) => e.id_ejercicio === idEjercicio)) return;
    setSelectedEjercicios([
      ...selectedEjercicios,
      { id_ejercicio: idEjercicio, series: 4, repeticiones: 12, descanso_segundos: 60 },
    ]);
  };

  const handleRemoveEjercicioRow = (index: number) => {
    setSelectedEjercicios(selectedEjercicios.filter((_, i) => i !== index));
  };

  const handleConfirmDeleteRutina = () => {
    if (deletingRutinaId !== null) {
      deleteRutinaMutation.mutate(deletingRutinaId);
      setDeletingRutinaId(null);
    }
  };

  const handleCreateRutina = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;
    createRutinaMutation.mutate(
      {
        nombre,
        descripcion,
        nivel,
        estado: true,
        ejercicios: selectedEjercicios,
      },
      {
        onSuccess: () => {
          setActiveTab('list');
          setNombre('');
          setDescripcion('');
          setSelectedEjercicios([]);
          setSearchQuery('');
          setFilterTipoId('');
          setFilterGrupoId('');
        },
      }
    );
  };

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
            <FaListCheck size={14} /> Listado de Rutinas ({filteredRutinas.length})
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
              <FaPlus size={14} /> Diseñar Nueva Rutina
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
            title="Generación automatizada de rutinas con Sistema Experto"
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
            title="Evaluación corporal y alineación postural con MediaPipe Pose"
          >
            <FaCamera size={13} style={{ color: '#0077D4' }} /> Análisis Postural (MediaPipe)
          </button>
        </div>
      </div>

      {/* TAB 1: LISTADO DE RUTINAS */}
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
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                placeholder="Buscar rutina por nombre o descripción..."
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
              {listSearch && (
                <button
                  onClick={() => setListSearch('')}
                  style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  <FaXmark />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.70rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
                Nivel:
              </span>
              <select
                value={listNivelFilter}
                onChange={(e) => setListNivelFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.80rem',
                  fontWeight: 600,
                  background: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                  minWidth: '150px',
                }}
              >
                <option value="todos">Todos los Niveles</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          {/* TABLA DESKTOP */}
          {isLoading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
              Cargando catálogo de rutinas de entrenamiento...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <tr>
                    <th style={{ padding: '0.65rem 1rem' }}>RUTINA / DENOMINACIÓN</th>
                    <th style={{ padding: '0.65rem 1rem' }}>NIVEL</th>
                    <th style={{ padding: '0.65rem 1rem' }}>EJERCICIOS ASIGNADOS</th>
                    <th style={{ padding: '0.65rem 1rem' }}>RECURSOS MULTIMEDIA</th>
                    <th style={{ padding: '0.65rem 1rem' }}>DESCRIPCIÓN TÉCNICA</th>
                    {canManage && <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>ACCIONES</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredRutinas.map((r: Rutina) => {
                    const totalEjercicios = r.rutina_ejercicios?.length || 0;

                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <FaListCheck style={{ color: '#0077D4' }} /> {r.nombre}
                          </div>
                        </td>

                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span style={{ fontSize: '0.70rem', background: '#E0F2FE', color: '#0077D4', padding: '0.15rem 0.45rem', borderRadius: '2px', fontWeight: 700, textTransform: 'uppercase' }}>
                            {r.nivel || 'General'}
                          </span>
                        </td>

                        <td style={{ padding: '0.65rem 1rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                            {r.rutina_ejercicios?.slice(0, 3).map((re: any, idx: number) => (
                              <span key={idx} style={{ fontSize: '0.70rem', background: '#F1F5F9', color: '#334155', padding: '0.12rem 0.4rem', borderRadius: '2px', fontWeight: 600 }}>
                                {re.ejercicio?.nombre || 'Ejercicio'} ({re.series || 4}x{re.repeticiones || 12})
                              </span>
                            ))}
                            {totalEjercicios > 3 && (
                              <span style={{ fontSize: '0.70rem', color: '#64748B', fontWeight: 600 }}>
                                +{totalEjercicios - 3} más
                              </span>
                            )}
                            {totalEjercicios === 0 && (
                              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Sin ejercicios asignados</span>
                            )}
                          </div>
                        </td>

                        {/* COLUMNA DE RECURSOS / MULTIMEDIA (OPCIÓN VER RUTINA) */}
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <button
                            onClick={() => setViewRutinaDetail(r)}
                            title="Ver detalle completo con videos e imágenes del ejercicio"
                            style={{
                              background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '0.35rem 0.65rem', borderRadius: '4px',
                              cursor: 'pointer', color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700
                            }}
                          >
                            <FaEye style={{ color: '#0077D4' }} /> Ver Rutina ({totalEjercicios})
                          </button>
                        </td>

                        <td style={{ padding: '0.65rem 1rem', color: '#64748B', maxWidth: '250px' }}>
                          <span style={{ display: 'inline-block', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {r.descripcion || '-'}
                          </span>
                        </td>

                        {canManage && (
                          <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                              <button
                                onClick={() => setEditRutina(r)}
                                title="Editar rutina"
                                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0077D4', cursor: 'pointer', fontSize: '0.80rem', padding: '0.35rem 0.55rem', borderRadius: '4px' }}
                              >
                                <FaPenToSquare />
                              </button>
                              <button
                                onClick={() => setDeletingRutinaId(r.id)}
                                title="Eliminar rutina"
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
                  {filteredRutinas.length === 0 && (
                    <tr>
                      <td colSpan={canManage ? 6 : 5} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.90rem' }}>No se encontraron rutinas con los filtros seleccionados.</span>
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Utiliza la pestaña "Diseñar Nueva Rutina" para registrar una.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PIE DE TABLA / PAGINACIÓN ENTERPRISE */}
          <div style={{
            padding: '0.65rem 1rem',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748B',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <div>
              Mostrando <strong>{filteredRutinas.length}</strong> {filteredRutinas.length === 1 ? 'rutina registrada' : 'rutinas registradas'} en plataforma
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
                <FaListCheck style={{ color: '#0077D4' }} /> Diseñar Nueva Rutina de Entrenamiento
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
                    ¿Prefieres que el Sistema Experto elabore esta rutina automáticamente?
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Selección determinista por nivel, grupo muscular e hipertrofia/fuerza.
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
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <FaWandMagicSparkles /> Configurar con IA
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreateRutina} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.35rem' }}>
                    Nombre de la Rutina *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Rutina Pectoral & Tríceps Hipertrofia"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.35rem' }}>
                    Nivel de Dificultad
                  </label>
                  <select
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', backgroundColor: '#FFF' }}
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.35rem' }}>
                  Descripción / Recomendaciones Técnicas
                </label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Orientado al desarrollo hipertrófico con descansos entre 60 y 90 segundos."
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              {/* SECCIÓN DE BÚSQUEDA Y FILTROS PARA ASIGNAR EJERCICIOS */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', marginBottom: '0.65rem' }}>
                  <FaFilter style={{ color: '#0077D4', marginRight: '0.3rem' }} /> Filtrar y Vincular Ejercicios a la Rutina
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.70rem', fontWeight: 600, color: '#64748B', marginBottom: '0.2rem' }}>Por Categoría / Tipo</label>
                    <select
                      value={filterTipoId}
                      onChange={(e) => setFilterTipoId(e.target.value ? Number(e.target.value) : '')}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFF' }}
                    >
                      <option value="">-- Todos los Tipos --</option>
                      {tipos.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.70rem', fontWeight: 600, color: '#64748B', marginBottom: '0.2rem' }}>Por Grupo Muscular</label>
                    <select
                      value={filterGrupoId}
                      onChange={(e) => setFilterGrupoId(e.target.value ? Number(e.target.value) : '')}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFF' }}
                    >
                      <option value="">-- Todos los Grupos --</option>
                      {grupos.map((g: any) => (
                        <option key={g.id} value={g.id}>{g.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.70rem', fontWeight: 600, color: '#64748B', marginBottom: '0.2rem' }}>Buscar por Nombre</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ej: Press, Biceps..."
                        style={{ width: '100%', padding: '0.4rem 0.4rem 0.4rem 1.6rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFF' }}
                      />
                      <FaMagnifyingGlass style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.70rem' }} />
                    </div>
                  </div>
                </div>

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddEjercicioRow(Number(e.target.value));
                      e.target.value = '';
                    }
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #0077D4', fontSize: '0.80rem', backgroundColor: '#FFF', fontWeight: 600, cursor: 'pointer', color: '#0077D4' }}
                >
                  <option value="">
                    Seleccionar Ejercicio del Catálogo ({filteredCatalogEjercicios.length} de {ejercicios.length} disponibles)...
                  </option>
                  {filteredCatalogEjercicios.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.nombre} ({ex.tipo_ejercicio?.nombre || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              {/* LISTA DE EJERCICIOS CONFIGURADOS */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '0.85rem', background: '#FFFFFF' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', display: 'block', marginBottom: '0.65rem' }}>
                  Ejercicios Configurados ({selectedEjercicios.length})
                </span>

                {selectedEjercicios.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1.2fr auto',
                      gap: '0.5rem',
                      padding: '0.4rem 0.5rem',
                      background: '#F1F5F9',
                      borderRadius: '4px',
                      marginBottom: '0.4rem',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      alignItems: 'center',
                    }}
                  >
                    <div>Nombre del Ejercicio</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <FaRepeat style={{ color: '#0077D4' }} /> Series
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <FaDumbbell style={{ color: '#0077D4' }} /> Repeticiones
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <FaClock style={{ color: '#0077D4' }} /> Descanso (seg)
                    </div>
                    <div style={{ textAlign: 'center' }}>Acción</div>
                  </div>
                )}

                {selectedEjercicios.map((item, index) => {
                  const ejObj = ejercicios.find((e) => e.id === item.id_ejercicio);
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1.2fr auto',
                        gap: '0.5rem',
                        alignItems: 'center',
                        marginBottom: '0.4rem',
                        background: '#F8FAFC',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <span style={{ fontSize: '0.80rem', fontWeight: 600, color: '#0F172A' }}>{ejObj?.nombre}</span>

                      <div>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={item.series}
                          onChange={(e) => {
                            const newArr = [...selectedEjercicios];
                            newArr[index].series = Number(e.target.value);
                            setSelectedEjercicios(newArr);
                          }}
                          placeholder="Series"
                          style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.80rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={item.repeticiones}
                          onChange={(e) => {
                            const newArr = [...selectedEjercicios];
                            newArr[index].repeticiones = Number(e.target.value);
                            setSelectedEjercicios(newArr);
                          }}
                          placeholder="Reps"
                          style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.80rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <input
                          type="number"
                          min={0}
                          max={600}
                          step={5}
                          value={item.descanso_segundos}
                          onChange={(e) => {
                            const newArr = [...selectedEjercicios];
                            newArr[index].descanso_segundos = Number(e.target.value);
                            setSelectedEjercicios(newArr);
                          }}
                          placeholder="Segundos"
                          style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.80rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                        />
                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>seg</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveEjercicioRow(index)}
                        style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer', padding: '0.3rem' }}
                        title="Quitar ejercicio"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })}

                {selectedEjercicios.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#94A3B8', fontSize: '0.80rem' }}>
                    No hay ejercicios agregados a esta rutina. Utiliza el selector superior para vincular ejercicios.
                  </div>
                )}
              </div>

              {/* FOOTER DEL FORMULARIO CON BOTONES ENTERPRISE */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '0.75rem',
                borderTop: '1px solid #E2E8F0',
                paddingTop: '1rem',
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: '0.80rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar y Volver
                </button>
                <button
                  type="submit"
                  disabled={createRutinaMutation.isPending}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#0077D4',
                    color: '#FFFFFF',
                    fontSize: '0.80rem',
                    fontWeight: 700,
                    cursor: createRutinaMutation.isPending ? 'not-allowed' : 'pointer',
                    opacity: createRutinaMutation.isPending ? 0.7 : 1,
                  }}
                >
                  {createRutinaMutation.isPending ? 'Guardando...' : 'Guardar Rutina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE VER RUTINA (INCLUYE VIDEOS E IMÁGENES DE LOS EJERCICIOS) */}
      {viewRutinaDetail && (
        <RutinaDetailModal
          rutina={viewRutinaDetail}
          onClose={() => setViewRutinaDetail(null)}
        />
      )}

      {/* MODAL DE EDICIÓN EXCLUSIVA DE RUTINA */}
      {editRutina && (
        <RutinaEditModal
          rutina={editRutina}
          onClose={() => setEditRutina(null)}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN PROPIO DE ELIMINACIÓN DE RUTINA */}
      <ConfirmModal
        isOpen={deletingRutinaId !== null}
        title="Eliminar Rutina"
        message="¿Deseas eliminar esta rutina de entrenamiento? Esta acción no se puede deshacer."
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteRutinaMutation.isPending}
        onConfirm={handleConfirmDeleteRutina}
        onClose={() => setDeletingRutinaId(null)}
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

export default RutinasPage;
