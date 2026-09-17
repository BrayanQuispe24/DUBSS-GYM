// src/features/gyms/components/GymListings.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useGymServices } from '../hooks/useGyms';
import { useGymFilterStore } from '../store/gymFilterStore';
import GymCard from './GymCard';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import type { GymServiceItem } from '@/types';

const CARD_WIDTH = 420;
const GAP = 24; // 1.5rem gap
const STEP = CARD_WIDTH + GAP;
const TRANSITION_DURATION = 1400; // 1.4 seconds for ultra-smooth slow movement
const AUTO_SLIDE_INTERVAL = 4800; // 4.8 seconds rest between slides

const GymListings: React.FC = () => {
  const { activeCategory } = useGymFilterStore();
  const { data: initialServices, isLoading } = useGymServices(activeCategory);

  const [items, setItems] = useState<GymServiceItem[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [withTransition, setWithTransition] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const [prevServices, setPrevServices] = useState<GymServiceItem[] | undefined>(undefined);
  if (initialServices && initialServices !== prevServices) {
    setPrevServices(initialServices);
    setItems(initialServices);
    setOffset(0);
    setWithTransition(false);
    setIsAnimating(false);
  }

  // Queue Next: Smooth slow slide left (-STEP), then move first item to end of queue
  const handleNext = useCallback(() => {
    if (isAnimating || items.length <= 1) return;
    setIsAnimating(true);
    setWithTransition(true);
    setOffset(-STEP);

    setTimeout(() => {
      setWithTransition(false);
      setItems((prev) => {
        if (prev.length <= 1) return prev;
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setOffset(0);
      setIsAnimating(false);
    }, TRANSITION_DURATION);
  }, [isAnimating, items.length]);

  // Queue Prev: Move last item to front instantly at -STEP, then smooth slow slide right to 0
  const handlePrev = useCallback(() => {
    if (isAnimating || items.length <= 1) return;
    setIsAnimating(true);

    setWithTransition(false);
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
    setOffset(-STEP);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setWithTransition(true);
        setOffset(0);
        setTimeout(() => {
          setIsAnimating(false);
        }, TRANSITION_DURATION);
      });
    });
  }, [isAnimating, items.length]);

  // Auto-slide effect every 4.8 seconds when not hovered
  useEffect(() => {
    if (isHovered || isLoading || items.length <= 1 || isAnimating) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isHovered, isLoading, items.length, isAnimating, handleNext]);

  return (
    <section className="section listing-grid-section" id="servicios">
      <div className="container">
        <div className="grid-header-row reveal-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="section-title-sm">Servicios y Disciplinas Deportivas UAGRM</h2>
            <p className="section-subtext">
              Mostrando {initialServices ? initialServices.length : 0} actividades disponibles en la Sede del Gimnasio Universitario DUBS
            </p>
          </div>

          <div className="carousel-header-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Direct Carousel Nav Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={handlePrev}
                className="carousel-arrow-btn"
                aria-label="Anterior"
                title="Ver anterior"
                disabled={isAnimating}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(0, 45, 98, 0.12)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isAnimating ? 'default' : 'pointer',
                  color: 'var(--color-primary)',
                  transition: 'all 0.2s ease',
                  opacity: isAnimating ? 0.7 : 1,
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={handleNext}
                className="carousel-arrow-btn"
                aria-label="Siguiente"
                title="Ver siguiente"
                disabled={isAnimating}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isAnimating ? 'default' : 'pointer',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(153, 0, 0, 0.3)',
                  transition: 'all 0.2s ease',
                  opacity: isAnimating ? 0.7 : 1,
                }}
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="view-toggle-btns" style={{ display: 'flex', gap: '0.6rem' }}>
              <a href="#mapa-envivo" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} /> Sede D.U.B.S.
              </a>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            Cargando disciplinas universitarias...
          </div>
        ) : (
          <div
            className="carousel-container-outer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: 'relative', overflow: 'hidden', paddingBottom: '1rem', paddingTop: '0.5rem' }}
          >
            <div
              className="queue-carousel-track"
              style={{
                display: 'flex',
                gap: `${GAP}px`,
                alignItems: 'stretch',
                transform: `translateX(${offset}px)`,
                transition: withTransition ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)` : 'none',
                willChange: 'transform',
              }}
            >
              {items.map((service) => (
                <div
                  key={service.id}
                  style={{
                    flex: `0 0 ${CARD_WIDTH}px`,
                    width: `${CARD_WIDTH}px`,
                    maxWidth: '88vw',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <GymCard service={service} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GymListings;
