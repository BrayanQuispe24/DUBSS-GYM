// src/features/accesos/components/EscanerQRModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { FaXmark, FaQrcode, FaCircleCheck, FaCircleXmark, FaUserCheck, FaCamera, FaKeyboard, FaRotateRight, FaRightToBracket, FaRightFromBracket, FaRepeat, FaHourglassHalf } from 'react-icons/fa6';
import { Html5Qrcode } from 'html5-qrcode';
import { validarQRAcceso } from '@/features/tramites/services/tramiteService';

interface EscanerQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EscanerQRModal: React.FC<EscanerQRModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [scanMode, setScanMode] = useState<'auto' | 'entrada' | 'salida'>('auto');
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<'idle' | 'success' | 'denied'>('idle');
  const [resultData, setResultData] = useState<any | null>(null);

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

  // Function to process payload validation
  const processValidation = async (payload: string) => {
    setLoading(true);
    setResultStatus('idle');
    setResultData(null);

    try {
      console.log('----------------------------------------------------');
      console.log(`ENVIANDO QR PAYLOAD (MODO: ${scanMode.toUpperCase()}) AL BACKEND:`);
      console.log(payload);
      console.log('----------------------------------------------------');

      const response = await validarQRAcceso(payload, scanMode);

      console.log('RESPUESTA DE VALIDACIÓN DEL BACKEND:', response);
      console.log('----------------------------------------------------');

      if (response?.permitido) {
        setResultStatus('success');
        setResultData(response);
      } else {
        setResultStatus('denied');
        setResultData(response);
      }
    } catch (err: any) {
      console.error('ERROR O RESPUESTA DE RECHAZO DEL BACKEND:', err?.response?.data || err);
      const errorData = err?.response?.data || {};
      setResultStatus('denied');
      setResultData({
        permitido: false,
        motivo: errorData.motivo || 'ERROR_SERVIDOR',
        mensaje: errorData.mensaje || 'Error al procesar la validación del pase QR en el servidor.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (html5QrcodeRef.current) {
        try {
          await html5QrcodeRef.current.stop();
        } catch (_) {}
      }

      const scanner = new Html5Qrcode('reader-canvas');
      html5QrcodeRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        async (decodedText) => {
          // Pause camera on successful scan
          try {
            await scanner.pause(true);
          } catch (_) {}

          setIsCameraActive(false);
          await processValidation(decodedText);
        },
        () => {
          // Ignore transient scan errors
        }
      );

      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Error al iniciar cámara web:', err);
      setIsCameraActive(false);
      setCameraError(
        'No se pudo acceder a la cámara web. Asegúrate de otorgar permisos de cámara al navegador o verifica que el equipo tenga una cámara conectada.'
      );
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
        }
      } catch (err) {
        console.error('Error al detener cámara:', err);
      } finally {
        html5QrcodeRef.current = null;
        setIsCameraActive(false);
      }
    }
  };

  // Effect to manage camera lifecycle
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      const timer = setTimeout(() => {
        startCamera();
      }, 300);

      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    processValidation(qrInput.trim());
  };

  const handleResetScan = () => {
    setQrInput('');
    setResultStatus('idle');
    setResultData(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const handleCloseModal = () => {
    stopCamera();
    onClose();
  };

  const isSalidaResult = resultData?.tipo_marcacion === 'salida' || resultData?.motivo === 'SALIDA_REGISTRADA';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid #CBD5E1',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
        }}
      >
        {/* HEADER BAR */}
        <div
          style={{
            background: 'linear-gradient(135deg, #003B70 0%, #002347 100%)',
            color: '#FFFFFF',
            padding: '1.1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: '#60A5FA',
              }}
            >
              <FaQrcode />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Validador de Ingreso & Salida QR</h3>
              <div style={{ fontSize: '0.78rem', color: '#93C5FD' }}>
                Recepción & Control de Accesos DUBSS UAGRM
              </div>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
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

        {/* MODE SELECTOR BAR (AUTO vs ENTRADA vs SALIDA) */}
        <div style={{ backgroundColor: '#F1F5F9', padding: '0.65rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Modo de Marcación:</span>
          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#E2E8F0', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setScanMode('auto')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: scanMode === 'auto' ? '#003B70' : 'transparent',
                color: scanMode === 'auto' ? '#FFFFFF' : '#475569',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="Detecta automáticamente si es Entrada o Salida según el estado actual del socio"
            >
              <FaRepeat /> Auto (Entrada/Salida)
            </button>

            <button
              type="button"
              onClick={() => setScanMode('entrada')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: scanMode === 'entrada' ? '#166534' : 'transparent',
                color: scanMode === 'entrada' ? '#FFFFFF' : '#475569',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="Forzar marcación de Entrada"
            >
              <FaRightToBracket /> Entrada
            </button>

            <button
              type="button"
              onClick={() => setScanMode('salida')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: scanMode === 'salida' ? '#0369A1' : 'transparent',
                color: scanMode === 'salida' ? '#FFFFFF' : '#475569',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="Forzar marcación de Salida"
            >
              <FaRightFromBracket /> Salida
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <button
            onClick={() => {
              setActiveTab('camera');
              setResultStatus('idle');
            }}
            style={{
              flex: 1,
              padding: '0.7rem',
              border: 'none',
              background: activeTab === 'camera' ? '#FFFFFF' : 'transparent',
              borderBottom: activeTab === 'camera' ? '3px solid #003B70' : 'none',
              color: activeTab === 'camera' ? '#003B70' : '#64748B',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <FaCamera /> Cámara Web en Vivo
          </button>

          <button
            onClick={() => {
              setActiveTab('manual');
              stopCamera();
              setResultStatus('idle');
            }}
            style={{
              flex: 1,
              padding: '0.7rem',
              border: 'none',
              background: activeTab === 'manual' ? '#FFFFFF' : 'transparent',
              borderBottom: activeTab === 'manual' ? '3px solid #003B70' : 'none',
              color: activeTab === 'manual' ? '#003B70' : '#64748B',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <FaKeyboard /> Lector USB / Pegar JSON
          </button>
        </div>

        {/* BODY CONTENT */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* ALERT RESULT BANNERS */}
          {resultStatus === 'success' && !isSalidaResult && (
            <div
              style={{
                backgroundColor: '#DCFCE7',
                border: '2px solid #16A34A',
                borderRadius: '12px',
                padding: '1.25rem',
                color: '#14532D',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <FaCircleCheck style={{ fontSize: '2rem', color: '#16A34A', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#15803D' }}>
                    ¡ENTRADA PERMITIDA!
                  </h4>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                    {resultData?.mensaje || 'Acceso registrado correctamente.'}
                  </div>
                </div>
              </div>

              {resultData?.data && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.85rem',
                    border: '1px solid #BBF7D0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaUserCheck style={{ color: '#16A34A' }} /> {resultData.data.socio}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', color: '#334155', fontSize: '0.8rem' }}>
                    <div><strong>C.I.:</strong> {resultData.data.ci}</div>
                    <div><strong>Nº Boleta:</strong> <span style={{ color: '#003B70', fontWeight: 800 }}>{resultData.data.numero_boleta}</span></div>
                    <div><strong>Disciplina:</strong> {resultData.data.disciplina}</div>
                    <div><strong>Turno:</strong> <span style={{ fontWeight: 800, color: '#B45309' }}>{resultData.data.horario}</span></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700, marginTop: '2px' }}>
                    Hora de marcado: {resultData.data.fecha_hora_ingreso}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EXIT RESULT BANNER (SALIDA REGISTRADA) */}
          {resultStatus === 'success' && isSalidaResult && (
            <div
              style={{
                backgroundColor: '#E0F2FE',
                border: '2px solid #0284C7',
                borderRadius: '12px',
                padding: '1.25rem',
                color: '#075985',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <FaRightFromBracket style={{ fontSize: '2rem', color: '#0284C7', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0369A1' }}>
                    ¡SALIDA REGISTRADA!
                  </h4>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#075985' }}>
                    {resultData?.mensaje || 'Gracias por su visita al Gimnasio UAGRM DUBSS.'}
                  </div>
                </div>
              </div>

              {resultData?.data && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.85rem',
                    border: '1px solid #BAE6FD',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaUserCheck style={{ color: '#0284C7' }} /> {resultData.data.socio}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', color: '#334155', fontSize: '0.8rem' }}>
                    <div><strong>C.I.:</strong> {resultData.data.ci}</div>
                    <div><strong>Nº Boleta:</strong> <span style={{ color: '#003B70', fontWeight: 800 }}>{resultData.data.numero_boleta}</span></div>
                    <div><strong>Disciplina:</strong> {resultData.data.disciplina}</div>
                    <div style={{ color: '#0369A1', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FaHourglassHalf /> Permanencia: {resultData.data.duracion || resultData.duracion || '1h'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#0369A1', fontWeight: 700, marginTop: '2px' }}>
                    Hora de salida: {resultData.data.fecha_hora_salida}
                  </div>
                </div>
              )}
            </div>
          )}

          {resultStatus === 'denied' && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                border: '2px solid #DC2626',
                borderRadius: '12px',
                padding: '1.25rem',
                color: '#7F1D1D',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaCircleXmark style={{ fontSize: '2.2rem', color: '#DC2626', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#B91C1C' }}>
                    ¡ACCESO DENEGADO!
                  </h4>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#991B1B', marginTop: '2px' }}>
                    {resultData?.mensaje || 'El pase QR no cumple con los requisitos de ingreso.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: LIVE CAMERA STREAM */}
          {activeTab === 'camera' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '100%',
                  minHeight: '260px',
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #3B82F6',
                }}
              >
                <div id="reader-canvas" style={{ width: '100%' }} />

                {loading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(15, 23, 42, 0.85)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                    }}
                  >
                    Validando Código QR...
                  </div>
                )}
              </div>

              {cameraError && (
                <div style={{ fontSize: '0.8rem', color: '#B91C1C', backgroundColor: '#FEE2E2', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', width: '100%' }}>
                  {cameraError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                {resultStatus !== 'idle' ? (
                  <button
                    onClick={handleResetScan}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#059669',
                      color: '#FFF',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <FaRotateRight /> Escanear Siguiente Socio
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#003B70',
                      color: '#FFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <FaRotateRight /> Reiniciar Cámara
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL TEXTAREA / USB SCANNER */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Ingresar o Pegar Payload JSON del QR:
              </label>

              <textarea
                rows={4}
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder='Escanee con la pistola lectora USB de barras/QR o pegue el contenido JSON del código QR aquí...'
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  resize: 'none',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                }}
                autoFocus
              />

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={loading || !qrInput.trim()}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#003B70',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: loading || !qrInput.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: loading || !qrInput.trim() ? 0.7 : 1,
                    boxShadow: '0 4px 6px -1px rgba(0, 59, 112, 0.3)',
                  }}
                >
                  {loading ? 'Validando Pase...' : 'Validar e Ingresar'}
                </button>

                {resultStatus !== 'idle' && (
                  <button
                    type="button"
                    onClick={handleResetScan}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '8px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      border: '1px solid #CBD5E1',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Siguiente Escaneo
                  </button>
                )}
              </div>
            </form>
          )}

          {/* INSTRUCTIONS FOOTER */}
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748B',
              backgroundColor: '#F1F5F9',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              lineHeight: '1.4',
            }}
          >
            <strong>Guía de Marcaciones (Entrada & Salida):</strong>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem' }}>
              <li><strong>Modo Auto:</strong> Registra ENTRADA la primera vez y SALIDA (con cálculo de tiempo) al volver a escanear.</li>
              <li>Al registrar la SALIDA, el sistema no restringe por horario para permitir el retiro limpio de socios.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscanerQRModal;
