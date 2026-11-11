// src/features/landing/components/CtaBanner.tsx
import React from 'react';
import { GraduationCap, Users } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { usePublicLanding } from '../hooks/usePublicLanding';

const CtaBanner: React.FC = () => {
  const { openModal } = useBookingStore();
  const { data } = usePublicLanding();
  const planes = data?.planes ?? [];

  const planPrincipal = planes.find((p) => p.nombre.toLowerCase().includes('estud')) ?? planes[0];
  const planSecundario =
    planes.find((p) => p.nombre.toLowerCase().includes('docent') || p.nombre.toLowerCase().includes('admin')) ??
    planes[1] ??
    planPrincipal;

  return (
    <section className="section cta-banner-section">
      <div className="container">
        <div className="cta-banner-card reveal-up reveal-end">
          <div className="cta-content reveal-left reveal-end">
            <h2>Únete al Gimnasio Universitario UAGRM</h2>
            <p>Dirección Universitaria de Bienestar Social (D.U.B.S.) • Salud y Deporte para la comunidad universitaria.</p>
          </div>
          <div className="cta-buttons reveal-right reveal-end">
            <button
              className="btn btn-accent btn-lg"
              onClick={() =>
                openModal({
                  spotName: planPrincipal ? planPrincipal.nombre : 'Membresía Estudiantes UAGRM',
                  price: planPrincipal
                    ? `Bs. ${Number(planPrincipal.tarifa.precio).toFixed(0)} / ${planPrincipal.duracion_dias} días`
                    : 'Tarifa Estudiantil UAGRM',
                  gymTitle: 'Gimnasio Universitario D.U.B.S.',
                  planId: planPrincipal?.id,
                  prefillUserType: 'estudiante',
                })
              }
            >
              <GraduationCap size={20} /> {planPrincipal ? planPrincipal.nombre : 'Membresía Estudiantes'}
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() =>
                openModal({
                  spotName: planSecundario ? planSecundario.nombre : 'Membresía Docentes & Admin UAGRM',
                  price: planSecundario
                    ? `Bs. ${Number(planSecundario.tarifa.precio).toFixed(0)} / ${planSecundario.duracion_dias} días`
                    : 'Tarifa Institucional UAGRM',
                  gymTitle: 'Gimnasio Universitario D.U.B.S.',
                  planId: planSecundario?.id,
                  prefillUserType: 'docente',
                })
              }
            >
              <Users size={20} /> {planSecundario && planSecundario.id !== planPrincipal?.id ? planSecundario.nombre : 'Docentes & Admin'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
