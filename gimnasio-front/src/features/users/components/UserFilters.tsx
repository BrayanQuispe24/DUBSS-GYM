// src/features/users/components/UserFilters.tsx
import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import type { UserFilterParams } from '../types/user.types';

interface UserFiltersProps {
  filters: UserFilterParams;
  onChange: (newFilters: Partial<UserFilterParams>) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="filters-bar" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: '#FFFFFF',
      border: '1px solid #D2DCEE',
      borderBottom: 'none',
      padding: '0.75rem 1rem',
      borderRadius: '4px 4px 0 0',
      flexWrap: 'wrap',
    }}>
      <div className="search-input-wrapper" style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
        <FaMagnifyingGlass style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#94A3B8',
          fontSize: '0.8rem',
          pointerEvents: 'none',
          zIndex: 2,
        }} />
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, correo, R.U., C.I. o rol..."
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value })}
          style={{
            width: '100%',
            height: '34px',
            paddingLeft: '2.1rem',
            paddingRight: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #CBD5E1',
            fontSize: '0.82rem',
            color: '#0B1727',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <select
        className="form-select"
        value={filters.rol || 'todos'}
        onChange={(e) => onChange({ rol: e.target.value })}
        style={{
          height: '34px',
          padding: '0 0.75rem',
          borderRadius: '4px',
          border: '1px solid #CBD5E1',
          fontSize: '0.82rem',
          color: '#0B1727',
          backgroundColor: '#FFFFFF',
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box',
          minWidth: '150px',
        }}
      >
        <option value="todos">Todos los Roles</option>
        <option value="administrador">Administrador</option>
        <option value="recepcionista">Recepcionista</option>
        <option value="instructor">Instructor</option>
        <option value="cliente">Cliente (Alumno/Docente/Admin)</option>
      </select>

      <select
        className="form-select"
        value={filters.estado || 'todos'}
        onChange={(e) => onChange({ estado: e.target.value })}
        style={{
          height: '34px',
          padding: '0 0.75rem',
          borderRadius: '4px',
          border: '1px solid #CBD5E1',
          fontSize: '0.82rem',
          color: '#0B1727',
          backgroundColor: '#FFFFFF',
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box',
          minWidth: '150px',
        }}
      >
        <option value="todos">Todos los Estados</option>
        <option value="activo">Solo Activos</option>
        <option value="suspendido">Solo Suspendidos</option>
      </select>
    </div>
  );
};

export default UserFilters;

