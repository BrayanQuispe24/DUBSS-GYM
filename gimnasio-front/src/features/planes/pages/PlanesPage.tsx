import React, { useState } from 'react';
import { FaGem, FaPlus, FaTrash, FaPen, FaTags, FaClock } from 'react-icons/fa6';
import { usePlanes, useTarifas, useCreatePlan, useUpdatePlan, useDeletePlan, useCreateTarifa, useDeleteTarifa } from '../hooks/usePlanes';
import type { Plan, Tarifa } from '../services/planService';
import PlanFormModal from '../components/PlanFormModal';
import TarifaFormModal from '../components/TarifaFormModal';
import { useAuthStore } from '@/store/authStore';

const PlanesPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol === 'administrador';
  const isCliente = user?.rol === 'cliente';

  const { data: planes = [], isLoading: isLoadingPlanes } = usePlanes();
  const { data: tarifas = [], isLoading: isLoadingTarifas } = useTarifas();

  const [activeTab, setActiveTab] = useState<'planes' | 'tarifas'>('planes');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isTarifaModalOpen, setIsTarifaModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const deletePlanMutation = useDeletePlan();
  const createTarifaMutation = useCreateTarifa();
  const deleteTarifaMutation = useDeleteTarifa();

  const handleOpenCreatePlan = () => {
    setSelectedPlan(null);
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (p: Plan) => {
    setSelectedPlan(p);
    setIsPlanModalOpen(true);
  };

  const handleDeletePlan = (id: number) => {
    if (window.confirm('¿Desea eliminar este plan de suscripción?')) {
      deletePlanMutation.mutate(id);
    }
  };

  const handleDeleteTarifa = (id: number) => {
    if (window.confirm('¿Desea eliminar esta tarifa del catálogo?')) {
      deleteTarifaMutation.mutate(id);
    }
  };

  const handlePlanSubmit = (formData: any) => {
    if (selectedPlan) {
      updatePlanMutation.mutate(
        { id: selectedPlan.id, data: formData },
        { onSuccess: () => setIsPlanModalOpen(false) }
      );
    } else {
      createPlanMutation.mutate(formData, {
        onSuccess: () => setIsPlanModalOpen(false),
      });
    }
  };

  return (
    <section style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
            <span style={{
              width: '30px', height: '30px', borderRadius: '4px', background: 'var(--color-primary)',
              color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.90rem'
            }}>
              <FaGem />
            </span>
            Gestión de Membresías & Tarifas
          </h2>
          <p style={{ fontSize: '0.80rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
            Catálogo institucional de planes de suscripción, periodos de vigencia y aranceles universitarios.
          </p>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {activeTab === 'tarifas' && (
              <button
                onClick={() => setIsTarifaModalOpen(true)}
                style={{
                  padding: '0.50rem 0.95rem', borderRadius: '4px', border: '1px solid var(--color-primary)',
                  background: 'var(--color-primary)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em'
                }}
              >
                <FaTags /> Nueva Tarifa
              </button>
            )}
            {activeTab === 'planes' && (
              <button
                onClick={handleOpenCreatePlan}
                style={{
                  padding: '0.50rem 0.95rem', borderRadius: '4px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF', border: '1px solid var(--color-primary)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em'
                }}
              >
                <FaPlus /> Crear Plan
              </button>
            )}
          </div>
        )}
      </div>

      {/* ENTERPRISE TABS NAVIGATION */}
      {!isCliente && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-strong)', marginBottom: '1.5rem', gap: '2rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('planes')}
            style={{
              padding: '0.65rem 0.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'planes' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'planes' ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.80rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FaGem style={{ fontSize: '0.85rem' }} />
            Planes de Suscripción ({planes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tarifas')}
            style={{
              padding: '0.65rem 0.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'tarifas' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'tarifas' ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.80rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FaTags style={{ fontSize: '0.85rem' }} />
            Catálogo de Tarifas ({tarifas.length})
          </button>
        </div>
      )}

      {/* TAB: PLANES DE SUSCRIPCIÓN */}
      {activeTab === 'planes' && (
        <div>
          {isLoadingPlanes ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}>
              Cargando catálogo de planes institucionales...
            </div>
          ) : planes.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}>
              No se encontraron planes de suscripción configurados.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {planes.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border-strong)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top Accent Line */}
                  <div style={{
                    height: '3px',
                    width: '100%',
                    background: p.estado ? 'var(--color-primary)' : '#94A3B8',
                  }} />

                  <div style={{ padding: '1.25rem' }}>
                    {/* Header Icon + Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '4px',
                        background: 'var(--color-surface-muted)',
                        border: '1px solid var(--color-border-strong)',
                        color: 'var(--color-primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.90rem'
                      }}>
                        <FaGem />
                      </div>
                      <span style={{
                        fontSize: '0.70rem', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.03em',
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        background: p.estado ? '#ECFDF5' : 'var(--color-danger-bg)',
                        color: p.estado ? 'var(--color-success-text)' : 'var(--color-danger-text)',
                        border: `1px solid ${p.estado ? 'rgba(22, 163, 74, 0.35)' : 'rgba(220, 38, 38, 0.35)'}`,
                      }}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: p.estado ? '#10B981' : '#EF4444',
                          display: 'inline-block'
                        }} />
                        {p.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {/* Plan Title & Tarifa Chip */}
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
                      {p.nombre}
                    </h4>

                    {p.tarifa && (
                      <div style={{ marginBottom: '0.65rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-primary-text)',
                          background: 'var(--color-primary-soft)', padding: '0.15rem 0.5rem', borderRadius: '2px',
                          border: '1px solid rgba(220, 38, 38, 0.30)', textTransform: 'uppercase'
                        }}>
                          <FaTags style={{ fontSize: '0.65rem' }} /> Tarifa: {p.tarifa.nombre}
                        </span>
                      </div>
                    )}

                    <p style={{ fontSize: '0.80rem', color: 'var(--color-text-muted)', lineHeight: '1.45', marginBottom: '1rem', minHeight: '36px' }}>
                      {p.descripcion || 'Sin especificaciones registradas para este plan.'}
                    </p>

                    {/* Duration & Price Container */}
                    <div style={{
                      background: 'var(--color-surface-muted)',
                      padding: '0.75rem 0.95rem',
                      borderRadius: '4px',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '4px', background: 'var(--color-surface)',
                          border: '1px solid var(--color-border-strong)', color: 'var(--color-primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <FaClock style={{ fontSize: '0.75rem' }} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Duración</span>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>{p.duracion_dias} días</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Arancel</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary-text)', fontWeight: 800 }}>
                          {p.tarifa ? `Bs. ${p.tarifa.precio}` : 'Bs. 0.00'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isAdmin && (
                    <div style={{
                      display: 'flex', justifyContent: 'flex-end', gap: '0.4rem',
                      padding: '0.65rem 1rem', background: 'var(--color-surface-muted)', borderTop: '1px solid var(--color-border)'
                    }}>
                      <button
                        onClick={() => handleOpenEditPlan(p)}
                        style={{
                          background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', padding: '0.35rem 0.65rem',
                          borderRadius: '4px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em'
                        }}
                      >
                        <FaPen style={{ fontSize: '0.68rem' }} /> Editar
                      </button>
                      <button
                        onClick={() => handleDeletePlan(p.id)}
                        style={{
                          background: 'var(--color-danger-bg)', border: '1px solid rgba(220, 38, 38, 0.35)', padding: '0.35rem 0.65rem',
                          borderRadius: '4px', color: 'var(--color-danger-text)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em'
                        }}
                      >
                        <FaTrash style={{ fontSize: '0.68rem' }} /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: CATÁLOGO DE TARIFAS */}
      {activeTab === 'tarifas' && !isCliente && (
        <div>
          {isLoadingTarifas ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)' }}>
              Cargando catálogo arancelario...
            </div>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead style={{ background: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border-strong)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <tr>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Denominación Tarifa</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Precio (Bs.)</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Vigencia Inicio</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Vigencia Fin</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tarifas.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No hay tarifas registradas en el catálogo.
                      </td>
                    </tr>
                  ) : (
                    tarifas.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{t.nombre}</td>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-primary-text)' }}>Bs. {t.precio}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-muted)' }}>{t.fecha_inicio || 'Inmediata'}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-muted)' }}>{t.fecha_fin || 'Indefinida'}</td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteTarifa(t.id)}
                              style={{
                                background: 'var(--color-danger-bg)', border: '1px solid rgba(220, 38, 38, 0.35)', color: 'var(--color-danger-text)', cursor: 'pointer',
                                padding: '0.30rem 0.55rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.03em', display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                              }}
                              title="Eliminar Tarifa"
                            >
                              <FaTrash style={{ fontSize: '0.68rem' }} /> Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <PlanFormModal
        isOpen={isPlanModalOpen}
        planToEdit={selectedPlan}
        tarifas={tarifas}
        onClose={() => setIsPlanModalOpen(false)}
        onSubmit={handlePlanSubmit}
        isPending={createPlanMutation.isPending || updatePlanMutation.isPending}
      />

      <TarifaFormModal
        isOpen={isTarifaModalOpen}
        onClose={() => setIsTarifaModalOpen(false)}
        onSubmit={(data) => createTarifaMutation.mutate(data, { onSuccess: () => setIsTarifaModalOpen(false) })}
        isPending={createTarifaMutation.isPending}
      />
    </section>
  );
};

export default PlanesPage;
