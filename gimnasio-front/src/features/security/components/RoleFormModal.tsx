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
        borderRadius: '12px',
        padding: '1.75rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', marginBottom: '1.25rem' }}>
          {rolToEdit ? 'Editar Rol de Sistema' : 'Nuevo Rol de Sistema'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Nombre del Rol *
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: Administrador, Instructor..."
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
              }}
            />
            {errors.nombre && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                {errors.nombre.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Describa la responsabilidad de este rol..."
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Estado
            </label>
            <select
              {...register('estado')}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
              }}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFF',
                color: '#475569',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#003B70',
                color: '#FFF',
                fontWeight: 700,
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
