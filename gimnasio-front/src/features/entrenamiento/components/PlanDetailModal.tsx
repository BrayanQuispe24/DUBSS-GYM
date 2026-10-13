import React, { useState } from 'react';
import { FaCalendarDays, FaXmark, FaUserCheck, FaVideo, FaEye, FaListCheck, FaClock, FaArrowUpRightFromSquare } from 'react-icons/fa6';
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
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        padding: '1rem',
        marginBottom: '0.85rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#003B70', color: '#FFF', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {idx + 1}
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
            {ejercicio?.nombre || 'Ejercicio'}
          </span>
          {ejercicio?.tipo_ejercicio?.nombre && (
            <span style={{ fontSize: '0.7rem', background: '#F1F5F9', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
              {ejercicio.tipo_ejercicio.nombre}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
            {re.series || 4} Series × {re.repeticiones || 12} Reps
          </span>
          <span style={{ fontSize: '0.75rem', background: '#E0F2FE', color: '#0369A1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <FaClock size={11} /> {re.descanso_segundos || 60}s
          </span>
        </div>
      </div>

      {ejercicio?.descripcion && (
        <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.65rem 0', lineHeight: 1.4 }}>
          <strong>Instrucción:</strong> {ejercicio.descripcion}
        </p>
      )}

      {/* REPRODUCTOR DE VIDEO DEL EJERCICIO */}
      {ejercicio?.url_video && (
        <div style={{ background: '#FEF2F2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #FECACA', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FaVideo style={{ color: '#DC2626' }} /> Video Demostrativo del Ejercicio
            </span>
            <a href={ejercicio.url_video} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              Abrir enlace <FaArrowUpRightFromSquare size={10} />
            </a>
          </div>

          {ejercicio.url_video.includes('youtube') || ejercicio.url_video.includes('youtu.be') ? (
            <div style={{ position: 'relative', paddingBottom: '45%', height: 0, overflow: 'hidden', borderRadius: '6px', background: '#000' }}>
              <iframe
                src={getEmbedVideoUrl(ejercicio.url_video)}
                title={`Video ${ejercicio.nombre}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          ) : (
            <video controls src={ejercicio.url_video} style={{ width: '100%', maxHeight: '240px', borderRadius: '6px', background: '#000' }} />
          )}
        </div>
      )}

      {/* GALERÍA DE IMÁGENES TÉCNICAS */}
      {imagenes.length > 0 && (
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.4rem' }}>
            Galería de Imágenes Ilustrativas ({imagenes.length}):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.6rem' }}>
            {imagenes.map((img: EjercicioImagen) => (
              <div key={img.id} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden', background: '#FFF', position: 'relative' }}>
                <div style={{ position: 'relative', height: '90px', background: '#F8FAFC' }}>
                  <img src={img.path_imagen} alt={img.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setActiveZoomImage(img)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(15,23,42,0.65)', border: 'none', color: '#FFF', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Ampliar imagen"
                  >
                    <FaEye style={{ fontSize: '0.65rem' }} />
                  </button>
                </div>
                <div style={{ padding: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10005, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
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
        backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem'
      }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem', textAlign: 'center', color: '#64748B' }}>
          Cargando detalle completo del plan...
        </div>
      </div>
    );
  }

  const rutinasPorDia = targetPlan.plan_entrenamiento_rutinas || (targetPlan as any).planEntrenamientoRutinas || [];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem'
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '16px', maxWidth: '900px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        position: 'relative', border: '1px solid #E2E8F0'
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: '#003B70', color: '#FFF', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaUserCheck /> Atleta: {targetPlan.usuario?.nombre} {targetPlan.usuario?.apellido}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCalendarDays style={{ color: '#003B70' }} /> {targetPlan.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <FaXmark style={{ fontSize: '1.2rem' }} />
          </button>
        </div>

        {/* OBJETIVO DEPORTIVO */}
        <div style={{ background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
            Objetivo Deportivo del Plan:
          </span>
          <p style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 600, margin: 0 }}>
            {targetPlan.objetivo || 'Recondicionamiento físico general y mejora de la capacidad cardiorrespiratoria.'}
          </p>
        </div>

        {/* DETALLE DE RUTINAS Y DÍAS ASIGNADOS */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FaListCheck style={{ color: '#003B70' }} /> Cronograma de Rutinas Asignadas ({rutinasPorDia.length} Días)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {rutinasPorDia.length > 0 ? (
              rutinasPorDia.map((item: any, idx: number) => {
                const rutina = item.rutina;
                const ejerciciosDeRutina = rutina?.rutina_ejercicios || rutina?.rutinaEjercicios || [];

                return (
                  <div key={item.id || idx} style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #CBD5E1', padding: '1.25rem' }}>
                    {/* ENCABEZADO DÍA Y NOMBRE DE LA RUTINA */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ background: '#003B70', color: '#FFF', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <FaCalendarDays size={13} /> {item.dia_semana || `Día ${idx + 1}`}
                        </span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {rutina?.nombre || 'Rutina Deportiva'}
                        </h4>
                      </div>
                      {rutina?.nivel && (
                        <span style={{ fontSize: '0.75rem', background: '#E0F2FE', color: '#0369A1', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 700 }}>
                          Nivel: {rutina.nivel}
                        </span>
                      )}
                    </div>

                    {rutina?.descripcion && (
                      <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1rem', fontStyle: 'italic' }}>
                        {rutina.descripcion}
                      </p>
                    )}

                    {/* LISTADO DE EJERCICIOS CON SUS VIDEOS E IMÁGENES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {ejerciciosDeRutina.length > 0 ? (
                        ejerciciosDeRutina.map((re: any, eIdx: number) => (
                          <ExerciseDetailCardInPlan key={re.id || eIdx} re={re} idx={eIdx} />
                        ))
                      ) : (
                        <div style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.82rem', textAlign: 'center', background: '#FFF', borderRadius: '8px' }}>
                          Esta rutina no contiene ejercicios vinculados.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                Este plan no posee rutinas ni días asignados aún.
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: '1.5rem', textAlign: 'right', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
          <button
            onClick={onClose}
            style={{ padding: '0.55rem 1.4rem', background: '#003B70', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            Cerrar Detalle del Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailModal;
