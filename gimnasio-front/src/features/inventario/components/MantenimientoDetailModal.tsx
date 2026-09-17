// src/features/inventario/components/MantenimientoDetailModal.tsx
import React from 'react';
import { FaXmark, FaWrench, FaCalendarDays, FaCoins, FaCheck, FaRotateLeft } from 'react-icons/fa6';
import type { Mantenimiento } from '../services/inventarioService';
import { useUpdateMantenimiento } from '../hooks/useInventario';

interface MantenimientoDetailModalProps {
  isOpen: boolean;
  mantenimiento: Mantenimiento | null;
  onClose: () => void;
}

const MantenimientoDetailModal: React.FC<MantenimientoDetailModalProps> = ({
  isOpen,
  mantenimiento,
  onClose,
}) => {
  const updateMutation = useUpdateMantenimiento();

  if (!isOpen || !mantenimiento) return null;

  const isPendiente = ['1', 'true', 'pendiente', 'proceso'].includes(String(mantenimiento.estado).toLowerCase());

  const handleToggleEstado = () => {
    const nuevoEstado = isPendiente ? false : true;
    updateMutation.mutate(
      {
        id: mantenimiento.id,
        data: { estado: nuevoEstado as any },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

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
          maxWidth: '560px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 59, 112, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#003B70',
                fontSize: '1.1rem',
              }}
            >
              <FaWrench />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
                Orden de Mantenimiento #{mantenimiento.id}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                Boleta de servicio técnico de equipamiento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status Banner */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: isPendiente ? '#FEF3C7' : '#DCFCE7',
              border: isPendiente ? '1px solid #FCD34D' : '1px solid #86EFAC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isPendiente ? '#B45309' : '#15803D', letterSpacing: '0.5px' }}>
                ESTADO ACTUAL DE LA BOLETA
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isPendiente ? '#92400E' : '#14532D', marginTop: '0.1rem' }}>
                {isPendiente ? 'PENDIENTE DE EJECUCIÓN' : 'MANTENIMIENTO COMPLETADO'}
              </div>
              <div style={{ fontSize: '0.75rem', color: isPendiente ? '#B45309' : '#15803D', marginTop: '0.2rem' }}>
                {isPendiente
                  ? `Al completar, ${mantenimiento.cantidad || 1} unidad(es) retornarán al stock.`
                  : `Las ${mantenimiento.cantidad || 1} unidad(es) fueron devueltas al stock disponible.`}
              </div>
            </div>
            <button
              onClick={handleToggleEstado}
              disabled={updateMutation.isPending}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isPendiente ? '#15803D' : '#D97706',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              {isPendiente ? <><FaCheck /> Marcar como Completado</> : <><FaRotateLeft /> Reabrir Mantenimiento</>}
            </button>
          </div>

          {/* Grid Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block' }}>Equipo</span>
              <strong style={{ fontSize: '0.92rem', color: '#0B1727' }}>
                {mantenimiento.equipo?.nombre || `Equipo ID: ${mantenimiento.id_equipo}`}
              </strong>
              {mantenimiento.equipo?.codigo && (
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                  CÓD: {mantenimiento.equipo.codigo}
                </div>
              )}
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block' }}>Tipo de Mantenimiento</span>
              <strong style={{ fontSize: '0.92rem', color: '#0B1727' }}>
                {mantenimiento.tipo || 'Sin especificar'}
              </strong>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block' }}>Cantidad en Mantenimiento</span>
              <strong style={{ fontSize: '0.92rem', color: '#0369A1' }}>
                {mantenimiento.cantidad || 1} Unidades
              </strong>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaCalendarDays style={{ color: '#003B70' }} /> Fecha Inicio
              </span>
              <strong style={{ fontSize: '0.92rem', color: '#0B1727' }}>
                {mantenimiento.fecha_inicio || 'Sin fecha'}
              </strong>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaCoins style={{ color: '#D97706' }} /> Costo Estimado
              </span>
              <strong style={{ fontSize: '0.92rem', color: '#0B1727' }}>
                {mantenimiento.costo ? `Bs. ${mantenimiento.costo}` : 'Sin costo registrado'}
              </strong>
            </div>
          </div>

          {/* Description */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              Descripción de Trabajos / Detalles
            </span>
            <div
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '0.85rem',
                color: '#475569',
                minHeight: '60px',
              }}
            >
              {mantenimiento.descripcion || 'Sin descripción o detalles especificados.'}
            </div>
          </div>

          {/* Observaciones */}
          {mantenimiento.observacion && (
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Observaciones Adicionales
              </span>
              <div
                style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.85rem',
                  color: '#475569',
                }}
              >
                {mantenimiento.observacion}
              </div>
            </div>
          )}
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
            onClick={onClose}
            style={{
              padding: '0.55rem 1.3rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MantenimientoDetailModal;
