import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, Info, X } from 'lucide-react';
import { useAnalizarFotografias, useHistorialAnalisisCorporales } from '../hooks/useEntrenamiento';
import type { AnalisisCorporal } from '../services/entrenamientoService';

interface AnalisisCorporalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnalisis?: (analisis: AnalisisCorporal) => void;
}

export const AnalisisCorporalModal: React.FC<AnalisisCorporalModalProps> = ({
  isOpen,
  onClose,
  onSelectAnalisis,
}) => {
  const [fotoFrontal, setFotoFrontal] = useState<File | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoEspalda, setFotoEspalda] = useState<File | null>(null);

  const [previewFrontal, setPreviewFrontal] = useState<string | null>(null);
  const [previewPerfil, setPreviewPerfil] = useState<string | null>(null);
  const [previewEspalda, setPreviewEspalda] = useState<string | null>(null);

  const [resultadoActual, setResultadoActual] = useState<AnalisisCorporal | null>(null);

  const analizarMutation = useAnalizarFotografias();
  const { data: historialAnalisis, isLoading: loadingHistorial } = useHistorialAnalisisCorporales();

  if (!isOpen) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoFrontal || !fotoPerfil || !fotoEspalda) return;

    const formData = new FormData();
    formData.append('foto_frontal', fotoFrontal);
    formData.append('foto_perfil', fotoPerfil);
    formData.append('foto_espalda', fotoEspalda);

    const res = await analizarMutation.mutateAsync(formData);
    setResultadoActual(res);
    if (onSelectAnalisis) onSelectAnalisis(res);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.6rem',
                backgroundColor: '#E0F2FE',
                color: '#0369A1',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Análisis Corporal con MediaPipe Pose
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                Inspección postural estática mediante 3 fotografías
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: '1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            flex: 1,
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Warning Banner */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              fontSize: '0.82rem',
              color: '#92400E',
              lineHeight: '1.5',
            }}
          >
            <Info size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontWeight: 700, color: '#78350F' }}>Aviso técnico y de privacidad:</strong> MediaPipe analiza únicamente la alineación geométrica de los puntos anatómicos clave. No estima porcentaje de grasa, peso corporal ni emite diagnósticos médicos.
            </div>
          </div>

          <form onSubmit={handleAnalizar} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              {/* 1. Vista Frontal */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  1. Vista Frontal
                </span>
                <label
                  style={{
                    width: '100%',
                    height: '210px',
                    border: '2px dashed #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {previewFrontal ? (
                    <img src={previewFrontal} alt="Frontal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                      <Upload size={32} style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0284C7' }}>Subir foto de frente</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFotoFrontal, setPreviewFrontal)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* 2. Vista Perfil */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  2. Vista Perfil (Lateral)
                </span>
                <label
                  style={{
                    width: '100%',
                    height: '210px',
                    border: '2px dashed #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {previewPerfil ? (
                    <img src={previewPerfil} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                      <Upload size={32} style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0284C7' }}>Subir foto de perfil</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFotoPerfil, setPreviewPerfil)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* 3. Vista Espalda */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  3. Vista Posterior (Espalda)
                </span>
                <label
                  style={{
                    width: '100%',
                    height: '210px',
                    border: '2px dashed #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {previewEspalda ? (
                    <img src={previewEspalda} alt="Espalda" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                      <Upload size={32} style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0284C7' }}>Subir foto de espalda</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFotoEspalda, setPreviewEspalda)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Submit Button Row */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <button
                type="submit"
                disabled={!fotoFrontal || !fotoPerfil || !fotoEspalda || analizarMutation.isPending}
                style={{
                  padding: '0.75rem 1.75rem',
                  backgroundColor: !fotoFrontal || !fotoPerfil || !fotoEspalda || analizarMutation.isPending ? '#94A3B8' : '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: !fotoFrontal || !fotoPerfil || !fotoEspalda || analizarMutation.isPending ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {analizarMutation.isPending ? 'Procesando con MediaPipe...' : 'Procesar Análisis Postural'}
              </button>
            </div>
          </form>

          {/* Resultado Actual */}
          {resultadoActual && (
            <div
              style={{
                border: '1px solid #BAE6FD',
                backgroundColor: '#F0F9FF',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0369A1', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <CheckCircle2 size={20} style={{ color: '#059669' }} />
                  Resultados del Análisis Geométrico
                </h3>
                <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                  Calidad: {resultadoActual.calidad_analisis}
                </span>
              </div>

              {resultadoActual.metricas_calculadas && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                  <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>Inclinación Hombros:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
                      {resultadoActual.metricas_calculadas.inclinacion_hombros_grados ?? 0}°
                    </span>
                  </div>
                  <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>Inclinación Cadera:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
                      {resultadoActual.metricas_calculadas.inclinacion_cadera_grados ?? 0}°
                    </span>
                  </div>
                  <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>Alineación Sagital:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
                      {resultadoActual.metricas_calculadas.alineacion_sagital_oreja_hombro_cadera ?? 0}°
                    </span>
                  </div>
                  <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>Simetría Espalda:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>
                      {resultadoActual.metricas_calculadas.simetria_espalda_score ?? 100} pts
                    </span>
                  </div>
                </div>
              )}

              {resultadoActual.observaciones && (
                <p style={{ fontSize: '0.8rem', color: '#334155', backgroundColor: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0', margin: 0, lineHeight: '1.5' }}>
                  {resultadoActual.observaciones}
                </p>
              )}
            </div>
          )}

          {/* Historial previo */}
          {!loadingHistorial && historialAnalisis && historialAnalisis.length > 0 && (
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Análisis Anteriores
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', maxHeight: '140px', overflowY: 'auto' }}>
                {historialAnalisis.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setResultadoActual(item);
                      if (onSelectAnalisis) onSelectAnalisis(item);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: resultadoActual?.id === item.id ? '2px solid #0284C7' : '1px solid #E2E8F0',
                      backgroundColor: resultadoActual?.id === item.id ? '#F0F9FF' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>
                      {new Date(item.fecha_analisis).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span style={{ fontWeight: 600, color: '#0369A1', backgroundColor: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.72rem' }}>
                      {item.calidad_analisis}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
