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
        backdropFilter: 'blur(3px)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          border: '1px solid #CBD5E1',
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header Enterprise */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                padding: '0.45rem',
                backgroundColor: '#E0F2FE',
                color: '#0077D4',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0B1727', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Evaluación Postural con MediaPipe Pose
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
                Inspección biométrica y alineación anatómica a partir de 3 capturas fotográficas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            flex: 1,
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Warning Banner */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              fontSize: '0.78rem',
              color: '#92400E',
              lineHeight: '1.4',
            }}
          >
            <Info size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontWeight: 700, color: '#78350F' }}>Aviso técnico y de privacidad:</strong> MediaPipe evalúa únicamente la alineación geométrica de puntos óseos y articulares. No calcula porcentaje graso, peso ni constituye diagnóstico médico clínico.
            </div>
          </div>

          <form onSubmit={handleAnalizar} id="form-analisis-corporal" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* 1. Vista Frontal */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '4px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  1. Vista Frontal
                </span>
                <label
                  style={{
                    width: '100%',
                    height: '190px',
                    border: '1px dashed #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  {previewFrontal ? (
                    <img src={previewFrontal} alt="Frontal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '1rem' }}>
                      <Upload size={26} style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0077D4' }}>Cargar captura frontal</span>
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
                  borderRadius: '4px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  2. Vista Perfil (Sagital)
                </span>
                <label
                  style={{
                    width: '100%',
                    height: '190px',
                    border: '1px dashed #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  {previewPerfil ? (
                    <img src={previewPerfil} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '1rem' }}>
                      <Upload size={26} style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0077D4' }}>Cargar captura de perfil</span>
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
                  borderRadius: '4px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  3. Vista Posterior (Dorsal)
                </span>
                <label
                  style={{
                    width: '100%',
                    height: '190px',
                    border: '1px dashed #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  {previewEspalda ? (
                    <img src={previewEspalda} alt="Espalda" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '1rem' }}>
                      <Upload size={26} style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0077D4' }}>Cargar captura posterior</span>
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
          </form>

          {/* Resultado Actual */}
          {resultadoActual && (
            <div
              style={{
                border: '1px solid #BAE6FD',
                backgroundColor: '#F4F9FF',
                borderRadius: '4px',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#003B70', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  <CheckCircle2 size={18} style={{ color: '#059669' }} />
                  Resultados del Análisis Geométrico
                </h3>
                <span style={{ padding: '0.2rem 0.6rem', backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0', borderRadius: '2px', fontSize: '0.72rem', fontWeight: 700 }}>
                  Calidad: {resultadoActual.calidad_analisis}
                </span>
              </div>

              {resultadoActual.metricas_calculadas && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Inclinación Hombros</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      {resultadoActual.metricas_calculadas.inclinacion_hombros_grados ?? 0}°
                    </span>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Inclinación Cadera</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      {resultadoActual.metricas_calculadas.inclinacion_cadera_grados ?? 0}°
                    </span>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Alineación Sagital</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      {resultadoActual.metricas_calculadas.alineacion_sagital_oreja_hombro_cadera ?? 0}°
                    </span>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Simetría Escapular</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0077D4' }}>
                      {resultadoActual.metricas_calculadas.simetria_espalda_score ?? 100} pts
                    </span>
                  </div>
                </div>
              )}

              {resultadoActual.observaciones && (
                <p style={{ fontSize: '0.78rem', color: '#334155', backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '4px', border: '1px solid #E2E8F0', margin: 0, lineHeight: '1.4' }}>
                  {resultadoActual.observaciones}
                </p>
              )}
            </div>
          )}

          {/* Historial previo */}
          {!loadingHistorial && historialAnalisis && historialAnalisis.length > 0 && (
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Historial de Evaluaciones Posturales
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', maxHeight: '140px', overflowY: 'auto' }}>
                {historialAnalisis.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setResultadoActual(item);
                      if (onSelectAnalisis) onSelectAnalisis(item);
                    }}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '4px',
                      border: resultadoActual?.id === item.id ? '1px solid #0077D4' : '1px solid #CBD5E1',
                      backgroundColor: resultadoActual?.id === item.id ? '#E0F2FE' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.78rem',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>
                      {new Date(item.fecha_analisis).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span style={{ fontWeight: 700, color: '#0077D4', backgroundColor: '#FFFFFF', padding: '0.15rem 0.45rem', borderRadius: '2px', border: '1px solid #CBD5E1', fontSize: '0.70rem' }}>
                      {item.calidad_analisis}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Enterprise Actions */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '0.80rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
          <button
            type="submit"
            form="form-analisis-corporal"
            disabled={!fotoFrontal || !fotoPerfil || !fotoEspalda || analizarMutation.isPending}
            style={{
              padding: '0.45rem 1.25rem',
              backgroundColor: !fotoFrontal || !fotoPerfil || !fotoEspalda || analizarMutation.isPending ? '#94A3B8' : '#0077D4',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.80rem',
              cursor: !fotoFrontal || !fotoPerfil || !fotoEspalda || analizarMutation.isPending ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.15s ease',
            }}
          >
            {analizarMutation.isPending ? 'Procesando con MediaPipe...' : 'Procesar Análisis Postural'}
          </button>
        </div>
      </div>
    </div>
  );
};

