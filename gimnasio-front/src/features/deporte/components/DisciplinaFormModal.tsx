// src/features/deporte/components/DisciplinaFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Disciplina } from '../services/deporteService';

const disciplinaSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  cantidad_cupos: z.coerce.number().min(1, 'La cantidad de cupos debe ser al menos 1'),
  descripcion: z.string().optional(),
  estado: z.string().min(1, 'El estado es requerido'),
});

type DisciplinaFormValues = z.infer<typeof disciplinaSchema>;

interface DisciplinaFormModalProps {
  isOpen: boolean;
  disciplinaToEdit: Disciplina | null;
  onClose: () => void;
  onSubmit: (data: DisciplinaFormValues) => void;
  isPending: boolean;
}

const DisciplinaFormModal: React.FC<DisciplinaFormModalProps> = ({
  isOpen,
  disciplinaToEdit,
  onClose,
  onSubmit,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DisciplinaFormValues>({
    resolver: zodResolver(disciplinaSchema),
    defaultValues: {
      nombre: '',
      cantidad_cupos: 30,
      descripcion: '',
      estado: 'activo',
    },
  });

  useEffect(() => {
    if (disciplinaToEdit) {
      reset({
        nombre: disciplinaToEdit.nombre,
        cantidad_cupos: disciplinaToEdit.cantidad_cupos ?? 30,
        descripcion: disciplinaToEdit.descripcion || '',
        estado: disciplinaToEdit.estado || 'activo',
      });
    } else {
      reset({
        nombre: '',
        cantidad_cupos: 30,
        descripcion: '',
        estado: 'activo',
      });
    }
  }, [disciplinaToEdit, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '480px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', marginBottom: '1.25rem' }}>
          {disciplinaToEdit ? 'Editar Disciplina Deportiva' : 'Nueva Disciplina Deportiva'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Nombre de la Disciplina *
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: Musculación, Funcional, Karate, CrossFit..."
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
            {errors.nombre && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                {errors.nombre.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Cantidad de Cupos / Capacidad Máxima *
            </label>
            <input
              type="number"
              min="1"
              {...register('cantidad_cupos')}
              placeholder="Ej: 30"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
            {errors.cantidad_cupos && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                {errors.cantidad_cupos.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Descripción / Objetivos
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Describa el enfoque o requerimientos..."
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Estado
            </label>
            <select
              {...register('estado')}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.55rem 1.1rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#003B70', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
            >
              {isPending ? 'Guardando...' : disciplinaToEdit ? 'Actualizar' : 'Crear Disciplina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisciplinaFormModal;
