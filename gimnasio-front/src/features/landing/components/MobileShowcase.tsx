// src/features/landing/components/MobileShowcase.tsx
import React, { useState } from 'react';
import { Zap, MapPin, CreditCard, QrCode, Star, Check, ArrowRight, ShieldCheck, QrCode as QrIcon } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { usePublicLanding } from '../hooks/usePublicLanding';

const MobileShowcase: React.FC = () => {
  const { openModal } = useBookingStore();
  const { data } = usePublicLanding();
  const defaultPlan = data?.planes?.[0];

  const [ruInput, setRuInput] = useState('');
  const [ciInput, setCiInput] = useState('');
  const [userType, setUserType] = useState<'estudiante' | 'docente' | 'administrativo'>('estudiante');

  const handleOpenFromMockup = () => {
    openModal({
      spotName: defaultPlan ? defaultPlan.nombre : 'Solicitud de Acceso y Membresía',
      price: defaultPlan
        ? `Bs. ${Number(defaultPlan.tarifa.precio).toFixed(0)} / ${defaultPlan.duracion_dias} días`
        : 'Tarifa Universitaria UAGRM',
      gymTitle: 'Gimnasio Universitario D.U.B.S.',
      planId: defaultPlan?.id,
      prefillRu: ruInput.trim() || undefined,
      prefillCi: ciInput.trim() || undefined,
      prefillUserType: userType,
    });
  };

  return (
    <section className="section mobile-showcase-section" id="parqueo-en-mano">
      <div className="container">
        <div className="mobile-feature-banner">
          {/* Background Ambient Gym Video with Blur & Overlay */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="banner-bg-video"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-man-training-with-dumbbells-in-a-gym-42646-large.mp4" type="video/mp4" />
          </video>
          <div className="banner-video-overlay" />

          {/* Floating Badges */}
          <div className="speech-bubble bubble-top-left reveal-left">
            <div className="bubble-icon-badge orange"><Zap size={15} /></div>
            <span>Registro Móvil al Instante</span>
          </div>

          <div className="speech-bubble bubble-top-right reveal-right">
            <div className="bubble-icon-badge green"><MapPin size={15} /></div>
            <span>Control de Entrada & Salida</span>
          </div>

          <div className="speech-bubble bubble-mid-left reveal-left">
            <div className="bubble-icon-badge blue"><CreditCard size={15} /></div>
            <span>Formulario con R.U.</span>
          </div>

          <div className="speech-bubble bubble-mid-right reveal-right">
            <div className="bubble-icon-badge purple"><QrCode size={15} /></div>
            <span>Pase Digital con QR</span>
          </div>

          {/* iPhone Custom Frame */}
          <div className="iphone-custom-frame-wrapper">
            <div className="iphone-custom-mockup reveal-up">
              <div className="iphone-notch-bar">
                <div className="iphone-notch-dot"></div>
                <div className="iphone-notch-speaker"></div>
                <div className="iphone-notch-dot"></div>
              </div>

              <div className="phone-screen-content" style={{ paddingTop: '2.2rem', paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem', background: '#101015', fontSize: '0.8rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="phone-app-header" style={{ marginBottom: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>Gimnasio<span style={{ color: '#EF4444' }}> UAGRM</span></div>
                  <div style={{ color: '#4ADE80', fontSize: '0.68rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }}></span>
                    {data?.estadisticas ? `${data.estadisticas.aforo_actual} dentro` : 'Acceso Activo'}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.14)', borderRadius: '16px', padding: '0.85rem', marginBottom: '0.7rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#F87171', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Pre-Solicitud de Inscripción
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div>
                      <label style={{ fontSize: '0.64rem', color: '#CBD5E1', display: 'block', marginBottom: '0.12rem' }}>Registro Universitario (R.U.)</label>
                      <input
                        type="text"
                        value={ruInput}
                        onChange={(e) => setRuInput(e.target.value)}
                        placeholder="Ej. 219084732"
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.64rem', color: '#CBD5E1', display: 'block', marginBottom: '0.12rem' }}>Cédula de Identidad (C.I.)</label>
                      <input
                        type="text"
                        value={ciInput}
                        onChange={(e) => setCiInput(e.target.value)}
                        placeholder="Ej. 9847120 SC"
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.64rem', color: '#CBD5E1', display: 'block', marginBottom: '0.12rem' }}>Tipo de Usuario UAGRM</label>
                      <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value as 'estudiante' | 'docente' | 'administrativo')}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        <option value="estudiante">Estudiante UAGRM</option>
                        <option value="docente">Docente UAGRM</option>
                        <option value="administrativo">Administrativo UAGRM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenFromMockup}
                    style={{ width: '100%', marginTop: '0.65rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    <QrIcon size={13} /> Continuar Solicitud
                  </button>
                </div>

                <div style={{ background: 'rgba(74, 222, 128, 0.12)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '14px', padding: '0.65rem 0.85rem', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <ShieldCheck size={22} style={{ color: '#4ADE80', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4ADE80' }}>ACCESO AUTORIZADO</div>
                    <div style={{ fontSize: '0.65rem', color: '#E2E8F0' }}>Control Entrada/Salida Torniquetes DUBS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="floating-benefit-card reveal-right">
            <div className="benefit-card-badge" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F87171', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              <Star size={14} style={{ fill: '#EF4444', color: '#EF4444', display: 'inline', marginRight: '0.3rem' }} /> CONTROL DE ACCESO D.U.B.S. UAGRM
            </div>
            <h4 className="benefit-card-title">
              ¿Cómo funciona el registro y control de entrada/salida desde tu celular?
            </h4>

            <ul className="benefit-item-list">
              <li className="benefit-item">
                <div className="benefit-item-icon">
                  <Check size={14} />
                </div>
                <div className="benefit-item-text">
                  <strong>Formulario de Registro Móvil:</strong> Solicita tu acceso ingresando tu Registro Universitario (R.U.) y cédula de identidad en segundos.
                </div>
              </li>
              <li className="benefit-item">
                <div className="benefit-item-icon">
                  <Check size={14} />
                </div>
                <div className="benefit-item-text">
                  <strong>Control de Entrada & Salida:</strong> Al llegar al gimnasio, la recepcionista escanea tu código QR para registrar tus ingresos y salidas en tiempo real.
                </div>
              </li>
              <li className="benefit-item">
                <div className="benefit-item-icon">
                  <Check size={14} />
                </div>
                <div className="benefit-item-text">
                  <strong>Validación de Vigencia Instantánea:</strong> El sistema confirma la vigencia activa de tu membresía sin filas ni trámites manuales.
                </div>
              </li>
            </ul>

            <button
              onClick={handleOpenFromMockup}
              className="btn-benefit-action"
              style={{ border: 'none', width: '100%', cursor: 'pointer' }}
            >
              <span>Solicitar Registro de Acceso Ahora</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
