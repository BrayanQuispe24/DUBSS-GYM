// src/features/inventario/components/AmbienteFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaXmark, FaBuildingFlag } from 'react-icons/fa6';
import type { Ambiente } from '../services/inventarioService';

const ambienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  estado: z.string(),
});

type AmbienteFormData = z.infer<typeof ambienteSchema>;

interface AmbienteFormModalProps {
  isOpen: boolean;
  ambienteToEdit: Ambiente | null;
  onClose: () => void;
  onSubmit: (data: AmbienteFormData) => void;
  isPending: boolean;
}

const AmbienteFormModal: React.FC<AmbienteFormModalProps> = ({
  isOpen,
  ambienteToEdit,
  onClose,
  onSubmit,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AmbienteFormData>({
    resolver: zodResolver(ambienteSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      estado: 'disponible',
    },
  });

  useEffect(() => {
    if (ambienteToEdit) {
      reset({
        nombre: ambienteToEdit.nombre || '',
        descripcion: ambienteToEdit.descripcion || '',
        estado: String(ambienteToEdit.estado || 'disponible'),
      });
    } else {
      reset({
        nombre: '',
        descripcion: '',
        estado: 'disponible',
      });
    }
  }, [ambienteToEdit, isOpen, reset]);

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
        zIndex: 9999,
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
        {/* Modal Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaBuildingFlag style={{ color: '#003B70', fontSize: '1.1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
              {ambienteToEdit ? 'Editar Ambiente / Espacio' : 'Registrar Nuevo Ambiente'}
            </h3>
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
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Nombre */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Nombre del Ambiente / Sala <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Sala de Musculación Principal, Zona Cardio"
                {...register('nombre')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: errors.nombre ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.nombre && (
                <span style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                  {errors.nombre.message}
                </span>
              )}
            </div>



            {/* Descripción */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Descripción o Ubicación
              </label>
              <textarea
                rows={3}
                placeholder="Indique detalles sobre la capacidad, equipos asignados o ubicación dentro del complejo UAGRM..."
                {...register('descripcion')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.6rem 1.2rem',
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
              {isPending ? 'Guardando...' : ambienteToEdit ? 'Actualizar Ambiente' : 'Registrar Ambiente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmbienteFormModal;
