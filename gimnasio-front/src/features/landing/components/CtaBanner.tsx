// src/features/landing/components/CtaBanner.tsx
import React from 'react';
import { GraduationCap, Users } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';

const CtaBanner: React.FC = () => {
  const { openModal } = useBookingStore();

  return (
    <section className="section cta-banner-section">
      <div className="container">
        <div className="cta-banner-card reveal-up">
          <div className="cta-content">
            <h2>Únete al Gimnasio Universitario UAGRM</h2>
            <p>Dirección Universitaria de Bienestar Social (D.U.B.S.) • Salud y Deporte para la comunidad universitaria.</p>
          </div>
          <div className="cta-buttons">
            <button
              className="btn btn-accent btn-lg"
              onClick={() => openModal('Membresía Estudiantes UAGRM', 'Bs. 50 / mes', 'Gimnasio Universitario DUBS')}
            >
              <GraduationCap size={20} /> Membresía Estudiantes
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => openModal('Membresía Administrativos & Docentes UAGRM', 'Bs. 80 / mes', 'Gimnasio Universitario DUBS')}
            >
              <Users size={20} /> Membresía Docentes & Admin
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
