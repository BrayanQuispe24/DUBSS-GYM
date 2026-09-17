// src/features/gyms/components/GymSidePanel.tsx
import React from 'react';
import { MousePointer, Clock, UserCheck } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import type { GymServiceItem } from '@/types';

interface GymSidePanelProps {
  selectedGym: GymServiceItem | null;
}

const GymSidePanel: React.FC<GymSidePanelProps> = ({ selectedGym }) => {
  const { openModal } = useBookingStore();

  if (!selectedGym) {
    return (
      <div className="map-side-panel">
        <div className="side-panel-header" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Selecciona una disciplina en la lista</h3>
          <span style={{ fontSize: '0.75rem', background: 'var(--color-background)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Instrucción DUBS
          </span>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-secondary)' }}>
          <MousePointer size={36} style={{ color: 'var(--color-primary)', marginBottom: '0.8rem' }} />
          <p style={{ fontSize: '0.9rem' }}>
            Haz clic en cualquiera de las disciplinas de la Sede del Gimnasio Universitario para consultar horarios y requisitos de inscripción.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-side-panel">
      <div className="side-panel-header" style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedGym.title}</h3>
        <span style={{ fontSize: '0.75rem', background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 800 }}>
          {selectedGym.capacity}
        </span>
      </div>

      <div className="side-panel-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '0.8rem' }}>
          <Clock size={14} style={{ color: 'var(--color-primary)' }} />
          <span>{selectedGym.schedule}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', marginBottom: '1rem' }}>
          <UserCheck size={14} style={{ color: 'var(--color-secondary)' }} />
          <strong>Instructor:</strong> {selectedGym.instructor}
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem', fontWeight: 700 }}>Actividades & Equipamiento:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {selectedGym.tags.map((tag: string, i: number) => (
              <span key={i} className="gym-tag" style={{ fontSize: '0.72rem' }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.3rem' }}>
          {selectedGym.studentPrice} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Estudiantes)</span>
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1.2rem' }}>
          {selectedGym.docentPrice} <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>(Admin/Docente)</span>
        </div>

        <button
          className="btn-step-action-orange"
          style={{ width: '100%', textAlign: 'center', padding: '0.7rem', fontSize: '0.9rem', cursor: 'pointer' }}
          onClick={() => openModal(selectedGym.title, `${selectedGym.studentPrice} (Estudiantes) / ${selectedGym.docentPrice} (Admin)`, 'Gimnasio UAGRM DUBS')}
        >
          Inscribirme en esta Disciplina
        </button>
      </div>
    </div>
  );
};

export default GymSidePanel;
