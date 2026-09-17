// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  FaDumbbell,
  FaChartPie,
  FaUsers,
  FaShieldHalved,
  FaBuildingFlag,
  FaClipboardCheck,
  FaGem,
  FaPercent,
  FaTriangleExclamation,
  FaGears,
  FaDatabase,
  FaListCheck,
  FaRightFromBracket,
  FaRotate,
  FaBars,
  FaMagnifyingGlass,
  FaBell,
  FaDownload,
  FaNotesMedical,
  FaFolderOpen,
  FaBasketball,
  FaBoxesPacking,
  FaRightLeft,
  FaWrench,
} from 'react-icons/fa6';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks/useAuth';
import showToast from '@/utils/toast';

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const location = useLocation();

  const getInitials = (name?: string) => {
    if (!name) return 'GU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const roleDisplayNames: Record<string, string> = {
    administrador: 'Administrador General',
    recepcionista: 'Recepcionista Garita',
    instructor: 'Instructor Fitness',
    cliente: 'Cliente Universitario',
  };

  const getBreadcrumbTitle = () => {
    if (location.pathname.includes('/dashboard/usuarios')) return 'Gestión de Usuarios';
    if (location.pathname.includes('/dashboard/permisos')) return 'Roles y Permisos';
    if (location.pathname.includes('/dashboard/historial')) return 'Historial Clínico / Deportivo';
    if (location.pathname.includes('/dashboard/documentos')) return 'Documentación Digital';
    if (location.pathname.includes('/dashboard/disciplinas')) return 'Disciplinas Deportivas & Horarios';
    if (location.pathname.includes('/dashboard/ambientes')) return 'Ambientes & Espacios';
    if (location.pathname.includes('/dashboard/equipos')) return 'Inventario de Equipos';
    if (location.pathname.includes('/dashboard/movimientos-inventario')) return 'Movimientos de Stock';
    if (location.pathname.includes('/dashboard/mantenimientos')) return 'Mantenimiento de Equipamiento';
    return 'Reportes Generales';
  };

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo-brand" title="Gimnasio UAGRM D.U.B.S.">
            <div className="logo-icon">
              <FaDumbbell />
            </div>
            {!collapsed && (
              <div className="logo-text">
                <span>GIMNASIO UAGRM</span>
                <span>D.U.B.S. SYSTEM</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Módulos de Gestión</div>

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Reportes Generales"
          >
            <FaChartPie />
            <span>Reportes Generales</span>
          </NavLink>

          {['administrador', 'recepcionista', 'instructor'].includes(user?.rol || '') && (
            <NavLink
              to="/dashboard/usuarios"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Gestión de Usuarios del Sistema"
            >
              <FaUsers />
              <span>Gestión de Usuarios</span>
            </NavLink>
          )}

          {user?.rol === 'administrador' && (
            <NavLink
              to="/dashboard/permisos"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Roles y Matriz de Permisos"
            >
              <FaShieldHalved />
              <span>Roles y Permisos</span>
            </NavLink>
          )}

          <NavLink
            to="/dashboard/historial"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Historial Clínico / Deportivo"
          >
            <FaNotesMedical />
            <span>Historial Clínico</span>
          </NavLink>

          <NavLink
            to="/dashboard/documentos"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Repositorio de Documentación"
          >
            <FaFolderOpen />
            <span>Documentación Digital</span>
          </NavLink>

          <NavLink
            to="/dashboard/disciplinas"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Disciplinas Deportivas"
          >
            <FaBasketball />
            <span>Disciplinas & Horarios</span>
          </NavLink>

          <NavLink
            to="/dashboard/ambientes"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Ambientes & Espacios"
          >
            <FaBuildingFlag />
            <span>Ambientes y Espacios</span>
          </NavLink>

          <div className="nav-section-label">Inventario & Mantenimiento</div>

          {['administrador', 'recepcionista', 'instructor'].includes(user?.rol || '') && (
            <NavLink
              to="/dashboard/equipos"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Inventario de Equipos"
            >
              <FaBoxesPacking />
              <span>Inventario Equipos</span>
            </NavLink>
          )}

          {user?.rol === 'administrador' && (
            <NavLink
              to="/dashboard/movimientos-inventario"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Movimientos de Stock"
            >
              <FaRightLeft />
              <span>Movimientos Stock</span>
            </NavLink>
          )}

          {['administrador', 'instructor'].includes(user?.rol || '') && (
            <NavLink
              to="/dashboard/mantenimientos"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Mantenimiento Tecnico"
            >
              <FaWrench />
              <span>Mantenimientos</span>
            </NavLink>
          )}

          <div className="nav-section-label">Seguridad y Auditoría</div>

          <a
            className="nav-item"
            title="Denuncias y Reportes"
            onClick={(e) => {
              e.preventDefault();
              showToast.warning('2 expedientes de denuncias en investigación.', 'Denuncias');
            }}
          >
            <FaTriangleExclamation />
            <span>Denuncias y Reportes</span>
            {!collapsed && (
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '999px',
                background: '#EF4444',
                color: '#FFF',
                fontWeight: 700,
              }}>2</span>
            )}
          </a>

          <a
            className="nav-item"
            title="Configuración General"
            onClick={(e) => {
              e.preventDefault();
              showToast.info('Configuración del sistema operativa.', 'Configuración');
            }}
          >
            <FaGears />
            <span>Configuración Sistema</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-card" title={`${user?.name || 'Admin General'} (${roleDisplayNames[user?.rol || 'administrador']})`}>
            <div className="admin-avatar">{getInitials(user?.name)}</div>
            {!collapsed && (
              <div className="admin-info">
                <div className="admin-name">{user?.name || 'Admin General'}</div>
                <div className="admin-role">{roleDisplayNames[user?.rol || 'administrador']}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <div className="main-wrapper">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="toggle-sidebar-btn"
              onClick={() => {
                if (window.innerWidth < 900) {
                  setMobileOpen(!mobileOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              title={collapsed ? "Mostrar menú lateral" : "Ocultar menú lateral"}
            >
              <FaBars />
            </button>
            <div className="page-title-display">
              <h1>{getBreadcrumbTitle()}</h1>
              <span className="page-breadcrumb">Gimnasio UAGRM / {getBreadcrumbTitle()}</span>
            </div>
          </div>

          <div className="command-search-box" title="Búsqueda Rápida UAGRM">
            <FaMagnifyingGlass />
            <span>Buscar por usuario, R.U. o membresía...</span>
            <kbd>⌘K</kbd>
          </div>

          <div className="topbar-right">
            <select
              className="form-select"
              title="Seleccionar Sede"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option>Sede Central Campus UAGRM</option>
              <option>Sucursal Montero</option>
              <option>Sucursal Camiri</option>
            </select>

            <button
              className="action-btn"
              onClick={() => showToast.info('3 notificaciones del sistema pendientes.', 'Notificaciones')}
              title="Notificaciones del Sistema"
              style={{ position: 'relative' }}
            >
              <FaBell />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#EF4444',
                color: '#FFF',
                borderRadius: '50%',
                fontSize: '0.65rem',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}>3</span>
            </button>

            <button
              className="action-btn"
              onClick={() => showToast.success('Reporte listo para descarga.', 'Exportar Reporte')}
              title="Programar Exportación"
            >
              <FaDownload />
            </button>

            <button
              onClick={() => logout()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                background: '#FEE2E2',
                color: '#B91C1C',
                border: '1px solid #FCA5A5',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Cerrar Sesión"
            >
              <FaRightFromBracket />
              <span>Salir</span>
            </button>
          </div>
        </header>

        {/* CANVAS VIEWS */}
        <main className="content-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

