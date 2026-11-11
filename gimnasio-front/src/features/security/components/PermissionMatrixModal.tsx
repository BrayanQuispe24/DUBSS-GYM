// src/features/security/components/PermissionMatrixModal.tsx
import React, { useState, useEffect } from 'react';
import {
  FaCheck,
  FaPlus,
  FaTrashCan,
  FaMagnifyingGlass,
  FaXmark,
  FaShieldHalved,
  FaArrowRightLong,
  FaArrowLeftLong,
} from 'react-icons/fa6';
import type { Rol, Permiso } from '../services/securityService';

interface PermissionMatrixModalProps {
  isOpen: boolean;
  rol: Rol | null;
  allPermisos: Permiso[];
  onClose: () => void;
  onSubmit: (permisosIds: number[]) => void;
  isPending: boolean;
}

const PermissionMatrixModal: React.FC<PermissionMatrixModalProps> = ({
  isOpen,
  rol,
  allPermisos,
  onClose,
  onSubmit,
  isPending,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchAssigned, setSearchAssigned] = useState('');
  const [searchAvailable, setSearchAvailable] = useState('');

  useEffect(() => {
    if (rol && isOpen) {
      const idsFromPermisos = (rol.permisos || []).map((p) => p.id);
      const idsFromRelations = (rol.rol_permisos || rol.rolPermisos || [])
        .map((rp) => rp.id_permiso || rp.permiso?.id)
        .filter((id): id is number => typeof id === 'number');

      const initialIds = Array.from(new Set([...idsFromPermisos, ...idsFromRelations]));
      setSelectedIds(initialIds);
      setSearchAssigned('');
      setSearchAvailable('');
    } else {
      setSelectedIds([]);
    }
  }, [rol, isOpen]);

  if (!isOpen || !rol) return null;

  const handleAddPermission = (id: number) => {
    setSelectedIds((prev) => [...prev, id]);
  };

  const handleRemovePermission = (id: number) => {
    setSelectedIds((prev) => prev.filter((pId) => pId !== id));
  };

  const handleAddAllFiltered = (filteredAvailable: Permiso[]) => {
    const newIds = filteredAvailable.map((p) => p.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...newIds])));
  };

  const handleRemoveAllFiltered = (filteredAssigned: Permiso[]) => {
    const removeIds = new Set(filteredAssigned.map((p) => p.id));
    setSelectedIds((prev) => prev.filter((id) => !removeIds.has(id)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedIds);
  };

  const assignedPermisos = allPermisos.filter((p) => selectedIds.includes(p.id));
  const availablePermisos = allPermisos.filter((p) => !selectedIds.includes(p.id));

  const filterFn = (permiso: Permiso, query: string) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      permiso.nombre.toLowerCase().includes(q) ||
      (permiso.descripcion && permiso.descripcion.toLowerCase().includes(q))
    );
  };

  const filteredAssigned = assignedPermisos.filter((p) => filterFn(p, searchAssigned));
  const filteredAvailable = availablePermisos.filter((p) => filterFn(p, searchAvailable));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(11, 23, 39, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid var(--color-border-strong)',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--color-border-strong)',
            backgroundColor: 'var(--color-surface-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFF',
                  fontSize: '0.85rem',
                }}
              >
                <FaShieldHalved />
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
                Asignación de Facultades — Rol: <span style={{ color: 'var(--color-primary-text)' }}>{rol.nombre}</span>
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
              Gestione las facultades del sistema. Asigne o desasigne permisos corporativos desde los paneles de control.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Cerrar"
          >
            <FaXmark />
          </button>
        </div>

        {/* DUAL PANEL CONTENT */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* PANEL IZQUIERDO: PERMISOS ASIGNADOS */}
          <div
            style={{
              border: '1px solid var(--color-border-strong)',
              borderRadius: '4px',
              backgroundColor: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-muted)',
                borderBottom: '1px solid var(--color-border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Facultades Asignadas
                </span>
                <span
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFF',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '2px',
                  }}
                >
                  {assignedPermisos.length}
                </span>
              </div>
              {filteredAssigned.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAllFiltered(filteredAssigned)}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--color-danger-text)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  Quitar todos
                </button>
              )}
            </div>

            {/* Search input */}
            <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: '4px',
                  padding: '0.4rem 0.65rem',
                }}
              >
                <FaMagnifyingGlass style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }} />
                <input
                  type="text"
                  placeholder="Buscar facultad asignada..."
                  value={searchAssigned}
                  onChange={(e) => setSearchAssigned(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.80rem',
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, maxHeight: '350px', overflowY: 'auto', padding: '0.75rem' }}>
              {filteredAssigned.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.80rem' }}>
                  {searchAssigned ? 'Sin coincidencias' : 'Este rol no tiene facultades asignadas aún.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {filteredAssigned.map((permiso) => (
                    <div
                      key={permiso.id}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FaCheck style={{ color: 'var(--color-primary-text)', fontSize: '0.72rem' }} />
                          {permiso.nombre}
                        </div>
                        {permiso.descripcion && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                            {permiso.descripcion}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePermission(permiso.id)}
                        style={{
                          padding: '0.3rem 0.55rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(220, 38, 38, 0.35)',
                          backgroundColor: 'var(--color-danger-bg)',
                          color: 'var(--color-danger-text)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <FaTrashCan style={{ fontSize: '0.68rem' }} /> Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PANEL DERECHO: PERMISOS DISPONIBLES */}
          <div
            style={{
              border: '1px solid var(--color-border-strong)',
              borderRadius: '4px',
              backgroundColor: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-muted)',
                borderBottom: '1px solid var(--color-border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Facultades Disponibles
                </span>
                <span
                  style={{
                    backgroundColor: '#64748B',
                    color: '#FFF',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '2px',
                  }}
                >
                  {availablePermisos.length}
                </span>
              </div>
              {filteredAvailable.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleAddAllFiltered(filteredAvailable)}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-text)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  Asignar todos
                </button>
              )}
            </div>

            {/* Search input */}
            <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: '4px',
                  padding: '0.4rem 0.65rem',
                }}
              >
                <FaMagnifyingGlass style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }} />
                <input
                  type="text"
                  placeholder="Buscar en facultades disponibles..."
                  value={searchAvailable}
                  onChange={(e) => setSearchAvailable(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.80rem',
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, maxHeight: '350px', overflowY: 'auto', padding: '0.75rem' }}>
              {filteredAvailable.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.80rem' }}>
                  {searchAvailable ? 'Sin coincidencias' : 'Todas las facultades ya están asignadas a este rol.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {filteredAvailable.map((permiso) => (
                    <div
                      key={permiso.id}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
                          {permiso.nombre}
                        </div>
                        {permiso.descripcion && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                            {permiso.descripcion}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddPermission(permiso.id)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          border: '1px solid var(--color-primary)',
                          backgroundColor: 'var(--color-primary)',
                          color: '#FFFFFF',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <FaPlus style={{ fontSize: '0.68rem' }} /> Asignar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              padding: '0.85rem 1.5rem',
              borderTop: '1px solid var(--color-border-strong)',
              backgroundColor: 'var(--color-surface-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Facultades totales asignadas: <strong style={{ color: 'var(--color-text-primary)' }}>{selectedIds.length}</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border-strong)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.80rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-primary)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.80rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                }}
              >
                {isPending ? 'Guardando...' : 'Guardar Matriz de Facultades'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionMatrixModal;
