// src/features/dashboard/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Link, Navigate } from 'react-router-dom';
import { useBoletasInscripcion } from '@/features/tramites/hooks/useTramites';
import CodigoQRInscripcionModal from '@/features/tramites/components/CodigoQRInscripcionModal';
import EscanerQRModal from '@/features/accesos/components/EscanerQRModal';
import showToast from '@/utils/toast';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  if (user?.rol === 'cliente') {
    return <Navigate to="/dashboard/planes" replace />;
  }

  if (user?.rol === 'instructor') {
    return <Navigate to="/dashboard/ejercicios" replace />;
  }
  const { data: rawInscData } = useBoletasInscripcion();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  const isStaff = user?.rol === 'administrador' || user?.rol === 'recepcionista' || user?.rol === 'instructor';

  const inscripciones = Array.isArray(rawInscData) ? rawInscData : Array.isArray((rawInscData as any)?.data) ? (rawInscData as any).data : [];
  
  // Find latest active membership boleta for the current user or first available
  const userBoleta = inscripciones.find((b: any) => String(b.id_usuario) === String(user?.id)) || inscripciones[0] || null;

  const handleOpenQR = () => {
    if (!userBoleta) {
      showToast.info('Aún no tienes una Boleta de Inscripción activa generada.');
      return;
    }
    setIsQRModalOpen(true);
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727' }}>Visión General Analítica</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Métricas consolidadas de aforo, ingresos por membresías y actividad de gimnasio D.U.B.S. UAGRM.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isStaff && (
            <>
              <button
                onClick={() => setIsScannerModalOpen(true)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '4px',
                  background: '#0077D4',
                  color: '#FFFFFF',
                  border: '1px solid #005FA8',
                  fontWeight: 700,
                  fontSize: '0.80rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}
              >
                <i className="fa-solid fa-qrcode"></i> Validar QR de Ingreso
              </button>
              <Link
                to="/dashboard/usuarios"
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '4px',
                  background: '#FFFFFF',
                  color: '#0077D4',
                  border: '1px solid #CBD5E1',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.80rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}
              >
                <i className="fa-solid fa-users-gear"></i> Gestionar Usuarios
              </Link>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderLeftColor: '#003B70' }}>
          <div className="kpi-header">
            <span>Usuarios Registrados</span>
            <div className="kpi-icon" style={{ background: 'rgba(0, 59, 112, 0.1)', color: '#003B70' }}>
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">1,420</div>
            <div className="kpi-subtext">Estudiantes, Docentes y Admins</div>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: '#990000' }}>
          <div className="kpi-header">
            <span>Socios Activos</span>
            <div className="kpi-icon" style={{ background: 'rgba(153, 0, 0, 0.1)', color: '#990000' }}>
              <i className="fa-solid fa-id-card"></i>
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">985</div>
            <div className="kpi-subtext">Con membresía mensual vigente</div>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: '#16A34A' }}>
          <div className="kpi-header">
            <span>Aforo Campus DUBS</span>
            <div className="kpi-icon" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
              <i className="fa-solid fa-door-open"></i>
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">78.4%</div>
            <div className="kpi-subtext">Ocupación sala musculación</div>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: '#D97706' }}>
          <div className="kpi-header">
            <span>Recaudación del Mes</span>
            <div className="kpi-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">Bs. 34,850.00</div>
            <div className="kpi-subtext">Ingresos por pases mensuales</div>
          </div>
        </div>
      </div>

      {/* Role specific quick panel */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '4px',
        padding: '1.25rem',
        marginTop: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727' }}>
              Bienvenido, {user?.name || 'Usuario'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Has iniciado sesión como <strong style={{ textTransform: 'capitalize' }}>{user?.rol || 'cliente'}</strong> en el Gimnasio UAGRM D.U.B.S.
            </p>
          </div>
          <span className={`badge-role ${user?.rol || 'cliente'}`}>
            <i className="fa-solid fa-shield-halved"></i> {user?.rol || 'cliente'}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.85rem',
          marginTop: '1rem',
        }}>
          {(user?.rol === 'administrador' || user?.rol === 'recepcionista' || user?.rol === 'instructor') && (
            <Link
              to="/dashboard/usuarios"
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                textDecoration: 'none',
                color: '#0B1727',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#0077D4', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Gestionar Usuarios</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Crear, editar o suspender cuentas</div>
              </div>
            </Link>
          )}

          {isStaff && (
            <div
              onClick={() => setIsScannerModalOpen(true)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '4px',
                border: '1px solid #059669',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#059669', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                <i className="fa-solid fa-expand"></i>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#065F46' }}>Escanear & Validar QR</div>
                <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>Comprobar pase e ingresar socio</div>
              </div>
            </div>
          )}

          <div
            onClick={handleOpenQR}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '4px',
              border: '1px solid #7C3AED',
              background: '#F5F3FF',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#7C3AED', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#5B21B6' }}>Pase QR de Acceso Digital</div>
              <div style={{ fontSize: '0.72rem', color: '#6D28D9', fontWeight: 600 }}>Ver / Imprimir Código QR para torniquete</div>
            </div>
          </div>

          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '4px',
            border: '1px solid #CBD5E1',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#16A34A', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Vigencia Membresía</div>
              <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>
                {userBoleta?.fecha_fin ? `Válido hasta: ${userBoleta.fecha_fin}` : 'Válido hasta: 30 días post-pago'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CodigoQRInscripcionModal
        isOpen={isQRModalOpen}
        inscripcionId={userBoleta?.id || null}
        inscripcionFallback={userBoleta}
        onClose={() => setIsQRModalOpen(false)}
      />

      <EscanerQRModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
      />
    </section>
  );
};

export default DashboardPage;
