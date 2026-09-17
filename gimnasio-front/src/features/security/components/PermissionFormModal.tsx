// src/features/security/components/PermissionFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Permiso } from '../services/securityService';

const permisoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
});

type PermisoFormValues = z.infer<typeof permisoSchema>;

interface PermissionFormModalProps {
  isOpen: boolean;
  permisoToEdit: Permiso | null;
  onClose: () => void;
  onSubmit: (data: PermisoFormValues) => void;
  isPending: boolean;
}

const PermissionFormModal: React.FC<PermissionFormModalProps> = ({
  isOpen,
  permisoToEdit,
  onClose,
  onSubmit,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermisoFormValues>({
    resolver: zodResolver(permisoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  });

  useEffect(() => {
    if (permisoToEdit) {
      reset({
        nombre: permisoToEdit.nombre,
        descripcion: permisoToEdit.descripcion || '',
      });
    } else {
      reset({
        nombre: '',
        descripcion: '',
      });
    }
  }, [permisoToEdit, reset, isOpen]);

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
          {permisoToEdit ? 'Editar Permiso del Sistema' : 'Nuevo Permiso del Sistema'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Nombre de la Facultad / Permiso *
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: gestionar_usuarios, ver_reportes, editar_inventario..."
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
              Descripción / Alcance
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Describa la acción o módulo que habilita este permiso..."
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
              }}
            />
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
              {isPending ? 'Guardando...' : permisoToEdit ? 'Actualizar Permiso' : 'Crear Permiso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionFormModal;
