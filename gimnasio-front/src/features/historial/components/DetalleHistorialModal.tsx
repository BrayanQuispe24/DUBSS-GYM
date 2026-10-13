// src/features/historial/components/DetalleHistorialModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaNotesMedical, FaPlus, FaCalendarDays, FaCircleInfo } from 'react-icons/fa6';
import type { Historial } from '../services/historialService';
import { useCreateDetalleHistorial } from '../hooks/useHistorial';

const detalleSchema = z.object({
  peso: z.coerce.number().optional(),
  altura: z.coerce.number().optional(),
  porcentaje_grasa: z.coerce.number().optional(),
  masa_muscular: z.coerce.number().optional(),
  presion: z.string().optional(),
  fecha_registro: z.string().min(1, 'La fecha es requerida'),
});

type DetalleFormValues = z.infer<typeof detalleSchema>;

interface DetalleHistorialModalProps {
  isOpen: boolean;
  historial: Historial | null;
  onClose: () => void;
}

const DetalleHistorialModal: React.FC<DetalleHistorialModalProps> = ({
  isOpen,
  historial,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const createDetalleMutation = useCreateDetalleHistorial();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DetalleFormValues>({
    resolver: zodResolver(detalleSchema),
    defaultValues: {
      peso: undefined,
      altura: undefined,
      porcentaje_grasa: undefined,
      masa_muscular: undefined,
      presion: '',
      fecha_registro: new Date().toISOString().split('T')[0],
    },
  });

  if (!isOpen || !historial) return null;

  const watchPeso = watch('peso');
  const watchAltura = watch('altura');

  // Automatic BMI Calculation (IMC = peso_kg / (altura_m ^ 2))
  const calculateIMC = () => {
    if (watchPeso && watchAltura && watchAltura > 0) {
      const alturaM = watchAltura > 3 ? watchAltura / 100 : watchAltura; // If entered in cm like 175
      const imc = watchPeso / (alturaM * alturaM);
      return imc.toFixed(2);
    }
    return null;
  };

  const handleFormSubmit = (data: DetalleFormValues) => {
    const imcValue = calculateIMC();

    createDetalleMutation.mutate(
      {
        id_historial: historial.id,
        peso: data.peso,
        altura: data.altura,
        imc: imcValue ? parseFloat(imcValue) : undefined,
        porcentaje_grasa: data.porcentaje_grasa,
        masa_muscular: data.masa_muscular,
        presion: data.presion,
        fecha_registro: data.fecha_registro,
      },
      {
        onSuccess: () => {
          reset();
          setShowAddForm(false);
        },
      }
    );
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '640px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaNotesMedical style={{ color: '#003B70' }} /> Registro Antropométrico & Físico
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Socio: <strong>{historial.usuario?.name || `ID: ${historial.id_usuario}`}</strong>
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '0.45rem 0.85rem', borderRadius: '6px', backgroundColor: '#003B70', color: '#FFF',
              border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <FaPlus /> {showAddForm ? 'Ver Mediciones' : 'Nueva Medición'}
          </button>
        </div>

        {showAddForm ? (
          <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>Registrar Nueva Medición Antropométrica</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Fecha Registro *
                </label>
                <input
                  type="date"
                  {...register('fecha_registro')}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
                {errors.fecha_registro && <span style={{ color: '#DC2626', fontSize: '0.72rem' }}>{errors.fecha_registro.message}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Presión Arterial (mmHg)
                </label>
                <input
                  type="text"
                  {...register('presion')}
                  placeholder="Ej: 120/80"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('peso')}
                  placeholder="Ej: 75.5"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Altura (cm o metros)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('altura')}
                  placeholder="Ej: 175 ó 1.75"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  % Grasa Corporal
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('porcentaje_grasa')}
                  placeholder="Ej: 18.5"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Masa Muscular (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('masa_muscular')}
                  placeholder="Ej: 34.2"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {calculateIMC() && (
              <div style={{ padding: '0.65rem 1rem', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0369A1', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaCircleInfo /> IMC Calculado Automáticamente: {calculateIMC()} kg/m²
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createDetalleMutation.isPending}
                style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#003B70', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
              >
                {createDetalleMutation.isPending ? 'Guardando...' : 'Guardar Medición'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>Histórico de Evaluaciones Físicas</h4>

            {!historial.detalles || historial.detalles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                Este usuario no posee mediciones antropométricas registradas aún. Haga clic en <strong>"Nueva Medición"</strong> para registrar la primera evaluación física.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {historial.detalles.map((det: any, idx: number) => (
                  <div key={det.id || idx} style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#003B70', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaCalendarDays /> {det.fecha_registro || det.fecha || 'Sin fecha'}
                      </span>
                      {det.imc && (
                        <span style={{ fontSize: '0.78rem', padding: '0.15rem 0.5rem', borderRadius: '999px', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 700 }}>
                          IMC: {det.imc}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
                      <div><strong>Peso:</strong> {det.peso ? `${det.peso} kg` : 'N/A'}</div>
                      <div><strong>Altura:</strong> {det.altura ? `${det.altura} cm` : 'N/A'}</div>
                      <div><strong>% Grasa:</strong> {det.porcentaje_grasa ? `${det.porcentaje_grasa}%` : 'N/A'}</div>
                      <div><strong>Presión:</strong> {det.presion || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.55rem 1.2rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleHistorialModal;
