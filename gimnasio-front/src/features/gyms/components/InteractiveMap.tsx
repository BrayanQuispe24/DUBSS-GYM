// src/features/gyms/components/InteractiveMap.tsx
import React, { useState } from 'react';
import { useGymServices } from '../hooks/useGyms';
import { useGymFilterStore } from '../store/gymFilterStore';
import { usePublicLanding } from '@/features/landing/hooks/usePublicLanding';
import { getDisciplinaVisualMeta } from '@/features/landing/utils/disciplinaVisuals';
import GymSidePanel from './GymSidePanel';
import { Layers, MapPin, Clock } from 'lucide-react';
import type { GymServiceItem } from '@/types';

const InteractiveMap: React.FC = () => {
  const { activeCategory, setActiveCategory } = useGymFilterStore();
  const { data: services } = useGymServices(activeCategory);
  const { data: landingData } = usePublicLanding();
  const [selectedService, setSelectedService] = useState<GymServiceItem | null>(null);

  const filterChips = (landingData?.disciplinas ?? []).slice(0, 4).map((disc) => {
    const meta = getDisciplinaVisualMeta(disc.nombre);
    return {
      id: meta.slug,
      label: disc.nombre,
      icon: meta.icon,
    };
  });

  return (
    <section className="section map-section" id="mapa-envivo">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <span className="section-subtitle">SEDE DIRECCIÓN UNIVERSITARIA DE BIENESTAR SOCIAL</span>
          <h2 className="section-title">Gimnasio Universitario UAGRM (D.U.B.S.)</h2>
          <p className="section-description">
            Ubicado en la Ciudad Universitaria. Consulta las disciplinas, horarios y cupos en tiempo real de nuestra sede.
          </p>
        </div>

        <div className="map-wrapper surface-card">
          <div className="map-controls-bar reveal-up">
            <div className="map-filters">
              <button
                className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <Layers size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Todas
              </button>
              {filterChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.id}
                    className={`filter-btn ${activeCategory === chip.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(chip.id)}
                  >
                    <Icon size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="map-search-inline">
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F87171', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} /> Sede Central D.U.B.S. • Ciudad Universitaria UAGRM
              </span>
            </div>
          </div>

          <div className="map-container-layout">
            <div className="map-canvas reveal-left" style={{ background: '#101015', padding: '1.5rem', position: 'relative', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.88rem', color: '#F87171', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} /> Disciplinas activas en la Sede ({services ? services.length : 0} áreas de entrenamiento):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {services && services.length > 0 ? (
                  services.map((service: GymServiceItem) => {
                    const isSelected = Boolean(selectedService && selectedService.id === service.id);
                    const borderStyle = isSelected ? '2px solid #DC2626' : '1px solid rgba(255, 255, 255, 0.1)';

                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        style={{
                          background: isSelected ? '#1E1418' : '#181820',
                          border: borderStyle,
                          borderRadius: '12px',
                          padding: '1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
                        }}
                      >
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{service.title}</h4>
                          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> {service.schedule}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F87171' }}>{service.studentPrice}</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-success-text)', fontWeight: 700 }}>{service.capacity}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    No hay disciplinas registradas para este filtro actualmente.
                  </div>
                )}
              </div>
            </div>

            <GymSidePanel selectedGym={selectedService} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
