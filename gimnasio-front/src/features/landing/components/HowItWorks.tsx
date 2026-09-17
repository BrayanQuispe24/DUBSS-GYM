// src/features/landing/components/HowItWorks.tsx
import React from 'react';
import { Search, GraduationCap, QrCode, Dumbbell } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section className="section how-it-works-section" id="como-funciona">
      <div className="container">
        <div className="section-header reveal-up text-center mb-5">
          <div className="section-subtitle-guide">
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, letterSpacing: '0.12em' }}>
              PROCESO SIMPLIFICADO UAGRM
            </span>
          </div>
          <h2 className="section-title-steps">
            Inscribirte y Entrenar Es <span className="highlight-pill-text">Simple</span>
          </h2>
          <p className="section-subtext-steps" style={{ color: '#E2E8F0', marginTop: '0.6rem' }}>
            Aprovecha los beneficios de la Dirección Universitaria de Bienestar Social (D.U.B.S.).
          </p>
        </div>

        <div className="classgo-steps-grid reveal-up delay-1">
          {/* Paso 1 */}
          <div className="classgo-step-card">
            <div className="step-badge-pill">Paso 1</div>
            <div className="step-card-img-wrapper">
              <Search size={44} />
            </div>
            <h3 className="classgo-step-title">Elige tu Disciplina</h3>
            <p className="classgo-step-desc">
              Selecciona entre Boxeo, Kick Boxing, Baile, Funcional o Gimnasio de Aparatos según tus metas.
            </p>
            <a href="#servicios" className="btn-step-action-orange">Ver Disciplinas</a>
          </div>

          {/* Paso 2 */}
          <div className="classgo-step-card">
            <div className="step-badge-pill">Paso 2</div>
            <div className="step-card-img-wrapper">
              <GraduationCap size={44} />
            </div>
            <h3 className="classgo-step-title">Selecciona tu Tarifa</h3>
            <p className="classgo-step-desc">
              Elige tu membresía según tu estado: Estudiante universitario regular o Administrativo/Docente UAGRM.
            </p>
            <a href="#membresias" className="btn-step-action-orange">Ver Membresías</a>
          </div>

          {/* Paso 3 */}
          <div className="classgo-step-card">
            <div className="step-badge-pill">Paso 3</div>
            <div className="step-card-img-wrapper">
              <QrCode size={44} />
            </div>
            <h3 className="classgo-step-title">Control en Recepción</h3>
            <p className="classgo-step-desc">
              La recepcionista valida la vigencia de tu membresía y registras tu entrada/salida escaneando tu QR en puerta.
            </p>
            <a href="#roles" className="btn-step-action-orange">Ver Recepción</a>
          </div>

          {/* Paso 4 / Highlight */}
          <div className="classgo-step-card cta-card-highlight">
            <div className="cta-icon-bubble" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>
              <Dumbbell size={44} />
            </div>
            <h3 className="classgo-cta-title">Entrena con Instructores</h3>
            <p className="classgo-cta-desc">
              Instructores calificados supervisan e indican tus rutinas y recomendaciones de ejercicio personalizadas.
            </p>
            <a href="#roles" className="btn-step-action-dark">Conoce Instructores</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
