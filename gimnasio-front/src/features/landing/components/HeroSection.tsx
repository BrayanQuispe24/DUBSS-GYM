// src/features/landing/components/HeroSection.tsx
import React from 'react';
import { Compass, Users, LogIn, HelpCircle, User, Zap, Sparkles } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const { openModal } = useBookingStore();

  return (
    <section className="hero-classgo" id="inicio">
      <div className="container hero-classgo-grid">
        <div className="hero-classgo-text reveal-up">
          <div className="dubs-badge-banner">
            <Sparkles size={16} /> DIRECCIÓN UNIVERSITARIA DE BIENESTAR SOCIAL (D.U.B.S.)
          </div>

          <h1 className="classgo-hero-h1">
            Gimnasio Universitario <span className="glow-cyan-text">UAGRM</span><br />
            Salud, Deporte & Rendimiento
          </h1>

          <p className="classgo-hero-p">
            Espacio deportivo universitario diseñado exclusivamente para <strong>Estudiantes, Administrativos y Docentes de la UAGRM</strong>. Disfruta de nuestras disciplinas: <strong>Boxeo, Kick Boxing, Baile, Funcional y Musculación con Aparatos</strong>.
          </p>

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

        {/* Right Mascot / DUBS Showcase */}
        <div className="hero-classgo-mascot reveal-up delay-1">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
            alt="Gimnasio Universitario UAGRM DUBS"
            className="mascot-img"
          />
        </div>
      </div>

      {/* Floating Corner Widgets */}
      <div className="floating-corner-widgets">
        <button className="widget-btn help-btn" title="Centro de Ayuda DUBS">
          <HelpCircle size={22} />
        </button>
        <button className="widget-btn user-btn" title="Portal UAGRM">
          <User size={22} />
          <span className="red-badge"></span>
        </button>
        <button
          className="widget-btn action-btn"
          title="Inscripción de Membresía"
          onClick={() => openModal('Membresía Estudiantes UAGRM', 'Bs. 50 / mes', 'Gimnasio Universitario DUBS')}
        >
          <Zap size={22} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
