// src/components/common/TermsModal.tsx
import React from 'react';
import { FaFileContract, FaCircleCheck } from 'react-icons/fa6';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '640px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '85vh',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
          color: '#FFFFFF',
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FaFileContract style={{ color: '#F59E0B' }} />
            Términos y Condiciones de Uso del Gimnasio UAGRM
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.4rem',
              cursor: 'pointer',
              color: '#94A3B8',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          fontSize: '0.88rem',
          color: '#334155',
          lineHeight: '1.6',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{
            background: '#FEF3C7',
            borderLeft: '4px solid #F59E0B',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            color: '#92400E',
            fontWeight: 600,
          }}>
            Por favor, lee atentamente el presente reglamento oficial del Gimnasio D.U.B.S. de la Universidad Autónoma Gabriel René Moreno (UAGRM).
          </div>

          <section>
            <h4 style={{ fontWeight: 700, color: '#0B1727', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
              1. Identidad y Credencial de Acceso
            </h4>
            <p style={{ margin: 0 }}>
              El pase o código QR generado por el sistema es **estrictamente personal e intransferible**. Está prohibido ceder, prestar o transferir el acceso a terceros. El incumplimiento causará la suspensión inmediata de la membresía.
            </p>
          </section>

          <section>
            <h4 style={{ fontWeight: 700, color: '#0B1727', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
              2. Uso del Equipamiento e Instalaciones
            </h4>
            <p style={{ margin: 0 }}>
              Los usuarios se comprometen a hacer un uso adecuado y responsable de las máquinas de musculación, pesas y áreas comunes del gimnasio D.U.B.S. En caso de daño intencional, el usuario deberá cubrir los costos de reparación o restitución.
            </p>
          </section>

          <section>
            <h4 style={{ fontWeight: 700, color: '#0B1727', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
              3. Normas de Higiene y Convivencia
            </h4>
            <p style={{ margin: 0 }}>
              Es obligatorio el uso de ropa deportiva adecuada, zapatillas cerradas y toalla de mano para el uso de cada máquina. Se deben acatar las indicaciones de los instructores y personal del gimnasio en todo momento.
            </p>
          </section>

          <section>
            <h4 style={{ fontWeight: 700, color: '#0B1727', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
              4. Aptitud Física y Deslinde de Responsabilidades
            </h4>
            <p style={{ margin: 0 }}>
              Al registrarse, el usuario declara encontrarse en condiciones de salud y estado físico óptimos para la realización de actividades de ejercicio muscular. La universidad no se responsabiliza por lesiones derivadas de imprudencias o patologías no informadas.
            </p>
          </section>

          <section>
            <h4 style={{ fontWeight: 700, color: '#0B1727', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
              5. Uso Responsable de la Plataforma Digital
            </h4>
            <p style={{ margin: 0 }}>
              El usuario garantiza la veracidad y exactitud de todos los datos ingresados al sistema (R.U., C.I., correo). Se prohíbe estrictamente cualquier intento de acceso no autorizado, suplantación de identidad, alteración maliciosa de información o uso indebido de los servicios web del gimnasio.
            </p>
          </section>

          <section>
            <h4 style={{ fontWeight: 700, color: '#0B1727', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
              6. Tratamiento y Uso de Datos Personales
            </h4>
            <p style={{ margin: 0 }}>
              El usuario autoriza de manera explícita a la Dirección Universitaria de Bienestar Social (D.U.B.S.) y a su personal administrativo e instructores autorizados para recopilar, consultar y procesar sus datos personales y registros de asistencia. Dicha información se utilizará exclusivamente para la validación con registros de la UAGRM, control de acceso, asignación de rutinas y gestión de procesos administrativos internos del gimnasio.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          background: '#F8FAFC',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            Cerrar
          </button>
          {onAccept && (
            <button
              type="button"
              onClick={() => {
                onAccept();
                onClose();
              }}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                background: '#003B70',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <FaCircleCheck /> Entendido y Acepto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
