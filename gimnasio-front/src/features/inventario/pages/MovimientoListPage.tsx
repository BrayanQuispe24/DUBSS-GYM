// src/features/inventario/pages/MovimientoListPage.tsx
import React, { useState, useEffect } from 'react';
import { FaRightLeft, FaPlus, FaListCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa6';
import {
  useMovimientosInventario,
  useEquipos,
  useCreateMovimiento,
  useTiposMovimiento,
} from '../hooks/useInventario';
import TipoMovimientoModal from '../components/TipoMovimientoModal';

const MovimientoListPage: React.FC = () => {
  const { data: movimientos = [], isLoading } = useMovimientosInventario();
  const { data: equipos = [] } = useEquipos();
  const { data: tiposMovimiento = [], isLoading: isLoadingTipos } = useTiposMovimiento();
  const createMutation = useCreateMovimiento();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTipoModalOpen, setIsTipoModalOpen] = useState(false);

  const [idEquipo, setIdEquipo] = useState<number | string>('');
  const [tipoMovimiento, setTipoMovimiento] = useState<number | string>('');
  const [cantidad, setCantidad] = useState<string>('1');
  const [motivo, setMotivo] = useState<string>('');

  useEffect(() => {
    if (tiposMovimiento.length > 0 && !tipoMovimiento) {
      setTipoMovimiento(tiposMovimiento[0].id);
    }
  }, [tiposMovimiento, tipoMovimiento]);

  const selectedEquipo = equipos.find((e) => String(e.id) === String(idEquipo));
  const selectedTipoObj = tiposMovimiento.find((t) => String(t.id) === String(tipoMovimiento));

  const esSalida = selectedTipoObj
    ? Boolean(selectedTipoObj.es_salida) || selectedTipoObj.nombre.toLowerCase().includes('salida') || selectedTipoObj.nombre.toLowerCase().includes('baja') || selectedTipoObj.nombre.toLowerCase().includes('egreso')
    : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cantNum = parseInt(cantidad, 10);
    if (!idEquipo || !tipoMovimiento || isNaN(cantNum) || cantNum === 0) return;

    createMutation.mutate(
      {
        fecha_movimiento: new Date().toISOString().split('T')[0],
        cantidad: cantNum,
        motivo,
        id_equipo: Number(idEquipo),
        id_tipo_movimiento: Number(tipoMovimiento),
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setMotivo('');
          setCantidad('1');
        },
      }
    );
  };

  const cantAbs = Math.abs(parseInt(cantidad, 10) || 0);

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaRightLeft style={{ color: '#003B70' }} /> Movimientos de Stock e Inventario
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Registro de entradas por compra o donación y salidas por deterioro, traslado o baja.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setIsTipoModalOpen(true)}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#003B70',
              border: '1px solid #CBD5E1',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FaListCheck /> Tipos de Movimiento
          </button>
          <button
            onClick={() => {
              if (tiposMovimiento.length > 0 && !tipoMovimiento) {
                setTipoMovimiento(tiposMovimiento[0].id);
              }
              setIsModalOpen(true);
            }}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 59, 112, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FaPlus /> Registrar Movimiento
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          Cargando bitácora de movimientos de stock...
        </div>
      ) : movimientos.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 2rem',
            color: '#64748B',
            backgroundColor: '#FFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
          }}
        >
          <FaRightLeft style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
          <p style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', margin: 0 }}>
            No hay movimientos de stock registrados.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>
            Haga clic en "Registrar Movimiento" para añadir entradas o salidas de equipos.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Fecha</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Equipo</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Tipo</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Cantidad</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Motivo / Detalle</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m) => {
                const tipoNombre = (m.tipoMovimiento?.nombre || '').toUpperCase();
                const esMovSalida = Boolean(m.tipoMovimiento?.es_salida) || tipoNombre.includes('SALIDA') || tipoNombre.includes('EGRESO') || tipoNombre.includes('BAJA');

                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.85rem 1.25rem', color: '#64748B' }}>
                      {m.fecha_hora ? new Date(m.fecha_hora).toLocaleDateString() : m.fecha_movimiento || 'Sin fecha'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                      {m.equipo?.nombre || `Equipo ID: ${m.id_equipo}`}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: esMovSalida ? '#FEE2E2' : '#DCFCE7',
                          color: esMovSalida ? '#DC2626' : '#15803D',
                        }}
                      >
                        {m.tipoMovimiento?.nombre || (esMovSalida ? 'SALIDA' : 'ENTRADA')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 800 }}>
                      {esMovSalida ? `-${m.cantidad}` : `+${m.cantidad}`} Unidades
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                      {m.motivo || 'Sin especificar'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para registrar movimiento de stock */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(11, 23, 39, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '12px',
              padding: '1.75rem',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', marginBottom: '1.25rem' }}>
              Registrar Movimiento de Stock
            </h3>

            {tiposMovimiento.length === 0 && !isLoadingTipos && (
              <div
                style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '0.82rem',
                  marginBottom: '1rem',
                  border: '1px solid #FCD34D',
                }}
              >
                <strong>No existen tipos de movimiento.</strong> Debe crear al menos un tipo (ej: Entrada, Salida) para registrar movimientos.
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsTipoModalOpen(true);
                  }}
                  style={{
                    display: 'block',
                    marginTop: '0.5rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    backgroundColor: '#B45309',
                    color: '#FFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  + Crear Tipo de Movimiento Ahora
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Equipo *
                </label>
                <select
                  value={idEquipo}
                  onChange={(e) => setIdEquipo(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                >
                  <option value="">Seleccione equipo...</option>
                  {equipos.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.nombre} (Stock actual: {eq.cantidad})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Tipo de Movimiento *
                </label>
                <select
                  value={tipoMovimiento}
                  onChange={(e) => setTipoMovimiento(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                >
                  {tiposMovimiento.length === 0 ? (
                    <option value="">No hay tipos registrados...</option>
                  ) : (
                    tiposMovimiento.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre} {t.es_salida ? '(- Salida)' : '(+ Entrada)'}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Cantidad *
                </label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  required
                  placeholder="Ej: 10 o -10"
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              {/* Dynamic preview of stock effect */}
              {selectedEquipo && cantAbs > 0 && (
                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    backgroundColor: esSalida ? '#FEF2F2' : '#F0FDF4',
                    border: esSalida ? '1px solid #FCA5A5' : '1px solid #86EFAC',
                    color: esSalida ? '#991B1B' : '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {esSalida ? <FaArrowDown /> : <FaArrowUp />}
                  <div>
                    <strong>Efecto en Stock:</strong> Se {esSalida ? 'RESTARÁN' : 'SUMARÁN'} {cantAbs} unidad(es).
                    <br />
                    Stock actual ({selectedEquipo.cantidad}) &rarr; {esSalida ? Math.max(0, selectedEquipo.cantidad - cantAbs) : selectedEquipo.cantidad + cantAbs}
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Motivo
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={2}
                  placeholder="Ej: Compra nueva, desgaste por uso, rotura..."
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.55rem 1.1rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || tiposMovimiento.length === 0}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#003B70',
                    color: '#FFF',
                    fontWeight: 700,
                    cursor: createMutation.isPending || tiposMovimiento.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {createMutation.isPending ? 'Guardando...' : 'Registrar Movimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para administrar tipos de movimiento */}
      <TipoMovimientoModal
        isOpen={isTipoModalOpen}
        onClose={() => setIsTipoModalOpen(false)}
      />
    </section>
  );
};

export default MovimientoListPage;
