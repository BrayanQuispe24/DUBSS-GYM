import React, { useState } from 'react';
import { FaLayerGroup } from 'react-icons/fa6';
import { useTiposEjercicio, useCreateTipoEjercicio } from '../hooks/useEntrenamiento';
import { useAuthStore } from '@/store/authStore';

const TiposEjercicioTab: React.FC = () => {
  const { user } = useAuthStore();
  const canManage = ['administrador', 'instructor'].includes(user?.rol || '');

  const { data: tipos = [], isLoading } = useTiposEjercicio();
  const createTipoMutation = useCreateTipoEjercicio();

  const [nombreTipo, setNombreTipo] = useState('');

  const handleCreateTipo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreTipo) return;
    createTipoMutation.mutate({ nombre: nombreTipo }, { onSuccess: () => setNombreTipo('') });
  };

  return (
    <div>
      {canManage && (
        <div style={{ background: 'var(--color-surface)', padding: '1rem 1.25rem', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FaLayerGroup style={{ color: 'var(--color-primary-text)' }} /> Registrar Nuevo Tipo de Ejercicio
          </h3>
          <form onSubmit={handleCreateTipo} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Nombre del Tipo *</label>
              <input
                value={nombreTipo}
                onChange={(e) => setNombreTipo(e.target.value)}
                placeholder="Ej: Hipertrofia / Cardio"
                style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.82rem' }}
              />
            </div>
            <button
              type="submit"
              disabled={createTipoMutation.isPending}
              style={{
                padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', height: 'fit-content',
                background: 'var(--color-primary)', color: '#FFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
              }}
            >
              {createTipoMutation.isPending ? 'Guardando...' : 'Guardar Tipo'}
            </button>
          </form>
        </div>
      )}

      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>
        Listado de Tipos de Ejercicio <span style={{ fontSize: '0.80rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>({tipos.length} en total)</span>
      </h3>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>Cargando tipos...</div>
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '0.65rem 1rem', width: '80px' }}>ID</th>
                <th style={{ padding: '0.65rem 1rem' }}>Nombre del Tipo</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.65rem 1rem', color: 'var(--color-text-muted)' }}>#{t.id}</td>
                  <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{t.nombre}</td>
                </tr>
              ))}
              {tipos.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay tipos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TiposEjercicioTab;
