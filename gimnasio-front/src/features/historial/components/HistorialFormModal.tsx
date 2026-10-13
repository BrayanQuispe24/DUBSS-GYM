// src/features/historial/components/HistorialFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Historial } from '../services/historialService';
import { useAuthStore } from '@/store/authStore';
import { useUsers } from '@/features/users/hooks/useUsers';

const historialSchema = z.object({
  id_usuario: z.coerce.number().min(1, 'El ID de usuario es requerido'),
  fecha_apertura: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  sexo: z.string().optional(),
  grupo_sanguineo: z.string().optional(),
  domicilio: z.string().optional(),
  facultad_carrera: z.string().optional(),
  celular_emergencia: z.string().optional(),
  antecedentes: z.string().optional(),
  observaciones: z.string().optional(),
  estado: z.string().min(1, 'El estado es requerido'),
});

type HistorialFormValues = z.infer<typeof historialSchema>;

interface HistorialFormModalProps {
  isOpen: boolean;
  historialToEdit: Historial | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

const HistorialFormModal: React.FC<HistorialFormModalProps> = ({
  isOpen,
  historialToEdit,
  onClose,
  onSubmit,
  isPending,
}) => {
  const { user: currentUser } = useAuthStore();
  const { data: users = [] } = useUsers();
  const isAdminOrStaff = currentUser?.rol === 'administrador' || currentUser?.rol === 'recepcionista' || currentUser?.rol === 'instructor';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HistorialFormValues>({
    resolver: zodResolver(historialSchema),
    defaultValues: {
      id_usuario: currentUser?.id || 1,
      fecha_apertura: new Date().toISOString().split('T')[0],
      fecha_nacimiento: '',
      sexo: 'Masculino',
      grupo_sanguineo: 'O+',
      domicilio: '',
      facultad_carrera: '',
      celular_emergencia: '',
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

  const formatDateForInput = (val?: string) => {
    if (!val) return '';
    return String(val).split('T')[0];
  };

  useEffect(() => {
    if (historialToEdit) {
      reset({
        id_usuario: historialToEdit.id_usuario,
        fecha_apertura: formatDateForInput(historialToEdit.fecha_apertura || historialToEdit.created_at) || new Date().toISOString().split('T')[0],
        fecha_nacimiento: formatDateForInput(historialToEdit.fecha_nacimiento),
        sexo: historialToEdit.sexo || 'Masculino',
        grupo_sanguineo: historialToEdit.grupo_sanguineo || 'O+',
        domicilio: historialToEdit.domicilio || '',
        facultad_carrera: historialToEdit.facultad_carrera || '',
        celular_emergencia: historialToEdit.celular_emergencia || '',
        antecedentes: formatAntecedentesToStr(historialToEdit.antecedentes),
        observaciones: historialToEdit.observaciones_generales || historialToEdit.observaciones || '',
        estado: historialToEdit.estado || 'activo',
      });
    } else {
      reset({
        id_usuario: currentUser?.id || 1,
        fecha_apertura: new Date().toISOString().split('T')[0],
        fecha_nacimiento: '',
        sexo: 'Masculino',
        grupo_sanguineo: 'O+',
        domicilio: '',
        facultad_carrera: '',
        celular_emergencia: '',
        antecedentes: '',
        observaciones: '',
        estado: 'activo',
      });
    }
  }, [historialToEdit, reset, isOpen, currentUser]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: HistorialFormValues) => {
    onSubmit({
      ...data,
      observaciones_generales: data.observaciones,
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '650px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '92vh', overflowY: 'auto'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1727', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
          {historialToEdit ? 'Editar Historial Clínico / Deportivo' : 'Nuevo Historial Clínico / Deportivo'}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* USUARIO */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Socio / Usuario Asignado *
            </label>
            {isAdminOrStaff && users.length > 0 ? (
              <select
                {...register('id_usuario')}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) {u.registro_universitario ? `- RU: ${u.registro_universitario}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <input type="hidden" {...register('id_usuario')} value={currentUser?.id || 1} />
                <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                  {currentUser?.name} ({currentUser?.email})
                </div>
              </div>
            )}
            {errors.id_usuario && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                {errors.id_usuario.message}
              </span>
            )}
          </div>

          {/* DATOS PERSONALES & FECHAS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                {...register('fecha_nacimiento')}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Fecha de Apertura Expediente
              </label>
              <input
                type="date"
                {...register('fecha_apertura')}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* SEXO & GRUPO SANGUÍNEO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Sexo
              </label>
              <select
                {...register('sexo')}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Grupo Sanguíneo
              </label>
              <select
                {...register('grupo_sanguineo')}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          {/* FACULTAD / CARRERA */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Facultad / Carrera / Unidad
            </label>
            <input
              {...register('facultad_carrera')}
              placeholder="Ej: Facultad de Ciencias Exactas - Ingeniería Informática"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          {/* DOMICILIO & CELULAR EMERGENCIA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Domicilio / Dirección
              </label>
              <input
                {...register('domicilio')}
                placeholder="Ej: Barrio San Martin C/5 #120"
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Celular de Contacto / Emergencia
              </label>
              <input
                {...register('celular_emergencia')}
                placeholder="Ej: 71234567"
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* ANTECEDENTES MÉDICOS / PATOLOGÍAS */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Antecedentes Médicos / Patologías Generales
            </label>
            <textarea
              {...register('antecedentes')}
              rows={2}
              placeholder="Ej: Asma, hipertensión, lesión en rodilla..."
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          {/* OBSERVACIONES GENERALES */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Observaciones Generales Clínicas / Deportivas
            </label>
            <textarea
              {...register('observaciones')}
              rows={2}
              placeholder="Ej: Ficha aperturada con certificado de aptitud física presentado..."
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
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
