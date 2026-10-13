import React, { useState } from 'react';
import { FaDumbbell, FaLayerGroup, FaShield } from 'react-icons/fa6';
import { useAuthStore } from '@/store/authStore';
import EjerciciosTab from '../components/EjerciciosTab';
import TiposEjercicioTab from '../components/TiposEjercicioTab';
import GruposMuscularesTab from '../components/GruposMuscularesTab';

const EjerciciosPage: React.FC = () => {
  const { user } = useAuthStore();
  const isCliente = user?.rol === 'cliente';

  const [activeTab, setActiveTab] = useState<'ejercicios' | 'tipos' | 'grupos'>('ejercicios');
  const currentTab = isCliente ? 'ejercicios' : activeTab;

  return (
    <section>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaDumbbell style={{ color: '#003B70' }} /> Catálogo de Ejercicios & Musculación
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          {isCliente
            ? 'Explora los ejercicios disponibles, técnicas de ejecución y demostraciones visuales.'
            : 'Gestión de movimientos técnicos, agrupaciones musculares y clasificación por tipo de ejercicio.'}
        </p>
      </div>

      {/* TABS NAVIGATION (Oculto para rol cliente si solo visualiza ejercicios) */}
      {!isCliente && (
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('ejercicios')}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: currentTab === 'ejercicios' ? '2px solid #0077D4' : '2px solid transparent',
              color: currentTab === 'ejercicios' ? '#0077D4' : '#64748B',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            <FaDumbbell /> Ejercicios
          </button>
          <button
            onClick={() => setActiveTab('tipos')}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: currentTab === 'tipos' ? '2px solid #0077D4' : '2px solid transparent',
              color: currentTab === 'tipos' ? '#0077D4' : '#64748B',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            <FaLayerGroup /> Tipos de Ejercicio
          </button>
          <button
            onClick={() => setActiveTab('grupos')}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: currentTab === 'grupos' ? '2px solid #0077D4' : '2px solid transparent',
              color: currentTab === 'grupos' ? '#0077D4' : '#64748B',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            <FaShield /> Grupos Musculares
          </button>
        </div>
      )}

      {/* TABS CONTENT */}
      <div>
        {currentTab === 'ejercicios' && <EjerciciosTab />}
        {!isCliente && currentTab === 'tipos' && <TiposEjercicioTab />}
        {!isCliente && currentTab === 'grupos' && <GruposMuscularesTab />}
      </div>
    </section>
  );
};

export default EjerciciosPage;
