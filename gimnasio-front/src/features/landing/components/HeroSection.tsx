// src/features/landing/components/HeroSection.tsx
import React, { useRef } from 'react';
import { Compass, Users, LogIn, HelpCircle, User, Zap } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { usePublicLanding } from '../hooks/usePublicLanding';
import { Link } from 'react-router-dom';
import fondoImg from '@/assets/fondo.webp';
import elementoIzquierdoImg from '@/assets/elementoIzquierdo.webp';
import elementoDerechoImg from '@/assets/elementoDerecho.webp';
import { useHeroScrollParallax } from '../hooks/useHeroScrollParallax';

const HeroSection: React.FC = () => {
  const { openModal } = useBookingStore();
  const { data } = usePublicLanding();
  const defaultPlan = data?.planes?.[0];

  const sectionRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const leftLayerRef = useRef<HTMLDivElement>(null);
  const rightLayerRef = useRef<HTMLDivElement>(null);

  useHeroScrollParallax({
    sectionRef,
    bgLayerRef,
    leftLayerRef,
    rightLayerRef,
  });

  return (
    <section className="hero-classgo" id="inicio" ref={sectionRef}>
      <div className="hero-parallax-stage" aria-hidden="true">
        <div className="hero-parallax-layer hero-parallax-layer--bg" ref={bgLayerRef}>
          <img
            src={fondoImg}
            alt=""
            className="hero-parallax-img"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>

        <div className="hero-parallax-layer hero-parallax-layer--left" ref={leftLayerRef}>
          {/* elementoDerecho.png contiene los elementos visuales del lado izquierdo (mancuerna, botella y pesa rusa) */}
          <img
            src={elementoDerechoImg}
            alt=""
            className="hero-parallax-img"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>

        <div className="hero-parallax-layer hero-parallax-layer--right" ref={rightLayerRef}>
          {/* elementoIzquierdo.png contiene los elementos visuales del lado derecho (shaker, discos y mancuerna) */}
          <img
            src={elementoIzquierdoImg}
            alt=""
            className="hero-parallax-img"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>

        <div className="hero-parallax-scrim" />
      </div>

      <div className="container hero-classgo-grid">
        <div className="hero-classgo-text">
          <h1 className="sr-only">
            Gimnasio Universitario UAGRM - Salud, Deporte & Rendimiento
          </h1>

          <div className="classgo-pill-btn-group">
            <a href="#servicios" className="btn-classgo-outline" id="btn-hero-cta-search">
              <Compass size={18} /> Ver Disciplinas & Clases
            </a>
            <a href="#membresias" className="btn-classgo-outline" id="btn-hero-cta-host">
              <Users size={18} /> Membresías Universitarias
            </a>
            <Link to="/login" className="btn-classgo-outline">
              <LogIn size={18} /> Acceso al Sistema
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Corner Widgets */}
      <div className="floating-corner-widgets">
        <a href="#como-funciona" className="widget-btn help-btn" title="Cómo Funciona DUBS">
          <HelpCircle size={22} />
        </a>
        <Link to="/login" className="widget-btn user-btn" title="Portal UAGRM">
          <User size={22} />
          <span className="red-badge"></span>
        </Link>
        <button
          className="widget-btn action-btn"
          title="Inscripción de Membresía"
          onClick={() =>
            openModal({
              spotName: defaultPlan ? defaultPlan.nombre : 'Inscripción Gimnasio D.U.B.S.',
              price: defaultPlan ? `Bs. ${Number(defaultPlan.tarifa.precio).toFixed(0)} / ${defaultPlan.duracion_dias} días` : 'Tarifa Universitaria UAGRM',
              gymTitle: 'Gimnasio Universitario D.U.B.S.',
              planId: defaultPlan?.id,
            })
          }
        >
          <Zap size={22} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
