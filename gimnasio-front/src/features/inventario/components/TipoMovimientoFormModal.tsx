// src/features/inventario/components/TipoMovimientoFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaXmark, FaRightLeft, FaArrowUp, FaArrowDown, FaCheck } from 'react-icons/fa6';
import type { TipoMovimiento } from '../services/inventarioService';

const tipoMovimientoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  es_salida: z.boolean(),
});

export type TipoMovimientoFormData = z.infer<typeof tipoMovimientoSchema>;

interface TipoMovimientoFormModalProps {
  isOpen: boolean;
  tipoToEdit: TipoMovimiento | null;
  onClose: () => void;
  onSubmit: (data: TipoMovimientoFormData) => void;
  isPending: boolean;
}

const TipoMovimientoFormModal: React.FC<TipoMovimientoFormModalProps> = ({
  isOpen,
  tipoToEdit,
  onClose,
  onSubmit,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TipoMovimientoFormData>({
    resolver: zodResolver(tipoMovimientoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      es_salida: false,
    },
  });

  const currentEsSalida = watch('es_salida');

  useEffect(() => {
    if (tipoToEdit) {
      reset({
        nombre: tipoToEdit.nombre || '',
        descripcion: tipoToEdit.descripcion || '',
        es_salida: Boolean(tipoToEdit.es_salida),
      });
    } else {
      reset({
        nombre: '',
        descripcion: '',
        es_salida: false,
      });
    }
  }, [tipoToEdit, isOpen, reset]);

  if (!isOpen) return null;

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
        zIndex: 10000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
                {tipoToEdit ? 'Editar Tipo de Movimiento' : 'Nuevo Tipo de Movimiento'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                Configure si el movimiento sumará o restará unidades del inventario.
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
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '0.35rem',
                }}
              >
                Nombre del Tipo *
              </label>
              <input
                type="text"
                placeholder="Ej: Entrada por Compra, Salida por Deterioro, Baja..."
                {...register('nombre')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: errors.nombre ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.nombre && (
                <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                  {errors.nombre.message}
                </span>
              )}
            </div>

            {/* Naturaleza / Efecto del Movimiento: Entrada u Salida (Dos Checkboxes excluyentes) */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '0.5rem',
                }}
              >
                Naturaleza del Movimiento (Selección Obligatoria) *
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {/* Opción ENTRADA */}
                <div
                  onClick={() => setValue('es_salida', false, { shouldValidate: true })}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: !currentEsSalida ? '2px solid #16A34A' : '1px solid #E2E8F0',
                    backgroundColor: !currentEsSalida ? '#F0FDF4' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!currentEsSalida}
                    onChange={() => setValue('es_salida', false, { shouldValidate: true })}
                    style={{ accentColor: '#16A34A', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: !currentEsSalida ? '#15803D' : '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FaArrowUp style={{ fontSize: '0.75rem' }} /> ENTRADA
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Sumar / Incrementa Stock (+)</span>
                  </div>
                </div>

                {/* Opción SALIDA */}
                <div
                  onClick={() => setValue('es_salida', true, { shouldValidate: true })}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: currentEsSalida ? '2px solid #DC2626' : '1px solid #E2E8F0',
                    backgroundColor: currentEsSalida ? '#FEF2F2' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={currentEsSalida}
                    onChange={() => setValue('es_salida', true, { shouldValidate: true })}
                    style={{ accentColor: '#DC2626', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: currentEsSalida ? '#B91C1C' : '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FaArrowDown style={{ fontSize: '0.75rem' }} /> SALIDA
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Restar / Reduce Stock (-)</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '0.35rem',
                }}
              >
                Descripción / Detalles
              </label>
              <textarea
                rows={2}
                placeholder="Explicación o detalles del tipo de movimiento..."
                {...register('descripcion')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1.1rem',
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
                padding: '0.55rem 1.3rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#003B70',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: isPending ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 10px rgba(0, 59, 112, 0.2)',
              }}
            >
              {isPending ? 'Guardando...' : tipoToEdit ? 'Actualizar Tipo' : 'Registrar Tipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipoMovimientoFormModal;
