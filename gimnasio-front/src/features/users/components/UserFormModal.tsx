import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUserGear } from 'react-icons/fa6';
import type { AuthUser } from '@/store/authStore';
import type { UserFormData } from '../types/user.types';
import api from '@/services/api';

const userModalSchema = z.object({
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

type UserFormModalInputs = z.infer<typeof userModalSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  userToEdit: AuthUser | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  isPending: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  userToEdit,
  onClose,
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
    setValue,
    formState: { errors },
  } = useForm<UserFormModalInputs>({
    resolver: zodResolver(userModalSchema),
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
    if (isOpen) {
      api.get('/disciplinas')
        .then((res) => setDisciplinas(res.data.data || res.data || []))
        .catch(() => {});
    }
  }, [isOpen]);

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
  }, [userToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: UserFormModalInputs) => {
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '580px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUserGear style={{ color: '#003B70' }} />
            {userToEdit ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '75vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  Rol de Usuario
                </label>
                <select
                  {...register('rol')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="administrador">Administrador General</option>
                  <option value="recepcionista">Recepcionista Garita</option>
                  <option value="instructor">Instructor Fitness</option>
                  <option value="cliente">Cliente (Alumno/Docente)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  Estado de Cuenta
                </label>
                <select
                  {...register('estado')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="activo">Activo</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </div>
            </div>

            {selectedRol === 'instructor' && (
              <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '0.75rem', borderRadius: '8px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#0369A1', marginBottom: '0.25rem' }}>
                  Disciplina Asignada al Instructor
                </label>
                <select
                  {...register('id_disciplina', { setValueAs: (v) => (v ? Number(v) : null) })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #0284C7',
                    fontSize: '0.85rem',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600,
                  }}
                >
                  <option value="">-- Seleccionar Disciplina --</option>
                  {disciplinas.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  Nombres *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Eduardo"
                  {...register('nombre')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: errors.nombre ? '1px solid #DC2626' : '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
                {errors.nombre && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.nombre.message}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  Apellidos *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Roca Saucedo"
                  {...register('apellido')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: errors.apellido ? '1px solid #DC2626' : '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
                {errors.apellido && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.apellido.message}</span>}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                Correo Electrónico *
              </label>
              <input
                type="email"
                placeholder="croca@uagrm.edu.bo"
                {...register('email')}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '6px',
                  border: errors.email ? '1px solid #DC2626' : '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                }}
              />
              {errors.email && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.email.message}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  Reg. Universitario (R.U.) / Código
                </label>
                <input
                  type="text"
                  placeholder="218093841"
                  {...register('registro_universitario')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  Cédula C.I.
                </label>
                <input
                  type="text"
                  placeholder="9281048 SC"
                  {...register('ci')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  Tipo de Usuario
                </label>
                <select
                  {...register('tipo_usuario')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="particular">Particular</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  Teléfono / Celular
                </label>
                <input
                  type="text"
                  placeholder="76019283"
                  {...register('telefono')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                {userToEdit ? 'Contraseña (dejar en blanco para conservar)' : 'Contraseña de Acceso *'}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '6px',
                  border: errors.password ? '1px solid #DC2626' : '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                }}
              />
              {errors.password && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.password.message}</span>}
            </div>
          </div>

          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            background: '#F8FAFC',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                fontSize: '0.85rem',
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
                background: '#003B70',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? 'Guardando...' : userToEdit ? 'Guardar Cambios' : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
