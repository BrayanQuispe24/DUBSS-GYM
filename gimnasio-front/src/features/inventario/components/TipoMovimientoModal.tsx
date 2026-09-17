// src/features/inventario/components/TipoMovimientoModal.tsx
import React, { useState } from 'react';
import { FaXmark, FaPlus, FaPenToSquare, FaTrashCan, FaRightLeft, FaArrowUp, FaArrowDown } from 'react-icons/fa6';
import type { TipoMovimiento } from '../services/inventarioService';
import {
  useTiposMovimiento,
  useCreateTipoMovimiento,
  useUpdateTipoMovimiento,
  useDeleteTipoMovimiento,
} from '../hooks/useInventario';
import TipoMovimientoFormModal, { type TipoMovimientoFormData } from './TipoMovimientoFormModal';

interface TipoMovimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TipoMovimientoModal: React.FC<TipoMovimientoModalProps> = ({ isOpen, onClose }) => {
  const { data: tipos = [], isLoading } = useTiposMovimiento();
  const createMutation = useCreateTipoMovimiento();
  const updateMutation = useUpdateTipoMovimiento();
  const deleteMutation = useDeleteTipoMovimiento();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tipoToEdit, setTipoToEdit] = useState<TipoMovimiento | null>(null);

  if (!isOpen) return null;

  const handleOpenForm = (tipo?: TipoMovimiento) => {
    setTipoToEdit(tipo || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTipoToEdit(null);
  };

  const handleFormSubmit = (data: TipoMovimientoFormData) => {
    if (tipoToEdit) {
      updateMutation.mutate(
        { id: tipoToEdit.id, data },
        { onSuccess: () => handleCloseForm() }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => handleCloseForm() });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este tipo de movimiento?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
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
          zIndex: 9998,
          padding: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '720px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
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
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 59, 112, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#003B70',
                }}
              >
                <FaRightLeft />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
                  Tipos de Movimiento de Stock
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                  Administre las categorías de entradas y salidas de inventario.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => handleOpenForm()}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                  backgroundColor: '#003B70',
                  color: '#FFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <FaPlus /> Nuevo Tipo
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FaXmark />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                Cargando tipos de movimiento...
              </div>
            ) : tipos.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  color: '#64748B',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px border-dashed #CBD5E1',
                }}
              >
                <FaRightLeft style={{ fontSize: '2rem', color: '#CBD5E1', marginBottom: '0.5rem' }} />
                <p style={{ fontWeight: 700, margin: 0, color: '#334155' }}>
                  No hay tipos de movimiento registrados.
                </p>
                <p style={{ fontSize: '0.82rem', margin: '0.35rem 0 1rem 0' }}>
                  Registre tipos como "Entrada", "Salida por Deterioro" o "Baja de Equipo".
                </p>
                <button
                  onClick={() => handleOpenForm()}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    backgroundColor: '#003B70',
                    color: '#FFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Registrar Primer Tipo
                </button>
              </div>
            ) : (
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                      <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Nombre</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Efecto Stock</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Descripción</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tipos.map((t) => {
                      const esSalida = Boolean(t.es_salida) || t.nombre.toLowerCase().includes('salida') || t.nombre.toLowerCase().includes('baja') || t.nombre.toLowerCase().includes('egreso');

                      return (
                        <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>
                            #{t.id}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0B1727' }}>
                            {t.nombre}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                backgroundColor: esSalida ? '#FEE2E2' : '#DCFCE7',
                                color: esSalida ? '#B91C1C' : '#15803D',
                              }}
                            >
                              {esSalida ? <><FaArrowDown /> SALIDA (-)</> : <><FaArrowUp /> ENTRADA (+)</>}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748B' }}>
                            {t.descripcion || 'Sin descripción'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                              <button
                                onClick={() => handleOpenForm(t)}
                                title="Editar Tipo"
                                style={{
                                  padding: '0.35rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#F1F5F9',
                                  color: '#475569',
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                <FaPenToSquare />
                              </button>
                              <button
                                onClick={() => handleDelete(t.id)}
                                disabled={deleteMutation.isPending}
                                title="Eliminar Tipo"
                                style={{
                                  padding: '0.35rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#FEE2E2',
                                  color: '#DC2626',
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                <FaTrashCan />
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
          </div>

          {/* Footer */}
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
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFF',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <TipoMovimientoFormModal
        isOpen={isFormOpen}
        tipoToEdit={tipoToEdit}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
};

export default TipoMovimientoModal;
