// src/features/gyms/components/GymCard.tsx
import React from 'react';
import { Clock, UserCheck, Users, Calendar } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import type { GymServiceItem } from '@/types';

interface GymCardProps {
  service: GymServiceItem;
}

const GymCard: React.FC<GymCardProps> = ({ service }) => {
  const { openModal } = useBookingStore();

  return (
    <div className="gym-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="gym-card-img-wrapper">
        <img src={service.image} alt={service.title} className="gym-card-img" />
        <span className="gym-card-badge">{service.categoryLabel}</span>
      </div>

      <div className="gym-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.4rem' }}>
        <div>
          <h3 className="gym-card-title">{service.title}</h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
            {service.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Clock size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span><strong>Horario:</strong> {service.schedule}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <UserCheck size={15} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
              <span><strong>Instructor:</strong> {service.instructor}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Users size={15} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <span><strong>Capacidad:</strong> {service.capacity}</span>
            </div>
          </div>

          <div className="gym-card-tags" style={{ marginBottom: '1.2rem' }}>
            {service.tags.map((tag, idx) => (
              <span key={idx} className="gym-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="gym-card-footer" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Tarifa Universitaria:</div>
            <div className="gym-card-price" style={{ fontSize: '1.25rem' }}>
              {service.studentPrice} <span style={{ fontSize: '0.75rem' }}>(Estudiantes)</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-secondary)', fontWeight: 700 }}>
              {service.docentPrice} <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>(Docentes/Admin)</span>
            </div>
          </div>

          <button
            className="btn-step-action-orange"
            onClick={() => openModal(service.title, `${service.studentPrice} (Estudiantes) / ${service.docentPrice} (Admin/Docentes)`, 'Gimnasio UAGRM DUBS')}
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderRadius: '999px' }}
          >
            <Calendar size={15} /> Inscribirse
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymCard;
