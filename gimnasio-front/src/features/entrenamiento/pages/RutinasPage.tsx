// src/features/entrenamiento/pages/RutinasPage.tsx
import React, { useState } from 'react';
import {
  FaListCheck, FaPlus, FaTrash, FaDumbbell, FaMagnifyingGlass, FaFilter,
  FaClock, FaRepeat, FaChevronUp, FaChevronDown, FaEye, FaImages, FaVideo, FaLayerGroup, FaPenToSquare,
  FaWandMagicSparkles, FaCamera
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

  // Estado del formulario retráctil
  const [isFormOpen, setIsFormOpen] = useState(false);

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
          setIsFormOpen(false);
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
      {/* HEADER DE LA PÁGINA */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaListCheck style={{ color: '#003B70' }} /> Rutinas de Entrenamiento Deportivo
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Confección y diseño de rutinas por nivel, series, repeticiones e información multimedia de ejercicios.
        </p>
      </div>

      {/* FORMULARIO DE REGISTRO RETRÁCTIL */}
      {canManage && (
        <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isFormOpen ? '1rem' : 0 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <FaPlus style={{ color: '#0077D4' }} /> Registrar Nueva Rutina
            </h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  background: isFormOpen ? '#F1F5F9' : '#0077D4',
                  color: isFormOpen ? '#0077D4' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                }}
              >
                {isFormOpen ? (
                  <>
                    <FaChevronUp /> Plegar Formulario
                  </>
                ) : (
                  <>
                    <FaChevronDown /> + Desplegar Formulario de Registro
                  </>
                )}
              </button>
            </div>
          </div>

          {isFormOpen && (
            <form onSubmit={handleCreateRutina} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Nombre de la Rutina *</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Rutina Pectoral & Tríceps Hipertrofia"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Nivel de Dificultad</label>
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
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Descripción / Recomendaciones General</label>
                <input
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Orientado al desarrollo hipertrófico con descansos entre 60 y 90 segundos."
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              {/* SECCIÓN DE BÚSQUEDA Y FILTROS PARA ASIGNAR EJERCICIOS */}
              <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', marginBottom: '0.5rem' }}>
                  <FaFilter style={{ color: '#0077D4' }} /> Filtrar y Asignar Ejercicios a la Rutina
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.65rem' }}>
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
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #0077D4', fontSize: '0.80rem', backgroundColor: '#FFF', fontWeight: 600, cursor: 'pointer', color: '#0077D4' }}
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
                    No hay ejercicios agregados a esta rutina. Utiliza el buscador y selector superior para agregar ejercicios.
                  </div>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                <button
                  type="submit"
                  disabled={createRutinaMutation.isPending}
                  style={{
                    padding: '0.55rem 1.15rem', borderRadius: '4px', border: 'none',
                    background: '#0077D4', color: '#FFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  }}
                >
                  {createRutinaMutation.isPending ? 'Guardando...' : 'Guardar Rutina'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* LISTA DE RUTINAS EN TABLA DE DISEÑO UNIFICADO */}
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
        Listado de Rutinas <span style={{ fontSize: '0.80rem', color: '#64748B', fontWeight: 600 }}>({rutinas.length} en total)</span>
      </h3>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', background: '#FFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>Cargando rutinas...</div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '0.65rem 1rem' }}>Rutina</th>
                <th style={{ padding: '0.65rem 1rem' }}>Nivel</th>
                <th style={{ padding: '0.65rem 1rem' }}>Ejercicios Incluidos</th>
                <th style={{ padding: '0.65rem 1rem' }}>Recursos / Multimedia</th>
                <th style={{ padding: '0.65rem 1rem' }}>Descripción</th>
                {canManage && <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {rutinas.map((r: Rutina) => {
                const totalEjercicios = r.rutina_ejercicios?.length || 0;

                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaListCheck style={{ color: '#0077D4' }} /> {r.nombre}
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      <span style={{ fontSize: '0.70rem', background: '#E0F2FE', color: '#0077D4', padding: '0.15rem 0.45rem', borderRadius: '2px', fontWeight: 700 }}>
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
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Sin ejercicios vinculados</span>
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
                          cursor: 'pointer', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700
                        }}
                      >
                        <FaEye style={{ color: '#0077D4' }} /> Ver Rutina ({totalEjercicios})
                      </button>
                    </td>

                    <td style={{ padding: '0.65rem 1rem', color: '#64748B', maxWidth: '250px' }}>{r.descripcion || '-'}</td>

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
              {rutinas.length === 0 && (
                <tr>
                  <td colSpan={canManage ? 6 : 5} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.90rem' }}>No hay rutinas registradas.</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Utiliza el botón superior para desplegar el formulario de registro.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
