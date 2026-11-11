// src/features/gyms/components/GymSidePanel.tsx
import React from 'react';
import { MousePointer, Clock, UserCheck } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { formatHorarioLabel } from '@/features/landing/utils/disciplinaVisuals';
import type { GymServiceItem } from '@/types';

interface GymSidePanelProps {
  selectedGym: GymServiceItem | null;
}

const GymSidePanel: React.FC<GymSidePanelProps> = ({ selectedGym }) => {
  const { openModal } = useBookingStore();

  if (!selectedGym) {
    return (
      <div className="map-side-panel reveal-right">
        <div className="side-panel-header" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Selecciona una disciplina en la lista</h3>
          <span style={{ fontSize: '0.75rem', background: 'var(--color-background)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Instrucción DUBS
          </span>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-secondary)' }}>
          <MousePointer size={36} style={{ color: '#F87171', marginBottom: '0.8rem', marginInline: 'auto' }} />
          <p style={{ fontSize: '0.9rem' }}>
            Haz clic en cualquiera de las disciplinas de la Sede del Gimnasio Universitario para consultar horarios, cupos y requisitos de inscripción.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-side-panel reveal-right">
      <div className="side-panel-header" style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedGym.title}</h3>
        <span style={{ fontSize: '0.75rem', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 800 }}>
          {selectedGym.capacity}
        </span>
      </div>

      <div className="side-panel-body">
        <div style={{ marginBottom: '0.9rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} style={{ color: '#F87171' }} /> Turnos y Cupos Disponibles:
          </div>
          {selectedGym.horarios && selectedGym.horarios.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {selectedGym.horarios.map((h) => (
                <div
                  key={h.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.82rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>{formatHorarioLabel(h)}</span>
                  <strong style={{ color: h.cupos_disponibles > 0 ? 'var(--color-success-text)' : '#F87171', fontSize: '0.78rem' }}>
                    {h.cupos_disponibles > 0 ? `${h.cupos_disponibles} cupos` : 'Lleno'}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{selectedGym.schedule}</div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', marginBottom: '1rem' }}>
          <UserCheck size={14} style={{ color: '#E4E4E7' }} />
          <strong>Supervisión:</strong> {selectedGym.instructor}
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem', fontWeight: 700 }}>Actividades & Equipamiento:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {selectedGym.tags.map((tag: string, i: number) => (
              <span key={i} className="gym-tag" style={{ fontSize: '0.72rem' }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F87171', marginBottom: '0.25rem' }}>
          {selectedGym.studentPrice}
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1.2rem' }}>
          {selectedGym.docentPrice}
        </div>

        <button
          className="btn-step-action-orange"
          style={{ width: '100%', textAlign: 'center', padding: '0.7rem', fontSize: '0.9rem', cursor: 'pointer' }}
          onClick={() =>
            openModal({
              spotName: selectedGym.title,
              price: `${selectedGym.studentPrice} • ${selectedGym.docentPrice}`,
              gymTitle: 'Gimnasio UAGRM D.U.B.S.',
              disciplinaId: selectedGym.disciplinaId,
              horarioId: selectedGym.horarios?.find((h) => h.cupos_disponibles > 0)?.id,
              planId: selectedGym.defaultPlanId,
            })
          }
        >
          Inscribirme en esta Disciplina
        </button>
      </div>
    </div>
  );
};

export default GymSidePanel;
