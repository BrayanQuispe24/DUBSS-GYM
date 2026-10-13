// src/features/nutricion/pages/PlanAlimentacionPage.tsx
import React, { useState } from 'react';
import { FaAppleWhole, FaPlus, FaTrash, FaUtensils } from 'react-icons/fa6';
import { usePlanesAlimentacion, useCreatePlanAlimentacion, useDeletePlanAlimentacion } from '../hooks/useNutricion';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';

const PlanAlimentacionPage: React.FC = () => {
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  const { data: planes = [], isLoading } = usePlanesAlimentacion();
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; apellido: string }[]>([]);

  const createMutation = useCreatePlanAlimentacion();
  const deleteMutation = useDeletePlanAlimentacion();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [idUsuario, setIdUsuario] = useState<number | ''>('');
  const [detalles, setDetalles] = useState<{ dia_semana: string; tipo_comida: string; descripcion: string; calorias: number }[]>([]);

  React.useEffect(() => {
    if (isModalOpen && canManage) {
      api.get('/usuarios').then((res) => setUsuarios(res.data.data)).catch(() => {});
    }
  }, [isModalOpen, canManage]);

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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaAppleWhole style={{ color: '#003B70' }} /> Planes de Alimentación & Nutrición
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Dietas personalizadas, cálculo calórico y prescripción nutricional para usuarios del gimnasio.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '0.55rem 1rem', borderRadius: '4px',
              background: '#0077D4', border: '1px solid #005FA8',
              color: '#FFFFFF', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em'
            }}
          >
            <FaPlus /> Crear Plan Nutricional
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>Cargando planes de alimentación...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {planes.map((p) => (
            <div key={p.id} style={{ background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>{p.nombre}</h4>
                <span style={{ fontSize: '0.70rem', background: '#DCFCE7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {p.usuario?.nombre} {p.usuario?.apellido}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '0.85rem' }}>
                <strong>Objetivo:</strong> {p.objetivo || 'Mantenimiento y rendimiento deportivo'}
              </p>

              <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Comidas Prescritas ({p.detalles?.length || 0}):
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
                  {p.detalles?.map((d, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FaUtensils style={{ fontSize: '0.65rem', color: '#0077D4' }} /> {d.tipo_comida} ({d.dia_semana}):
                      </span>
                      <span style={{ color: '#64748B', fontSize: '0.72rem' }}>{d.descripcion} ({d.calorias || 0} kcal)</span>
                    </li>
                  ))}
                </ul>
              </div>

              {canManage && (
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => { if (window.confirm('¿Eliminar plan de alimentación?')) deleteMutation.mutate(p.id); }}
                    style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '0.3rem 0.55rem', borderRadius: '4px', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <FaTrash size={11} /> Eliminar Plan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR PLAN ALIMENTACIÓN */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#FFF', borderRadius: '12px', width: '100%', maxWidth: '580px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Prescribir Plan Nutricional</h3>
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Atleta / Usuario *</label>
                <select value={idUsuario} onChange={(e) => setIdUsuario(e.target.value ? Number(e.target.value) : '')} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}>
                  <option value="">-- Seleccionar Usuario --</option>
                  {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Nombre Plan *</label>
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Dieta Normocalórica Deportiva" style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Objetivo</label>
                  <input value={objetivo} onChange={(e) => setObjetivo(e.target.value)} placeholder="Ej: Déficit calórico moderado" style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
                </div>
              </div>

              <div>
                <button type="button" onClick={handleAddMeal} style={{ padding: '0.4rem 0.8rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>+ Agregar Comida</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem', background: '#F8FAFC' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Menú diario ({detalles.length})</span>
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
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', color: '#475569', fontWeight: 600, fontSize: '0.85rem' }}>Cancelar</button>
                <button type="submit" disabled={createMutation.isPending} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)', color: '#FFF', fontWeight: 700, fontSize: '0.85rem' }}>Guardar Plan Nutricional</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlanAlimentacionPage;
