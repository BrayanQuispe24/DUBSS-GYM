import React, { useState } from 'react';
import { FaListCheck, FaXmark, FaDumbbell, FaVideo, FaImages, FaClock, FaRepeat, FaBookOpen, FaEye, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import type { Rutina, EjercicioImagen } from '../services/entrenamientoService';
import { useEjercicioImagenes } from '../hooks/useEntrenamiento';

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

// Formateador de texto técnico con soporte para asteriscos Markdown
const renderCleanInstruction = (text?: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
          {part.slice(2, -2)}{' '}
        </strong>
      );
    }
    return <span key={i}>{part} </span>;
  });
};

// Componente individual para mostrar el detalle multimedia de cada ejercicio dentro de la rutina
const RutinaEjercicioItemDetail: React.FC<{ re: any; idx: number }> = ({ re, idx }) => {
  const ejercicio = re.ejercicio;
  const idEjercicio = ejercicio?.id || re.id_ejercicio;

  // Cargar imágenes guardadas de la galería técnica del ejercicio
  const { data: imagenes = [] } = useEjercicioImagenes(idEjercicio);
  const [activeZoomImage, setActiveZoomImage] = useState<EjercicioImagen | null>(null);

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: '4px',
        border: '1px solid var(--color-border-strong)',
        padding: '0.85rem 1rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* CABECERA DEL EJERCICIO EN LA RUTINA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ width: '20px', height: '20px', borderRadius: '2px', background: 'var(--color-primary)', color: '#FFF', fontSize: '0.70rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {idx + 1}
          </span>
          <div>
            <h4 style={{ fontSize: '0.90rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FaDumbbell style={{ color: 'var(--color-primary-text)', fontSize: '0.8rem' }} /> {ejercicio?.nombre || `Ejercicio #${idx + 1}`}
            </h4>
            {ejercicio?.tipo_ejercicio?.nombre && (
              <span style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Categoría: {ejercicio.tipo_ejercicio.nombre}
              </span>
            )}
          </div>
        </div>

        {/* PRESCRIPCIÓN DE ENTRENAMIENTO (SERIES X REPS & DESCANSO) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', background: 'var(--color-surface-muted)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-strong)', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FaRepeat style={{ color: 'var(--color-primary-text)' }} /> {re.series || 4} Series × {re.repeticiones || 12} Reps
          </span>
          <span style={{ fontSize: '0.72rem', background: 'var(--color-primary-soft)', color: 'var(--color-primary-text)', border: '1px solid rgba(220, 38, 38, 0.30)', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FaClock style={{ color: 'var(--color-primary-text)' }} /> {re.descanso_segundos || 60}s Descanso
          </span>
        </div>
      </div>

      {/* INSTRUCCIONES TÉCNICAS */}
      {ejercicio?.descripcion && (
        <div style={{ background: 'var(--color-surface-muted)', padding: '0.6rem 0.75rem', borderRadius: '2px', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            <FaBookOpen style={{ color: 'var(--color-primary-text)' }} /> Instrucciones Técnicas:
          </span>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {renderCleanInstruction(ejercicio.descripcion)}
          </div>
        </div>
      )}

      {/* VIDEO DEMOSTRATIVO DEL EJERCICIO */}
      {ejercicio?.url_video ? (
        <div style={{ background: '#FFF7ED', padding: '0.65rem 0.85rem', borderRadius: '2px', border: '1px solid #FFEDD5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <h5 style={{ fontSize: '0.74rem', fontWeight: 700, color: '#C2410C', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              <FaVideo style={{ color: '#EA580C' }} /> Demostración Técnica en Video
            </h5>
            <a
              href={ejercicio.url_video}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.72rem', color: 'var(--color-primary-text)', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              Abrir enlace <FaArrowUpRightFromSquare size={9} />
            </a>
          </div>

          {ejercicio.url_video.includes('youtube') || ejercicio.url_video.includes('youtu.be') ? (
            <div style={{ position: 'relative', paddingBottom: '45%', height: 0, overflow: 'hidden', borderRadius: '2px', background: '#141419' }}>
              <iframe
                src={getEmbedVideoUrl(ejercicio.url_video)}
                title={`Video ${ejercicio.nombre}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          ) : (
            <video
              controls
              src={ejercicio.url_video}
              style={{ width: '100%', maxHeight: '240px', borderRadius: '2px', background: '#141419' }}
            >
              Navegador no soporta video HTML5.
            </video>
          )}
        </div>
      ) : null}

      {/* GALERÍA DE IMÁGENES ILUSTRATIVAS DEL EJERCICIO */}
      <div>
        <h5 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <FaImages style={{ color: 'var(--color-primary-text)' }} /> Galería Fotográfica ({imagenes.length})
        </h5>

        {imagenes.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
            {imagenes.map((img: EjercicioImagen) => (
              <div
                key={img.id}
                style={{
                  border: '1px solid var(--color-border-strong)', borderRadius: '2px', overflow: 'hidden', background: 'var(--color-surface)',
                  display: 'flex', flexDirection: 'column', position: 'relative'
                }}
              >
                <div style={{ position: 'relative', height: '80px', background: 'var(--color-surface-muted)' }}>
                  <img src={img.path_imagen} alt={img.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setActiveZoomImage(img)}
                    style={{
                      position: 'absolute', top: '4px', right: '4px', background: 'rgba(0, 0, 0,0.7)',
                      border: 'none', color: '#FFF', width: '22px', height: '22px', borderRadius: '2px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                    title="Ampliar imagen"
                  >
                    <FaEye style={{ fontSize: '0.65rem' }} />
                  </button>
                </div>
                <div style={{ padding: '0.3rem 0.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {img.titulo}
                  </span>
                  {img.descripcion && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {img.descripcion}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '0.6rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-muted)', borderRadius: '2px', border: '1px dashed var(--color-border-strong)', fontSize: '0.72rem', textAlign: 'center' }}>
            Sin imágenes registradas en la biblioteca para este ejercicio.
          </div>
        )}
      </div>

      {/* ZOOM MODAL DE IMAGEN AMPLIADA */}
      {activeZoomImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0,0.85)', zIndex: 10005, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{ maxWidth: '85vw', maxHeight: '85vh', position: 'relative', textAlign: 'center', background: '#141419', border: '1px solid #334155', borderRadius: '2px', padding: '1rem' }}>
            <button
              onClick={() => setActiveZoomImage(null)}
              style={{ position: 'absolute', top: '-14px', right: '-14px', background: 'var(--color-primary)', color: '#FFF', border: 'none', borderRadius: '2px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FaXmark size={14} />
            </button>
            <img src={activeZoomImage.path_imagen} alt={activeZoomImage.titulo} style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '2px', objectFit: 'contain' }} />
            <div style={{ color: '#F8FAFC', marginTop: '0.5rem', textAlign: 'left' }}>
              <h4 style={{ margin: 0, fontSize: '0.90rem', fontWeight: 700 }}>{activeZoomImage.titulo}</h4>
              {activeZoomImage.descripcion && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', margin: 0 }}>{activeZoomImage.descripcion}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface RutinaDetailModalProps {
  rutina: Rutina;
  onClose: () => void;
}

const RutinaDetailModal: React.FC<RutinaDetailModalProps> = ({ rutina, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '4px',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          position: 'relative',
          border: '1px solid var(--color-border-strong)',
          overflow: 'hidden',
        }}
      >
        {/* HEADER DE LA RUTINA */}
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--color-border-strong)', background: 'var(--color-surface-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span style={{ background: 'var(--color-primary)', color: '#FFF', padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <FaListCheck /> Nivel: {rutina.nivel || 'General'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {rutina.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', width: '28px', height: '28px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            title="Cerrar ventana"
          >
            <FaXmark style={{ fontSize: '0.85rem' }} />
          </button>
        </div>

        {/* CONTENIDO SCROLLABLE */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* DESCRIPCIÓN DE LA RUTINA */}
          {rutina.descripcion && (
            <div style={{ background: 'var(--color-surface-muted)', padding: '0.65rem 0.85rem', borderRadius: '2px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {renderCleanInstruction(rutina.descripcion)}
              </div>
            </div>
          )}

          {/* LISTADO DE EJERCICIOS Y SUS RECURSOS MULTIMEDIA (IMÁGENES Y VIDEOS) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                <FaDumbbell style={{ color: 'var(--color-primary-text)' }} /> Ejercicios Configurados ({rutina.rutina_ejercicios?.length || 0})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {rutina.rutina_ejercicios && rutina.rutina_ejercicios.length > 0 ? (
                rutina.rutina_ejercicios.map((re: any, idx: number) => (
                  <RutinaEjercicioItemDetail key={re.id || idx} re={re} idx={idx} />
                ))
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-surface-muted)', borderRadius: '2px', border: '1px dashed var(--color-border-strong)', fontSize: '0.80rem' }}>
                  Esta rutina no contiene ejercicios vinculados.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--color-border-strong)', background: 'var(--color-surface-muted)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={onClose}
            style={{ padding: '0.45rem 1.1rem', background: 'var(--color-primary)', color: '#FFF', border: 'none', borderRadius: '2px', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer' }}
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};

export default RutinaDetailModal;
