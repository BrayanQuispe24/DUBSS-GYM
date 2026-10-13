// src/features/users/components/UserFormPanel.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUserGear, FaXmark, FaFloppyDisk, FaArrowLeft } from 'react-icons/fa6';
import type { AuthUser } from '@/store/authStore';
import type { UserFormData } from '../types/user.types';
import api from '@/services/api';

const userSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  apellido: z.string().min(2, 'El apellido es obligatorio'),
  email: z.string().email('Correo electrónico inválido'),
  rol: z.enum(['administrador', 'recepcionista', 'instructor', 'cliente']),
  registro_universitario: z.string().optional(),
  ci: z.string().optional(),
  telefono: z.string().optional(),
  tipo_usuario: z.enum(['estudiante', 'docente', 'administrativo', 'particular']).optional(),
  estado: z.enum(['activo', 'suspendido']).optional(),
  password: z.string().optional(),
  id_disciplina: z.number().optional().nullable(),
});

type UserFormInputs = z.infer<typeof userSchema>;

interface UserFormPanelProps {
  userToEdit: AuthUser | null;
  onCancel: () => void;
  onSubmit: (data: UserFormData) => void;
  isPending: boolean;
}

const UserFormPanel: React.FC<UserFormPanelProps> = ({
  userToEdit,
  onCancel,
  onSubmit,
  isPending,
}) => {
  const [disciplinas, setDisciplinas] = useState<{ id: number; nombre: string }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      rol: 'cliente',
      registro_universitario: '',
      ci: '',
      telefono: '',
      tipo_usuario: 'estudiante',
      estado: 'activo',
      password: '',
      id_disciplina: null,
    },
  });

  const selectedRol = watch('rol');

  useEffect(() => {
    api.get('/disciplinas')
      .then((res) => setDisciplinas(res.data.data || res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (userToEdit) {
      reset({
        id: userToEdit.id,
        nombre: userToEdit.nombre || userToEdit.name.split(' ')[0] || '',
        apellido: userToEdit.apellido || userToEdit.name.split(' ').slice(1).join(' ') || '',
        email: userToEdit.email,
        rol: userToEdit.rol,
        registro_universitario: userToEdit.registro_universitario || '',
        ci: userToEdit.ci || '',
        telefono: userToEdit.telefono || '',
        tipo_usuario: userToEdit.tipo_usuario || 'estudiante',
        estado: userToEdit.estado || 'activo',
        password: '',
        id_disciplina: userToEdit.id_disciplina || null,
      });
    } else {
      reset({
        id: undefined,
        nombre: '',
        apellido: '',
        email: '',
        rol: 'cliente',
        registro_universitario: '',
        ci: '',
        telefono: '',
        tipo_usuario: 'estudiante',
        estado: 'activo',
        password: '',
        id_disciplina: null,
      });
    }
  }, [userToEdit, reset]);

  const handleFormSubmit = (data: UserFormInputs) => {
    if (!userToEdit && (!data.password || data.password.length < 6)) {
      setError('password', {
        type: 'manual',
        message: 'La contraseña es obligatoria y debe tener al menos 6 caracteres',
      });
      return;
    }
    onSubmit(data as UserFormData);
  };

  return (
    <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        {/* Panel Header */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#0B1727',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: 0,
          }}>
            <FaUserGear style={{ color: '#0077D4' }} />
            {userToEdit ? `Editar Registro: ${userToEdit.name}` : 'Registrar Nuevo Usuario en Plataforma'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            title="Cancelar y Volver al Listado"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FaXmark size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Roles and Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                  Rol en Sistema <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  {...register('rol')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    backgroundColor: '#FFFFFF',
                    color: '#0B1727',
                    outline: 'none',
                  }}
                >
                  <option value="administrador">Administrador General</option>
                  <option value="recepcionista">Recepcionista Garita</option>
                  <option value="instructor">Instructor Fitness</option>
                  <option value="cliente">Cliente (Alumno/Docente/Particular)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                  Estado de Cuenta
                </label>
                <select
                  {...register('estado')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    backgroundColor: '#FFFFFF',
                    color: '#0B1727',
                    outline: 'none',
                  }}
                >
                  <option value="activo">Activo (Habilitado)</option>
                  <option value="suspendido">Suspendido (Bloqueado)</option>
                </select>
              </div>
            </div>

            {/* Disciplina si es Instructor */}
            {selectedRol === 'instructor' && (
              <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', padding: '0.75rem', borderRadius: '4px' }}>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0369A1', marginBottom: '0.3rem' }}>
                  Disciplina Asignada al Instructor
                </label>
                <select
                  {...register('id_disciplina', { setValueAs: (v) => (v ? Number(v) : null) })}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #0284C7',
                    fontSize: '0.82rem',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600,
                  }}
                >
                  <option value="">-- Sin Disciplina Específica --</option>
                  {disciplinas.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Nombres y Apellidos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                  Nombres <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Eduardo"
                  {...register('nombre')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: errors.nombre ? '1px solid #DC2626' : '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.nombre && <span style={{ color: '#DC2626', fontSize: '0.72rem' }}>{errors.nombre.message}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                  Apellidos <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Roca Saucedo"
                  {...register('apellido')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: errors.apellido ? '1px solid #DC2626' : '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.apellido && <span style={{ color: '#DC2626', fontSize: '0.72rem' }}>{errors.apellido.message}</span>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                Correo Electrónico Institucional / Personal <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="usuario@uagrm.edu.bo"
                {...register('email')}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '4px',
                  border: errors.email ? '1px solid #DC2626' : '1px solid #CBD5E1',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.email && <span style={{ color: '#DC2626', fontSize: '0.72rem' }}>{errors.email.message}</span>}
            </div>

            {/* Documentos CI y RU */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                  Cédula de Identidad (C.I.)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 8492041 SC"
                  {...register('ci')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                  Registro Universitario (R.U.)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 219045812"
                  {...register('registro_universitario')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Teléfono y Tipo Usuario */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                  Teléfono / Celular
                </label>
                <input
                  type="text"
                  placeholder="Ej. 70012345"
                  {...register('telefono')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                  Tipo de Afiliado UAGRM
                </label>
                <select
                  {...register('tipo_usuario')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    backgroundColor: '#FFFFFF',
                    color: '#0B1727',
                  }}
                >
                  <option value="estudiante">Estudiante Regular UAGRM</option>
                  <option value="docente">Docente Universitario</option>
                  <option value="administrativo">Personal Administrativo</option>
                  <option value="particular">Socio Particular Externo</option>
                </select>
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.3rem' }}>
                {userToEdit ? 'Nueva Contraseña (Opcional, dejar vacío para mantener la actual)' : 'Contraseña de Acceso *'}
              </label>
              <input
                type="password"
                placeholder={userToEdit ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
                {...register('password')}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '4px',
                  border: errors.password ? '1px solid #DC2626' : '1px solid #CBD5E1',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.password && <span style={{ color: '#DC2626', fontSize: '0.72rem' }}>{errors.password.message}</span>}
            </div>
          </div>

          {/* Action Footer */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <FaArrowLeft size={12} /> Cancelar y Volver
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '4px',
                backgroundColor: '#0077D4',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              <FaFloppyDisk size={12} />
              {isPending ? 'Guardando Registro...' : (userToEdit ? 'Actualizar Usuario' : 'Registrar Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPanel;
