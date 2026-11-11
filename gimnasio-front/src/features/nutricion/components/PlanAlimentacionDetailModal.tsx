import React from 'react';
import {
  X,
  Apple,
  Sparkles,
  Calendar,
  User,
  Flame,
  Clock,
  UtensilsCrossed,
  Info,
  Dumbbell,
} from 'lucide-react';
import type { PlanAlimentacion } from '../services/nutricionService';

interface PlanAlimentacionDetailModalProps {
  plan: PlanAlimentacion | null;
  isOpen: boolean;
  onClose: () => void;
}

const renderDetalleObservacion = (obs?: string) => {
  if (!obs) return null;

  const blocks = obs.split('\n\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.45rem' }}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('Macros:')) {
          return (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border)',
                padding: '0.2rem 0.55rem',
                borderRadius: '3px',
                fontSize: '0.73rem',
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                width: 'fit-content',
              }}
            >
              <Dumbbell size={12} color="var(--color-primary-text)" /> {trimmed}
            </div>
          );
        }
        if (trimmed.startsWith('Horario Sugerido:')) {
          return (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
              }}
            >
              <Clock size={12} color="var(--color-primary-text)" /> {trimmed}
            </div>
          );
        }
        if (trimmed.startsWith('Ingredientes y Porciones:') || trimmed.startsWith('Ingredientes:')) {
          const header = trimmed.startsWith('Ingredientes y Porciones:') ? 'Ingredientes y Porciones:' : 'Ingredientes:';
          const content = trimmed.replace(header, '').trim();
          return (
            <div key={i} style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.55rem 0.75rem' }}>
              <span style={{ fontSize: '0.69rem', fontWeight: 800, color: 'var(--color-primary-text)', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                <Apple size={12} color="var(--color-primary-text)" /> {header}
              </span>
              <div style={{ fontSize: '0.77rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                {content}
              </div>
            </div>
          );
        }
        if (trimmed.startsWith('Preparación:') || trimmed.startsWith('Preparación Rápida:')) {
          const header = trimmed.startsWith('Preparación Rápida:') ? 'Preparación Rápida:' : 'Preparación:';
          const content = trimmed.replace(header, '').trim();
          return (
            <div key={i} style={{ background: 'var(--color-success-bg)', border: '1px solid #BBF7D0', borderRadius: '4px', padding: '0.55rem 0.75rem' }}>
              <span style={{ fontSize: '0.69rem', fontWeight: 800, color: 'var(--color-success-text)', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                <UtensilsCrossed size={12} color="#16a34a" /> {header}
              </span>
              <div style={{ fontSize: '0.77rem', color: 'var(--color-text-primary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                {content}
              </div>
            </div>
          );
        }
        if (trimmed.startsWith('Sustitutos Económicos:') || trimmed.startsWith('Sustitutos:')) {
          const header = trimmed.startsWith('Sustitutos Económicos:') ? 'Sustitutos Económicos Sugeridos:' : 'Sustitutos:';
          const content = trimmed.replace(/^(Sustitutos Económicos:|Sustitutos:)/, '').trim();
          return (
            <div key={i} style={{ background: '#FEFCE8', border: '1px solid #FEF08A', borderRadius: '4px', padding: '0.5rem 0.75rem' }}>
              <span style={{ fontSize: '0.69rem', fontWeight: 800, color: '#854D0E', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                <Info size={12} color="#CA8A04" /> {header}
              </span>
              <div style={{ fontSize: '0.75rem', color: '#713F12', lineHeight: 1.45, whiteSpace: 'pre-line' }}>
                {content}
              </div>
            </div>
          );
        }
        return (
          <div
            key={i}
            style={{
              fontSize: '0.76rem',
              color: 'var(--color-text-secondary)',
              background: 'var(--color-surface-muted)',
              borderRadius: '3px',
              padding: '0.4rem 0.65rem',
              border: '1px solid var(--color-border)',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {trimmed}
          </div>
        );
      })}
    </div>
  );
};

export const PlanAlimentacionDetailModal: React.FC<PlanAlimentacionDetailModalProps> = ({
  plan,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !plan) return null;

  const totalCalorias = (plan.detalles || []).reduce(
    (acc, d) => acc + Math.round(Number(d.cantidad ?? d.calorias ?? 0)),
    0
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(0, 0, 0, 0.70)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '4px',
          border: '1px solid var(--color-border-strong)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header Enterprise */}
        <div
          style={{
            background: 'linear-gradient(135deg, #990000 0%, #570000 100%)',
            padding: '1rem 1.25rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--color-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Apple size={18} color="#FCA5A5" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                {plan.nombre}
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.82)' }}>
                Detalle oficial del plan de alimentación y pauta energética
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Cerrar ventana"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Metadata Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              background: 'var(--color-surface-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '0.85rem 1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'uppercase' }}>
                <User size={12} /> Atleta Asignado
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {plan.usuario ? `${plan.usuario.nombre} ${plan.usuario.apellido}` : 'Usuario del Sistema'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'uppercase' }}>
                <Flame size={12} color="#F97316" /> Meta Energética Total
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.86rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>
                {totalCalorias > 0 ? `${totalCalorias} kcal/día` : plan.objetivo?.split('-')[0] || 'Personalizada'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'uppercase' }}>
                <Calendar size={12} /> Vigencia
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                {plan.fecha_inicio ? `${plan.fecha_inicio} a ${plan.fecha_fin || 'Indefinido'}` : 'Vigencia activa'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'uppercase' }}>
                <UtensilsCrossed size={12} /> Comidas Diarias
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {plan.detalles?.length || 0} Tiempos de comida
              </p>
            </div>
          </div>

          {/* Objetivo */}
          {plan.objetivo && (
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: '4px', padding: '0.75rem 1rem' }}>
              <span style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--color-primary-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Objetivo Prescrito:
              </span>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {plan.objetivo}
              </p>
            </div>
          )}

          {/* Estrategia Nutricional IA (Observación) */}
          {plan.observacion && (
            <div
              style={{
                background: 'var(--color-primary-soft)',
                border: '1px solid rgba(220, 38, 38, 0.30)',
                borderRadius: '4px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
                <Sparkles size={16} color="var(--color-primary-text)" />
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Estrategia Nutricional Prescrita (Gemini IA)
                </h4>
              </div>
              <div
                style={{
                  fontSize: '0.80rem',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {plan.observacion}
              </div>
            </div>
          )}

          {/* Comidas Prescritas */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em', margin: 0 }}>
                Menú y Tiempos de Comida Prescritos ({plan.detalles?.length || 0})
              </h4>
            </div>

            {(!plan.detalles || plan.detalles.length === 0) ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.82rem', background: 'var(--color-surface-muted)', borderRadius: '4px', border: '1px dashed var(--color-border-strong)' }}>
                No hay comidas individuales registradas en este plan.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {plan.detalles.map((d, index) => {
                  const platoNombre = d.alimento || d.descripcion || 'Comida Prescrita';
                  const calorias = Math.round(Number(d.cantidad ?? d.calorias ?? 0));
                  return (
                    <div
                      key={index}
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border-strong)',
                        borderRadius: '4px',
                        padding: '0.85rem 1rem',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              background: 'var(--color-primary)',
                              color: '#FFFFFF',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '2px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {d.tipo_comida || 'Comida'}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                            {d.dia_semana || 'Lunes a Domingo'}
                          </span>
                          {d.hora && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Clock size={11} /> {d.hora}
                            </span>
                          )}
                        </div>

                        {calorias > 0 && (
                          <span
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              color: 'var(--color-primary-text)',
                              background: 'var(--color-primary-soft)',
                              border: '1px solid rgba(220, 38, 38, 0.30)',
                              padding: '0.15rem 0.6rem',
                              borderRadius: '2px',
                            }}
                          >
                            {calorias} {d.unidad || 'kcal'}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.90rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.3rem' }}>
                        {platoNombre}
                      </div>

                      {d.observacion && d.observacion !== platoNombre && renderDetalleObservacion(d.observacion)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Enterprise */}
        <div
          style={{
            background: 'var(--color-surface-muted)',
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--color-border-strong)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.2rem',
              borderRadius: '4px',
              border: '1px solid var(--color-border-strong)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '0.80rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
