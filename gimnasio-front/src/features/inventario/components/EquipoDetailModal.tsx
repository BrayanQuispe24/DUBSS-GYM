// src/features/inventario/components/EquipoDetailModal.tsx
import React from 'react';
import { FaXmark, FaBoxesPacking, FaCircleInfo, FaBarcode, FaBuildingFlag, FaTag, FaLayerGroup } from 'react-icons/fa6';
import type { Equipo } from '../services/inventarioService';

interface EquipoDetailModalProps {
  isOpen: boolean;
  equipo: Equipo | null;
  onClose: () => void;
}

const EquipoDetailModal: React.FC<EquipoDetailModalProps> = ({
  isOpen,
  equipo,
  onClose,
}) => {
  if (!isOpen || !equipo) return null;

  const getStatusBadge = (estadoRaw: string) => {
    const est = String(estadoRaw ?? 'bueno').toLowerCase();
    if (['bueno', 'excelente', 'operativo'].includes(est)) {
      return { label: 'BUENO (OPERATIVO)', bg: '#DCFCE7', color: '#15803D' };
    }
    if (['regular', 'revisión'].includes(est)) {
      return { label: 'REGULAR', bg: '#FEF3C7', color: '#B45309' };
    }
    if (['mantenimiento', 'en mantenimiento'].includes(est)) {
      return { label: 'EN MANTENIMIENTO', bg: '#DBEAFE', color: '#1E40AF' };
    }
    return { label: 'DADO DE BAJA', bg: '#FEE2E2', color: '#B91C1C' };
  };

  const status = getStatusBadge(equipo.estado);

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
          maxWidth: '640px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#003B70',
                color: '#FFF',
                fontSize: '1rem',
              }}
            >
              <FaBoxesPacking />
            </span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
                Ficha Técnica de Equipo
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                Información del activo fijo en la plataforma UAGRM.
              </p>
            </div>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* BODY DETAILS */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main Specs Grid */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaBarcode /> Código Patrimonial
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#003B70', marginTop: '0.2rem' }}>
                {equipo.codigo}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Nombre del Equipo
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B1727', marginTop: '0.2rem' }}>
                {equipo.nombre}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaTag /> Marca y Modelo
              </span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>
                {equipo.marca?.nombre || 'Marca No Especificada'} {equipo.modelo ? `(${equipo.modelo})` : ''}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaBuildingFlag /> Ambiente / Ubicación
              </span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0369A1', marginTop: '0.2rem' }}>
                {equipo.ambiente?.nombre || 'General / Sin asignación'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Stock e Inventario
              </span>
              <div style={{ marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    backgroundColor: equipo.cantidad > 0 ? '#DCFCE7' : '#FEE2E2',
                    color: equipo.cantidad > 0 ? '#15803D' : '#DC2626',
                    width: 'fit-content',
                  }}
                >
                  {equipo.cantidad} Disponibles
                </span>
                {(() => {
                  const activeMants = (equipo.mantenimientos || []).filter((m) =>
                    ['1', 'true', 'pendiente', 'proceso'].includes(String(m.estado).toLowerCase())
                  );
                  const cantMant = activeMants.reduce((sum, m) => sum + (m.cantidad || 1), 0);
                  if (cantMant === 0) return null;
                  return (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#B45309',
                        backgroundColor: '#FEF3C7',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        width: 'fit-content',
                      }}
                    >
                      🛠️ {cantMant} Unidad(es) en Mantenimiento Activo
                    </span>
                  );
                })()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Estado Técnico
              </span>
              <div style={{ marginTop: '0.2rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backgroundColor: status.bg,
                    color: status.color,
                  }}
                >
                  {status.label}
                </span>
              </div>
            </div>

            {equipo.tipoEquipo && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FaLayerGroup /> Categoría
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>
                  {equipo.tipoEquipo.nombre}
                </div>
              </div>
            )}

            {equipo.fecha_adquisicion && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Fecha Adquisición
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>
                  {equipo.fecha_adquisicion}
                </div>
              </div>
            )}

            {equipo.precio_compra !== undefined && equipo.precio_compra !== null && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Precio de Compra
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669', marginTop: '0.2rem' }}>
                  Bs. {Number(equipo.precio_compra).toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#F0F7FF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <FaCircleInfo style={{ color: '#0284C7', fontSize: '1.2rem', flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#0369A1' }}>
              <strong>ID de Registro:</strong> #{equipo.id} — Registro activo de patrimonio universitario UAGRM.
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.6rem 1.4rem',
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
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipoDetailModal;
