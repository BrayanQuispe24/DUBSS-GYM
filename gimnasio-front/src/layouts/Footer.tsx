// src/layouts/Footer.tsx
import React from 'react';
import { Dumbbell, Mail, Globe, Share2, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top grid grid-4">
          <div className="footer-col brand-col">
            <a href="#" className="logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <div className="logo-icon">
                <Dumbbell size={20} />
              </div>
              <span className="logo-text" style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800 }}>
                Fit<span style={{ color: 'var(--color-accent)' }}>Go!</span>
              </span>
            </a>
            <p style={{ fontSize: '0.88rem', color: '#A7B2AB' }}>
              Plataforma tecnológica para encontrar, reservar y gestionar gimnasios, clases fitness y entrenamiento libre en Santa Cruz de la Sierra, Bolivia.
            </p>
            <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
              <a href="#" aria-label="Web"><Globe size={18} /></a>
              <a href="#" aria-label="Compartir"><Share2 size={18} /></a>
              <a href="#" aria-label="Contacto"><MessageCircle size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Producto & Servicios</h4>
            <ul>
              <li><a href="#como-funciona">Cómo funciona</a></li>
              <li><a href="#explorar">Buscar Gimnasios</a></li>
              <li><a href="#mapa-envivo">Mapa de Sedes</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Empresa & Aliados</h4>
            <ul>
              <li><a href="#roles">Para Atletas y Socios</a></li>
              <li><a href="#roles">Para Gimnasios y Cadenas</a></li>
              <li><a href="#planes">Planes B2B & Tarifas</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Acceso & Soporte</h4>
            <ul>
              <li><a href="#explorar">Iniciar Sesión / Registro</a></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A7B2AB' }}>
                <Mail size={14} /> contacto@fitgo.bo
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom text-center">
          <p>&copy; 2026 FitGo Bolivia. Todos los derechos reservados. Sistema de Gestión de Gimnasios.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
