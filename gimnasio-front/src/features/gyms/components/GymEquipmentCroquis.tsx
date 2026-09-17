// src/features/gyms/components/GymEquipmentCroquis.tsx
import React from 'react';
import { useGymCroquis } from '../hooks/useGyms';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { Layers, CheckCircle, Ban, Clock, MousePointer, Accessibility, Wrench } from 'lucide-react';
import type { CroquisSpot } from '@/types';

const GymEquipmentCroquis: React.FC = () => {
  const { data: spots } = useGymCroquis();
  const { openModal } = useBookingStore();

  const getStatusIcon = (status: CroquisSpot['status']) => {
    switch (status) {
      case 'available': return <CheckCircle size={12} />;
      case 'occupied': return <Ban size={12} />;
      case 'reserved': return <Clock size={12} />;
      case 'selected': return <MousePointer size={12} />;
      case 'disabled': return <Accessibility size={12} />;
      case 'out-of-service': return <Wrench size={12} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: CroquisSpot['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Ocupado';
      case 'reserved': return 'Reservado';
      case 'selected': return 'Seleccionado';
      case 'disabled': return 'Accesible';
      case 'out-of-service': return 'Mantenimiento';
      default: return status;
    }
  };

  return (
    <section className="section croquis-section" id="croquis-seccion">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <span className="section-subtitle">GESTIÓN DE ZONAS & EQUIPAMIENTO</span>
          <h2 className="section-title">Cada máquina y área, visible en tiempo real.</h2>
          <p className="section-description">
            Codificación visual del estado de los Racks, Máquinas de Musculación, Cintas Cardio y Zonas de Funcional del gimnasio.
          </p>
        </div>

        <div className="croquis-container reveal-up delay-1">
          <div className="croquis-header">
            <div className="croquis-title">
              <Layers size={18} /> Croquis Nivel 1 • SmartFit Equipetrol Central
            </div>
            <div className="croquis-legend">
              <span className="legend-item"><span className="legend-color available"></span> Disponible</span>
              <span className="legend-item"><span className="legend-color occupied"></span> Ocupado</span>
              <span className="legend-item"><span className="legend-color reserved"></span> Reservado</span>
              <span className="legend-item"><span className="legend-color out-of-service"></span> Mantenimiento</span>
              <span className="legend-item"><span className="legend-color selected"></span> Seleccionado</span>
              <span className="legend-item"><span className="legend-color disabled"></span> Preferencial</span>
            </div>
          </div>

          <div className="croquis-layout-grid">
            {spots && spots.map((spot) => (
              <div
                key={spot.id}
                className={`parking-spot-box spot-${spot.status}`}
                onClick={() => {
                  if (spot.status === 'available' || spot.status === 'disabled') {
                    openModal(`${spot.type} (${spot.id})`, 'Bs. 25 / pase libre', 'SmartFit Equipetrol');
                  }
                }}
              >
                <span className="spot-id">{spot.id}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center' }}>
                  {spot.type}
                </span>
                <span className="spot-status-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  {getStatusIcon(spot.status)} {getStatusLabel(spot.status)}
                </span>
                <span className="spot-rate-tag">{spot.rate}</span>
              </div>
            ))}

            <div className="croquis-street-lane">
              VÍA PRINCIPAL DE CIRCULACIÓN DE SOCIOS & CORREDOR DE FUNCIONAL ➔
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymEquipmentCroquis;
