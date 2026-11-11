// src/features/inventario/pages/MantenimientoListPage.tsx
import React, { useState } from 'react';
import { FaWrench, FaPlus, FaEye, FaRotate } from 'react-icons/fa6';
import {
  useMantenimientos,
  useEquipos,
  useCreateMantenimiento,
  useUpdateMantenimiento,
} from '../hooks/useInventario';
import type { Mantenimiento } from '../services/inventarioService';
import MantenimientoDetailModal from '../components/MantenimientoDetailModal';

const MantenimientoListPage: React.FC = () => {
  const { data: mantenimientos = [], isLoading } = useMantenimientos();
  const { data: equipos = [] } = useEquipos();
  const createMutation = useCreateMantenimiento();
  const updateMutation = useUpdateMantenimiento();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<Mantenimiento | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [tipo, setTipo] = useState('Preventivo');
  const [cantidad, setCantidad] = useState<number | string>(1);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [costo, setCosto] = useState<number | string>('');
  const [idEquipo, setIdEquipo] = useState<number | string>('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idEquipo || !fechaInicio || Number(cantidad) <= 0) return;

    createMutation.mutate(
      {
        tipo,
        cantidad: Number(cantidad),
        fecha_inicio: fechaInicio,
        costo: costo ? Number(costo) : undefined,
        id_equipo: Number(idEquipo),
        descripcion,
        estado: '1',
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setDescripcion('');
          setCosto('');
          setCantidad(1);
        },
      }
    );
  };

  const handleOpenDetail = (mant: Mantenimiento) => {
    setSelectedMantenimiento(mant);
    setIsDetailModalOpen(true);
  };

  const handleToggleEstado = (mant: Mantenimiento) => {
    const isPendiente = ['1', 'true', 'pendiente', 'proceso'].includes(String(mant.estado).toLowerCase());
    const nuevoEstado = isPendiente ? false : true;

    updateMutation.mutate({
      id: mant.id,
      data: { estado: nuevoEstado as any },
    });
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaWrench style={{ color: 'var(--color-primary-text)' }} /> Gestión de Mantenimientos de Equipamiento
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Programación preventivas y correctivas de máquinas de gimnasio, lubricación y cambio de cables.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #990000 0%, #570000 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(153, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaPlus /> Registrar Mantenimiento
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Cargando registro de mantenimientos...</div>
      ) : mantenimientos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <FaWrench style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
          <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            No hay órdenes de mantenimiento registradas.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Equipo</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Cantidad</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Tipo</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Fecha Inicio</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Costo (Bs)</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Estado</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((mant) => {
                const isPendiente = ['1', 'true', 'pendiente', 'proceso'].includes(String(mant.estado).toLowerCase());

                return (
                  <tr key={mant.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {mant.equipo?.nombre || `Equipo ID: ${mant.id_equipo}`}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>
                      {mant.cantidad || 1} Unidades
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--color-text-secondary)' }}>
                      {mant.tipo}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--color-text-muted)' }}>
                      {mant.fecha_inicio}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>
                      {mant.costo ? `Bs. ${mant.costo}` : 'Sin costo'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: isPendiente ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
                          color: isPendiente ? 'var(--color-warning-text)' : 'var(--color-success-text)',
                        }}
                      >
                        {isPendiente ? 'PENDIENTE' : 'COMPLETADO'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenDetail(mant)}
                          title="Ver Detalle de Boleta"
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '6px',
                            backgroundColor: 'var(--color-surface-muted)',
                            color: 'var(--color-primary-text)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                          }}
                        >
                          <FaEye /> Ver
                        </button>
                        <button
                          onClick={() => handleToggleEstado(mant)}
                          disabled={updateMutation.isPending}
                          title={isPendiente ? 'Marcar como Completado' : 'Reabrir como Pendiente'}
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '6px',
                            backgroundColor: isPendiente ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                            color: isPendiente ? 'var(--color-success-text)' : 'var(--color-warning-text)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                          }}
                        >
                          <FaRotate /> {isPendiente ? 'Completar' : 'Reabrir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Registrar Mantenimiento */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 23, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}>Nueva Orden de Mantenimiento</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>Equipo *</label>
                <select value={idEquipo} onChange={(e) => setIdEquipo(e.target.value)} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem' }}>
                  <option value="">Seleccione equipo...</option>
                  {equipos.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.nombre} (Stock disponible: {eq.cantidad})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>Tipo Mantenimiento *</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem' }}>
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                    <option value="Calibración">Calibración</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>Cantidad Equipos *</label>
                  <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e.target.value)} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>Fecha Inicio *</label>
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>Costo Estimado (Bs)</label>
                <input type="number" min={0} value={costo} onChange={(e) => setCosto(e.target.value)} placeholder="Ej: 150" style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>Descripción / Trabajos</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} placeholder="Detalle el trabajo técnico..." style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.55rem 1.1rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={createMutation.isPending} style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>{createMutation.isPending ? 'Guardando...' : 'Crear Orden'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Detalles */}
      <MantenimientoDetailModal
        isOpen={isDetailModalOpen}
        mantenimiento={selectedMantenimiento}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </section>
  );
};

export default MantenimientoListPage;
