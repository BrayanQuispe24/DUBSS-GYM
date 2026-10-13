import React, { useState } from 'react';
import { FaPenToSquare, FaXmark, FaCheck, FaUpload, FaVideo, FaTrash, FaImages } from 'react-icons/fa6';
import type { Ejercicio, EjercicioImagen } from '../services/entrenamientoService';
import {
  useTiposEjercicio,
  useGruposMusculares,
  useUpdateEjercicio,
  useEjercicioImagenes,
  useUploadEjercicioImagen,
  useDeleteEjercicioImagen,
} from '../hooks/useEntrenamiento';
import ConfirmModal from '@/components/common/ConfirmModal';

interface Props {
  ejercicio: Ejercicio;
  onClose: () => void;
}

interface NewImageItem {
  id: string;
  file: File;
  preview: string;
  titulo: string;
  descripcion: string;
}

const EjercicioEditModal: React.FC<Props> = ({ ejercicio, onClose }) => {
  const { data: tipos = [] } = useTiposEjercicio();
  const { data: grupos = [] } = useGruposMusculares();
  const { data: imagenesExistentes = [], isLoading: isLoadingImagenes } = useEjercicioImagenes(ejercicio.id);

  const updateMutation = useUpdateEjercicio();
  const uploadImagenMutation = useUploadEjercicioImagen();
  const deleteImagenMutation = useDeleteEjercicioImagen();

  // Estado para controlar la eliminación con ConfirmModal
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  // Obtener IDs de grupos musculares asociados previamente
  const initialGrupos = ejercicio.ejercicio_grupo_musculares
    ?.map((gm: any) => gm.grupo_muscular?.id || gm.id_grupo_muscular)
    .filter(Boolean) || [];

  const [nombre, setNombre] = useState(ejercicio.nombre || '');
  const [descripcion, setDescripcion] = useState(ejercicio.descripcion || '');
  const [idTipo, setIdTipo] = useState<number | ''>(ejercicio.id_tipo_ejercicio || '');
  const [urlVideo, setUrlVideo] = useState(ejercicio.url_video || '');
  const [selectedGrupos, setSelectedGrupos] = useState<number[]>(initialGrupos);

  // Lista de múltiples nuevas imágenes seleccionadas para cargar con título y descripción
  const [newImagesList, setNewImagesList] = useState<NewImageItem[]>([]);

  const toggleGrupo = (id: number) => {
    setSelectedGrupos((prev) =>
      prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
    );
  };

  // Manejar selección múltiple de imágenes
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newItems: NewImageItem[] = filesArray.map((file, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        titulo: `Foto ${newImagesList.length + idx + 1} - ${nombre || 'Ejercicio'}`,
        descripcion: '',
      }));

      setNewImagesList((prev) => [...prev, ...newItems]);
      e.target.value = ''; // Resetear input para permitir seleccionar de nuevo si lo desea
    }
  };

  const handleRemoveNewImage = (idToRemove: string) => {
    setNewImagesList((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleUpdateNewImageTitle = (id: string, newTitle: string) => {
    setNewImagesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, titulo: newTitle } : item))
    );
  };

  const handleUpdateNewImageDescription = (id: string, newDesc: string) => {
    setNewImagesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, descripcion: newDesc } : item))
    );
  };

  const handleConfirmDeleteImage = () => {
    if (deletingImageId !== null) {
      deleteImagenMutation.mutate({ idImagen: deletingImageId, idEjercicio: ejercicio.id });
      setDeletingImageId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;

    try {
      // 1. Actualizar datos principales del ejercicio y sus grupos musculares
      await updateMutation.mutateAsync({
        id: ejercicio.id,
        data: {
          nombre,
          descripcion: descripcion || undefined,
          url_video: urlVideo || undefined,
          id_tipo_ejercicio: idTipo ? Number(idTipo) : undefined,
          grupos_musculares: selectedGrupos,
        },
      });

      // 2. Subir todas las nuevas imágenes seleccionadas secuencialmente con su título y descripción
      if (newImagesList.length > 0) {
        for (const item of newImagesList) {
          await uploadImagenMutation.mutateAsync({
            idEjercicio: ejercicio.id,
            file: item.file,
            titulo: item.titulo || `Foto de ${nombre}`,
            descripcion: item.descripcion || undefined,
          });
        }
      }

      onClose();
    } catch (err) {
      console.error('Error al actualizar el ejercicio:', err);
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem'
      }}>
        <div style={{
          background: '#FFFFFF', borderRadius: '16px', maxWidth: '850px', width: '100%',
          maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          position: 'relative'
        }}>
          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <FaPenToSquare style={{ color: '#003B70' }} /> Editar Ejercicio: {ejercicio.nombre}
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
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Nombre del Ejercicio *</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Press de Banca Plano"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Tipo de Ejercicio</label>
              <select
                value={idTipo}
                onChange={(e) => setIdTipo(e.target.value ? Number(e.target.value) : '')}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
              >
                <option value="">-- Seleccionar Categoría --</option>
                {tipos.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                <FaVideo style={{ color: '#003B70' }} /> URL de Video Demostrativo
              </label>
              <input
                value={urlVideo}
                onChange={(e) => setUrlVideo(e.target.value)}
                placeholder="Ej: https://youtube.com/watch?v=..."
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Descripción / Instrucciones Técnicas</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describa la técnica y precauciones del ejercicio..."
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit' }}
              />
            </div>

            {/* CHECKBOXES DE GRUPOS MUSCULARES */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Grupos Musculares Involucrados
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                {grupos.map((g: any) => {
                  const isChecked = selectedGrupos.includes(g.id);
                  return (
                    <label
                      key={g.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontSize: '0.85rem',
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
                        style={{ cursor: 'pointer', accentColor: '#003B70', width: '15px', height: '15px' }}
                      />
                      {g.nombre}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 1: IMÁGENES EXISTENTES EN LA GALERÍA CON OPCIÓN DE ELIMINAR */}
            <div style={{ gridColumn: '1 / -1', background: '#FFF', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaImages style={{ color: '#003B70' }} /> Imágenes Actuales en Galería ({imagenesExistentes.length})
              </h4>

              {isLoadingImagenes ? (
                <div style={{ fontSize: '0.8rem', color: '#64748B', padding: '0.5rem' }}>Cargando imágenes actuales...</div>
              ) : imagenesExistentes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {imagenesExistentes.map((img: EjercicioImagen) => (
                    <div
                      key={img.id}
                      style={{
                        border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', background: '#F8FAFC',
                        display: 'flex', flexDirection: 'column', position: 'relative'
                      }}
                    >
                      <img src={img.path_imagen} alt={img.titulo} style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                      <div style={{ padding: '0.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {img.titulo}
                          </span>
                          {img.descripcion && (
                            <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {img.descripcion}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setDeletingImageId(img.id)}
                          disabled={deleteImagenMutation.isPending}
                          style={{
                            marginTop: '0.35rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626',
                            borderRadius: '4px', padding: '0.25rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem'
                          }}
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0, fontStyle: 'italic' }}>
                  Este ejercicio aún no cuenta con imágenes en su galería.
                </p>
              )}
            </div>

            {/* SECCIÓN 2: CARGAR MÚLTIPLES NUEVAS IMÁGENES LOCALES CON TÍTULO Y DESCRIPCIÓN */}
            <div style={{ gridColumn: '1 / -1', background: '#F0F9FF', padding: '1rem', borderRadius: '10px', border: '1px dashed #7DD3FC' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0369A1', marginBottom: '0.4rem' }}>
                <FaUpload /> Cargar Múltiples Nuevas Imágenes al Ejercicio (con Título y Descripción)
              </label>
              <p style={{ fontSize: '0.78rem', color: '#0284C7', margin: '0 0 0.75rem 0' }}>
                Puedes seleccionar una o varias imágenes al mismo tiempo desde tu dispositivo e ingresar su título y descripción individual.
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFilesChange}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #7DD3FC', fontSize: '0.82rem', background: '#FFF', cursor: 'pointer' }}
              />

              {/* PREVISUALIZACIÓN DE ARCHIVOS PENDIENTES DE SUBIR CON CAMPOS DE TÍTULO Y DESCRIPCIÓN */}
              {newImagesList.length > 0 && (
                <div style={{ marginTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.5rem' }}>
                    Nuevas imágenes a subir ({newImagesList.length}):
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
                    {newImagesList.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: '#FFF', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '0.65rem',
                          display: 'flex', flexDirection: 'column', gap: '0.45rem', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <img src={item.preview} alt="Preview" style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#0369A1', marginBottom: '0.15rem' }}>Título de la foto *</label>
                            <input
                              type="text"
                              value={item.titulo}
                              onChange={(e) => handleUpdateNewImageTitle(item.id, e.target.value)}
                              placeholder="Ej: Angulo Lateral"
                              style={{ width: '100%', padding: '0.3rem 0.4rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(item.id)}
                            style={{ background: '#FEE2E2', border: 'none', color: '#EF4444', width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            title="Descartar esta imagen"
                          >
                            <FaXmark style={{ fontSize: '0.8rem' }} />
                          </button>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#475569', marginBottom: '0.15rem' }}>Descripción / Explicación Técnica (Opcional)</label>
                          <input
                            type="text"
                            value={item.descripcion}
                            onChange={(e) => handleUpdateNewImageDescription(item.id, e.target.value)}
                            placeholder="Ej: Mantener la retracción escapular durante el movimiento."
                            style={{ width: '100%', padding: '0.3rem 0.4rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div style={{ gridColumn: '1 / -1', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending || uploadImagenMutation.isPending}
                style={{
                  padding: '0.6rem 1.25rem', borderRadius: '6px', border: 'none',
                  background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                <FaCheck /> {updateMutation.isPending || uploadImagenMutation.isPending ? 'Guardando cambios...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN PROPIO PARA ELIMINACIÓN DE IMAGEN */}
      <ConfirmModal
        isOpen={deletingImageId !== null}
        title="Eliminar Imagen"
        message="¿Deseas eliminar esta imagen permanentemente de la galería del ejercicio?"
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteImagenMutation.isPending}
        onConfirm={handleConfirmDeleteImage}
        onClose={() => setDeletingImageId(null)}
      />
    </>
  );
};

export default EjercicioEditModal;
