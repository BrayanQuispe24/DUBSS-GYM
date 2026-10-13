// src/layouts/AuthLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaShieldHalved, FaBolt, FaCircleCheck } from 'react-icons/fa6';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  variant?: 'single' | 'split';
  maxWidth?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  variant = 'single',
  maxWidth,
}) => {
  const isSplit = variant === 'split';
  const cardMaxWidth = maxWidth || (isSplit ? '1080px' : '480px');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #001C38 0%, #003B70 45%, #990000 100%)',
      padding: '1.5rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative dynamic ambient background elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(153,0,0,0.3) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0,59,112,0.4) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Style block for responsive split hiding */}
      <style>{`
        @media (max-width: 900px) {
          .auth-left-banner {
            display: none !important;
          }
          .auth-right-panel {
            width: 100% !important;
            flex: 1 1 100% !important;
            padding: 1.75rem 1.25rem !important;
          }
        }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: cardMaxWidth,
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        display: isSplit ? 'flex' : 'block',
        minHeight: isSplit ? '620px' : 'auto',
      }}>
        {/* Left Visual Banner Panel for Gym Ambience */}
        {isSplit && (
          <div
            className="auth-left-banner"
            style={{
              flex: '0 0 42%',
              position: 'relative',
              backgroundImage: `linear-gradient(135deg, rgba(0, 28, 56, 0.90) 0%, rgba(0, 59, 112, 0.82) 50%, rgba(153, 0, 0, 0.88) 100%), url('/assets/gym_auth_banner.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '3rem 2.5rem',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Top Brand Logo */}
            <div>
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  background: 'linear-gradient(135deg, #990000 0%, #7A0000 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  boxShadow: '0 4px 15px rgba(153, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <FaDumbbell />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.35rem', color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '0.02em' }}>
                    FITGO <span style={{ color: '#FF3333' }}>UAGRM</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.75)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    D.U.B.S. Universitario
                  </div>
                </div>
              </Link>
            </div>

            {/* Central Gym Copy */}
            <div style={{ margin: '2rem 0' }}>
              <div style={{
                display: 'inline-block',
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FFD700',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 215, 0, 0.3)',
              }}>
                Gimnasio Universitario UAGRM
              </div>

              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '2.1rem',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                marginBottom: '0.85rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}>
                Transforma tu <span style={{ color: '#FF4D4D' }}>potencial</span> físico
              </h2>

              <p style={{
                fontSize: '0.88rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.5,
                marginBottom: '1.75rem',
              }}>
                Forma parte de la comunidad deportiva de la UAGRM. Registra tu cuenta cliente para acceder a nuestras salas de musculación, horarios y entrenamiento profesional.
              </p>

              {/* Benefits list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.83rem', color: '#FFFFFF' }}>
                  <FaDumbbell style={{ color: '#FF4D4D', fontSize: '1rem' }} />
                  <span>Maquinaria y musculación de primera clase</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.83rem', color: '#FFFFFF' }}>
                  <FaBolt style={{ color: '#FFD700', fontSize: '1rem' }} />
                  <span>Descuentos exclusivos para la comunidad UAGRM</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.83rem', color: '#FFFFFF' }}>
                  <FaCircleCheck style={{ color: '#4ADE80', fontSize: '1rem' }} />
                  <span>Registro seguro con notificación oficial</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Badge */}
            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.72rem',
              color: 'rgba(255, 255, 255, 0.65)',
            }}>
              Dirección Universitaria de Bienestar Social • UAGRM
            </div>
          </div>
        )}

        {/* Right Form Panel */}
        <div
          className="auth-right-panel"
          style={{
            flex: isSplit ? '1 1 58%' : '1 1 100%',
            padding: isSplit ? '2.5rem 2.75rem' : '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Header Header Brand (Shown in right panel if single or on mobile) */}
          <div style={{ textAlign: isSplit ? 'left' : 'center', marginBottom: '1.5rem' }}>
            {!isSplit && (
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: '#990000',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(153, 0, 0, 0.3)',
                }}>
                  <FaDumbbell />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#003B70', lineHeight: 1.1 }}>
                    FITGO <span style={{ color: '#990000' }}>UAGRM</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    D.U.B.S. Universitario
                  </div>
                </div>
              </Link>
            )}

            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#0B1727', marginBottom: '0.25rem' }}>
              {title}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              {subtitle}
            </p>
          </div>

          {/* Form Body */}
          {children}

          {/* Footer Security Badge */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid #E2E8F0',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            <FaShieldHalved style={{ color: '#003B70' }} />
            <span>Acceso Seguro • Universidad Autónoma Gabriel René Moreno</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
