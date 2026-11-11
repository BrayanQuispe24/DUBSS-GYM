// src/features/landing/components/PricingPlans.tsx
import React from 'react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { usePublicLanding } from '../hooks/usePublicLanding';
import { GraduationCap, Briefcase, Check, Zap, Star, Building, Calendar } from 'lucide-react';

const PricingPlans: React.FC = () => {
  const { openModal } = useBookingStore();
  const { data, isLoading } = usePublicLanding();
  const planes = data?.planes ?? [];

  const getPlanPresentation = (nombre: string, idx: number) => {
    const lower = nombre.toLowerCase();
    if (lower.includes('estud')) {
      return {
        tag: 'ALUMNOS REGULARES UAGRM',
        icon: GraduationCap,
        highlightText: 'Subvencionado por Bienestar Social',
        isPopular: true,
        btnClass: 'btn btn-secondary btn-block btn-select-plan',
      };
    }
    if (lower.includes('docent') || lower.includes('admin')) {
      return {
        tag: 'PERSONAL INSTITUCIONAL',
        icon: Briefcase,
        highlightText: 'Tarifa Preferencial Institucional',
        isPopular: false,
        btnClass: 'btn btn-accent btn-block btn-select-plan',
      };
    }
    if (lower.includes('diario') || lower.includes('pase') || lower.includes('eventual')) {
      return {
        tag: 'PASE POR SESIÓN',
        icon: Zap,
        highlightText: 'Ideal para entrenamientos ocasionales',
        isPopular: false,
        btnClass: 'btn btn-outline btn-block btn-select-plan',
      };
    }
    return {
      tag: 'MEMBRESÍA D.U.B.S. UAGRM',
      icon: idx === 0 ? GraduationCap : Building,
      highlightText: 'Acceso habilitado con Carnet QR',
      isPopular: idx === 0,
      btnClass: idx === 0 ? 'btn btn-secondary btn-block btn-select-plan' : 'btn btn-accent btn-block btn-select-plan',
    };
  };

  return (
    <section className="section plans-section" id="membresias">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <span className="section-subtitle">TARIFAS DE MEMBRESÍAS UAGRM</span>
          <h2 className="section-title">Precios subvencionados para la comunidad universitaria</h2>
          <p className="section-description">
            La Dirección Universitaria de Bienestar Social (D.U.B.S.) ofrece {planes.length > 0 ? `${planes.length} modalidades vigentes` : 'modalidades oficiales'} de membresías registradas en el sistema.
          </p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
            Cargando planes y tarifas vigentes...
          </div>
        ) : planes.length === 0 ? (
          <div className="surface-card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-secondary)' }}>
            No hay planes de membresía activos publicados en este momento. Consulta en recepción D.U.B.S.
          </div>
        ) : (
          <div className="grid grid-3 pricing-grid" id="pricing-grid">
            {planes.map((plan, idx) => {
              const pres = getPlanPresentation(plan.nombre, idx);
              const TagIcon = pres.icon;
              const precioFormateado = `Bs. ${Number(plan.tarifa.precio).toFixed(0)}`;
              const periodoLabel = plan.duracion_dias === 1 ? '/ día' : `/ ${plan.duracion_dias} días`;

              return (
                <div
                  key={plan.id}
                  className={`pricing-card ${pres.isPopular ? 'popular-card' : ''} reveal-up`}
                >
                  {pres.isPopular && (
                    <div className="popular-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} /> DESTACADO
                    </div>
                  )}

                  <div
                    className="plan-tag"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: pres.isPopular ? '#F87171' : '#E4E4E7',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <TagIcon size={16} /> {pres.tag}
                  </div>

                  <h3 className="plan-title">{plan.nombre}</h3>

                  <div className="plan-price">
                    <span className="price-amount">{precioFormateado}</span>
                    <span className="price-period">{periodoLabel}</span>
                  </div>

                  <p className="plan-desc">
                    {plan.descripcion || `Membresía vigente por ${plan.duracion_dias} días con acceso al Gimnasio Universitario D.U.B.S.`}
                  </p>

                  <div
                    className="plan-fee-highlight"
                    style={{
                      background: pres.isPopular ? 'var(--color-success-bg)' : 'rgba(255, 255, 255, 0.06)',
                      border: pres.isPopular ? undefined : '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      marginBottom: '1.4rem',
                      color: pres.isPopular ? 'var(--color-success-text)' : '#E4E4E7',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Calendar size={16} /> {plan.tarifa.nombre} • {plan.duracion_dias} días de vigencia
                  </div>

                  <ul className="plan-features">
                    <li><Check size={16} /> Acceso a disciplina seleccionada según turno</li>
                    <li><Check size={16} /> Supervisión de Instructores D.U.B.S.</li>
                    <li><Check size={16} /> Carnet Digital & Control de Acceso QR</li>
                    <li><Check size={16} /> {pres.highlightText}</li>
                  </ul>

                  <button
                    className={pres.btnClass}
                    onClick={() =>
                      openModal({
                        spotName: plan.nombre,
                        price: `${precioFormateado} ${periodoLabel}`,
                        gymTitle: 'Gimnasio Universitario D.U.B.S.',
                        planId: plan.id,
                      })
                    }
                  >
                    Solicitar {plan.nombre}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPlans;
