import React, { useState } from 'react';
import { FaShield } from 'react-icons/fa6';
import { useGruposMusculares, useCreateGrupoMuscular } from '../hooks/useEntrenamiento';
import { useAuthStore } from '@/store/authStore';

const GruposMuscularesTab: React.FC = () => {
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  const { data: grupos = [], isLoading } = useGruposMusculares();
  const createGrupoMutation = useCreateGrupoMuscular();

  const [nombreGrupo, setNombreGrupo] = useState('');

  const handleCreateGrupo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreGrupo) return;
    createGrupoMutation.mutate({ nombre: nombreGrupo }, { onSuccess: () => setNombreGrupo('') });
  };

  return (
    <div>
      {canManage && (
        <div style={{ background: 'var(--color-surface)', padding: '1rem 1.25rem', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FaShield style={{ color: 'var(--color-primary-text)' }} /> Registrar Nuevo Grupo Muscular
          </h3>
          <form onSubmit={handleCreateGrupo} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Nombre del Grupo *</label>
              <input
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                placeholder="Ej: Pectorales / Cuádriceps"
                style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem' }}
              />
            </div>
            <button
              type="submit"
              disabled={createGrupoMutation.isPending}
              style={{
                padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', height: 'fit-content',
                background: 'var(--color-primary)', color: '#FFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
              }}
            >
              {createGrupoMutation.isPending ? 'Guardando...' : 'Guardar Grupo'}
            </button>
          </form>
        </div>
      )}

      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>
        Listado de Grupos Musculares <span style={{ fontSize: '0.80rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>({grupos.length} en total)</span>
      </h3>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>Cargando grupos...</div>
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '0.65rem 1rem', width: '80px' }}>ID</th>
                <th style={{ padding: '0.65rem 1rem' }}>Nombre del Grupo</th>
              </tr>
            </thead>
            <tbody>
              {grupos.map((g: any) => (
                <tr key={g.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.65rem 1rem', color: 'var(--color-text-muted)' }}>#{g.id}</td>
                  <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{g.nombre}</td>
                </tr>
              ))}
              {grupos.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay grupos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GruposMuscularesTab;
