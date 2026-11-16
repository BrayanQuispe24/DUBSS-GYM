import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2, X } from 'lucide-react';
import {
  usePerfilEntrenamiento,
  useSavePerfilEntrenamiento,
  useGenerarRutinaIA,
} from '../hooks/useEntrenamiento';
import { AnalisisCorporalModal } from './AnalisisCorporalModal';
import type { AnalisisCorporal } from '../services/entrenamientoService';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';

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
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; apellido: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(user?.id);

  const { data: perfilExistente } = usePerfilEntrenamiento(selectedUserId);
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
    if (canManage && isOpen) {
      api.get('/usuarios')
        .then((res) => {
          const list = res.data.data || res.data || [];
          setUsuarios(list);
          if (list.length > 0 && (!selectedUserId || selectedUserId === user?.id)) {
            setSelectedUserId(list[0].id);
          }
        })
        .catch(() => {});
    }
  }, [canManage, isOpen]);

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
      id_usuario: selectedUserId,
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
    const data = await generarRutinaMutation.mutateAsync(selectedUserId);
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
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(3px)',
          padding: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '4px',
            border: '1px solid var(--color-border-strong)',
            width: '100%',
            maxWidth: '880px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Header Enterprise */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-surface-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  padding: '0.45rem',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary-text)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Recomendador de Rutinas por Sistema Experto IA
                </h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.15rem 0 0 0' }}>
                  Motor determinista basado en reglas ACSM/NSCA & Alineación Articular MediaPipe
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Cerrar ventana"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div
            style={{
              padding: '1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              flex: 1,
              backgroundColor: 'var(--color-surface)',
            }}
          >
            {!resultadoGenerado ? (
              <form onSubmit={handleGenerar} id="form-sistema-experto" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Selector de Atleta para Administradores / Instructores */}
                {canManage && usuarios.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      Atleta / Socio Destinatario *
                    </label>
                    <select
                      value={selectedUserId || ''}
                      onChange={(e) => setSelectedUserId(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border-strong)',
                        backgroundColor: 'var(--color-surface)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        outline: 'none',
                      }}
                    >
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} {u.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 1. Objetivo & Nivel */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      Objetivo Principal
                    </label>
                    <select
                      value={objetivo}
                      onChange={(e: any) => setObjetivo(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border-strong)',
                        backgroundColor: 'var(--color-surface)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        outline: 'none',
                      }}
                    >
                      <option value="HIPERTROFIA">Hipertrofia Muscular (Ganancia de masa)</option>
                      <option value="FUERZA">Fuerza Máxima (Fuerza explosiva / cargas pesadas)</option>
                      <option value="RESISTENCIA">Resistencia Muscular (Tono y acondicionamiento)</option>
                      <option value="ACONDICIONAMIENTO">Acondicionamiento Físico General</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      Nivel de Experiencia
                    </label>
                    <select
                      value={nivelExperiencia}
                      onChange={(e: any) => setNivelExperiencia(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border-strong)',
                        backgroundColor: 'var(--color-surface)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        outline: 'none',
                      }}
                    >
                      <option value="PRINCIPIANTE">Principiante (0 - 6 meses)</option>
                      <option value="INTERMEDIO">Intermedio (6 meses - 2 años)</option>
                      <option value="AVANZADO">Avanzado (&gt; 2 años)</option>
                    </select>
                  </div>
                </div>

                {/* 2. Días, Edad & Duración */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      Edad del Atleta
                    </label>
                    <input
                      type="number"
                      value={edad}
                      onChange={(e) => setEdad(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border-strong)',
                        backgroundColor: 'var(--color-surface)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      Frecuencia Semanal
                    </label>
                    <select
                      value={diasDisponibles}
                      onChange={(e) => setDiasDisponibles(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border-strong)',
                        backgroundColor: 'var(--color-surface)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
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
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      Minutos por Sesión
                    </label>
                    <input
                      type="number"
                      value={duracionSesion}
                      onChange={(e) => setDuracionSesion(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border-strong)',
                        backgroundColor: 'var(--color-surface)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* 3. Equipamiento Disponible */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Equipamiento Disponible en Gimnasio / Domicilio
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                    {EQUIPAMIENTO_OPCIONES.map((item) => {
                      const selected = equipamiento.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleEquipamiento(item)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '4px',
                            border: selected ? '1px solid var(--color-primary)' : '1px solid var(--color-border-strong)',
                            backgroundColor: selected ? 'var(--color-primary-soft)' : 'var(--color-surface-muted)',
                            color: selected ? 'var(--color-primary-text)' : 'var(--color-text-secondary)',
                            fontWeight: selected ? 700 : 500,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{item}</span>
                          {selected && <CheckCircle2 size={15} style={{ color: 'var(--color-primary-text)' }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Restricciones Físicas */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Restricciones o Molestias Físicas Declaradas
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.5rem' }}>
                    {RESTRICCIONES_OPCIONES.map((item) => {
                      const selected = restricciones.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleRestriccion(item)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '4px',
                            border: selected ? '1px solid var(--color-primary)' : '1px solid var(--color-border-strong)',
                            backgroundColor: selected ? 'var(--color-primary-soft)' : 'var(--color-surface-muted)',
                            color: selected ? 'var(--color-primary-text)' : 'var(--color-text-secondary)',
                            fontWeight: selected ? 700 : 500,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{item}</span>
                          {selected && <CheckCircle2 size={15} style={{ color: 'var(--color-primary-text)' }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Análisis Postural MediaPipe */}
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--color-surface-muted)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Brain size={22} style={{ color: 'var(--color-primary-text)' }} />
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block' }}>
                        Evaluación Corporal Articular (MediaPipe Pose)
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {analisisSeleccionado
                          ? `Análisis biomecánico activo (${analisisSeleccionado.calidad_analisis})`
                          : 'No se ha seleccionado ningún análisis fotográfico.'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalFotoOpen(true)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-strong)',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {analisisSeleccionado ? 'Cambiar / Ver Fotografías' : 'Tomar / Subir 3 Fotos'}
                  </button>
                </div>
              </form>
            ) : (
              /* Muestra de la Rutina Generada */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'var(--color-surface-muted)',
                    border: '1px solid rgba(220, 38, 38, 0.30)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-text)', margin: 0 }}>
                      {resultadoGenerado.plan.nombre}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0 0' }}>
                      Objetivo: <strong>{resultadoGenerado.plan.objetivo}</strong> | Distribución: <strong>{resultadoGenerado.rutinas.length} días semanales</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setResultadoGenerado(null)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-strong)',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Ajustar Parámetros
                  </button>
                </div>

                {/* Justificación de Reglas */}
                <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary-text)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Reglas Biomecánicas Aplicadas por el Motor:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {resultadoGenerado.reglas_aplicadas.map((r: string, idx: number) => (
                      <li key={idx}><code style={{ fontFamily: 'monospace', color: 'var(--color-primary-text)' }}>{r}</code></li>
                    ))}
                  </ul>
                </div>

                {/* Rutinas por Día */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {resultadoGenerado.rutinas.map((r: any, idx: number) => (
                    <div key={r.id || idx} style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', borderRadius: '4px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{r.nombre}</span>
                        <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-primary-text)', backgroundColor: 'var(--color-primary-soft)', padding: '0.15rem 0.5rem', borderRadius: '2px', border: '1px solid rgba(220, 38, 38, 0.30)' }}>
                          {r.descripcion}
                        </span>
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {r.rutina_ejercicios?.map((re: any) => (
                          <div key={re.id} style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-surface-muted)', borderRadius: '4px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                            <div>
                              <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', display: 'block' }}>{re.ejercicio?.nombre}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{re.observacion}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700, fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{re.series} series</span>
                              <span style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700, fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{re.repeticiones} reps</span>
                              <span style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700, fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{re.descanso_segundos}s desc.</span>
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

          {/* Footer Enterprise Actions */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-muted)',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            {resultadoGenerado ? (
              <button
                type="button"
                onClick={() => {
                  setResultadoGenerado(null);
                  onClose();
                }}
                style={{
                  padding: '0.45rem 1.25rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.80rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.15s ease',
                }}
              >
                Aceptar y Ver en Listado de Planes
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border-strong)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.80rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar y Cerrar
                </button>
                <button
                  type="submit"
                  form="form-sistema-experto"
                  disabled={generarRutinaMutation.isPending || savePerfilMutation.isPending}
                  style={{
                    padding: '0.45rem 1.25rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.80rem',
                    cursor: generarRutinaMutation.isPending || savePerfilMutation.isPending ? 'not-allowed' : 'pointer',
                    opacity: generarRutinaMutation.isPending || savePerfilMutation.isPending ? 0.7 : 1,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {generarRutinaMutation.isPending
                    ? 'Consultando Motor de Reglas ACSM...'
                    : 'Generar Rutina con Sistema Experto IA'}
                </button>
              </>
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

