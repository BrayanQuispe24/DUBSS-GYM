// src/features/planes/components/PlanFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Plan, Tarifa } from '../services/planService';
import { FaXmark } from 'react-icons/fa6';

const planSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  duracion_dias: z.coerce.number().min(1, 'La duración debe ser mayor a 0 días'),
  id_tarifa: z.coerce.number().optional(),
  estado: z.boolean(),
});

type PlanFormData = {
  nombre: string;
  descripcion?: string;
  duracion_dias: number;
  id_tarifa?: number;
  estado: boolean;
};

interface Props {
  isOpen: boolean;
  planToEdit?: Plan | null;
  tarifas: Tarifa[];
  onClose: () => void;
  onSubmit: (data: PlanFormData) => void;
  isPending: boolean;
}

const PlanFormModal: React.FC<Props> = ({ isOpen, planToEdit, tarifas, onClose, onSubmit, isPending }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema) as any,
    defaultValues: {
      nombre: '',
      descripcion: '',
      duracion_dias: 30,
      estado: true,
    },
  });

  useEffect(() => {
    if (planToEdit) {
      setValue('nombre', planToEdit.nombre);
      setValue('descripcion', planToEdit.descripcion || '');
      setValue('duracion_dias', planToEdit.duracion_dias);
      setValue('id_tarifa', planToEdit.id_tarifa || undefined);
      setValue('estado', planToEdit.estado);
    } else {
      reset({ nombre: '', descripcion: '', duracion_dias: 30, estado: true });
    }
  }, [planToEdit, setValue, reset]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '4px', width: '100%', maxWidth: '520px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #CBD5E1',
      }}>
        <div style={{
          padding: '1rem 1.5rem', background: '#0F172A', color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', margin: 0 }}>
            {planToEdit ? 'Editar Plan de Suscripción' : 'Nuevo Plan de Suscripción'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.1rem', padding: '0.2rem' }}>
            <FaXmark />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit(data))} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Nombre del Plan *
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: Membresía Estudiantil Trimestral"
              style={{
                width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px',
                border: errors.nombre ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: '0.82rem',
                color: '#0F172A', outline: 'none',
              }}
            />
            {errors.nombre && <span style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>{errors.nombre.message}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Descripción del Plan
            </label>
            <textarea
              {...register('descripcion')}
              placeholder="Detalle de beneficios e instalaciones incluidas"
              rows={3}
              style={{
                width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px',
                border: '1px solid #CBD5E1', fontSize: '0.82rem', color: '#0F172A', outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                Duración (Días) *
              </label>
              <input
                type="number"
                {...register('duracion_dias')}
                style={{
                  width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px',
                  border: errors.duracion_dias ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: '0.82rem',
                  color: '#0F172A', outline: 'none',
                }}
              />
              {errors.duracion_dias && <span style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>{errors.duracion_dias.message}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                Tarifa Asociada
              </label>
              <select
                {...register('id_tarifa')}
                style={{
                  width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px',
                  border: '1px solid #CBD5E1', fontSize: '0.82rem', backgroundColor: '#FFF',
                  color: '#0F172A', outline: 'none',
                }}
              >
                <option value="">-- Sin tarifa fija --</option>
                {tarifas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} - Bs. {t.precio}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <input type="checkbox" id="estadoPlan" {...register('estado')} style={{ cursor: 'pointer', borderRadius: '2px' }} />
            <label htmlFor="estadoPlan" style={{ fontSize: '0.80rem', color: '#334155', cursor: 'pointer', fontWeight: 600 }}>
              Plan Activo en el catálogo
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.50rem 1rem', borderRadius: '4px', border: '1px solid #CBD5E1',
                background: '#FFFFFF', color: '#475569', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.03em',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '0.50rem 1.25rem', borderRadius: '4px', border: '1px solid #005FA8',
                background: '#0077D4',
                color: '#FFFFFF', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.03em',
              }}
            >
              {isPending ? 'Guardando...' : planToEdit ? 'Actualizar Plan' : 'Guardar Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanFormModal;
