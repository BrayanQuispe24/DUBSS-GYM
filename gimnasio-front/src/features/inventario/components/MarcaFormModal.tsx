// src/features/inventario/components/MarcaFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaXmark, FaTag } from 'react-icons/fa6';
import type { Marca } from '../services/inventarioService';

const marcaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  estado: z.string().min(1, 'Seleccione un estado'),
});

type MarcaFormData = z.infer<typeof marcaSchema>;

interface MarcaFormModalProps {
  isOpen: boolean;
  marcaToEdit: Marca | null;
  onClose: () => void;
  onSubmit: (data: MarcaFormData) => void;
  isPending: boolean;
}

const MarcaFormModal: React.FC<MarcaFormModalProps> = ({
  isOpen,
  marcaToEdit,
  onClose,
  onSubmit,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarcaFormData>({
    resolver: zodResolver(marcaSchema),
    defaultValues: {
      nombre: '',
      estado: 'activo',
    },
  });

  useEffect(() => {
    if (marcaToEdit) {
      reset({
        nombre: marcaToEdit.nombre || '',
        estado: String(marcaToEdit.estado || 'activo'),
      });
    } else {
      reset({
        nombre: '',
        estado: 'activo',
      });
    }
  }, [marcaToEdit, isOpen, reset]);

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
          maxWidth: '480px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaTag style={{ color: '#003B70', fontSize: '1.1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
              {marcaToEdit ? 'Editar Marca' : 'Registrar Nueva Marca'}
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Nombre */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Nombre de la Marca / Fabricante <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Matrix, Life Fitness, Technogym, Hammer Strength"
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

            {/* Estado */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Estado <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                {...register('estado')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: errors.estado ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
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
              {isPending ? 'Guardando...' : marcaToEdit ? 'Actualizar Marca' : 'Registrar Marca'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarcaFormModal;
