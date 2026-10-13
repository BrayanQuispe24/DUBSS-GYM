// src/features/landing/components/PricingPlans.tsx
import React from 'react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { GraduationCap, Briefcase, Check, Zap, Star, Building } from 'lucide-react';

const PricingPlans: React.FC = () => {
  const { openModal } = useBookingStore();

  return (
    <section className="section plans-section" id="membresias">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <span className="section-subtitle">TARIFAS DE MEMBRESÍAS UAGRM</span>
          <h2 className="section-title">Precios subvencionados para la comunidad universitaria</h2>
          <p className="section-description">
            La Dirección Universitaria de Bienestar Social (D.U.B.S.) ofrece 2 modalidades oficiales de cobro de membresías según tu perfil universitario.
          </p>
        </div>

        <div className="grid grid-3 pricing-grid" id="pricing-grid">
          {/* Membresia Estudiantes */}
          <div className="pricing-card popular-card reveal-up delay-1">
            <div className="popular-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} /> MÁS SOLICITADA
            </div>
            <div className="plan-tag" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GraduationCap size={16} /> ALUMNOS REGULARES UAGRM
            </div>
            <h3 className="plan-title">Membresía Estudiantes</h3>
            <div className="plan-price">
              <span className="price-amount">Bs. 50</span>
              <span className="price-period">/ mes</span>
            </div>
            <p className="plan-desc">Tarifa especial universitaria para estudiantes inscritos en cualquier carrera o facultad de la UAGRM.</p>

            <div className="plan-fee-highlight" style={{ background: 'var(--color-success-bg)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.4rem', color: 'var(--color-success-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={16} /> 100% Subvencionada por Bienestar Social
            </div>

            <ul className="plan-features">
              <li><Check size={16} /> Acceso ilimitado a Gimnasio & Aparatos</li>
              <li><Check size={16} /> Clases de Boxeo, Kick Boxing y Baile</li>
              <li><Check size={16} /> Circuitos de Entrenamiento Funcional</li>
              <li><Check size={16} /> Indicación de ejercicios por Instructores</li>
              <li><Check size={16} /> Carnet Digital & Control de Acceso QR</li>
            </ul>

            <button
              className="btn btn-secondary btn-block btn-select-plan"
              onClick={() => openModal('Membresía Estudiantes UAGRM', 'Bs. 50 / mes', 'Gimnasio Universitario DUBS')}
            >
              Inscribirme como Estudiante
            </button>
          </div>

          {/* Membresia Administrativos & Docentes */}
          <div className="pricing-card reveal-left delay-2">
            <div className="plan-tag" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Briefcase size={16} /> PERSONAL INSTITUCIONAL
            </div>
            <h3 className="plan-title">Membresía Administrativos & Docentes</h3>
            <div className="plan-price">
              <span className="price-amount">Bs. 80</span>
              <span className="price-period">/ mes</span>
            </div>
            <p className="plan-desc">Dirigida al cuerpo docente y al personal administrativo que presta servicios en la UAGRM.</p>

            <div className="plan-fee-highlight" style={{ background: 'var(--color-background)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.4rem', fontWeight: 700, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building size={16} /> Descuento por Boleta de Pago Institucional
            </div>

            <ul className="plan-features">
              <li><Check size={16} /> Acceso completo a todas las disciplinas</li>
              <li><Check size={16} /> Horarios extendidos de 06:00 a 22:00</li>
              <li><Check size={16} /> Lockers y casilleros preferenciales</li>
              <li><Check size={16} /> Plan de acondicionamiento con Instructores</li>
              <li><Check size={16} /> Validación de vigencia automática</li>
            </ul>

            <button
              className="btn btn-accent btn-block btn-select-plan"
              onClick={() => openModal('Membresía Administrativos & Docentes UAGRM', 'Bs. 80 / mes', 'Gimnasio Universitario DUBS')}
            >
              Inscribirme como Docente / Admin
            </button>
          </div>

          {/* Pase Diario Universitaria */}
          <div className="pricing-card reveal-right delay-3">
            <div className="plan-tag" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} /> PASE POR SESIÓN
            </div>
            <h3 className="plan-title">Pase Diario Eventual</h3>
            <div className="plan-price">
              <span className="price-amount">Bs. 10</span>
              <span className="price-period">/ día</span>
            </div>
            <p className="plan-desc">Acceso por una jornada para estudiantes o personal universitario sin membresía mensual activa.</p>

            <div className="plan-fee-highlight" style={{ background: 'var(--color-background)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} /> Ideal para entrenamientos ocasionales
            </div>

            <ul className="plan-features">
              <li><Check size={16} /> Entrada por el día completo</li>
              <li><Check size={16} /> Acceso libre a la sala de Aparatos</li>
              <li><Check size={16} /> Participación en la clase del día</li>
              <li><Check size={16} /> Orientación básica por Instructor</li>
              <li><Check size={16} /> Registro de ingreso en recepción</li>
            </ul>

            <button
              className="btn btn-outline btn-block btn-select-plan"
              onClick={() => openModal('Pase Diario Eventual UAGRM', 'Bs. 10 / día', 'Gimnasio Universitario DUBS')}
            >
              Comprar Pase Diario
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
