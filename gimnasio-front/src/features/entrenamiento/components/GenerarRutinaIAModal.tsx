import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2, X } from 'lucide-react';
import {
  usePerfilEntrenamiento,
  useSavePerfilEntrenamiento,
  useGenerarRutinaIA,
} from '../hooks/useEntrenamiento';
import { AnalisisCorporalModal } from './AnalisisCorporalModal';
import type { AnalisisCorporal } from '../services/entrenamientoService';

interface GenerarRutinaIAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EQUIPAMIENTO_OPCIONES = [
  'Mancuerna',
  'Barra',
  'Polea',
  'Máquina',
  'Peso corporal',
  'Pesa Rusa (Kettlebell)',
  'Banda Elástica',
  'Balón Medicinal',
];

const RESTRICCIONES_OPCIONES = [
  'Sin restricciones',
  'Molestia en Rodilla',
  'Molestia en Hombro',
  'Dolor Lumbar leve',
  'Molestia en Muñeca',
];

export const GenerarRutinaIAModal: React.FC<GenerarRutinaIAModalProps> = ({ isOpen, onClose }) => {
  const { data: perfilExistente } = usePerfilEntrenamiento();
  const savePerfilMutation = useSavePerfilEntrenamiento();
  const generarRutinaMutation = useGenerarRutinaIA();

  const [edad, setEdad] = useState<number>(25);
  const [objetivo, setObjetivo] = useState<'HIPERTROFIA' | 'FUERZA' | 'RESISTENCIA' | 'ACONDICIONAMIENTO'>('HIPERTROFIA');
  const [nivelExperiencia, setNivelExperiencia] = useState<'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'>('PRINCIPIANTE');
  const [diasDisponibles, setDiasDisponibles] = useState<number>(3);
  const [duracionSesion, setDuracionSesion] = useState<number>(60);
  const [equipamiento, setEquipamiento] = useState<string[]>(['Mancuerna', 'Barra', 'Peso corporal']);
  const [restricciones, setRestricciones] = useState<string[]>(['Sin restricciones']);
  const [analisisSeleccionado, setAnalisisSeleccionado] = useState<AnalisisCorporal | null>(null);

  const [modalFotoOpen, setModalFotoOpen] = useState(false);
  const [resultadoGenerado, setResultadoGenerado] = useState<any | null>(null);

  useEffect(() => {
    if (perfilExistente) {
      if (perfilExistente.edad) setEdad(perfilExistente.edad);
      if (perfilExistente.objetivo) setObjetivo(perfilExistente.objetivo);
      if (perfilExistente.nivel_experiencia) setNivelExperiencia(perfilExistente.nivel_experiencia);
      if (perfilExistente.dias_disponibles) setDiasDisponibles(perfilExistente.dias_disponibles);
      if (perfilExistente.duracion_sesion_min) setDuracionSesion(perfilExistente.duracion_sesion_min);
      if (perfilExistente.equipamiento_disponible) setEquipamiento(perfilExistente.equipamiento_disponible);
      if (perfilExistente.restricciones_declaradas) setRestricciones(perfilExistente.restricciones_declaradas);
      if (perfilExistente.ultimo_analisis) setAnalisisSeleccionado(perfilExistente.ultimo_analisis);
    }
  }, [perfilExistente]);

  if (!isOpen) return null;

  const toggleEquipamiento = (item: string) => {
    setEquipamiento((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleRestriccion = (item: string) => {
    if (item === 'Sin restricciones') {
      setRestricciones(['Sin restricciones']);
      return;
    }
    setRestricciones((prev) => {
      const filtered = prev.filter((i) => i !== 'Sin restricciones');
      return filtered.includes(item)
        ? filtered.filter((i) => i !== item)
        : [...filtered, item];
    });
  };

  const handleGenerar = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Guardar o actualizar perfil primero
    await savePerfilMutation.mutateAsync({
      edad,
      objetivo,
      nivel_experiencia: nivelExperiencia,
      dias_disponibles: diasDisponibles,
      duracion_sesion_min: duracionSesion,
      equipamiento_disponible: equipamiento,
      restricciones_declaradas: restricciones,
      id_ultimo_analisis: analisisSeleccionado?.id,
    });

    // 2. Ejecutar recomendación por IA
    const data = await generarRutinaMutation.mutateAsync();
    setResultadoGenerado(data);
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          padding: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            width: '100%',
            maxWidth: '920px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  padding: '0.6rem',
                  backgroundColor: '#F3E8FF',
                  color: '#7E22CE',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Recomendador de Rutinas por IA Experta
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                  Sistema experto basado en reglas ACSM/NSCA & MediaPipe Pose
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div
            style={{
              padding: '1.75rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              flex: 1,
              backgroundColor: '#FFFFFF',
            }}
          >
            {!resultadoGenerado ? (
              <form onSubmit={handleGenerar} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* 1. Objetivo & Nivel */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                      Objetivo Principal
                    </label>
                    <select
                      value={objetivo}
                      onChange={(e: any) => setObjetivo(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                      }}
                    >
                      <option value="HIPERTROFIA">Hipertrofia Muscular (Ganancia de masa)</option>
                      <option value="FUERZA">Fuerza Máxima (Fuerza explosiva / pesados)</option>
                      <option value="RESISTENCIA">Resistencia Muscular (Definición / tono)</option>
                      <option value="ACONDICIONAMIENTO">Acondicionamiento Físico General</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                      Nivel de Experiencia
                    </label>
                    <select
                      value={nivelExperiencia}
                      onChange={(e: any) => setNivelExperiencia(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                      }}
                    >
                      <option value="PRINCIPIANTE">Principiante (0 - 6 meses)</option>
                      <option value="INTERMEDIO">Intermedio (6 meses - 2 años)</option>
                      <option value="AVANZADO">Avanzado (&gt; 2 años)</option>
                    </select>
                  </div>
                </div>

                {/* 2. Días & Duración */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                      Edad
                    </label>
                    <input
                      type="number"
                      value={edad}
                      onChange={(e) => setEdad(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                      Días por Semana
                    </label>
                    <select
                      value={diasDisponibles}
                      onChange={(e) => setDiasDisponibles(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6].map((d) => (
                        <option key={d} value={d}>
                          {d} {d === 1 ? 'día' : 'días'} a la semana
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                      Minutos por Sesión
                    </label>
                    <input
                      type="number"
                      value={duracionSesion}
                      onChange={(e) => setDuracionSesion(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    />
                  </div>
                </div>

                {/* 3. Equipamiento Disponible */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                    Equipamiento Disponible en tu Gimnasio / Casa
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.6rem' }}>
                    {EQUIPAMIENTO_OPCIONES.map((item) => {
                      const selected = equipamiento.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleEquipamiento(item)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            border: selected ? '2px solid #7E22CE' : '1px solid #E2E8F0',
                            backgroundColor: selected ? '#FAF5FF' : '#F8FAFC',
                            color: selected ? '#6B21A8' : '#475569',
                            fontWeight: selected ? 800 : 600,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{item}</span>
                          {selected && <CheckCircle2 size={16} style={{ color: '#7E22CE' }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Restricciones Físicas */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                    Restricciones o Molestias Físicas Declaradas
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
                    {RESTRICCIONES_OPCIONES.map((item) => {
                      const selected = restricciones.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleRestriccion(item)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            border: selected ? '2px solid #D97706' : '1px solid #E2E8F0',
                            backgroundColor: selected ? '#FFFBEB' : '#F8FAFC',
                            color: selected ? '#92400E' : '#475569',
                            fontWeight: selected ? 800 : 600,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{item}</span>
                          {selected && <CheckCircle2 size={16} style={{ color: '#D97706' }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Análisis Postural MediaPipe */}
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <Brain size={24} style={{ color: '#0369A1' }} />
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                        Análisis Corporal con MediaPipe
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#0369A1', fontWeight: 600 }}>
                        {analisisSeleccionado
                          ? `Análisis activo (${analisisSeleccionado.calidad_analisis})`
                          : 'No se ha seleccionado ningún análisis de fotografías.'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalFotoOpen(true)}
                    style={{
                      padding: '0.55rem 1rem',
                      backgroundColor: '#FFFFFF',
                      color: '#0369A1',
                      border: '1px solid #BAE6FD',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    {analisisSeleccionado ? 'Cambiar / Ver Fotografías' : 'Tomar / Subir 3 Fotos'}
                  </button>
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                  <button
                    type="submit"
                    disabled={generarRutinaMutation.isPending || savePerfilMutation.isPending}
                    style={{
                      padding: '0.85rem 2rem',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: generarRutinaMutation.isPending || savePerfilMutation.isPending ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {generarRutinaMutation.isPending
                      ? 'Consultando Motor de Reglas ACSM...'
                      : 'Generar Rutina con Sistema Experto IA'}
                  </button>
                </div>
              </form>
            ) : (
              /* Muestra de la Rutina Generada */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: 'linear-gradient(135deg, #F3E8FF 0%, #E0E7FF 100%)',
                    border: '1px solid #C084FC',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#581C87', margin: 0 }}>
                      {resultadoGenerado.plan.nombre}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#431407', margin: '0.3rem 0 0 0' }}>
                      Objetivo: <strong>{resultadoGenerado.plan.objetivo}</strong> | Días: <strong>{resultadoGenerado.rutinas.length} días</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setResultadoGenerado(null)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#FFFFFF',
                      color: '#4C1D95',
                      border: '1px solid #DDD6FE',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Ajustar Parámetros
                  </button>
                </div>

                {/* Justificación de Reglas */}
                <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6B21A8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Reglas Aplicadas por el Sistema Experto:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {resultadoGenerado.reglas_aplicadas.map((r: string, idx: number) => (
                      <li key={idx}><code style={{ fontFamily: 'monospace', color: '#581C87' }}>{r}</code></li>
                    ))}
                  </ul>
                </div>

                {/* Rutinas por Día */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {resultadoGenerado.rutinas.map((r: any, idx: number) => (
                    <div key={r.id || idx} style={{ border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{r.nombre}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B21A8', backgroundColor: '#F3E8FF', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid #E9D5FF' }}>
                          {r.descripcion}
                        </span>
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {r.rutina_ejercicios?.map((re: any) => (
                          <div key={re.id} style={{ padding: '0.85rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <div>
                              <span style={{ fontWeight: 800, color: '#0F172A', display: 'block' }}>{re.ejercicio?.nombre}</span>
                              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{re.observacion}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.78rem' }}>{re.series} series</span>
                              <span style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.78rem' }}>{re.repeticiones} reps</span>
                              <span style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.78rem' }}>{re.descanso_segundos}s desc.</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnalisisCorporalModal
        isOpen={modalFotoOpen}
        onClose={() => setModalFotoOpen(false)}
        onSelectAnalisis={(analisis) => {
          setAnalisisSeleccionado(analisis);
          setModalFotoOpen(false);
        }}
      />
    </>
  );
};
