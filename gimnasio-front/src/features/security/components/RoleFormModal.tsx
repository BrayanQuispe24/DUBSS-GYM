// src/features/security/components/RoleFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Rol } from '../services/securityService';

const roleSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  estado: z.string().min(1, 'El estado es requerido'),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormModalProps {
  isOpen: boolean;
  rolToEdit: Rol | null;
  onClose: () => void;
  onSubmit: (data: RoleFormValues) => void;
  isPending: boolean;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  rolToEdit,
  onClose,
  onSubmit,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      estado: 'activo',
    },
  });

  useEffect(() => {
    if (rolToEdit) {
      const isActivo = rolToEdit.estado === true || rolToEdit.estado === 'activo' || String(rolToEdit.estado) === '1';
      reset({
        nombre: rolToEdit.nombre,
        descripcion: rolToEdit.descripcion || '',
        estado: isActivo ? 'activo' : 'inactivo',
      });
    } else {
      reset({
        nombre: '',
        descripcion: '',
        estado: 'activo',
      });
    }
  }, [rolToEdit, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
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
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #CBD5E1',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
            {rolToEdit ? 'Editar Rol de Sistema' : 'Nuevo Rol de Sistema'}
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Nombre del Rol *
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: Administrador, Instructor..."
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
            {errors.nombre && (
              <span style={{ color: '#DC2626', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block', fontWeight: 600 }}>
                {errors.nombre.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Describa la responsabilidad de este rol..."
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Estado
            </label>
            <select
              {...register('estado')}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                color: '#0F172A',
                backgroundColor: '#FFF',
                outline: 'none',
              }}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFF',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.80rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '4px',
                border: '1px solid #005FA8',
                backgroundColor: '#0077D4',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.80rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                cursor: 'pointer',
              }}
            >
              {isPending ? 'Guardando...' : rolToEdit ? 'Actualizar Rol' : 'Crear Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormModal;
