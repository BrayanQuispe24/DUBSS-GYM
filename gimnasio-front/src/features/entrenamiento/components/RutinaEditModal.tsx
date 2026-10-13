import React, { useState } from 'react';
import {
  FaPenToSquare, FaXmark, FaCheck, FaFilter, FaMagnifyingGlass,
  FaRepeat, FaDumbbell, FaClock, FaTrash
} from 'react-icons/fa6';
import type { Rutina } from '../services/entrenamientoService';
import {
  useEjercicios,
  useTiposEjercicio,
  useGruposMusculares,
  useUpdateRutina,
} from '../hooks/useEntrenamiento';

interface Props {
  rutina: Rutina;
  onClose: () => void;
}

const RutinaEditModal: React.FC<Props> = ({ rutina, onClose }) => {
  const { data: responseEjercicios } = useEjercicios({ all: true });
  const ejercicios = responseEjercicios?.data || [];
  const { data: tipos = [] } = useTiposEjercicio();
  const { data: grupos = [] } = useGruposMusculares();
  const updateRutinaMutation = useUpdateRutina();

  // Mapear los ejercicios configurados previamente en la rutina
  const initialSelected = (rutina.rutina_ejercicios || (rutina as any).rutinaEjercicios)?.map((re: any) => ({
    id_ejercicio: re.id_ejercicio || re.ejercicio?.id,
    series: re.series || 4,
    repeticiones: re.repeticiones || 12,
    descanso_segundos: re.descanso_segundos || 60,
  })).filter((item: any) => Boolean(item.id_ejercicio)) || [];

  const [nombre, setNombre] = useState(rutina.nombre || '');
  const [descripcion, setDescripcion] = useState(rutina.descripcion || '');
  const [nivel, setNivel] = useState(rutina.nivel || 'Intermedio');
  const [selectedEjercicios, setSelectedEjercicios] = useState(initialSelected);

  // Filtros de búsqueda para seleccionar ejercicios
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipoId, setFilterTipoId] = useState<number | ''>('');
  const [filterGrupoId, setFilterGrupoId] = useState<number | ''>('');

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
    if (selectedEjercicios.some((e: any) => e.id_ejercicio === idEjercicio)) return;
    setSelectedEjercicios([
      ...selectedEjercicios,
      { id_ejercicio: idEjercicio, series: 4, repeticiones: 12, descanso_segundos: 60 },
    ]);
  };

  const handleRemoveEjercicioRow = (index: number) => {
    setSelectedEjercicios(selectedEjercicios.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;

    try {
      await updateRutinaMutation.mutateAsync({
        id: rutina.id,
        data: {
          nombre,
          descripcion: descripcion || undefined,
          nivel,
          ejercicios: selectedEjercicios,
        },
      });
      onClose();
    } catch (err) {
      console.error('Error al actualizar la rutina:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem'
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '16px', maxWidth: '800px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        position: 'relative'
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaPenToSquare style={{ color: '#003B70' }} /> Editar Rutina: {rutina.nombre}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <FaXmark style={{ fontSize: '1.1rem' }} />
          </button>
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Nombre de la Rutina *</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Rutina Pectoral & Tríceps"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Nivel de Dificultad</label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Descripción / Recomendaciones</label>
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción opcional..."
              style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          {/* FILTROS Y BÚSQUEDA DE EJERCICIOS */}
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.6rem' }}>
              <FaFilter style={{ color: '#003B70' }} /> Agregar Nuevos Ejercicios a la Rutina
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748B', marginBottom: '0.2rem' }}>Por Categoría</label>
                <select
                  value={filterTipoId}
                  onChange={(e) => setFilterTipoId(e.target.value ? Number(e.target.value) : '')}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', background: '#FFF' }}
                >
                  <option value="">-- Todos los Tipos --</option>
                  {tipos.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748B', marginBottom: '0.2rem' }}>Por Grupo Muscular</label>
                <select
                  value={filterGrupoId}
                  onChange={(e) => setFilterGrupoId(e.target.value ? Number(e.target.value) : '')}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', background: '#FFF' }}
                >
                  <option value="">-- Todos los Grupos --</option>
                  {grupos.map((g: any) => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748B', marginBottom: '0.2rem' }}>Buscar por Nombre</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: Press, Biceps..."
                    style={{ width: '100%', padding: '0.45rem 0.45rem 0.45rem 1.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', background: '#FFF' }}
                  />
                  <FaMagnifyingGlass style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.75rem' }} />
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
              style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #003B70', fontSize: '0.85rem', backgroundColor: '#FFF', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="">
                Seleccionar Ejercicio ({filteredCatalogEjercicios.length} de {ejercicios.length} disponibles)...
              </option>
              {filteredCatalogEjercicios.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.nombre} ({ex.tipo_ejercicio?.nombre || 'General'})
                </option>
              ))}
            </select>
          </div>

          {/* LISTA DE EJERCICIOS CONFIGURADOS */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem', background: '#FFFFFF' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.75rem' }}>
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
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#475569',
                  alignItems: 'center',
                }}
              >
                <div>Nombre del Ejercicio</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <FaRepeat style={{ color: '#003B70' }} /> Series
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <FaDumbbell style={{ color: '#003B70' }} /> Repeticiones
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <FaClock style={{ color: '#003B70' }} /> Descanso (seg)
                </div>
                <div style={{ textAlign: 'center' }}>Acción</div>
              </div>
            )}

            {selectedEjercicios.map((item: any, index: number) => {
              const ejObj = ejercicios.find((e) => e.id === item.id_ejercicio);
              return (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1.2fr auto',
                    gap: '0.5rem',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    background: '#F8FAFC',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{ejObj?.nombre}</span>

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
                      style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.82rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
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
                      style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.82rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
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
                      style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.82rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>seg</span>
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
          </div>

          {/* BOTONES */}
          <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateRutinaMutation.isPending}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: '6px', border: 'none',
                background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <FaCheck /> {updateRutinaMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RutinaEditModal;
