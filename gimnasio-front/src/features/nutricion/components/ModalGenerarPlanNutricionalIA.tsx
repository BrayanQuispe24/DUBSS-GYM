import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Apple,
  Flame,
  Droplets,
  Dumbbell,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Save,
  UtensilsCrossed,
} from 'lucide-react';
import {
  iaNutricionService,
  type PerfilNutricionalInput,
  type RecomendacionNutricionalResponse,
} from '../services/iaNutricionService';

interface UsuarioSimple {
  id: number;
  nombre: string;
  apellido: string;
}

interface ModalGenerarPlanNutricionalIAProps {
  isOpen: boolean;
  onClose: () => void;
  usuarios: UsuarioSimple[];
  currentUser?: { id: number; name?: string; nombre?: string; apellido?: string; rol?: string } | null;
  onSavePlanOficial: (planData: {
    nombre: string;
    objetivo?: string;
    observacion?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    id_usuario: number;
    estado: boolean;
    detalles: {
      dia_semana?: string;
      tipo_comida?: string;
      alimento?: string;
      descripcion?: string;
      cantidad?: number;
      unidad?: string;
      calorias?: number;
      proteinas?: number;
      carbohidratos?: number;
      grasas?: number;
      observacion?: string;
    }[];
  }) => Promise<void> | void;
  isSavingPlan?: boolean;
}

export const ModalGenerarPlanNutricionalIA: React.FC<ModalGenerarPlanNutricionalIAProps> = ({
  isOpen,
  onClose,
  usuarios,
  currentUser,
  onSavePlanOficial,
  isSavingPlan = false,
}) => {
  const isCliente = currentUser?.rol === 'cliente';
  const [selectedUserId, setSelectedUserId] = useState<number | ''>(
    currentUser?.id ? currentUser.id : ''
  );

  React.useEffect(() => {
    if (currentUser?.id && (!selectedUserId || isCliente)) {
      setSelectedUserId(currentUser.id);
    }
  }, [currentUser, isCliente]);
  const [edad, setEdad] = useState<number>(23);
  const [sexo, setSexo] = useState<'masculino' | 'femenino'>('masculino');
  const [pesoKg, setPesoKg] = useState<number>(72.0);
  const [alturaCm, setAlturaCm] = useState<number>(174.0);
  const [nivelActividad, setNivelActividad] = useState<string>('moderado');
  const [objetivo, setObjetivo] = useState<string>('aumento_masa_muscular');
  const [comidasAlDia, setComidasAlDia] = useState<number>(4);
  const [presupuesto, setPresupuesto] = useState<string>('economico');
  const [restriccionesTexto, setRestriccionesTexto] = useState<string>('');
  const [alimentosEvitar, setAlimentosEvitar] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RecomendacionNutricionalResponse | null>(null);
  const [expandedMealIdx, setExpandedMealIdx] = useState<number | null>(0);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setErrorMsg('Por favor selecciona un atleta / usuario para asignarle la recomendación.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    setSavedSuccess(false);

    try {
      const restricciones = restriccionesTexto
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
      const noDeseados = alimentosEvitar
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const payload: PerfilNutricionalInput = {
        edad: Number(edad),
        sexo,
        peso_kg: Number(pesoKg),
        altura_cm: Number(alturaCm),
        nivel_actividad: nivelActividad,
        objetivo,
        comidas_al_dia: Number(comidasAlDia),
        restricciones,
        alimentos_no_deseados: noDeseados,
        presupuesto,
        observaciones_adicionales: observaciones || undefined,
      };

      const data = await iaNutricionService.generarRecomendacion(payload);
      setResultado(data);
    } catch (err: any) {
      console.error('Error generando recomendación con Gemini:', err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Error al conectar con el microservicio de IA. Verifica que esté activo en el puerto 8001.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarOficial = async () => {
    const finalUserId = Number(selectedUserId || currentUser?.id);
    if (!resultado || !finalUserId) {
      setErrorMsg('No se pudo identificar el ID del usuario para guardar el plan.');
      return;
    }

    const selectedUser =
      usuarios.find((u) => u.id === finalUserId) ||
      (currentUser?.id === finalUserId ? currentUser : null);

    const userName = selectedUser
      ? `${selectedUser.nombre || ''} ${selectedUser.apellido || ''}`.trim() || 'Atleta'
      : 'Atleta';

    const objetivoLabel =
      objetivo === 'perdida_grasa'
        ? 'Déficit Calórico'
        : objetivo === 'aumento_masa_muscular'
        ? 'Hipertrofia Muscular'
        : objetivo === 'definicion'
        ? 'Definición'
        : 'Rendimiento';

    const nombreCompleto = `Plan IA (${objetivoLabel}) - ${userName}`.substring(0, 95);

    const parseHoraSafe = (h?: string): string | undefined => {
      if (!h) return undefined;
      const match = h.match(/(\d{1,2}):(\d{2})(?:\s*([APap][Mm]))?/);
      if (!match) return undefined;
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const modifier = match[3]?.toUpperCase();
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    };

    const detalles = resultado.comidas.map((c) => {
      const lineasObservacion = [
        `Macros: P: ${c.proteinas_g}g | C: ${c.carbohidratos_g}g | G: ${c.grasas_g}g`,
        c.horario_sugerido ? `Horario Sugerido: ${c.horario_sugerido}` : '',
        c.ingredientes && c.ingredientes.length > 0
          ? `Ingredientes y Porciones:\n${c.ingredientes.map((i) => `• ${i}`).join('\n')}`
          : '',
        c.instrucciones_preparacion
          ? `Preparación:\n${c.instrucciones_preparacion}`
          : '',
        c.sustitutos_accesibles && c.sustitutos_accesibles.length > 0
          ? `Sustitutos Económicos:\n${c.sustitutos_accesibles.map((s) => `• ${s}`).join('\n')}`
          : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      return {
        dia_semana: 'Lunes a Domingo',
        tipo_comida: c.tipo_comida.substring(0, 45),
        hora: parseHoraSafe(c.horario_sugerido),
        alimento: c.plato_nombre.substring(0, 240),
        descripcion: `${c.plato_nombre} - ${c.ingredientes.join(', ')}`.substring(0, 240),
        cantidad: c.calorias,
        unidad: 'kcal',
        calorias: c.calorias,
        proteinas: c.proteinas_g,
        carbohidratos: c.carbohidratos_g,
        grasas: c.grasas_g,
        observacion: lineasObservacion,
      };
    });

    // El campo objetivo en DB es varchar(255). Mantenemos un valor conciso y claro:
    const objetivoCorto = `${resultado.calorias_diarias_recomendadas} kcal/día - Plan ${objetivoLabel}`.substring(0, 240);

    // Guardamos la estrategia completa de Gemini en 'observacion' que es de tipo TEXT (ilimitado)
    const observacionEstrategia = resultado.resumen_estrategia;

    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaFin = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      setErrorMsg(null);
      await onSavePlanOficial({
        nombre: nombreCompleto,
        objetivo: objetivoCorto,
        observacion: observacionEstrategia,
        fecha_inicio: fechaHoy,
        fecha_fin: fechaFin,
        id_usuario: finalUserId,
        estado: true,
        detalles,
      });

      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      console.error('Error al guardar plan oficial:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error al guardar el plan oficial en el sistema.';
      setErrorMsg(msg);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        backgroundColor: 'rgba(0, 0, 0, 0.70)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '4px',
          border: '1px solid var(--color-border-strong)',
          width: '100%',
          maxWidth: resultado ? '920px' : '720px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Header Enterprise */}
        <div
          style={{
            background: 'linear-gradient(135deg, #990000 0%, #570000 100%)',
            padding: '1rem 1.25rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--color-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="#FCA5A5" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.01em' }}>
                Prescripción Nutricional Inteligente (Gemini 2.5 Flash)
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#FCA5A5' }}>
                Cálculo energético clínico y diseño de menú con insumos locales accesibles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E2E8F0',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '2px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body con Scroll */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, backgroundColor: 'var(--color-surface-muted)' }}>
          {errorMsg && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-danger-bg)',
                border: '1px solid rgba(220, 38, 38, 0.35)',
                borderRadius: '4px',
                color: 'var(--color-danger-text)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} color="var(--color-danger-text)" />
              <span>{errorMsg}</span>
            </div>
          )}

          {savedSuccess && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-success-bg)',
                border: '1px solid rgba(22, 163, 74, 0.35)',
                borderRadius: '4px',
                color: 'var(--color-success-text)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} color="#16A34A" />
              <span>¡El plan nutricional fue guardado exitosamente en el sistema como Plan Oficial!</span>
            </div>
          )}

          {!resultado ? (
            /* FORMULARIO DE ENTRADA */
            <form onSubmit={handleGenerar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-text)',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  1. Selección del Usuario & Datos Antropométricos
                </span>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                    Usuario / Atleta Evaluado *
                  </label>
                  {isCliente ? (
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: 'var(--color-primary-soft)',
                        border: '1px solid rgba(220, 38, 38, 0.30)',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--color-primary-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>
                        {currentUser?.nombre || currentUser?.name || 'Usuario Actual'} {currentUser?.apellido || ''}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          background: '#DBEAFE',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '2px',
                          textTransform: 'uppercase',
                          fontWeight: 800,
                        }}
                      >
                        Tu Perfil
                      </span>
                    </div>
                  ) : (
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : '')}
                      required
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.6rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border-strong)',
                        fontSize: '0.85rem',
                        backgroundColor: 'var(--color-surface)',
                        outline: 'none',
                      }}
                    >
                      <option value="">-- Selecciona el usuario --</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} {u.apellido}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Edad (años) *
                    </label>
                    <input
                      type="number"
                      min={14}
                      max={90}
                      value={edad}
                      onChange={(e) => setEdad(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Sexo Biológico *
                    </label>
                    <select
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value as any)}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem', backgroundColor: 'var(--color-surface)' }}
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Peso (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={35}
                      max={220}
                      value={pesoKg}
                      onChange={(e) => setPesoKg(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Estatura (cm) *
                    </label>
                    <input
                      type="number"
                      min={120}
                      max={230}
                      value={alturaCm}
                      onChange={(e) => setAlturaCm(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-text)',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  2. Parámetros de Entrenamiento & Prescripción
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Nivel de Actividad Diaria
                    </label>
                    <select
                      value={nivelActividad}
                      onChange={(e) => setNivelActividad(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem', backgroundColor: 'var(--color-surface)' }}
                    >
                      <option value="sedentario">Sedentario (Trabajo de escritorio / Poco ejercicio)</option>
                      <option value="ligero">Ligero (1-3 días de entrenamiento/sem)</option>
                      <option value="moderado">Moderado (3-5 días de entrenamiento/sem)</option>
                      <option value="intenso">Intenso (6-7 días de entrenamiento/sem)</option>
                      <option value="muy_intenso">Muy Intenso (Doble sesión / Atleta de competencia)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Objetivo Nutricional
                    </label>
                    <select
                      value={objetivo}
                      onChange={(e) => setObjetivo(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem', backgroundColor: 'var(--color-surface)' }}
                    >
                      <option value="aumento_masa_muscular">Aumento de Masa Muscular (Superávit controlado)</option>
                      <option value="perdida_grasa">Pérdida de Grasa (Déficit calórico moderado)</option>
                      <option value="definicion">Definición Muscular (Retención proteica estricta)</option>
                      <option value="mantenimiento">Mantenimiento & Rendimiento Deportivo</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Cantidad de Comidas al Día
                    </label>
                    <select
                      value={comidasAlDia}
                      onChange={(e) => setComidasAlDia(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem', backgroundColor: 'var(--color-surface)' }}
                    >
                      <option value={3}>3 Comidas (Desayuno, Almuerzo, Cena)</option>
                      <option value={4}>4 Comidas (Desayuno, Almuerzo, Merienda, Cena)</option>
                      <option value={5}>5 Comidas (Desayuno, Colación, Almuerzo, Merienda, Cena)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Presupuesto / Tipo de Insumos
                    </label>
                    <select
                      value={presupuesto}
                      onChange={(e) => setPresupuesto(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem', backgroundColor: 'var(--color-surface)' }}
                    >
                      <option value="economico">Económico (Canasta básica accesible: huevos, pollo, avena, arroz, plátano)</option>
                      <option value="estandar">Estándar (Variedad balanceada de carnes y suplementos)</option>
                      <option value="flexible">Flexible (Sin restricción de insumos)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-text)',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  3. Preferencias & Restricciones
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Restricciones / Alergias (separadas por coma)
                    </label>
                    <input
                      placeholder="Ej: sin_lactosa, celiaco, vegetariano"
                      value={restriccionesTexto}
                      onChange={(e) => setRestriccionesTexto(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Alimentos a Excluir (separados por coma)
                    </label>
                    <input
                      placeholder="Ej: pescado, brocoli, cebolla"
                      value={alimentosEvitar}
                      onChange={(e) => setAlimentosEvitar(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                    Observaciones o Notas Clínicas Adicionales
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Estudiante con entrenamiento a las 06:00 AM, necesita desayuno ligero previo."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem', resize: 'none' }}
                  />
                </div>
              </div>

              {/* Botón Acción Generar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border-strong)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #B91C1C 0%, #7A0000 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 4px rgba(153, 0, 0, 0.2)',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Generando con Gemini 2.5 Flash...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generar Plan Nutricional</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* RESULTADOS GENERADOS CON GEMINI */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Tarjetas KPI de Metas Energéticas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: '4px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Meta Calórica</span>
                    <Flame size={16} color="#EA580C" />
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    {resultado.calorias_diarias_recomendadas} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>kcal</span>
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    TMB: {resultado.tasa_metabolica_basal_estimada} | GET: {resultado.gasto_energetico_total}
                  </div>
                </div>

                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: '4px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Proteínas</span>
                    <Dumbbell size={16} color="var(--color-primary-text)" />
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>
                    {resultado.macronutrientes_totales.proteinas_g} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>g</span>
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    ~{((resultado.macronutrientes_totales.proteinas_g * 4 / resultado.calorias_diarias_recomendadas) * 100).toFixed(0)}% del aporte
                  </div>
                </div>

                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: '4px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Carbohidratos</span>
                    <Apple size={16} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16A34A' }}>
                    {resultado.macronutrientes_totales.carbohidratos_g} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>g</span>
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    ~{((resultado.macronutrientes_totales.carbohidratos_g * 4 / resultado.calorias_diarias_recomendadas) * 100).toFixed(0)}% del aporte
                  </div>
                </div>

                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: '4px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Grasas Saludables</span>
                    <Droplets size={16} color="var(--color-warning-text)" />
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-warning-text)' }}>
                    {resultado.macronutrientes_totales.grasas_g} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>g</span>
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Agua: {resultado.hidratacion_recomendada_litros} L/día
                  </div>
                </div>
              </div>

              {/* Estrategia y Consejos */}
              <div style={{ background: 'var(--color-primary-soft)', border: '1px solid rgba(220, 38, 38, 0.30)', borderRadius: '4px', padding: '0.85rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-text)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Estrategia Nutricional Prescrita:
                </span>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-primary-text)', lineHeight: 1.45 }}>
                  {resultado.resumen_estrategia}
                </p>
                {resultado.consejos_clave && resultado.consejos_clave.length > 0 && (
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--color-primary-text)' }}>
                    {resultado.consejos_clave.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Menú de Comidas Estructuradas */}
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-text)',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  Menú Prescrito ({resultado.comidas.length} Tiempos de Comida)
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {resultado.comidas.map((comida, idx) => {
                    const isExpanded = expandedMealIdx === idx;
                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border-strong)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          onClick={() => setExpandedMealIdx(isExpanded ? null : idx)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            backgroundColor: isExpanded ? 'var(--color-surface-muted)' : 'var(--color-surface)',
                            borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <span
                              style={{
                                background: 'var(--color-primary)',
                                color: '#FFFFFF',
                                fontSize: '0.70rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.45rem',
                                borderRadius: '2px',
                                textTransform: 'uppercase',
                              }}
                            >
                              {comida.tipo_comida}
                            </span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                              {comida.plato_nombre}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>({comida.horario_sugerido})</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#EA580C' }}>
                              {comida.calorias} kcal
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              P: {comida.proteinas_g}g | C: {comida.carbohidratos_g}g | G: {comida.grasas_g}g
                            </span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ padding: '0.85rem', background: 'var(--color-surface-muted)', fontSize: '0.80rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong style={{ color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                                Ingredientes y Porciones:
                              </strong>
                              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--color-text-secondary)' }}>
                                {comida.ingredientes.map((ing, i) => (
                                  <li key={i}>{ing}</li>
                                ))}
                              </ul>
                            </div>

                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong style={{ color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                                Preparación Rápida:
                              </strong>
                              <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                                {comida.instrucciones_preparacion}
                              </p>
                            </div>

                            {comida.sustitutos_accesibles && comida.sustitutos_accesibles.length > 0 && (
                              <div style={{ background: '#FFFBEB', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #FDE68A' }}>
                                <strong style={{ color: 'var(--color-warning-text)', fontSize: '0.75rem' }}>
                                  Sustitutos Económicos Sugeridos:
                                </strong>
                                <span style={{ color: 'var(--color-warning-text)', fontSize: '0.75rem', marginLeft: '0.35rem' }}>
                                  {comida.sustitutos_accesibles.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Acciones de Resultados */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setResultado(null);
                    setSavedSuccess(false);
                  }}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border-strong)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.80rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ← Ajustar Parámetros / Regenerar
                </button>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '4px',
                      border: '1px solid var(--color-border-strong)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cerrar
                  </button>

                  <button
                    type="button"
                    disabled={isSavingPlan || savedSuccess}
                    onClick={handleGuardarOficial}
                    style={{
                      padding: '0.55rem 1.25rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: savedSuccess ? '#16A34A' : 'linear-gradient(135deg, #990000 0%, #570000 100%)',
                      color: '#FFFFFF',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      cursor: isSavingPlan || savedSuccess ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 2px 4px rgba(153, 0, 0, 0.2)',
                    }}
                  >
                    {isSavingPlan ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Guardando en PostgreSQL...</span>
                      </>
                    ) : savedSuccess ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Guardado como Plan Oficial</span>
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        <span>Guardar como Plan Oficial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
