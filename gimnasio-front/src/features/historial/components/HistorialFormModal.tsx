// src/features/historial/components/HistorialFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Historial } from '../services/historialService';

const historialSchema = z.object({
  id_usuario: z.coerce.number().min(1, 'El ID de usuario es requerido'),
  antecedentes: z.string().optional(),
  observaciones: z.string().optional(),
  estado: z.string().min(1, 'El estado es requerido'),
});

type HistorialFormValues = z.infer<typeof historialSchema>;

interface HistorialFormModalProps {
  isOpen: boolean;
  historialToEdit: Historial | null;
  onClose: () => void;
  onSubmit: (data: HistorialFormValues) => void;
  isPending: boolean;
}

const HistorialFormModal: React.FC<HistorialFormModalProps> = ({
  isOpen,
  historialToEdit,
  onClose,
  onSubmit,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HistorialFormValues>({
    resolver: zodResolver(historialSchema),
    defaultValues: {
      id_usuario: 1,
      antecedentes: '',
      observaciones: '',
      estado: 'activo',
    },
  });

  const formatAntecedentesToStr = (ant: any) => {
    if (!ant) return '';
    if (typeof ant === 'string') return ant;
    if (Array.isArray(ant)) {
      if (ant.length === 0) return '';
      return ant.map((a: any) => {
        const items = [];
        if (a.tiene_enfermedades_cardiovasculares) items.push(`Cardio: ${a.detalle_enfermedades_cardiovasculares || 'Si'}`);
        if (a.tiene_hipertension_arterial) items.push(`Hipertensión: ${a.detalle_hipertension_arterial || 'Si'}`);
        if (a.tiene_enfermedades_pulmonares) items.push(`Pulmonar/Asma: ${a.detalle_enfermedades_pulmonares || 'Si'}`);
        if (a.tiene_diabetes) items.push(`Diabetes: ${a.detalle_diabetes || 'Si'}`);
        if (a.tiene_lesiones) items.push(`Lesiones: ${a.detalle_lesiones || 'Si'}`);
        if (a.tiene_alergias) items.push(`Alergias: ${a.detalle_alergias || 'Si'}`);
        if (a.observaciones) items.push(`Obs: ${a.observaciones}`);
        return items.join(', ');
      }).filter(Boolean).join('; ');
    }
    return '';
  };

  useEffect(() => {
    if (historialToEdit) {
      reset({
        id_usuario: historialToEdit.id_usuario,
        antecedentes: formatAntecedentesToStr(historialToEdit.antecedentes),
        observaciones: historialToEdit.observaciones_generales || historialToEdit.observaciones || '',
        estado: historialToEdit.estado || 'activo',
      });
    } else {
      reset({
        id_usuario: 1,
        antecedentes: '',
        observaciones: '',
        estado: 'activo',
      });
    }
  }, [historialToEdit, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', marginBottom: '1.25rem' }}>
          {historialToEdit ? 'Editar Historial Clínico / Deportivo' : 'Nuevo Historial Clínico / Deportivo'}
        </h3>

        <form onSubmit={handleSubmit((data) => onSubmit({ ...data, observaciones_generales: data.observaciones } as any))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              ID Usuario / Socio UAGRM *
            </label>
            <input
              type="number"
              {...register('id_usuario')}
              placeholder="Ej: 1"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
            {errors.id_usuario && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                {errors.id_usuario.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Antecedentes Médicos / Patologías
            </label>
            <textarea
              {...register('antecedentes')}
              rows={3}
              placeholder="Ej: Asma, hipertensión, lesión en rodilla..."
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Observaciones del Instructor / Médico
            </label>
            <textarea
              {...register('observaciones')}
              rows={3}
              placeholder="Ej: Requiere adaptaciones en ejercicios de impacto..."
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
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
              {isPending ? 'Guardando...' : historialToEdit ? 'Actualizar Historial' : 'Crear Historial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HistorialFormModal;
