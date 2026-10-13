// src/features/gyms/components/InteractiveMap.tsx
import React, { useState } from 'react';
import { useGymServices } from '../hooks/useGyms';
import { useGymFilterStore } from '../store/gymFilterStore';
import GymSidePanel from './GymSidePanel';
import { Layers, Dumbbell, Shield, MapPin, Clock } from 'lucide-react';
import type { GymServiceItem } from '@/types';

const InteractiveMap: React.FC = () => {
  const { activeCategory, setActiveCategory } = useGymFilterStore();
  const { data: services } = useGymServices(activeCategory);
  const [selectedService, setSelectedService] = useState<GymServiceItem | null>(null);

  return (
    <section className="section map-section" id="mapa-envivo">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <span className="section-subtitle">SEDE DIRECCIÓN UNIVERSITARIA DE BIENESTAR SOCIAL</span>
          <h2 className="section-title">Gimnasio Universitario UAGRM (D.U.B.S.)</h2>
          <p className="section-description">
            Ubicado en la Ciudad Universitaria. Consulta las disciplinas impartidas en nuestra sede y selecciona para ver detalles.
          </p>
        </div>

        <div className="map-wrapper surface-card">
          <div className="map-controls-bar">
            <div className="map-filters">
              <button
                className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <Layers size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Todas
              </button>
              <button
                className={`filter-btn ${activeCategory === 'aparatos' ? 'active' : ''}`}
                onClick={() => setActiveCategory('aparatos')}
              >
                <Dumbbell size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Aparatos
              </button>
              <button
                className={`filter-btn ${activeCategory === 'boxeo' ? 'active' : ''}`}
                onClick={() => setActiveCategory('boxeo')}
              >
                <Shield size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Boxeo & Kick Boxing
              </button>
            </div>

            <div className="map-search-inline">
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} /> Sede Central D.U.B.S. • Ciudad Universitaria UAGRM
              </span>
            </div>
          </div>

          <div className="map-container-layout">
            <div className="map-canvas" style={{ background: '#EEF2F9', padding: '1.5rem', position: 'relative', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} /> Disciplinas registradas en la Sede ({services ? services.length : 0} áreas de entrenamiento):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {services && services.map((service: GymServiceItem) => {
                  const isSelected = Boolean(selectedService && selectedService.id === service.id);
                  const borderStyle = isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)';

                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      style={{
                        background: '#ffffff',
                        border: borderStyle,
                        borderRadius: '12px',
                        padding: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{service.title}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {service.schedule}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>{service.studentPrice}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>{service.capacity}</div>
                      </div>
                    </div>
                  );
                })}
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
