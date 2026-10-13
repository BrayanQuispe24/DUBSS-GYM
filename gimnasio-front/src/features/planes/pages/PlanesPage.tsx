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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
            <span style={{
              width: '30px', height: '30px', borderRadius: '4px', background: '#0077D4',
              color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.90rem'
            }}>
              <FaGem />
            </span>
            Gestión de Membresías & Tarifas
          </h2>
          <p style={{ fontSize: '0.80rem', color: '#64748B', marginTop: '0.25rem', marginBottom: 0 }}>
            Catálogo institucional de planes de suscripción, periodos de vigencia y aranceles universitarios.
          </p>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {activeTab === 'tarifas' && (
              <button
                onClick={() => setIsTarifaModalOpen(true)}
                style={{
                  padding: '0.50rem 0.95rem', borderRadius: '4px', border: '1px solid #005FA8',
                  background: '#0077D4', color: '#FFFFFF', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
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
                  background: '#0077D4',
                  color: '#FFFFFF', border: '1px solid #005FA8', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
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
        <div style={{ display: 'flex', borderBottom: '1px solid #CBD5E1', marginBottom: '1.5rem', gap: '2rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('planes')}
            style={{
              padding: '0.65rem 0.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'planes' ? '2px solid #0077D4' : '2px solid transparent',
              color: activeTab === 'planes' ? '#0077D4' : '#64748B',
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
              borderBottom: activeTab === 'tarifas' ? '2px solid #0077D4' : '2px solid transparent',
              color: activeTab === 'tarifas' ? '#0077D4' : '#64748B',
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
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}>
              Cargando catálogo de planes institucionales...
            </div>
          ) : planes.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}>
              No se encontraron planes de suscripción configurados.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {planes.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
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
                    background: p.estado ? '#0077D4' : '#94A3B8',
                  }} />

                  <div style={{ padding: '1.25rem' }}>
                    {/* Header Icon + Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '4px',
                        background: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        color: '#0077D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.90rem'
                      }}>
                        <FaGem />
                      </div>
                      <span style={{
                        fontSize: '0.70rem', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.03em',
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        background: p.estado ? '#ECFDF5' : '#FEF2F2',
                        color: p.estado ? '#047857' : '#B91C1C',
                        border: `1px solid ${p.estado ? '#A7F3D0' : '#FECACA'}`,
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
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
                      {p.nombre}
                    </h4>

                    {p.tarifa && (
                      <div style={{ marginBottom: '0.65rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          fontSize: '0.70rem', fontWeight: 700, color: '#0077D4',
                          background: '#F0F7FF', padding: '0.15rem 0.5rem', borderRadius: '2px',
                          border: '1px solid #BAE6FD', textTransform: 'uppercase'
                        }}>
                          <FaTags style={{ fontSize: '0.65rem' }} /> Tarifa: {p.tarifa.nombre}
                        </span>
                      </div>
                    )}

                    <p style={{ fontSize: '0.80rem', color: '#64748B', lineHeight: '1.45', marginBottom: '1rem', minHeight: '36px' }}>
                      {p.descripcion || 'Sin especificaciones registradas para este plan.'}
                    </p>

                    {/* Duration & Price Container */}
                    <div style={{
                      background: '#F8FAFC',
                      padding: '0.75rem 0.95rem',
                      borderRadius: '4px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '4px', background: '#FFFFFF',
                          border: '1px solid #CBD5E1', color: '#0077D4', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <FaClock style={{ fontSize: '0.75rem' }} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Duración</span>
                          <strong style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 700 }}>{p.duracion_dias} días</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Arancel</span>
                        <strong style={{ fontSize: '1.1rem', color: '#0077D4', fontWeight: 800 }}>
                          {p.tarifa ? `Bs. ${p.tarifa.precio}` : 'Bs. 0.00'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isAdmin && (
                    <div style={{
                      display: 'flex', justifyContent: 'flex-end', gap: '0.4rem',
                      padding: '0.65rem 1rem', background: '#FAFAFA', borderTop: '1px solid #E2E8F0'
                    }}>
                      <button
                        onClick={() => handleOpenEditPlan(p)}
                        style={{
                          background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '0.35rem 0.65rem',
                          borderRadius: '4px', color: '#334155', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em'
                        }}
                      >
                        <FaPen style={{ fontSize: '0.68rem' }} /> Editar
                      </button>
                      <button
                        onClick={() => handleDeletePlan(p.id)}
                        style={{
                          background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '0.35rem 0.65rem',
                          borderRadius: '4px', color: '#DC2626', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
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
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem', background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
              Cargando catálogo arancelario...
            </div>
          ) : (
            <div style={{ background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                        No hay tarifas registradas en el catálogo.
                      </td>
                    </tr>
                  ) : (
                    tarifas.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>{t.nombre}</td>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0077D4' }}>Bs. {t.precio}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>{t.fecha_inicio || 'Inmediata'}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>{t.fecha_fin || 'Indefinida'}</td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteTarifa(t.id)}
                              style={{
                                background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', cursor: 'pointer',
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
