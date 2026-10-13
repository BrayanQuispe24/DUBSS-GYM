import React, { useState } from 'react';
import { FaDumbbell, FaXmark, FaVideo, FaImages, FaLayerGroup, FaShield, FaBookOpen, FaPenToSquare, FaCheck } from 'react-icons/fa6';
import type { Ejercicio } from '../services/entrenamientoService';
import { useEjercicioImagenes, useUpdateEjercicio } from '../hooks/useEntrenamiento';

const getEmbedVideoUrl = (url?: string) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/').split('&')[0];
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
};

interface Props {
  ejercicio: Ejercicio;
  onClose: () => void;
  onOpenGaleria?: () => void;
  onEdit?: () => void;
}

const EjercicioDetailModal: React.FC<Props> = ({ ejercicio, onClose, onOpenGaleria, onEdit }) => {
  const { data: imagenes = [] } = useEjercicioImagenes(ejercicio.id);
  const updateEjercicioMutation = useUpdateEjercicio();

  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState(ejercicio.url_video || '');
  const [currentVideoUrl, setCurrentVideoUrl] = useState(ejercicio.url_video || '');

  const handleSaveVideoUrl = async () => {
    try {
      await updateEjercicioMutation.mutateAsync({
        id: ejercicio.id,
        data: { url_video: videoUrlInput || undefined }
      });
      setCurrentVideoUrl(videoUrlInput);
      setIsEditingVideo(false);
    } catch (err) {
      console.error('Error al guardar la URL del video:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem'
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '16px', maxWidth: '750px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        position: 'relative', border: '1px solid #E2E8F0'
      }}>
        {/* HEADER DE LA TARJETA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: '#003B70', color: '#FFF', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaLayerGroup /> {ejercicio.tipo_ejercicio?.nombre || 'General'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaDumbbell style={{ color: '#003B70' }} /> {ejercicio.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <FaXmark style={{ fontSize: '1.2rem' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* GRUPOS MUSCULARES */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FaShield style={{ color: '#003B70' }} /> Grupos Musculares Involucrados
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {ejercicio.ejercicio_grupo_musculares && ejercicio.ejercicio_grupo_musculares.length > 0 ? (
                ejercicio.ejercicio_grupo_musculares.map((gm: any) => (
                  <span key={gm.id} style={{ fontSize: '0.78rem', background: '#E0F2FE', color: '#0369A1', padding: '0.25rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>
                    {gm.grupo_muscular?.nombre}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Sin grupos musculares vinculados</span>
              )}
            </div>
          </div>

          {/* DESCRIPCIÓN E INSTRUCCIONES TÉCNICAS */}
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FaBookOpen style={{ color: '#003B70' }} /> Instrucciones Técnicas y Ejecución
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line' }}>
              {ejercicio.descripcion || 'Sin instrucciones adicionales especificadas para este ejercicio.'}
            </p>
          </div>

          {/* SECCIÓN DE VIDEO DEMOSTRATIVO (SIEMPRE VISIBLE) */}
          <div style={{ background: '#FEF2F2', padding: '1rem', borderRadius: '10px', border: '1px solid #FECACA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#991B1B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaVideo style={{ color: '#DC2626' }} /> Demostración en Video
              </h4>
              <button
                onClick={() => setIsEditingVideo(!isEditingVideo)}
                style={{ background: 'none', border: 'none', color: '#B91C1C', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <FaPenToSquare /> {isEditingVideo ? 'Cancelar' : (currentVideoUrl ? 'Cambiar URL' : '+ Asignar URL de Video')}
              </button>
            </div>

            {/* FORMULARIO DE EDICIÓN O ASIGNACIÓN DE VIDEO */}
            {isEditingVideo ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: '1px solid #FCA5A5', fontSize: '0.82rem', background: '#FFF' }}
                />
                <button
                  onClick={handleSaveVideoUrl}
                  disabled={updateEjercicioMutation.isPending}
                  style={{ background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '6px', padding: '0.45rem 0.85rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <FaCheck /> {updateEjercicioMutation.isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            ) : currentVideoUrl ? (
              <div style={{ marginBottom: '0.75rem', fontSize: '0.82rem', wordBreak: 'break-all' }}>
                <span style={{ fontWeight: 600, color: '#7F1D1D' }}>URL del Video: </span>
                <a
                  href={currentVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'underline' }}
                >
                  {currentVideoUrl}
                </a>
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: '#991B1B', margin: '0 0 0.5rem 0', fontStyle: 'italic' }}>
                Este ejercicio aún no tiene una URL de video asignada. Puedes hacer clic arriba en <strong>"+ Asignar URL de Video"</strong> para agregar una.
              </p>
            )}

            {/* REPRODUCTOR SI HAY VIDEO */}
            {currentVideoUrl && !isEditingVideo && (
              currentVideoUrl.includes('youtube') || currentVideoUrl.includes('youtu.be') ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '10px', background: '#000' }}>
                  <iframe
                    src={getEmbedVideoUrl(currentVideoUrl)}
                    title={`Video ${ejercicio.nombre}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
              ) : (
                <video
                  controls
                  src={currentVideoUrl}
                  style={{ width: '100%', maxHeight: '350px', borderRadius: '10px', background: '#000' }}
                >
                  Tu navegador no soporta reproducción de video HTML5.
                </video>
              )
            )}
          </div>

          {/* GALERÍA DE IMÁGENES GUARDADAS LOCALMENTE */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaImages style={{ color: '#0369A1' }} /> Galería de Imágenes Ilustrativas ({imagenes.length})
              </h4>
              {onOpenGaleria && (
                <button
                  onClick={onOpenGaleria}
                  style={{ background: '#E0F2FE', border: 'none', color: '#0369A1', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Administrar Galería
                </button>
              )}
            </div>

            {imagenes.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {imagenes.map((img) => (
                  <div key={img.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', background: '#FFF', display: 'flex', flexDirection: 'column' }}>
                    <img src={img.path_imagen} alt={img.titulo} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                    <div style={{ padding: '0.6rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>{img.titulo}</span>
                        {img.descripcion && <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block', marginTop: '0.2rem' }}>{img.descripcion}</span>}
                      </div>
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.35rem', borderTop: '1px solid #F1F5F9', fontSize: '0.7rem', wordBreak: 'break-all' }}>
                        <span style={{ color: '#94A3B8', fontWeight: 600 }}>URL: </span>
                        <a href={img.path_imagen} target="_blank" rel="noopener noreferrer" style={{ color: '#0284C7', textDecoration: 'underline', fontWeight: 600 }}>
                          {img.path_imagen}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1.25rem', textAlign: 'center', color: '#94A3B8', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1', fontSize: '0.82rem' }}>
                No hay imágenes cargadas en la galería de este ejercicio.
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: '1.5rem', textAlign: 'right', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          {onEdit && (
            <button
              onClick={onEdit}
              style={{ padding: '0.55rem 1.25rem', background: '#F1F5F9', color: '#003B70', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FaPenToSquare /> Editar Información
            </button>
          )}
          <button
            onClick={onClose}
            style={{ padding: '0.55rem 1.25rem', background: '#003B70', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};

export default EjercicioDetailModal;
