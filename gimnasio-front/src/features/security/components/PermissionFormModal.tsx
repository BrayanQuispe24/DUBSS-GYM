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
            {permisoToEdit ? 'Editar Permiso del Sistema' : 'Nuevo Permiso del Sistema'}
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Nombre de la Facultad / Permiso *
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: gestionar_usuarios, ver_reportes, editar_inventario..."
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
              Descripción / Alcance
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Describa la acción o módulo que habilita este permiso..."
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
              {isPending ? 'Guardando...' : permisoToEdit ? 'Actualizar Permiso' : 'Crear Permiso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionFormModal;
