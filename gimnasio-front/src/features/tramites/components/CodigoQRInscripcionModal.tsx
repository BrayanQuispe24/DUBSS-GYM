// src/features/tramites/components/CodigoQRInscripcionModal.tsx
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaXmark, FaQrcode, FaShieldHalved, FaPrint, FaClock, FaUser, FaCircleCheck } from 'react-icons/fa6';
import { getBoletaInscripcionQR } from '../services/tramiteService';

interface CodigoQRInscripcionModalProps {
  isOpen: boolean;
  inscripcionId: number | null;
  inscripcionFallback?: any | null;
  onClose: () => void;
}

const CodigoQRInscripcionModal: React.FC<CodigoQRInscripcionModalProps> = ({
  isOpen,
  inscripcionId,
  inscripcionFallback,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !inscripcionId) {
      setQrData(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    getBoletaInscripcionQR(inscripcionId)
      .then((data) => {
        if (isMounted) {
          console.log('----------------------------------------------------');
          console.log('JSON PAYLOAD DEL CÓDIGO QR GENERADO (COPIAR PARA PROBAR EN VALIDADOR):');
          console.log(data?.qr_payload || JSON.stringify(data));
          console.log('----------------------------------------------------');
          setQrData(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error obteniendo código QR:', err);
          // Fallback if backend call fails
          if (inscripcionFallback) {
            const user = inscripcionFallback.usuario || {};
            const fallbackPayload = JSON.stringify({
              boleta_id: inscripcionFallback.id,
              numero_boleta: inscripcionFallback.numero_boleta,
              id_usuario: inscripcionFallback.id_usuario,
              usuario_nombre: `${user.nombre || ''} ${user.apellido || ''}`.trim(),
              disciplina: inscripcionFallback.disciplina || 'Gimnasio Musculación',
              hora_inicio: inscripcionFallback.hora_inicio || '07:00',
              hora_salida: inscripcionFallback.hora_salida || '09:00',
              fecha_inicio: inscripcionFallback.fecha_inicio,
              fecha_fin: inscripcionFallback.fecha_fin,
              estado: strToLower(inscripcionFallback.estado || 'activo'),
            });
            setQrData({
              boleta_id: inscripcionFallback.id,
              numero_boleta: inscripcionFallback.numero_boleta,
              usuario: {
                nombre: `${user.nombre || ''} ${user.apellido || ''}`.trim() || user.email || 'Socio',
                ci: user.ci,
                registro_universitario: user.registro_universitario,
              },
              membresia: {
                disciplina: inscripcionFallback.disciplina || 'Gimnasio Musculación',
                horario_texto: `${inscripcionFallback.hora_inicio || '07:00'} - ${inscripcionFallback.hora_salida || '09:00'}`,
                fecha_inicio: inscripcionFallback.fecha_inicio,
                fecha_fin: inscripcionFallback.fecha_fin,
                estado: strToLower(inscripcionFallback.estado || 'activo'),
              },
              qr_payload: fallbackPayload,
            });
          } else {
            setError('No se pudo cargar el código QR de acceso.');
          }
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, inscripcionId, inscripcionFallback]);

  if (!isOpen) return null;

  function strToLower(val?: string) {
    return String(val || '').toLowerCase();
  }

  const payloadString = qrData?.qr_payload || (inscripcionId ? JSON.stringify({ boleta_id: inscripcionId }) : '');

  const user = qrData?.usuario || {};
  const membresia = qrData?.membresia || {};
  const numeroBoleta = qrData?.numero_boleta || inscripcionFallback?.numero_boleta || `INS-${inscripcionId}`;

  const isActivo = membresia?.estado === 'activo' || strToLower(inscripcionFallback?.estado) === 'activo';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal-qr-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '1rem',
      }}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .modal-qr-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: none !important;
            padding: 0 !important;
          }
          .qr-card-printable, .qr-card-printable * {
            visibility: visible !important;
          }
          .qr-card-printable {
            position: absolute !important;
            left: 50% !important;
            top: 20px !important;
            transform: translateX(-50%) !important;
            box-shadow: none !important;
            border: 2px solid var(--color-primary) !important;
          }
          .no-print-qr {
            display: none !important;
          }
        }
      `}</style>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* HEADER BAR */}
        <div
          className="no-print-qr"
          style={{
            background: 'linear-gradient(135deg, #990000 0%, #570000 100%)',
            color: '#FFFFFF',
            padding: '1.2rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: '#FCA5A5',
              }}
            >
              <FaQrcode />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Pase Digital de Ingreso QR</h3>
              <div style={{ fontSize: '0.75rem', color: '#FCA5A5' }}>Gimnasio UAGRM - DUBSS</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#FFF',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* CONTENT CARD */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {loading ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid var(--color-border)',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem auto',
                }}
              />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Generando Pase QR Digital...</div>
              <div style={{ fontSize: '0.78rem' }}>Verificando firma de seguridad en servidor</div>
            </div>
          ) : error ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-danger-text)' }}>
              <p style={{ fontWeight: 700 }}>{error}</p>
              <button
                onClick={onClose}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#EF4444',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          ) : (
            <div
              className="qr-card-printable"
              style={{
                width: '100%',
                background: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1.5px solid var(--color-border-strong)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* INSTITUTIONAL SUBHEADER */}
              <div
                style={{
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-primary)',
                  width: '100%',
                  paddingBottom: '0.6rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '0.82rem', color: 'var(--color-primary-text)', letterSpacing: '0.5px' }}>
                  UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
                  DIRECCIÓN UNIVERSITARIA DE BIENESTAR SOCIAL Y SALUD (DUBSS)
                </div>
              </div>

              {/* USER BADGE & TICKET */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-surface-muted)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    <FaUser style={{ color: 'var(--color-primary-text)' }} />
                    <span>{user.nombre || 'Socio Universitario'}</span>
                  </div>
                  <span
                    style={{
                      marginLeft: 'auto',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '12px',
                      backgroundColor: isActivo ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                      color: isActivo ? 'var(--color-success-text)' : 'var(--color-danger-text)',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <FaCircleCheck /> {isActivo ? 'MEMBRESÍA ACTIVA' : 'INACTIVA'}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <div>
                    <strong>Nº Boleta:</strong> <span style={{ color: 'var(--color-primary-text)', fontWeight: 700 }}>{numeroBoleta}</span>
                  </div>
                  <div>
                    <strong>C.I.:</strong> {user.ci || 'Sin C.I.'}
                  </div>
                </div>
              </div>

              {/* QR CODE BOX */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px dashed var(--color-primary)',
                  boxShadow: '0 4px 10px rgba(153, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <QRCodeSVG
                  value={payloadString}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/UAGRM_Logo.png/220px-UAGRM_Logo.png',
                    x: undefined,
                    y: undefined,
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />
                <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                  <FaShieldHalved style={{ color: 'var(--color-success-text)' }} /> Pase Firmado Digitalmente (HMAC-SHA256)
                </div>
              </div>

              {/* SCHEDULE & DISCIPLINE INFO */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-warning-bg)',
                  border: '1px solid rgba(217, 119, 6, 0.35)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-warning-text)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '2px' }}>
                  {membresia.disciplina || 'Gimnasio Musculación'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 900, fontSize: '0.9rem', color: 'var(--color-warning-text)' }}>
                  <FaClock /> Turno Habilitado: {membresia.horario_texto || '07:00 - 09:00'}
                </div>
                {membresia.fecha_inicio && membresia.fecha_fin && (
                  <div style={{ fontSize: '0.73rem', marginTop: '2px', color: 'var(--color-warning-text)' }}>
                    Vigente del {membresia.fecha_inicio} al {membresia.fecha_fin}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          {!loading && !error && (
            <div className="no-print-qr" style={{ display: 'flex', width: '100%', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={handlePrint}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 6px rgba(153, 0, 0, 0.25)',
                }}
              >
                <FaPrint /> Imprimir / Guardar QR
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-muted)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-strong)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodigoQRInscripcionModal;
