// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  FaDumbbell,
  FaChartPie,
  FaUsers,
  FaShieldHalved,
  FaBuildingFlag,
  FaGem,
  FaTriangleExclamation,
  FaGears,
  FaListCheck,
  FaRightFromBracket,
  FaBars,
  FaNotesMedical,
  FaFolderOpen,
  FaBasketball,
  FaBoxesPacking,
  FaRightLeft,
  FaWrench,
  FaCalendarDays,
  FaAppleWhole,
  FaFileInvoiceDollar,
  FaQrcode
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
    if (location.pathname.includes('/dashboard/planes')) return 'Planes & Tarifas de Membresía';
    if (location.pathname.includes('/dashboard/ejercicios')) return 'Catálogo de Ejercicios';
    if (location.pathname.includes('/dashboard/rutinas')) return 'Rutinas de Entrenamiento';
    if (location.pathname.includes('/dashboard/planes-entrenamiento')) return 'Planes de Entrenamiento Personalizados';
    if (location.pathname.includes('/dashboard/nutricion')) return 'Planes de Alimentación';
    if (location.pathname.includes('/dashboard/tramites')) return 'Trámites, Pagos & Boletas';
    if (location.pathname.includes('/dashboard/accesos')) return 'Garita de Acceso & Asistencia';
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
          <div className="nav-section-label">Módulos Principales</div>

          {!['cliente', 'instructor'].includes(user?.rol || '') && (
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Reportes Generales"
            >
              <FaChartPie />
              <span>Reportes Generales</span>
            </NavLink>
          )}

          {['administrador', 'recepcionista', 'instructor'].includes(user?.rol || '') && (
            <NavLink
              to="/dashboard/usuarios"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Gestión de Usuarios del Sistema"
            >
              <FaUsers />
              <span>Gestión Usuarios</span>
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

          {user?.rol !== 'instructor' && (
            <NavLink
              to="/dashboard/planes"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Planes & Tarifas de Membresía"
            >
              <FaGem />
              <span>Planes y Tarifas</span>
            </NavLink>
          )}

          <div className="nav-section-label">Deporte & Entrenamiento</div>

          <NavLink
            to="/dashboard/ejercicios"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Catálogo de Ejercicios"
          >
            <FaDumbbell />
            <span>Catálogo Ejercicios</span>
          </NavLink>

          <NavLink
            to="/dashboard/rutinas"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Rutinas Deportivas"
          >
            <FaListCheck />
            <span>Rutinas Deportivas</span>
          </NavLink>

          <NavLink
            to="/dashboard/planes-entrenamiento"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Planes de Entrenamiento"
          >
            <FaCalendarDays />
            <span>Planes Entrenamiento</span>
          </NavLink>

          <NavLink
            to="/dashboard/nutricion"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Planes de Alimentación"
          >
            <FaAppleWhole />
            <span>Planes Nutrición</span>
          </NavLink>

          <div className="nav-section-label">Trámites & Operaciones</div>

          {user?.rol !== 'instructor' && (
            <NavLink
              to="/dashboard/tramites"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Trámites, Pagos y Boletas"
            >
              <FaFileInvoiceDollar />
              <span>Trámites y Pagos</span>
            </NavLink>
          )}

          {['administrador', 'recepcionista'].includes(user?.rol || '') && (
            <NavLink
              to="/dashboard/accesos"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Garita & Control de Asistencia"
            >
              <FaQrcode />
              <span>Garita de Acceso</span>
            </NavLink>
          )}

          <NavLink
            to="/dashboard/disciplinas"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Disciplinas Deportivas"
          >
            <FaBasketball />
            <span>Disciplinas & Horarios</span>
          </NavLink>

          {user?.rol !== 'instructor' && (
            <NavLink
              to="/dashboard/historial"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Historial Clínico / Deportivo"
            >
              <FaNotesMedical />
              <span>Historial Clínico</span>
            </NavLink>
          )}

          {user?.rol !== 'instructor' && (
            <NavLink
              to="/dashboard/documentos"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Repositorio de Documentación"
            >
              <FaFolderOpen />
              <span>Documentación Digital</span>
            </NavLink>
          )}

          {user?.rol !== 'cliente' && (
            <>
              <div className="nav-section-label">Inventario & Espacios</div>

              <NavLink
                to="/dashboard/ambientes"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title="Ambientes & Espacios"
              >
                <FaBuildingFlag />
                <span>Ambientes y Espacios</span>
              </NavLink>
            </>
          )}

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

          {user?.rol === 'administrador' && (
            <NavLink
              to="/dashboard/mantenimientos"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title="Mantenimiento Técnico"
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

          <div className="topbar-right">
            <button
              onClick={() => logout()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '4px',
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
