import React, { useState, useEffect } from 'react';
import {
  FaPlus, FaTrash, FaImage, FaVideo, FaXmark, FaFilm, FaImages, FaUpload,
  FaEye, FaChevronUp, FaChevronDown, FaPenToSquare, FaMagnifyingGlass, FaRotateLeft,
  FaChevronLeft, FaChevronRight, FaWandMagicSparkles, FaCamera
} from 'react-icons/fa6';
import {
  useEjercicios, useTiposEjercicio, useGruposMusculares,
  useCreateEjercicio, useDeleteEjercicio, useAsignarGrupoMuscular,
  useUploadEjercicioImagen
} from '../hooks/useEntrenamiento';
import type { Ejercicio } from '../services/entrenamientoService';
import { useAuthStore } from '@/store/authStore';
import EjercicioGaleriaModal from './EjercicioGaleriaModal';
import EjercicioDetailModal from './EjercicioDetailModal';
import EjercicioEditModal from './EjercicioEditModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { GenerarRutinaIAModal } from './GenerarRutinaIAModal';
import { AnalisisCorporalModal } from './AnalisisCorporalModal';

const EjerciciosTab: React.FC = () => {
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  // Estados de filtros, búsqueda y paginación
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [idTipoFilter, setIdTipoFilter] = useState<number | ''>('');
  const [idGrupoFilter, setIdGrupoFilter] = useState<number | ''>('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // Debounce para búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Petición paginada con filtros
  const { data: response, isLoading } = useEjercicios({
    search: debouncedSearch || undefined,
    id_tipo_ejercicio: idTipoFilter ? Number(idTipoFilter) : undefined,
    id_grupo_muscular: idGrupoFilter ? Number(idGrupoFilter) : undefined,
    page,
    per_page: perPage,
  });

  const { data: tipos = [] } = useTiposEjercicio();
  const { data: grupos = [] } = useGruposMusculares();

  const ejercicios = response?.data || [];
  const meta = response?.meta;
  const totalEjercicios = meta?.total ?? ejercicios.length;
  const lastPage = meta?.last_page ?? 1;

  const createEjercicioMutation = useCreateEjercicio();
  const deleteEjercicioMutation = useDeleteEjercicio();
  const asignarGrupoMutation = useAsignarGrupoMuscular();
  const uploadImagenMutation = useUploadEjercicioImagen();

  // Estado del formulario retráctil
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idTipo, setIdTipo] = useState<number | ''>('');
  const [urlVideo, setUrlVideo] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imagenTitulo, setImagenTitulo] = useState('');
  const [imagenDescripcion, setImagenDescripcion] = useState('');
  const [selectedGrupos, setSelectedGrupos] = useState<number[]>([]);

  // Modales
  const [selectedGaleriaEjercicio, setSelectedGaleriaEjercicio] = useState<Ejercicio | null>(null);
  const [viewEjercicioDetail, setViewEjercicioDetail] = useState<Ejercicio | null>(null);
  const [editEjercicio, setEditEjercicio] = useState<Ejercicio | null>(null);
  const [deletingEjercicio, setDeletingEjercicio] = useState<Ejercicio | null>(null);

  // Modales Módulo IA
  const [isIAModalOpen, setIsIAModalOpen] = useState(false);
  const [isAnalisisModalOpen, setIsAnalisisModalOpen] = useState(false);

  const handleConfirmDeleteEjercicio = () => {
    if (deletingEjercicio) {
      deleteEjercicioMutation.mutate(deletingEjercicio.id);
      setDeletingEjercicio(null);
    }
  };

  const toggleGrupo = (id: number) => {
    setSelectedGrupos((prev) =>
      prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      if (!imagenTitulo) {
        setImagenTitulo(`Imagen Principal - ${nombre || 'Ejercicio'}`);
      }
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setIdTipoFilter('');
    setIdGrupoFilter('');
    setPage(1);
  };

  const handleCreateEjercicio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;

    try {
      const newEjercicio = await createEjercicioMutation.mutateAsync({
        nombre,
        descripcion,
        url_video: urlVideo || undefined,
        id_tipo_ejercicio: idTipo ? Number(idTipo) : undefined,
      });

      if (newEjercicio) {
        if (selectedGrupos.length > 0) {
          await Promise.all(
            selectedGrupos.map((gId) =>
              asignarGrupoMutation.mutateAsync({
                idEjercicio: newEjercicio.id,
                idGrupoMuscular: gId,
              })
            )
          );
        }

        if (selectedFile) {
          await uploadImagenMutation.mutateAsync({
            idEjercicio: newEjercicio.id,
            file: selectedFile,
            titulo: imagenTitulo || 'Imagen Principal',
            descripcion: imagenDescripcion || undefined,
          });
        }
      }

      setNombre('');
      setDescripcion('');
      setIdTipo('');
      setUrlVideo('');
      setSelectedFile(null);
      setFilePreview(null);
      setImagenTitulo('');
      setImagenDescripcion('');
      setSelectedGrupos([]);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error al crear el ejercicio:', err);
    }
  };

  return (
    <div>
      {/* FORMULARIO DE REGISTRO RETRÁCTIL */}
      {canManage && (
        <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isFormOpen ? '1rem' : 0 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <FaPlus style={{ color: '#0077D4' }} /> Registrar Nuevo Ejercicio
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
            <form onSubmit={handleCreateEjercicio} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Nombre del Ejercicio *</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Press de Banca Plano con Barra"
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Tipo de Ejercicio</label>
                <select
                  value={idTipo}
                  onChange={(e) => setIdTipo(e.target.value ? Number(e.target.value) : '')}
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', backgroundColor: '#FFF' }}
                >
                  <option value="">-- Seleccionar Categoría --</option>
                  {tipos.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              {/* SELECCIÓN DE ARCHIVO DE IMAGEN */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>
                  <FaUpload style={{ color: '#0077D4' }} /> Subir Imagen desde el Dispositivo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.80rem', background: '#FFF' }}
                />
                {filePreview && (
                  <div style={{ marginTop: '0.5rem', background: '#F8FAFC', padding: '0.6rem', borderRadius: '4px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={filePreview} alt="Preview" style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                      <span style={{ fontSize: '0.72rem', color: '#0077D4', fontWeight: 600 }}>{selectedFile?.name}</span>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.70rem', fontWeight: 600, color: '#475569' }}>Título de la Imagen *</label>
                      <input
                        type="text"
                        value={imagenTitulo}
                        onChange={(e) => setImagenTitulo(e.target.value)}
                        placeholder="Ej: Posición Inicial"
                        style={{ width: '100%', padding: '0.3rem 0.4rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.70rem', fontWeight: 600, color: '#475569' }}>Descripción de la Imagen (Opcional)</label>
                      <input
                        type="text"
                        value={imagenDescripcion}
                        onChange={(e) => setImagenDescripcion(e.target.value)}
                        placeholder="Ej: Mantener la postura alineada..."
                        style={{ width: '100%', padding: '0.3rem 0.4rem', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>
                  <FaVideo style={{ color: '#0077D4' }} /> URL de Video Demostrativo
                </label>
                <input
                  value={urlVideo}
                  onChange={(e) => setUrlVideo(e.target.value)}
                  placeholder="Ej: https://youtube.com/watch?v=..."
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.3rem' }}>Descripción / Instrucción Técnica</label>
                <input
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Mantener retracción escapular y apoyar firmemente los pies."
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              {/* SELECCIÓN MÚLTIPLE DE GRUPOS MUSCULARES */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.4rem' }}>
                  Grupos Musculares Involucrados
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', background: '#F8FAFC', padding: '0.65rem', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  {grupos.map((g: any) => {
                    const isChecked = selectedGrupos.includes(g.id);
                    return (
                      <label
                        key={g.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.80rem',
                          fontWeight: 500,
                          color: '#334155',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleGrupo(g.id)}
                          style={{ cursor: 'pointer', accentColor: '#0077D4', width: '14px', height: '14px' }}
                        />
                        {g.nombre}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                <button
                  type="submit"
                  disabled={createEjercicioMutation.isPending || uploadImagenMutation.isPending}
                  style={{
                    padding: '0.55rem 1.15rem', borderRadius: '4px', border: 'none',
                    background: '#0077D4', color: '#FFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  }}
                >
                  {createEjercicioMutation.isPending || uploadImagenMutation.isPending ? 'Guardando...' : 'Guardar Ejercicio'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* BARRA SUPERIOR DE BUSCADOR Y FILTROS AVANZADOS */}
      <div style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
        {/* BUSCADOR POR TEXTO */}
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <FaMagnifyingGlass style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.80rem' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            style={{
              width: '100%',
              padding: '0.5rem 1.8rem 0.5rem 2.1rem',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              <FaXmark />
            </button>
          )}
        </div>

        {/* FILTRO POR TIPO / CATEGORÍA */}
        <div style={{ minWidth: '170px' }}>
          <select
            value={idTipoFilter}
            onChange={(e) => {
              setIdTipoFilter(e.target.value ? Number(e.target.value) : '');
              setPage(1);
            }}
            style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', backgroundColor: '#FFF', color: '#1E293B', cursor: 'pointer' }}
          >
            <option value="">-- Todos los Tipos --</option>
            {tipos.map((t: any) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        {/* FILTRO POR GRUPO MUSCULAR */}
        <div style={{ minWidth: '170px' }}>
          <select
            value={idGrupoFilter}
            onChange={(e) => {
              setIdGrupoFilter(e.target.value ? Number(e.target.value) : '');
              setPage(1);
            }}
            style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', backgroundColor: '#FFF', color: '#1E293B', cursor: 'pointer' }}
          >
            <option value="">-- Todos los Grupos --</option>
            {grupos.map((g: any) => (
              <option key={g.id} value={g.id}>{g.nombre}</option>
            ))}
          </select>
        </div>

        {/* REGISTROS POR PÁGINA */}
        <div style={{ minWidth: '110px' }}>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', backgroundColor: '#FFF', color: '#1E293B', cursor: 'pointer' }}
          >
            <option value={15}>15 por pág.</option>
            <option value={25}>25 por pág.</option>
            <option value={50}>50 por pág.</option>
            <option value={100}>100 por pág.</option>
          </select>
        </div>

        {/* BOTÓN LIMPIAR FILTROS */}
        {(search || idTipoFilter || idGrupoFilter || perPage !== 15) && (
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#475569',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <FaRotateLeft /> Limpiar
          </button>
        )}
      </div>

      {/* HEADER DEL LISTADO CON CONTEO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
          Listado de Ejercicios <span style={{ fontSize: '0.80rem', color: '#64748B', fontWeight: 600 }}>({totalEjercicios} en total)</span>
        </h3>
      </div>

      {/* TABLA DE EJERCICIOS */}
      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', background: '#FFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
          Cargando catálogo de ejercicios...
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '0.65rem 1rem' }}>Vista Previa</th>
                <th style={{ padding: '0.65rem 1rem' }}>Ejercicio</th>
                <th style={{ padding: '0.65rem 1rem' }}>Tipo</th>
                <th style={{ padding: '0.65rem 1rem' }}>Grupos Musculares</th>
                <th style={{ padding: '0.65rem 1rem' }}>Multimedia / Galería</th>
                <th style={{ padding: '0.65rem 1rem' }}>Descripción</th>
                {canManage && <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {ejercicios.map((ex: Ejercicio) => {
                const mainImage = ex.imagenes?.[0]?.path_imagen || ex.url_imagen;
                const totalImagenes = ex.imagenes?.length || 0;

                return (
                  <tr key={ex.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    {/* MINIATURA DE IMAGEN */}
                    <td style={{ padding: '0.65rem 1rem' }}>
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={ex.nombre}
                          onClick={() => setViewEjercicioDetail(ex)}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
                        />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                          <FaImage style={{ fontSize: '1rem' }} />
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#0F172A' }}>{ex.nombre}</td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      <span style={{ fontSize: '0.72rem', background: '#F1F5F9', padding: '0.15rem 0.45rem', borderRadius: '2px', color: '#334155', fontWeight: 600 }}>
                        {ex.tipo_ejercicio?.nombre || 'General'}
                      </span>
                    </td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                        {ex.ejercicio_grupo_musculares?.map((gm: any) => (
                          <span key={gm.id} style={{ fontSize: '0.70rem', background: '#E0F2FE', color: '#0077D4', padding: '0.12rem 0.4rem', borderRadius: '2px', fontWeight: 600 }}>
                            {gm.grupo_muscular?.nombre}
                          </span>
                        ))}
                        {canManage && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                asignarGrupoMutation.mutate({ idEjercicio: ex.id, idGrupoMuscular: Number(e.target.value) });
                                e.target.value = '';
                              }
                            }}
                            style={{ fontSize: '0.70rem', padding: '0.15rem', borderRadius: '2px', border: '1px dashed #94A3B8', backgroundColor: '#FFF', cursor: 'pointer' }}
                          >
                            <option value="">+ Vincular grupo</option>
                            {grupos.map((g: any) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                          </select>
                        )}
                      </div>
                    </td>

                    {/* MULTIMEDIA ACCIONES */}
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        <button
                          onClick={() => setViewEjercicioDetail(ex)}
                          title="Ver tarjeta completa del ejercicio"
                          style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '0.35rem 0.55rem', borderRadius: '4px', cursor: 'pointer', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700 }}
                        >
                          <FaEye style={{ color: '#0077D4' }} /> Ver Ejercicio
                        </button>

                        <button
                          onClick={() => setSelectedGaleriaEjercicio(ex)}
                          title="Gestionar Galería de Imágenes Locales"
                          style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '0.35rem 0.55rem', borderRadius: '4px', cursor: 'pointer', color: '#0077D4', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700 }}
                        >
                          <FaImages /> Galería ({totalImagenes})
                        </button>
                      </div>
                    </td>

                    {/* DESCRIPCIÓN RESTRINGIDA A 1 LINEA */}
                    <td
                      style={{
                        padding: '0.65rem 1rem',
                        color: '#64748B',
                        maxWidth: '220px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={ex.descripcion || ''}
                    >
                      {ex.descripcion || '-'}
                    </td>

                    {canManage && (
                      <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            onClick={() => setEditEjercicio(ex)}
                            title="Editar ejercicio"
                            style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0077D4', cursor: 'pointer', fontSize: '0.80rem', padding: '0.35rem 0.55rem', borderRadius: '4px' }}
                          >
                            <FaPenToSquare />
                          </button>
                          <button
                            onClick={() => setDeletingEjercicio(ex)}
                            title="Eliminar ejercicio"
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

              {ejercicios.length === 0 && (
                <tr>
                  <td colSpan={canManage ? 7 : 6} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.90rem' }}>No se encontraron ejercicios con los filtros seleccionados.</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Prueba modificando el texto de búsqueda o limpiando los filtros.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTROLES DE PAGINACIÓN */}
      {meta && meta.last_page > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', padding: '0.65rem 1rem', background: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Mostrando <strong>{((meta.current_page - 1) * meta.per_page) + 1}</strong> a <strong>{Math.min(meta.current_page * meta.per_page, meta.total)}</strong> de <strong>{meta.total}</strong> ejercicios
          </span>

          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <button
              disabled={meta.current_page <= 1}
              onClick={() => setPage(1)}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                background: meta.current_page <= 1 ? '#F1F5F9' : '#FFF',
                color: meta.current_page <= 1 ? '#94A3B8' : '#334155',
                cursor: meta.current_page <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              « Primero
            </button>
            <button
              disabled={meta.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                background: meta.current_page <= 1 ? '#F1F5F9' : '#FFF',
                color: meta.current_page <= 1 ? '#94A3B8' : '#334155',
                cursor: meta.current_page <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              <FaChevronLeft style={{ fontSize: '0.65rem' }} /> Anterior
            </button>

            <span style={{ fontSize: '0.78rem', padding: '0 0.4rem', fontWeight: 700, color: '#0F172A' }}>
              Página {meta.current_page} de {meta.last_page}
            </span>

            <button
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                background: meta.current_page >= meta.last_page ? '#F1F5F9' : '#FFF',
                color: meta.current_page >= meta.last_page ? '#94A3B8' : '#334155',
                cursor: meta.current_page >= meta.last_page ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              Siguiente <FaChevronRight style={{ fontSize: '0.65rem' }} />
            </button>
            <button
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage(meta.last_page)}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                background: meta.current_page >= meta.last_page ? '#F1F5F9' : '#FFF',
                color: meta.current_page >= meta.last_page ? '#94A3B8' : '#334155',
                cursor: meta.current_page >= meta.last_page ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              Último »
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE TARJETA DETALLADA DEL EJERCICIO */}
      {viewEjercicioDetail && (
        <EjercicioDetailModal
          ejercicio={viewEjercicioDetail}
          onClose={() => setViewEjercicioDetail(null)}
          onOpenGaleria={() => {
            const ex = viewEjercicioDetail;
            setViewEjercicioDetail(null);
            setSelectedGaleriaEjercicio(ex);
          }}
          onEdit={() => {
            const ex = viewEjercicioDetail;
            setViewEjercicioDetail(null);
            setEditEjercicio(ex);
          }}
        />
      )}

      {/* MODAL DE EDICIÓN EXCLUSIVA DEL EJERCICIO */}
      {editEjercicio && (
        <EjercicioEditModal
          ejercicio={editEjercicio}
          onClose={() => setEditEjercicio(null)}
        />
      )}

      {/* MODAL DE GALERÍA DE IMÁGENES */}
      {selectedGaleriaEjercicio && (
        <EjercicioGaleriaModal
          ejercicio={selectedGaleriaEjercicio}
          onClose={() => setSelectedGaleriaEjercicio(null)}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <ConfirmModal
        isOpen={deletingEjercicio !== null}
        title="Eliminar Ejercicio"
        message={`¿Deseas eliminar el ejercicio "${deletingEjercicio?.nombre || ''}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteEjercicioMutation.isPending}
        onConfirm={handleConfirmDeleteEjercicio}
        onClose={() => setDeletingEjercicio(null)}
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
    </div>
  );
};

export default EjerciciosTab;
