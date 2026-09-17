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
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#003B70',
                  color: '#FFF',
                  fontSize: '0.95rem',
                }}
              >
                <FaShieldHalved />
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
                Asignación de Permisos — Rol: <span style={{ color: '#003B70' }}>{rol.nombre}</span>
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.3rem', marginBottom: 0 }}>
              Gestione las facultades del sistema. Asigne o desasigne permisos fácilmente desde ambos paneles.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px',
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
            padding: '1.5rem 1.75rem',
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* PANEL IZQUIERDO: PERMISOS ASIGNADOS */}
          <div
            style={{
              border: '1px solid #DCFCE7',
              borderRadius: '12px',
              backgroundColor: '#FAFCF9',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#ECFDF5',
                borderBottom: '1px solid #D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#065F46' }}>
                  Permisos Asignados
                </span>
                <span
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFF',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
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
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#DC2626',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Quitar todos
                </button>
              )}
            </div>

            {/* Search input */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                }}
              >
                <FaMagnifyingGlass style={{ color: '#94A3B8', fontSize: '0.8rem' }} />
                <input
                  type="text"
                  placeholder="Buscar permiso asignado..."
                  value={searchAssigned}
                  onChange={(e) => setSearchAssigned(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.82rem',
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: '#0B1727',
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, maxHeight: '350px', overflowY: 'auto', padding: '0.75rem' }}>
              {filteredAssigned.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94A3B8', fontSize: '0.82rem' }}>
                  {searchAssigned ? 'Sin coincidencias' : 'Este rol no tiene permisos asignados aún.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filteredAssigned.map((permiso) => (
                    <div
                      key={permiso.id}
                      style={{
                        padding: '0.7rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FaCheck style={{ color: '#059669', fontSize: '0.75rem' }} />
                          {permiso.nombre}
                        </div>
                        {permiso.descripcion && (
                          <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.15rem' }}>
                            {permiso.descripcion}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePermission(permiso.id)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #FCA5A5',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <FaTrashCan style={{ fontSize: '0.7rem' }} /> Quitar
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
              border: '1px solid #DBEAFE',
              borderRadius: '12px',
              backgroundColor: '#FAFCFF',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#EFF6FF',
                borderBottom: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E40AF' }}>
                  Permisos Disponibles por Asignar
                </span>
                <span
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFF',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
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
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#2563EB',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Asignar todos
                </button>
              )}
            </div>

            {/* Search input */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                }}
              >
                <FaMagnifyingGlass style={{ color: '#94A3B8', fontSize: '0.8rem' }} />
                <input
                  type="text"
                  placeholder="Buscar en otros permisos..."
                  value={searchAvailable}
                  onChange={(e) => setSearchAvailable(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.82rem',
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: '#0B1727',
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, maxHeight: '350px', overflowY: 'auto', padding: '0.75rem' }}>
              {filteredAvailable.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94A3B8', fontSize: '0.82rem' }}>
                  {searchAvailable ? 'Sin coincidencias' : 'Todos los permisos ya están asignados a este rol.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filteredAvailable.map((permiso) => (
                    <div
                      key={permiso.id}
                      style={{
                        padding: '0.7rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0B1727' }}>
                          {permiso.nombre}
                        </div>
                        {permiso.descripcion && (
                          <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.15rem' }}>
                            {permiso.descripcion}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddPermission(permiso.id)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#003B70',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <FaPlus style={{ fontSize: '0.7rem' }} /> Asignar
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
              padding: '1rem 1.75rem',
              borderTop: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Permisos totales a asignar: <strong style={{ color: '#0B1727' }}>{selectedIds.length}</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#003B70',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,59,112,0.2)',
                }}
              >
                {isPending ? 'Guardando...' : 'Guardar Matriz de Permisos'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionMatrixModal;
