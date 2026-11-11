import React from 'react';
import { FaXmark, FaBoxesPacking, FaCircleInfo, FaBarcode, FaBuildingFlag, FaTag, FaLayerGroup, FaWrench } from 'react-icons/fa6';
import { getEquipoImageUrl, type Equipo } from '../services/inventarioService';

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

  const getStatusBadge = (estadoRaw: any) => {
    const isVigente = estadoRaw === true || estadoRaw === 1 || ['1', 'true', 'bueno', 'operativo', 'vigente'].includes(String(estadoRaw ?? '').toLowerCase());
    if (isVigente) {
      return { label: 'VIGENTE EN SISTEMA', bg: 'var(--color-success-bg)', color: 'var(--color-success-text)' };
    }
    return { label: 'ELIMINADO / DADO DE BAJA', bg: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' };
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
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '640px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-muted)',
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
                backgroundColor: 'var(--color-primary)',
                color: '#FFF',
                fontSize: '1rem',
              }}
            >
              <FaBoxesPacking />
            </span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                Ficha Técnica de Equipo
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
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
              color: 'var(--color-text-muted)',
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
          {/* Image banner */}
          {equipo.imagen_url && (
            <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)' }}>
              <img src={getEquipoImageUrl(equipo.imagen_url)} alt={equipo.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Main Specs Grid */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid var(--color-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaBarcode /> Código Patrimonial
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-text)', marginTop: '0.2rem' }}>
                {equipo.codigo}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Nombre del Equipo
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '0.2rem' }}>
                {equipo.nombre}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaTag /> Marca y Modelo
              </span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                {equipo.marca?.nombre || 'Marca No Especificada'} {equipo.modelo ? `(${equipo.modelo})` : ''}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaBuildingFlag /> Ambiente / Ubicación
              </span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary-text)', marginTop: '0.2rem' }}>
                {equipo.ambiente?.nombre || 'General / Sin asignación'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Stock e Inventario
              </span>
              <div style={{ marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    backgroundColor: equipo.cantidad > 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                    color: equipo.cantidad > 0 ? 'var(--color-success-text)' : 'var(--color-danger-text)',
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
                        color: 'var(--color-warning-text)',
                        backgroundColor: 'var(--color-warning-bg)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        width: 'fit-content',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FaWrench size={11} /> {cantMant} Unidad(es) en Mantenimiento Activo
                    </span>
                  );
                })()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
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
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FaLayerGroup /> Categoría
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                  {equipo.tipoEquipo.nombre}
                </div>
              </div>
            )}

            {equipo.fecha_adquisicion && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Fecha Adquisición
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                  {equipo.fecha_adquisicion}
                </div>
              </div>
            )}

            {equipo.precio_compra !== undefined && equipo.precio_compra !== null && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Precio de Compra
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-success-text)', marginTop: '0.2rem' }}>
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
              backgroundColor: 'var(--color-primary-soft)',
              border: '1px solid rgba(220, 38, 38, 0.30)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <FaCircleInfo style={{ color: 'var(--color-primary-text)', fontSize: '1.2rem', flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: 'var(--color-primary-text)' }}>
              <strong>ID de Registro:</strong> #{equipo.id} — Registro activo de patrimonio universitario UAGRM.
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-muted)',
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
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(153, 0, 0,0.2)',
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
