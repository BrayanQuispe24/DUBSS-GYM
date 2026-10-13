import React, { useState } from 'react';
import { FaImages, FaPlus, FaTrash, FaXmark, FaUpload, FaEye } from 'react-icons/fa6';
import {
  useEjercicioImagenes, useUploadEjercicioImagen, useDeleteEjercicioImagen
} from '../hooks/useEntrenamiento';
import type { Ejercicio, EjercicioImagen } from '../services/entrenamientoService';
import { useAuthStore } from '@/store/authStore';
import ConfirmModal from '@/components/common/ConfirmModal';

interface Props {
  ejercicio: Ejercicio;
  onClose: () => void;
}

const EjercicioGaleriaModal: React.FC<Props> = ({ ejercicio, onClose }) => {
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  const { data: imagenes = [], isLoading } = useEjercicioImagenes(ejercicio.id);
  const uploadMutation = useUploadEjercicioImagen();
  const deleteMutation = useDeleteEjercicioImagen();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeZoomImage, setActiveZoomImage] = useState<EjercicioImagen | null>(null);

  // Estado para ConfirmModal de eliminación de imagen
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !titulo) return;

    try {
      await uploadMutation.mutateAsync({
        idEjercicio: ejercicio.id,
        file: selectedFile,
        titulo,
        descripcion: descripcion || undefined,
      });

      setTitulo('');
      setDescripcion('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Error al subir la imagen:', err);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingImageId !== null) {
      deleteMutation.mutate({ idImagen: deletingImageId, idEjercicio: ejercicio.id });
      setDeletingImageId(null);
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
          maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <FaImages style={{ color: '#003B70' }} /> Galería Técnica: {ejercicio.nombre}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                Imágenes del paso a paso, ángulos de ejecución y posturas guardadas en el sistema.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: '#F1F5F9', border: 'none', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
            >
              <FaXmark style={{ fontSize: '1.1rem' }} />
            </button>
          </div>

          {/* FORMULARIO DE CARGA LOCAL (SOLO PARA ADMINISTRADORES/INSTRUCTORES) */}
          {canManage && (
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px dashed #CBD5E1', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaUpload style={{ color: '#003B70' }} /> Subir Nueva Imagen Local con Título y Descripción
              </h4>
              <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Título de la Imagen *</label>
                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Posición Inicial / Agarre Neutro"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Seleccionar Archivo de Imagen *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ width: '100%', padding: '0.35rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFF' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Descripción / Explicación Técnica</label>
                  <input
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej: Mantener retracción escapular durante toda la fase concéntrica."
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                {previewUrl && (
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1rem', background: '#FFF', padding: '0.5rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <img src={previewUrl} alt="Vista previa" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                    <span style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 600 }}>Vista previa del archivo seleccionado ({selectedFile?.name})</span>
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                  <button
                    type="submit"
                    disabled={uploadMutation.isPending || !selectedFile || !titulo}
                    style={{
                      padding: '0.55rem 1.2rem', borderRadius: '6px', border: 'none',
                      background: selectedFile && titulo ? 'linear-gradient(135deg, #003B70 0%, #002A52 100%)' : '#94A3B8',
                      color: '#FFF', fontWeight: 700, fontSize: '0.82rem', cursor: selectedFile && titulo ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {uploadMutation.isPending ? 'Guardando localmente...' : 'Subir e Guardar en Galería'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LISTADO / GRILLA DE IMÁGENES */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem' }}>
            Imágenes Registradas ({imagenes.length})
          </h4>

          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Cargando galería de imágenes...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {imagenes.map((img: EjercicioImagen) => (
                <div
                  key={img.id}
                  style={{
                    background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0',
                    overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ position: 'relative', height: '140px', background: '#F8FAFC', overflow: 'hidden' }}>
                    <img
                      src={img.path_imagen}
                      alt={img.titulo}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      onClick={() => setActiveZoomImage(img)}
                      style={{
                        position: 'absolute', top: '8px', right: '8px', background: 'rgba(15,23,42,0.6)',
                        border: 'none', color: '#FFF', width: '28px', height: '28px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                      }}
                      title="Ver imagen completa"
                    >
                      <FaEye style={{ fontSize: '0.75rem' }} />
                    </button>
                  </div>

                  <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.3rem 0' }}>
                        {img.titulo}
                      </h5>
                      <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: '1.3' }}>
                        {img.descripcion || 'Sin descripción adicional.'}
                      </p>
                    </div>

                    {canManage && (
                      <div style={{ marginTop: '0.75rem', textAlign: 'right', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem' }}>
                        <button
                          onClick={() => setDeletingImageId(img.id)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {imagenes.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#94A3B8', background: '#F8FAFC', borderRadius: '8px' }}>
                  No hay imágenes registradas en la galería de este ejercicio.
                </div>
              )}
            </div>
          )}

          {/* MODAL ZOOM IMAGEN AMPLIADA */}
          {activeZoomImage && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
            }}>
              <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative', textAlign: 'center' }}>
                <button
                  onClick={() => setActiveZoomImage(null)}
                  style={{ position: 'absolute', top: '-40px', right: '0', background: '#FFF', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
                >
                  <FaXmark />
                </button>
                <img src={activeZoomImage.path_imagen} alt={activeZoomImage.titulo} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', objectFit: 'contain' }} />
                <div style={{ color: '#FFF', marginTop: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{activeZoomImage.titulo}</h4>
                  {activeZoomImage.descripcion && <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '0.25rem' }}>{activeZoomImage.descripcion}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN PROPIO DE ELIMINACIÓN */}
      <ConfirmModal
        isOpen={deletingImageId !== null}
        title="Eliminar Imagen"
        message="¿Deseas eliminar esta imagen de la galería técnica?"
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingImageId(null)}
      />
    </>
  );
};

export default EjercicioGaleriaModal;
