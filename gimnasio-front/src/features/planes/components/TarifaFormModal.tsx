// src/features/planes/components/TarifaFormModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaXmark } from 'react-icons/fa6';

const tarifaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  precio: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  estado: z.boolean(),
});

type TarifaFormData = {
  nombre: string;
  precio: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: boolean;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TarifaFormData) => void;
  isPending: boolean;
}

const TarifaFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, isPending }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TarifaFormData>({
    resolver: zodResolver(tarifaSchema) as any,
    defaultValues: {
      nombre: '',
      precio: 0,
      estado: true,
    },
  });

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '4px', width: '100%', maxWidth: '480px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #CBD5E1',
      }}>
        <div style={{
          padding: '1rem 1.5rem', background: '#0F172A', color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', margin: 0 }}>
            Nueva Tarifa Institucional
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.1rem', padding: '0.2rem' }}>
            <FaXmark />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Nombre de la Tarifa *
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: Tarifa Regular Estudiante UAGRM"
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
              Precio (Bs.) *
            </label>
            <input
              type="number"
              step="0.5"
              {...register('precio')}
              style={{
                width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px',
                border: errors.precio ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: '0.82rem',
                color: '#0F172A', outline: 'none',
              }}
            />
            {errors.precio && <span style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>{errors.precio.message}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                Vigente Desde
              </label>
              <input
                type="date"
                {...register('fecha_inicio')}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', color: '#0F172A', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                Vigente Hasta
              </label>
              <input
                type="date"
                {...register('fecha_fin')}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', color: '#0F172A', outline: 'none' }}
              />
            </div>
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
              {isPending ? 'Guardando...' : 'Guardar Tarifa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TarifaFormModal;
