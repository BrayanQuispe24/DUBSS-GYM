// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LandingPage from '@/features/landing/pages/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import UserListPage from '@/features/users/pages/UserListPage';
import UserDetailPage from '@/features/users/pages/UserDetailPage';
import RoleListPage from '@/features/security/pages/RoleListPage';
import HistorialListPage from '@/features/historial/pages/HistorialListPage';
import DocumentoListPage from '@/features/documentos/pages/DocumentoListPage';
import DeporteListPage from '@/features/deporte/pages/DeporteListPage';
import AmbienteListPage from '@/features/inventario/pages/AmbienteListPage';
import EquipoListPage from '@/features/inventario/pages/EquipoListPage';
import MovimientoListPage from '@/features/inventario/pages/MovimientoListPage';
import MantenimientoListPage from '@/features/inventario/pages/MantenimientoListPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Gestión de Usuarios */}
          <Route element={<ProtectedRoute allowedRoles={['administrador', 'recepcionista', 'instructor']} />}>
            <Route path="usuarios" element={<UserListPage />} />
            <Route path="usuarios/:id" element={<UserDetailPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
          </Route>

          {/* Seguridad (Roles y Permisos) */}
          <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
            <Route path="permisos" element={<RoleListPage />} />
          </Route>

          {/* Historial Médico / Deportivo */}
          <Route path="historial" element={<HistorialListPage />} />

          {/* Documentación Digital */}
          <Route path="documentos" element={<DocumentoListPage />} />

          {/* Deporte & Horarios */}
          <Route path="disciplinas" element={<DeporteListPage />} />

          {/* Espacios / Ambientes */}
          <Route path="ambientes" element={<AmbienteListPage />} />

          {/* Inventario de Equipos */}
          <Route element={<ProtectedRoute allowedRoles={['administrador', 'recepcionista', 'instructor']} />}>
            <Route path="equipos" element={<EquipoListPage />} />
          </Route>

          {/* Movimientos de Stock */}
          <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
            <Route path="movimientos-inventario" element={<MovimientoListPage />} />
          </Route>

          {/* Mantenimientos */}
          <Route element={<ProtectedRoute allowedRoles={['administrador', 'instructor']} />}>
            <Route path="mantenimientos" element={<MantenimientoListPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
