// src/features/users/pages/UserDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaUser,
  FaFileMedical,
  FaHeartPulse,
  FaFolderOpen,
  FaCircleCheck,
  FaBan,
  FaShieldHalved,
  FaIdCard,
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaCalendarDays,
  FaPrint,
  FaEye,
  FaDownload,
  FaSpinner,
  FaCircleExclamation,
  FaFilePdf,
  FaImage,
} from 'react-icons/fa6';
import { useUserDetail } from '../hooks/useUsers';
import { resolveDocumentFileUrl, type Documento } from '@/features/documentos/services/documentoService';
import type { Historial, DetalleHistorial, Antecedente } from '@/features/historial/services/historialService';
import HistorialPhysicalViewModal from '@/features/historial/components/HistorialPhysicalViewModal';
import DocumentoPreviewModal from '@/features/documentos/components/DocumentoPreviewModal';

type TabType = 'perfil' | 'historial' | 'antecedentes' | 'documentos';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('perfil');
  const [selectedHistorial, setSelectedHistorial] = useState<Historial | null>(null);
  const [isPhysicalModalOpen, setIsPhysicalModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { data: user, isLoading, isError, error } = useUserDetail(userId);

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>
        <FaSpinner className="animate-spin" style={{ fontSize: '2.5rem', color: '#003B70', marginBottom: '1rem' }} />
        <p style={{ fontWeight: 600 }}>Cargando expediente completo del usuario...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <FaCircleExclamation style={{ fontSize: '3rem', color: '#DC2626', marginBottom: '1rem' }} />
        <h3 style={{ color: '#0B1727', fontWeight: 800 }}>No se pudo cargar la información del socio</h3>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {(error as Error)?.message || 'Ocurrió un error al consultar la API de usuarios.'}
        </p>
        <button
          onClick={() => navigate('/dashboard/usuarios')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: '#003B70',
            color: '#FFF',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Volver a Usuarios
        </button>
      </div>
    );
  }

  const isSuspended = user.estado === 'suspendido';
  const historiales: Historial[] = user.historiales || [];
  const documentos: Documento[] = user.documentos || [];

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadgeStyle = (rol: string) => {
    switch (rol) {
      case 'administrador':
        return { bg: '#FEE2E2', color: '#990000', label: 'Administrador' };
      case 'recepcionista':
        return { bg: '#E0F2FE', color: '#003B70', label: 'Recepcionista' };
      case 'instructor':
        return { bg: '#FEF3C7', color: '#D97706', label: 'Instructor' };
      default:
        return { bg: '#DCFCE7', color: '#15803D', label: 'Cliente / Socio' };
    }
  };

  const roleStyle = getRoleBadgeStyle(user.rol);

  const handleOpenPhysicalView = (hist: Historial) => {
    // Si el objeto historial no incluye los datos de usuario completos, asignarle los del usuario cargado
    const histConUsuario = {
      ...hist,
      usuario: {
        id: user.id,
        name: user.name,
        nombre: user.nombre,
        apellido: user.apellido,
        codigo: user.registro_universitario,
        email: user.email,
        registro_universitario: user.registro_universitario,
      },
    };
    setSelectedHistorial(histConUsuario);
    setIsPhysicalModalOpen(true);
  };

  const handleOpenDocPreview = (doc: Documento) => {
    const docConUsuario = {
      ...doc,
      usuario: {
        id: user.id,
        name: user.name,
        nombre: user.nombre,
        apellido: user.apellido,
        codigo: user.registro_universitario,
        registro_universitario: user.registro_universitario,
        email: user.email,
      },
    };
    setSelectedDoc(docConUsuario);
    setIsPreviewModalOpen(true);
  };

  return (
    <section>
      {/* BUTTON VOLVER */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          onClick={() => navigate('/dashboard/usuarios')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            color: '#003B70',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <FaArrowLeft /> Volver a la Lista de Usuarios
        </button>
      </div>

      {/* USER BANNER / HEADER CARD */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: user.rol === 'administrador' ? '#990000' : user.rol === 'recepcionista' ? '#003B70' : '#059669',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              flexShrink: 0,
            }}
          >
            {getInitials(user.name)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
                {user.name}
              </h2>
              <span
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '20px',
                  backgroundColor: roleStyle.bg,
                  color: roleStyle.color,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <FaShieldHalved /> {roleStyle.label}
              </span>
              <span
                className={`badge-status ${isSuspended ? 'suspendido' : 'activo'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {isSuspended ? <FaBan /> : <FaCircleCheck />}
                {isSuspended ? 'Cuenta Suspendida' : 'Socio Activo'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.6rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#64748B' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaEnvelope style={{ color: '#003B70', flexShrink: 0 }} />
                <span>{user.email}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaIdCard style={{ color: '#D97706', flexShrink: 0 }} />
                <span>R.U.: <strong>{user.registro_universitario || 'N/A'}</strong></span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaIdCard style={{ color: '#0284C7', flexShrink: 0 }} />
                <span>CI: <strong>{user.ci || 'Sin CI'}</strong></span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaPhone style={{ color: '#059669', flexShrink: 0 }} />
                <span>{user.telefono || 'Sin celular'}</span>
              </span>
            </div>
          </div>
        </div>

        {historiales.length > 0 && (
          <button
            onClick={() => handleOpenPhysicalView(historiales[0])}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#003B70',
              color: '#FFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 10px rgba(0,59,112,0.2)',
            }}
          >
            <FaPrint /> Ver Ficha Física Impresa
          </button>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '1.5rem',
          backgroundColor: '#FFFFFF',
          padding: '0.5rem 1rem 0 1rem',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <button
          onClick={() => setActiveTab('perfil')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'perfil' ? '3px solid #003B70' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'perfil' ? '#003B70' : '#64748B',
            fontWeight: activeTab === 'perfil' ? 800 : 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaUser /> Datos Personales
        </button>

        <button
          onClick={() => setActiveTab('historial')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'historial' ? '3px solid #003B70' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'historial' ? '#003B70' : '#64748B',
            fontWeight: activeTab === 'historial' ? 800 : 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaFileMedical /> Historial Clínico ({historiales.length})
        </button>

        <button
          onClick={() => setActiveTab('antecedentes')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'antecedentes' ? '3px solid #003B70' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'antecedentes' ? '#003B70' : '#64748B',
            fontWeight: activeTab === 'antecedentes' ? 800 : 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaHeartPulse style={{ color: '#DC2626' }} /> Antecedentes Médicos
        </button>

        <button
          onClick={() => setActiveTab('documentos')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'documentos' ? '3px solid #003B70' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'documentos' ? '#003B70' : '#64748B',
            fontWeight: activeTab === 'documentos' ? 800 : 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaFolderOpen style={{ color: '#0284C7' }} /> Documentos Digitales ({documentos.length})
        </button>
      </div>

      {/* TAB CONTENT: PERFIL */}
      {activeTab === 'perfil' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#003B70', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            Información de Registro & Datos Personales
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>Nombre Completo:</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B1727' }}>{user.name}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>Correo Electrónico Institucional:</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B1727' }}>{user.email}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>Rol en el Sistema:</span>
              <div style={{ textTransform: 'capitalize', fontWeight: 700, color: roleStyle.color }}>{user.rol}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>Tipo de Usuario:</span>
              <div style={{ textTransform: 'capitalize', fontWeight: 700, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaGraduationCap style={{ color: '#003B70' }} /> {user.tipo_usuario || 'Estudiante'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>Registro Universitario (R.U.):</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B1727' }}>{user.registro_universitario || 'N/A'}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>Cédula de Identidad (C.I.):</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B1727' }}>{user.ci || 'Sin C.I.'}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>Teléfono / Celular de Contacto:</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B1727' }}>{user.telefono || 'Sin teléfono'}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>Fecha de Alta en el Sistema:</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaCalendarDays style={{ color: '#D97706' }} />
                {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Registrado'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORIAL CLINICO */}
      {activeTab === 'historial' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#003B70', margin: 0 }}>
              Historial Clínico y Evaluaciones Físicas
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
              {historiales.length} Expediente(s) encontrado(s)
            </span>
          </div>

          {historiales.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
              <FaFileMedical style={{ fontSize: '2.5rem', color: '#94A3B8', marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Este socio no cuenta con un historial clínico aperturado.</p>
            </div>
          ) : (
            historiales.map((hist) => {
              const detalles: DetalleHistorial[] = hist.detalles || [];
              return (
                <div key={hist.id} style={{ marginBottom: '2rem', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#FAF9F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                        EXPEDIENTE Nº #{hist.id.toString().padStart(6, '0')}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#003B70', margin: '0.1rem 0 0 0' }}>
                        Apertura: {hist.created_at ? new Date(hist.created_at).toLocaleDateString() : 'Aperturado'}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleOpenPhysicalView(hist)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: '6px',
                        backgroundColor: '#003B70',
                        color: '#FFF',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <FaPrint /> Ver/Imprimir Ficha Física Completa
                    </button>
                  </div>

                  <div style={{ marginBottom: '1rem', backgroundColor: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#003B70', display: 'block', marginBottom: '0.25rem' }}>
                      Observaciones Médicas / Diagnóstico:
                    </span>
                    <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>
                      {hist.observaciones_generales || hist.observaciones || 'Sin observaciones adicionales declaradas.'}
                    </p>
                  </div>

                  <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0B1727', marginBottom: '0.6rem' }}>
                    Evaluaciones Antropométricas Registradas ({detalles.length})
                  </h5>

                  {detalles.length === 0 ? (
                    <p style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                      No hay mediciones físicas periódicas registradas en este expediente.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="data-table" style={{ fontSize: '0.82rem' }}>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Peso</th>
                            <th>Altura</th>
                            <th>IMC</th>
                            <th>% Grasa</th>
                            <th>Presión</th>
                            <th>Observaciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalles.map((det, idx) => (
                            <tr key={det.id || idx}>
                              <td style={{ fontWeight: 700 }}>{det.fecha_registro || det.fecha || 'N/A'}</td>
                              <td>{det.peso ? `${det.peso} kg` : '-'}</td>
                              <td>{det.altura ? `${det.altura} cm` : '-'}</td>
                              <td style={{ fontWeight: 800, color: '#003B70' }}>{det.imc || '-'}</td>
                              <td>{det.porcentaje_grasa ? `${det.porcentaje_grasa}%` : '-'}</td>
                              <td>{det.presion || '-'}</td>
                              <td style={{ color: '#64748B', fontSize: '0.78rem' }}>{det.observaciones || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB CONTENT: ANTECEDENTES MEDICOS */}
      {activeTab === 'antecedentes' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#003B70', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaHeartPulse style={{ color: '#DC2626' }} /> Antecedentes Patológicos & Condición Médica
          </h3>

          {historiales.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '0.88rem' }}>Sin historial médico aperturado para consultar antecedentes.</p>
          ) : (
            historiales.map((hist) => {
              const antecedentesList: Antecedente[] = (hist as any).antecedentes || hist.antecedentes_medicos || [];
              return (
                <div key={hist.id} style={{ marginBottom: '1.5rem' }}>
                  {antecedentesList.length === 0 ? (
                    <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.88rem' }}>
                      {typeof hist.antecedentes === 'string' ? hist.antecedentes : 'Sin antecedentes patológicos declarados por el socio.'}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                      {antecedentesList.map((ant, idx) => (
                        <div key={idx} style={{ padding: '1.25rem', borderRadius: '8px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2' }}>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#990000', marginBottom: '0.75rem' }}>
                            Afecciones y Antecedentes Declarados
                          </h4>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#7F1D1D', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {ant.tiene_enfermedades_cardiovasculares && (
                              <li><strong>Enfermedades Cardiovasculares:</strong> {ant.detalle_enfermedades_cardiovasculares || 'Declarado'}</li>
                            )}
                            {ant.tiene_hipertension_arterial && (
                              <li><strong>Hipertensión Arterial:</strong> {ant.detalle_hipertension_arterial || 'Declarado'}</li>
                            )}
                            {ant.tiene_enfermedades_pulmonares && (
                              <li><strong>Enfermedades Pulmonares / Asma:</strong> {ant.detalle_enfermedades_pulmonares || 'Declarado'}</li>
                            )}
                            {ant.tiene_diabetes && (
                              <li><strong>Diabetes:</strong> {ant.detalle_diabetes || 'Declarado'}</li>
                            )}
                            {ant.tiene_lesiones && (
                              <li><strong>Lesiones Físicas / Musculares:</strong> {ant.detalle_lesiones || 'Declarado'}</li>
                            )}
                            {ant.tiene_alergias && (
                              <li><strong>Alergias Conocidas:</strong> {ant.detalle_alergias || 'Declarado'}</li>
                            )}
                            {ant.observaciones && (
                              <li style={{ marginTop: '0.3rem', fontStyle: 'italic', color: '#451A03' }}>
                                <strong>Notas Adicionales:</strong> {ant.observaciones}
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB CONTENT: DOCUMENTOS DIGITALES */}
      {activeTab === 'documentos' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#003B70', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaFolderOpen style={{ color: '#0284C7' }} /> Documentación Digital de Respaldos
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
              {documentos.length} Documento(s) adjunto(s)
            </span>
          </div>

          {documentos.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
              <FaFolderOpen style={{ fontSize: '2.5rem', color: '#94A3B8', marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>No hay documentos digitales subidos para este socio.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Archivo / Título</th>
                    <th>Tipo de Documento</th>
                    <th>Fecha Subida</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((doc) => {
                    const rawPath = doc.archivo_url || doc.ruta_archivo || '';
                    const isImg = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(rawPath);
                    const fileUrl = resolveDocumentFileUrl(doc);
                    const tipoNombre = doc.tipoDocumento?.nombre || doc.tipo_documento?.nombre || 'Documento Socio';

                    return (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ fontSize: '1.25rem', color: isImg ? '#0284C7' : '#EF4444' }}>
                              {isImg ? <FaImage /> : <FaFilePdf />}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0B1727' }}>
                                {doc.titulo || tipoNombre}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                ID: #{doc.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ padding: '0.2rem 0.65rem', borderRadius: '4px', backgroundColor: '#E0F2FE', color: '#0369A1', fontWeight: 700, fontSize: '0.78rem' }}>
                            {tipoNombre}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Cargado'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              className="action-btn"
                              onClick={() => handleOpenDocPreview(doc)}
                              title="Vista Previa de Documento"
                              style={{ backgroundColor: '#F8FAFC', color: '#003B70', border: '1px solid #CBD5E1' }}
                            >
                              <FaEye />
                            </button>
                            <a
                              href={fileUrl}
                              download
                              className="action-btn"
                              title="Descargar Archivo"
                              style={{ backgroundColor: '#003B70', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                            >
                              <FaDownload />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODALES REUTILIZABLES DE VISTA PREVIA Y IMPRESIÓN */}
      <HistorialPhysicalViewModal
        isOpen={isPhysicalModalOpen}
        historial={selectedHistorial}
        onClose={() => setIsPhysicalModalOpen(false)}
      />

      <DocumentoPreviewModal
        isOpen={isPreviewModalOpen}
        documento={selectedDoc}
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </section>
  );
};

export default UserDetailPage;
