// src/features/nutricion/pages/PlanAlimentacionPage.tsx
import React, { useState } from 'react';
import { FaAppleWhole, FaPlus, FaTrash, FaUtensils, FaEye } from 'react-icons/fa6';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { usePlanesAlimentacion, useCreatePlanAlimentacion, useDeletePlanAlimentacion } from '../hooks/useNutricion';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import type { PlanAlimentacion } from '../services/nutricionService';
import { ModalGenerarPlanNutricionalIA } from '../components/ModalGenerarPlanNutricionalIA';
import { PlanAlimentacionDetailModal } from '../components/PlanAlimentacionDetailModal';

const extractResumenMacros = (d: any) => {
  if (d.proteinas && d.carbohidratos && d.grasas) {
    return `P: ${d.proteinas}g | C: ${d.carbohidratos}g | G: ${d.grasas}g`;
  }
  if (d.observacion) {
    const match = d.observacion.match(/Macros:\s*([^H\n•]+)/i);
    if (match) return match[1].trim();
    const firstLine = d.observacion.split('\n')[0]?.trim();
    if (firstLine && firstLine.startsWith('P:')) return firstLine;
  }
  return null;
};

const PlanAlimentacionPage: React.FC = () => {
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  const { data: planes = [], isLoading } = usePlanesAlimentacion();
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; apellido: string }[]>([]);

  const createMutation = useCreatePlanAlimentacion();
  const deleteMutation = useDeletePlanAlimentacion();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIaModalOpen, setIsIaModalOpen] = useState(false);
  const [selectedPlanForDetail, setSelectedPlanForDetail] = useState<PlanAlimentacion | null>(null);
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [idUsuario, setIdUsuario] = useState<number | ''>('');
  const [detalles, setDetalles] = useState<{ dia_semana: string; tipo_comida: string; descripcion: string; calorias: number }[]>([]);

  React.useEffect(() => {
    if ((isModalOpen || isIaModalOpen) && canManage && usuarios.length === 0) {
      api.get('/usuarios').then((res) => setUsuarios(res.data.data)).catch(() => {});
    }
  }, [isModalOpen, isIaModalOpen, canManage, usuarios.length]);

  const handleAddMeal = () => {
    setDetalles([...detalles, { dia_semana: 'Lunes', tipo_comida: 'Desayuno', descripcion: '', calorias: 500 }]);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !idUsuario) return;
    createMutation.mutate({
      nombre,
      objetivo,
      id_usuario: Number(idUsuario),
      estado: true,
      detalles,
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setNombre('');
        setObjetivo('');
        setDetalles([]);
      }
    });
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaAppleWhole style={{ color: 'var(--color-primary-text)' }} /> Planes de Alimentación & Nutrición
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Dietas personalizadas, cálculo calórico y prescripción nutricional para usuarios del gimnasio.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={() => setIsIaModalOpen(true)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #990000 0%, #570000 100%)',
              border: '1px solid var(--color-primary-dark)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.80rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 4px rgba(153, 0, 0, 0.15)',
            }}
          >
            <Sparkles size={14} color="#FCA5A5" /> {canManage ? 'Recomendar con IA (Gemini)' : 'Generar mi Plan con IA'}
          </button>

          {canManage && (
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '4px',
                background: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.80rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              <FaPlus /> Crear Plan Manual
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Cargando planes de alimentación...
        </div>
      ) : planes.length === 0 ? (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: '4px',
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-primary-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            <FaAppleWhole style={{ fontSize: '2rem', color: 'var(--color-primary-text)' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
            Aún no tienes un plan de alimentación asignado
          </h3>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              maxWidth: '480px',
              margin: '0 auto 1.5rem auto',
              lineHeight: 1.5,
            }}
          >
            Diseña una pauta nutricional científica adaptada a tu metabolismo, horarios y presupuesto con el motor de inteligencia artificial de Gemini 2.5 Flash.
          </p>
          <button
            onClick={() => setIsIaModalOpen(true)}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #990000 0%, #570000 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              boxShadow: '0 4px 6px -1px rgba(153, 0, 0, 0.2)',
            }}
          >
            <Sparkles size={16} color="#FCA5A5" /> Generar mi Plan con Gemini IA
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {planes.map((p) => (
            <div key={p.id} style={{ background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', padding: '1.25rem', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>{p.nombre}</h4>
                <span style={{ fontSize: '0.70rem', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', padding: '0.15rem 0.5rem', borderRadius: '2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                  {p.usuario?.nombre} {p.usuario?.apellido}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Objetivo:</strong> {p.objetivo || 'Mantenimiento y rendimiento deportivo'}
              </p>

              <div style={{ background: 'var(--color-surface-muted)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '0.85rem', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Comidas Prescritas ({p.detalles?.length || 0}):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {p.detalles?.map((d, idx) => {
                    const plato = d.alimento || d.descripcion || 'Comida Prescrita';
                    const cals = Math.round(Number(d.cantidad ?? d.calorias ?? 0));
                    const macros = extractResumenMacros(d);
                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--color-surface)',
                          borderRadius: '3px',
                          border: '1px solid var(--color-border)',
                          padding: '0.45rem 0.6rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary-text)', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <FaUtensils style={{ fontSize: '0.65rem', color: 'var(--color-primary-text)' }} /> {d.tipo_comida || 'Comida'}
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.68rem' }}>({d.dia_semana || 'Diario'})</span>
                          </span>
                          {cals > 0 && (
                            <span style={{ fontWeight: 700, color: 'var(--color-primary-text)', fontSize: '0.74rem' }}>
                              {cals} {d.unidad || 'kcal'}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                          {plato}
                        </div>
                        {macros && (
                          <div style={{ marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', background: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', padding: '0.1rem 0.35rem', borderRadius: '2px', fontWeight: 600 }}>
                              {macros}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedPlanForDetail(p)}
                  style={{
                    background: 'linear-gradient(135deg, #990000 0%, #570000 100%)',
                    border: 'none',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    boxShadow: '0 2px 4px rgba(153, 0, 0, 0.15)',
                  }}
                >
                  <FaEye size={12} /> Abrir Plan Completo
                </button>

                {canManage && (
                  <button
                    onClick={() => { if (window.confirm('¿Eliminar plan de alimentación?')) deleteMutation.mutate(p.id); }}
                    style={{ background: 'var(--color-danger-bg)', border: '1px solid rgba(220, 38, 38, 0.35)', padding: '0.4rem 0.65rem', borderRadius: '4px', color: 'var(--color-danger-text)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <FaTrash size={11} /> Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR PLAN ALIMENTACIÓN */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: '12px', width: '100%', maxWidth: '580px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Prescribir Plan Nutricional</h3>
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Atleta / Usuario *</label>
                <select value={idUsuario} onChange={(e) => setIdUsuario(e.target.value ? Number(e.target.value) : '')} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem', backgroundColor: 'var(--color-surface)' }}>
                  <option value="">-- Seleccionar Usuario --</option>
                  {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Nombre Plan *</label>
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Dieta Normocalórica Deportiva" style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Objetivo</label>
                  <input value={objetivo} onChange={(e) => setObjetivo(e.target.value)} placeholder="Ej: Déficit calórico moderado" style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem' }} />
                </div>
              </div>

              <div>
                <button type="button" onClick={handleAddMeal} style={{ padding: '0.4rem 0.8rem', background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-strong)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>+ Agregar Comida</button>
              </div>

              <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.75rem', background: 'var(--color-surface-muted)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Menú diario ({detalles.length})</span>
                {detalles.map((d, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr auto', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <select value={d.dia_semana} onChange={(e) => { const arr = [...detalles]; arr[index].dia_semana = e.target.value; setDetalles(arr); }} style={{ fontSize: '0.75rem', padding: '0.2rem' }}><option>Lunes</option><option>Martes</option><option>Miércoles</option><option>Jueves</option><option>Viernes</option></select>
                    <select value={d.tipo_comida} onChange={(e) => { const arr = [...detalles]; arr[index].tipo_comida = e.target.value; setDetalles(arr); }} style={{ fontSize: '0.75rem', padding: '0.2rem' }}><option>Desayuno</option><option>Almuerzo</option><option>Cena</option><option>Snack</option></select>
                    <input value={d.descripcion} onChange={(e) => { const arr = [...detalles]; arr[index].descripcion = e.target.value; setDetalles(arr); }} placeholder="Plato / Alimento" style={{ fontSize: '0.75rem', padding: '0.2rem' }} />
                    <input type="number" value={d.calorias} onChange={(e) => { const arr = [...detalles]; arr[index].calorias = Number(e.target.value); setDetalles(arr); }} placeholder="Kcal" style={{ fontSize: '0.75rem', padding: '0.2rem' }} />
                    <button type="button" onClick={() => setDetalles(detalles.filter((_, i) => i !== index))} style={{ color: '#EF4444', border: 'none', background: 'none' }}><FaTrash /></button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', background: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Cancelar</button>
                <button type="submit" disabled={createMutation.isPending} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #990000 0%, #570000 100%)', color: '#FFF', fontWeight: 700, fontSize: '0.85rem' }}>Guardar Plan Nutricional</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GENERACIÓN INTELIGENTE CON GEMINI 2.5 FLASH */}
      <ModalGenerarPlanNutricionalIA
        isOpen={isIaModalOpen}
        onClose={() => setIsIaModalOpen(false)}
        usuarios={usuarios}
        currentUser={user}
        isSavingPlan={createMutation.isPending}
        onSavePlanOficial={async (planData) => {
          await createMutation.mutateAsync(planData);
        }}
      />

      {/* MODAL DETALLE COMPLETO DEL PLAN */}
      <PlanAlimentacionDetailModal
        isOpen={!!selectedPlanForDetail}
        plan={selectedPlanForDetail}
        onClose={() => setSelectedPlanForDetail(null)}
      />
    </section>
  );
};

export default PlanAlimentacionPage;
