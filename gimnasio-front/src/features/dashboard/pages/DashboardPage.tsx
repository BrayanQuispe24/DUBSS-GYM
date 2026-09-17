// src/features/dashboard/pages/DashboardPage.tsx
import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

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
          {(user?.rol === 'administrador' || user?.rol === 'recepcionista' || user?.rol === 'instructor') && (
            <Link
              to="/dashboard/usuarios"
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                background: '#003B70',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="fa-solid fa-users-gear"></i> Gestionar Usuarios
            </Link>
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
        border: '1px solid #D2DCEE',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '1.5rem',
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
          gap: '1rem',
          marginTop: '1rem',
        }}>
          {(user?.rol === 'administrador' || user?.rol === 'recepcionista' || user?.rol === 'instructor') && (
            <Link
              to="/dashboard/usuarios"
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                textDecoration: 'none',
                color: '#0B1727',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#003B70', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Gestionar Usuarios</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Crear, editar o suspender cuentas</div>
              </div>
            </Link>
          )}

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#990000', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pase QR de Acceso</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Código activo para torniquete</div>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#16A34A', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Vigencia Membresía</div>
              <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>Válido hasta: 30 de Octubre</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
