// src/features/landing/components/ExploreZones.tsx
import React from 'react';

const ExploreZones: React.FC = () => {
  return (
    <section className="section explore-parking-types-section" id="explora-tipos">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>Nuestras 5 Disciplinas Principales</h2>
          <p className="section-description" style={{ color: 'var(--color-text-secondary)' }}>
            Instalaciones acondicionadas en la Dirección Universitaria de Bienestar Social (D.U.B.S.) para el desarrollo físico y saludable.
          </p>
        </div>

        <div className="masonry-grid reveal-up delay-1">
          <div className="masonry-card tall">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" alt="Gimnasio y Aparatos" />
            <div className="masonry-content">
              <h3>Gimnasio & Aparatos</h3>
              <p>Musculación selectorizada, racks de potencia, mancuernas olímpicas y máquinas cardio.</p>
            </div>
          </div>

          <div className="masonry-card short">
            <img src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80" alt="Boxeo Universitario" />
            <div className="masonry-content">
              <h3>Boxeo Universitario</h3>
              <p>Ring reglamentario, sacos profesionales, manoplas y técnica de combate.</p>
            </div>
          </div>

          <div className="masonry-card short">
            <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80" alt="Kick Boxing" />
            <div className="masonry-content">
              <h3>Kick Boxing</h3>
              <p>Entrenamiento de resistencia, sacos pesados, acondicionamiento y potencia de patadas.</p>
            </div>
          </div>

          <div className="masonry-card tall">
            <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" alt="Baile & Zumba" />
            <div className="masonry-content">
              <h3>Baile & Ritmo</h3>
              <p>Salón espejado con audio pro para ritmoterapia, zumba fitness y ritmos latinos.</p>
            </div>
          </div>

          <div className="masonry-card short">
            <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80" alt="Entrenamiento Funcional" />
            <div className="masonry-content">
              <h3>Entrenamiento Funcional</h3>
              <p>Circuitos de alta intensidad, TRX, kettlebells, cuerdas de batalla y balones medicinales.</p>
            </div>
          </div>

          <div className="masonry-card short">
            <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80" alt="Supervisión e Instructores" />
            <div className="masonry-content">
              <h3>Supervisión de Instructores</h3>
              <p>Guía continua e indicación de ejercicios por profesionales cualificados de la UAGRM.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreZones;
