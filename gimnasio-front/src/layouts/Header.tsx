// src/layouts/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { ShieldCheck, UserCheck, Users, Dumbbell, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const { isUserMenuOpen, toggleUserMenu } = useUIStore();
  const navigate = useNavigate();

  return (
    <header className="header classgo-pill-header" id="header">
      <div className="pill-header-wrapper">
        {/* Brand Logo DUBS UAGRM */}
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="logo-text" style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 800, lineHeight: 1 }}>
              FITGO <span style={{ color: 'var(--color-accent)' }}>UAGRM</span>
            </span>
            <span style={{ fontSize: '0.68rem', color: '#CBD5E1', fontWeight: 600, letterSpacing: '0.05em' }}>
              D.U.B.S. Bienestar Social
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="pill-nav-links">
          <a href="#servicios">Servicios & Clases</a>
          <a href="#membresias">Membresías UAGRM</a>
          <a href="#roles">Módulos del Sistema</a>
          <a href="#mapa-envivo">Sede D.U.B.S.</a>
        </nav>

        {/* Right Topbar Actions (Access & Register) */}
        <div className="pill-header-actions" style={{ gap: '0.65rem' }}>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(153, 0, 0, 0.4)',
                }}
              >
                <LayoutDashboard size={16} />
                <span>Mi Panel ({user?.name ? user.name.split(' ')[0] : 'Socio'})</span>
              </Link>

              <button
                onClick={() => logout()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
                title="Cerrar Sesión"
              >
                <LogOut size={15} />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              {/* Login Button (Unified for all roles) */}
              <Link
                to="/login"
                className="btn-pill-login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none',
                }}
                title="Iniciar Sesión (Cualquier Rol)"
              >
                <LogIn size={16} />
                <span>Iniciar Sesión</span>
              </Link>

              {/* Public Client Registration Button */}
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.48rem 1rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                title="Registro Público de Cliente (Estudiantes/Docentes)"
              >
                <UserPlus size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Registrarse</span>
              </Link>
            </>
          )}

          {/* Quick Role Access Menu Dropdown */}
          <div className="user-menu-dropdown-wrapper">
            <div
              className="user-avatar-circle-btn"
              id="user-menu-trigger"
              title="Acceso por Rol de Usuario"
              onClick={toggleUserMenu}
            >
              <Users size={18} />
            </div>

            <div className={`user-menu-popover ${isUserMenuOpen ? 'show' : ''}`} id="user-menu-popover">
              <div style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase', padding: '0.3rem 0.6rem' }}>
                Acceso Rápido por Rol:
              </div>
              <a
                href="#login"
                className="popover-item highlight"
                onClick={(e) => {
                  e.preventDefault();
                  toggleUserMenu();
                  navigate('/login');
                }}
              >
                <ShieldCheck size={16} /> Administrador
              </a>
              <a
                href="#login"
                className="popover-item"
                onClick={(e) => {
                  e.preventDefault();
                  toggleUserMenu();
                  navigate('/login');
                }}
              >
                <UserCheck size={16} /> Recepcionista (Torniquetes)
              </a>
              <a
                href="#login"
                className="popover-item"
                onClick={(e) => {
                  e.preventDefault();
                  toggleUserMenu();
                  navigate('/login');
                }}
              >
                <Dumbbell size={16} /> Instructor (Rutinas)
              </a>
              <div className="popover-divider"></div>
              <a
                href="#register"
                className="popover-item"
                onClick={(e) => {
                  e.preventDefault();
                  toggleUserMenu();
                  navigate('/register');
                }}
              >
                <Users size={16} /> Registrar Cliente UAGRM
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
