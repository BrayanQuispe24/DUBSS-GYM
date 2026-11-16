// src/features/accesos/components/EscanerQRModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FaXmark, FaQrcode, FaCircleCheck, FaCircleXmark, FaUserCheck, FaCamera, FaKeyboard, FaRotateRight, FaRightToBracket, FaRightFromBracket, FaRepeat, FaHourglassHalf } from 'react-icons/fa6';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { validarQRAcceso } from '@/features/tramites/services/tramiteService';

interface EscanerQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EscanerQRModal: React.FC<EscanerQRModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [scanMode, setScanMode] = useState<'auto' | 'entrada' | 'salida'>('auto');
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<'idle' | 'success' | 'denied'>('idle');
  const [resultData, setResultData] = useState<any | null>(null);

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);
  const isModalActiveRef = useRef(false);

  // Stop Camera safely even if start() was in flight
  const stopCamera = async (instance?: Html5Qrcode | null) => {
    const target = instance || html5QrcodeRef.current;
    if (target) {
      try {
        if (target.isScanning) {
          await target.stop();
        }
      } catch (err) {
        console.error('Error al detener cámara:', err);
      }
      try {
        target.clear();
      } catch (_) {}
    }
    if (!instance || instance === html5QrcodeRef.current) {
      html5QrcodeRef.current = null;
      setIsCameraActive(false);
    }
  };

  // Function to process payload validation
  const processValidation = async (payload: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setLoading(true);
    setResultStatus('idle');
    setResultData(null);

    try {
      const response = await validarQRAcceso(payload, scanMode);

      if (!isModalActiveRef.current) return;

      if (response?.permitido) {
        setResultStatus('success');
        setResultData(response);
        queryClient.invalidateQueries({ queryKey: ['registro-accesos'] });
        queryClient.invalidateQueries({ queryKey: ['bi', 'aforo-tiempo-real'] });
      } else {
        setResultStatus('denied');
        setResultData(response);
      }
    } catch (err: any) {
      if (!isModalActiveRef.current) return;
      const errorData = err?.response?.data || {};
      setResultStatus('denied');
      setResultData({
        permitido: false,
        motivo: errorData.motivo || 'ERROR_SERVIDOR',
        mensaje: errorData.mensaje || 'Error al procesar la validación del pase QR en el servidor.',
      });
    } finally {
      if (isModalActiveRef.current) {
        setLoading(false);
      }
      isProcessingRef.current = false;
    }
  };

  // Start Camera
  const startCamera = async (overrideCameraId?: string) => {
    if (!isModalActiveRef.current) return;
    setCameraError(null);
    isProcessingRef.current = false;

    try {
      await stopCamera();

      if (!isModalActiveRef.current) return;

      const scanner = new Html5Qrcode('reader-canvas', {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        useBarCodeDetectorIfSupported: true,
        verbose: false,
      });
      html5QrcodeRef.current = scanner;

      let cameraSource: string | { facingMode: string } = { facingMode: 'environment' };
      try {
        const availableCameras = await Html5Qrcode.getCameras();
        if (!isModalActiveRef.current) {
          await stopCamera(scanner);
          return;
        }
        if (availableCameras && availableCameras.length > 0) {
          setCameras(availableCameras);

          const targetId = overrideCameraId || selectedCameraId;
          const chosenCam = availableCameras.find((c) => c.id === targetId);

          if (chosenCam) {
            cameraSource = chosenCam.id;
          } else {
            // Filtrar para dar prioridad a cámaras físicas sobre cámaras virtuales (como OBS Virtual Camera)
            const physicalCams = availableCameras.filter((c) => !/obs|virtual|fake/i.test(c.label));
            const candidateList = physicalCams.length > 0 ? physicalCams : availableCameras;
            const backCamera = candidateList.find((c) => /back|rear|environment|trasera/i.test(c.label));
            const defaultCam = backCamera || candidateList[0];
            cameraSource = defaultCam.id;
            setSelectedCameraId(defaultCam.id);
          }
        }
      } catch (_) {}

      if (!isModalActiveRef.current) {
        await stopCamera(scanner);
        return;
      }

      await scanner.start(
        cameraSource,
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
        },
        async (decodedText) => {
          if (isProcessingRef.current || !isModalActiveRef.current) return;
          await stopCamera(scanner);
          await processValidation(decodedText);
        },
        () => {
          // Ignore transient scan errors
        }
      );

      if (!isModalActiveRef.current || html5QrcodeRef.current !== scanner) {
        await stopCamera(scanner);
        return;
      }

      setIsCameraActive(true);
    } catch (err: any) {
      if (!isModalActiveRef.current) return;
      console.error('Error al iniciar cámara web:', err);
      setIsCameraActive(false);
      setCameraError(
        'No se pudo acceder a la cámara web. Asegúrate de otorgar permisos de cámara al navegador o verifica que el equipo tenga una cámara conectada.'
      );
    }
  };

  // Effect to manage camera lifecycle
  useEffect(() => {
    isModalActiveRef.current = isOpen;

    if (isOpen && activeTab === 'camera') {
      const timer = setTimeout(() => {
        startCamera();
      }, 300);

      return () => {
        isModalActiveRef.current = false;
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }

    return () => {
      if (!isOpen) {
        isModalActiveRef.current = false;
      }
    };
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
    isModalActiveRef.current = false;
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--color-border-strong)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
        }}
      >
        {/* HEADER BAR */}
        <div
          style={{
            background: 'linear-gradient(135deg, #990000 0%, #570000 100%)',
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
                color: '#FCA5A5',
              }}
            >
              <FaQrcode />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Validador de Ingreso & Salida QR</h3>
              <div style={{ fontSize: '0.78rem', color: '#FCA5A5' }}>
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
        <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Modo de Marcación:</span>
          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--color-surface-hover)', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setScanMode('auto')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: scanMode === 'auto' ? 'var(--color-primary)' : 'transparent',
                color: scanMode === 'auto' ? '#FFFFFF' : 'var(--color-text-secondary)',
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
                color: scanMode === 'entrada' ? '#FFFFFF' : 'var(--color-text-secondary)',
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
                background: scanMode === 'salida' ? 'var(--color-primary)' : 'transparent',
                color: scanMode === 'salida' ? '#FFFFFF' : 'var(--color-text-secondary)',
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
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-muted)' }}>
          <button
            onClick={() => {
              setActiveTab('camera');
              setResultStatus('idle');
            }}
            style={{
              flex: 1,
              padding: '0.7rem',
              border: 'none',
              background: activeTab === 'camera' ? 'var(--color-surface)' : 'transparent',
              borderBottom: activeTab === 'camera' ? '3px solid var(--color-primary)' : 'none',
              color: activeTab === 'camera' ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
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
              background: activeTab === 'manual' ? 'var(--color-surface)' : 'transparent',
              borderBottom: activeTab === 'manual' ? '3px solid var(--color-primary)' : 'none',
              color: activeTab === 'manual' ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
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
                backgroundColor: 'var(--color-success-bg)',
                border: '2px solid #16A34A',
                borderRadius: '12px',
                padding: '1.25rem',
                color: '#14532D',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <FaCircleCheck style={{ fontSize: '2rem', color: '#16A34A', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-success-text)' }}>
                    ¡ENTRADA PERMITIDA!
                  </h4>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-success-text)' }}>
                    {resultData?.mensaje || 'Acceso registrado correctamente.'}
                  </div>
                </div>
              </div>

              {resultData?.data && (
                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.85rem',
                    border: '1px solid #BBF7D0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ fontWeight: 800, color: 'var(--color-text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaUserCheck style={{ color: '#16A34A' }} /> {resultData.data.socio}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    <div><strong>C.I.:</strong> {resultData.data.ci}</div>
                    <div><strong>Nº Boleta:</strong> <span style={{ color: 'var(--color-primary-text)', fontWeight: 800 }}>{resultData.data.numero_boleta}</span></div>
                    <div><strong>Disciplina:</strong> {resultData.data.disciplina}</div>
                    <div><strong>Turno:</strong> <span style={{ fontWeight: 800, color: 'var(--color-warning-text)' }}>{resultData.data.horario}</span></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-success-text)', fontWeight: 700, marginTop: '2px' }}>
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
                backgroundColor: 'var(--color-primary-soft)',
                border: '2px solid var(--color-primary)',
                borderRadius: '12px',
                padding: '1.25rem',
                color: '#075985',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <FaRightFromBracket style={{ fontSize: '2rem', color: 'var(--color-primary-text)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-primary-text)' }}>
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
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(220, 38, 38, 0.30)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ fontWeight: 800, color: 'var(--color-text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaUserCheck style={{ color: 'var(--color-primary-text)' }} /> {resultData.data.socio}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    <div><strong>C.I.:</strong> {resultData.data.ci}</div>
                    <div><strong>Nº Boleta:</strong> <span style={{ color: 'var(--color-primary-text)', fontWeight: 800 }}>{resultData.data.numero_boleta}</span></div>
                    <div><strong>Disciplina:</strong> {resultData.data.disciplina}</div>
                    <div style={{ color: 'var(--color-primary-text)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FaHourglassHalf /> Permanencia: {resultData.data.duracion || resultData.duracion || '1h'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-text)', fontWeight: 700, marginTop: '2px' }}>
                    Hora de salida: {resultData.data.fecha_hora_salida}
                  </div>
                </div>
              )}
            </div>
          )}

          {resultStatus === 'denied' && (
            <div
              style={{
                backgroundColor: 'var(--color-danger-bg)',
                border: '2px solid #DC2626',
                borderRadius: '12px',
                padding: '1.25rem',
                color: 'var(--color-danger-text)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaCircleXmark style={{ fontSize: '2.2rem', color: 'var(--color-danger-text)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-danger-text)' }}>
                    ¡ACCESO DENEGADO!
                  </h4>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-danger-text)', marginTop: '2px' }}>
                    {resultData?.mensaje || 'El pase QR no cumple con los requisitos de ingreso.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: LIVE CAMERA STREAM */}
          {activeTab === 'camera' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
              {cameras.length > 1 && (
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-0.25rem' }}>
                  <FaCamera style={{ color: '#3B82F6', fontSize: '0.9rem', flexShrink: 0 }} />
                  <select
                    value={selectedCameraId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedCameraId(newId);
                      startCamera(newId);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#1f1f28',
                      color: '#FFF',
                      border: '1px solid #333344',
                      borderRadius: '4px',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.82rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {cameras.map((c, idx) => (
                      <option key={c.id} value={c.id}>
                        {c.label || `Cámara ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div
                style={{
                  width: '100%',
                  minHeight: '260px',
                  backgroundColor: '#141419',
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
                      background: 'rgba(0, 0, 0, 0.85)',
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
                <div style={{ fontSize: '0.8rem', color: 'var(--color-danger-text)', backgroundColor: 'var(--color-danger-bg)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', width: '100%' }}>
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
                    onClick={() => startCamera(selectedCameraId)}
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
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
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
                  border: '1.5px solid var(--color-border-strong)',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  resize: 'none',
                  backgroundColor: 'var(--color-surface-muted)',
                  color: 'var(--color-text-primary)',
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
                    backgroundColor: 'var(--color-primary)',
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
                    boxShadow: '0 4px 6px -1px rgba(153, 0, 0, 0.3)',
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
                      backgroundColor: 'var(--color-surface-muted)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border-strong)',
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
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-surface-muted)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
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
