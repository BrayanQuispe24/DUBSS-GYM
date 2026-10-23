import React, { useState } from 'react';
import { FaCalendarDays, FaXmark, FaUserCheck, FaVideo, FaEye, FaListCheck, FaClock, FaArrowUpRightFromSquare, FaDumbbell } from 'react-icons/fa6';
import type { PlanEntrenamiento, EjercicioImagen } from '../services/entrenamientoService';
import { useEjercicioImagenes, usePlanEntrenamiento } from '../hooks/useEntrenamiento';

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
        <strong key={i} style={{ color: '#0F172A', fontWeight: 700 }}>
          {part.slice(2, -2)}{' '}
        </strong>
      );
    }
    return <span key={i}>{part} </span>;
  });
};

// Componente para renderizar la galería e info técnica de cada ejercicio dentro del plan
const ExerciseDetailCardInPlan: React.FC<{ re: any; idx: number }> = ({ re, idx }) => {
  const ejercicio = re.ejercicio;
  const idEjercicio = ejercicio?.id || re.id_ejercicio;
  const { data: imagenes = [] } = useEjercicioImagenes(idEjercicio);
  const [activeZoomImage, setActiveZoomImage] = useState<EjercicioImagen | null>(null);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #CBD5E1',
        padding: '0.85rem 1rem',
        marginBottom: '0.65rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.45rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.70rem', fontWeight: 800, background: '#0077D4', color: '#FFF', width: '20px', height: '20px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {idx + 1}
          </span>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
            {ejercicio?.nombre || 'Ejercicio'}
          </span>
          {ejercicio?.tipo_ejercicio?.nombre && (
            <span style={{ fontSize: '0.68rem', background: '#F1F5F9', color: '#475569', padding: '0.12rem 0.4rem', borderRadius: '2px', fontWeight: 600 }}>
              {ejercicio.tipo_ejercicio.nombre}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.72rem', background: '#E0F2FE', color: '#0077D4', padding: '0.15rem 0.5rem', borderRadius: '2px', fontWeight: 700 }}>
            {re.series || 4} Series × {re.repeticiones || 12} Reps
          </span>
          <span style={{ fontSize: '0.72rem', background: '#F1F5F9', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: '2px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <FaClock size={10} /> {re.descanso_segundos || 60}s
          </span>
        </div>
      </div>

      {/* INSTRUCCIONES TÉCNICAS LIMPIAS */}
      {ejercicio?.descripcion && (
        <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 0.55rem 0', lineHeight: 1.45 }}>
          <strong style={{ color: '#0077D4', textTransform: 'uppercase', fontSize: '0.70rem', letterSpacing: '0.04em' }}>Instrucción: </strong>
          {renderCleanInstruction(ejercicio.descripcion)}
        </p>
      )}

      {/* REPRODUCTOR DE VIDEO DEL EJERCICIO */}
      {ejercicio?.url_video && (
        <div style={{ background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0077D4', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FaVideo style={{ color: '#0077D4' }} /> Video Demostrativo
            </span>
            <a href={ejercicio.url_video} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.70rem', color: '#0077D4', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              Abrir enlace <FaArrowUpRightFromSquare size={9} />
            </a>
          </div>

          {ejercicio.url_video.includes('youtube') || ejercicio.url_video.includes('youtu.be') ? (
            <div style={{ position: 'relative', paddingBottom: '45%', height: 0, overflow: 'hidden', borderRadius: '2px', background: '#000' }}>
              <iframe
                src={getEmbedVideoUrl(ejercicio.url_video)}
                title={`Video ${ejercicio.nombre}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          ) : (
            <video controls src={ejercicio.url_video} style={{ width: '100%', maxHeight: '220px', borderRadius: '2px', background: '#000' }} />
          )}
        </div>
      )}

      {/* GALERÍA DE IMÁGENES TÉCNICAS */}
      {imagenes.length > 0 && (
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.35rem' }}>
            Galería de Imágenes Ilustrativas ({imagenes.length}):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
            {imagenes.map((img: EjercicioImagen) => (
              <div key={img.id} style={{ border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', background: '#FFF', position: 'relative' }}>
                <div style={{ position: 'relative', height: '85px', background: '#F8FAFC' }}>
                  <img src={img.path_imagen} alt={img.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setActiveZoomImage(img)}
                    style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(15,23,42,0.7)', border: 'none', color: '#FFF', width: '20px', height: '20px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Ampliar imagen"
                  >
                    <FaEye style={{ fontSize: '0.60rem' }} />
                  </button>
                </div>
                <div style={{ padding: '0.3rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {img.titulo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ZOOM MODAL DE IMAGEN */}
      {activeZoomImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.8)', zIndex: 10005, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative', textAlign: 'center' }}>
            <button
              onClick={() => setActiveZoomImage(null)}
              style={{ position: 'absolute', top: '-35px', right: '0', background: '#FFF', border: 'none', borderRadius: '2px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FaXmark />
            </button>
            <img src={activeZoomImage.path_imagen} alt={activeZoomImage.titulo} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '4px', objectFit: 'contain' }} />
            <div style={{ color: '#FFF', marginTop: '0.4rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.90rem' }}>{activeZoomImage.titulo}</h4>
              {activeZoomImage.descripcion && <p style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.2rem' }}>{activeZoomImage.descripcion}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Props {
  planId?: number;
  plan?: PlanEntrenamiento;
  onClose: () => void;
}

const PlanDetailModal: React.FC<Props> = ({ planId, plan: initialPlan, onClose }) => {
  const { data: fetchedPlan, isLoading } = usePlanEntrenamiento(planId);
  const targetPlan = fetchedPlan || initialPlan;

  if (isLoading || !targetPlan) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
      }}>
        <div style={{ background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
          Cargando detalle completo del plan...
        </div>
      </div>
    );
  }

  const rutinasPorDia = targetPlan.plan_entrenamiento_rutinas || (targetPlan as any).planEntrenamientoRutinas || [];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '4px', maxWidth: '880px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', padding: '1.25rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        position: 'relative', border: '1px solid #CBD5E1'
      }}>
        {/* HEADER ENTERPRISE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ background: '#E0F2FE', color: '#0077D4', padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.70rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <FaUserCheck size={11} /> Atleta: {targetPlan.usuario?.nombre} {targetPlan.usuario?.apellido}
              </span>
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B1727', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <FaCalendarDays style={{ color: '#0077D4' }} /> {targetPlan.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', width: '30px', height: '30px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
            title="Cerrar modal"
          >
            <FaXmark style={{ fontSize: '0.90rem' }} />
          </button>
        </div>

        {/* OBJETIVO DEPORTIVO */}
        <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '1.15rem' }}>
          <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
            Objetivo Deportivo del Plan:
          </span>
          <p style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, margin: 0 }}>
            {targetPlan.objetivo || 'Recondicionamiento físico general y mejora de la capacidad cardiorrespiratoria.'}
          </p>
        </div>

        {/* DETALLE DE RUTINAS Y DÍAS ASIGNADOS */}
        <div>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <FaListCheck style={{ color: '#0077D4' }} /> Cronograma de Rutinas Asignadas ({rutinasPorDia.length} Días)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rutinasPorDia.length > 0 ? (
              rutinasPorDia.map((item: any, idx: number) => {
                const rutina = item.rutina;
                const ejerciciosDeRutina = rutina?.rutina_ejercicios || rutina?.rutinaEjercicios || [];

                return (
                  <div key={item.id || idx} style={{ background: '#F8FAFC', borderRadius: '4px', border: '1px solid #CBD5E1', padding: '1rem' }}>
                    {/* ENCABEZADO DÍA Y NOMBRE DE LA RUTINA */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.55rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ background: '#0077D4', color: '#FFF', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '2px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FaCalendarDays size={11} /> {item.dia_semana || `Día ${idx + 1}`}
                        </span>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {rutina?.nombre || 'Rutina Deportiva'}
                        </h4>
                      </div>
                      {rutina?.nivel && (
                        <span style={{ fontSize: '0.70rem', background: '#E0F2FE', color: '#0077D4', padding: '0.15rem 0.5rem', borderRadius: '2px', fontWeight: 700, textTransform: 'uppercase' }}>
                          Nivel: {rutina.nivel}
                        </span>
                      )}
                    </div>

                    {rutina?.descripcion && (
                      <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                        {rutina.descripcion}
                      </p>
                    )}

                    {/* LISTADO DE EJERCICIOS CON SUS VIDEOS E IMÁGENES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {ejerciciosDeRutina.length > 0 ? (
                        ejerciciosDeRutina.map((re: any, eIdx: number) => (
                          <ExerciseDetailCardInPlan key={re.id || eIdx} re={re} idx={eIdx} />
                        ))
                      ) : (
                        <div style={{ padding: '0.85rem', color: '#94A3B8', fontSize: '0.78rem', textAlign: 'center', background: '#FFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                          Esta rutina no contiene ejercicios vinculados.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', background: '#F8FAFC', borderRadius: '4px', border: '1px dashed #CBD5E1', fontSize: '0.82rem' }}>
                Este plan no posee rutinas ni días asignados aún.
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ENTERPRISE */}
        <div style={{ marginTop: '1.25rem', textAlign: 'right', borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem' }}>
          <button
            onClick={onClose}
            style={{ padding: '0.45rem 1.25rem', background: '#0077D4', color: '#FFF', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            Cerrar Detalle del Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailModal;

