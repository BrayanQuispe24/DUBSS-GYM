// src/features/auth/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterCliente } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FaCircleExclamation, FaCircleInfo, FaSpinner, FaIdCard, FaFileContract } from 'react-icons/fa6';
import type { RegisterClienteData } from '../types/auth.types';
import TermsModal from '@/components/common/TermsModal';

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  apellido: z.string().min(2, 'El apellido es obligatorio'),
  email: z.string().email('Ingrese un correo electrónico válido'),
  registro_universitario: z.string().min(4, 'El Registro Universitario (R.U.) es requerido'),
  ci: z.string().min(5, 'La Cédula de Identidad (C.I.) es requerida'),
  tipo_usuario: z.enum(['estudiante', 'docente', 'administrativo', 'particular']),
  telefono: z.string().optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_confirmation: z.string(),
  acepta_terminos: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los Términos y Condiciones para completar tu registro' }),
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const { mutate: registerCliente, isPending, error } = useRegisterCliente();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      registro_universitario: '',
      ci: '',
      tipo_usuario: 'estudiante',
      telefono: '',
      password: '',
      password_confirmation: '',
      acepta_terminos: undefined,
    },
  });

  const onSubmit = (data: RegisterFormInputs) => {
    const payload: RegisterClienteData = {
      name: `${data.nombre} ${data.apellido}`,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      registro_universitario: data.registro_universitario,
      ci: data.ci,
      tipo_usuario: data.tipo_usuario,
      telefono: data.telefono,
      password: data.password,
      password_confirmation: data.password_confirmation,
      acepta_terminos: true,
    };
    registerCliente(payload);
  };

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    'No se pudo completar el registro. Intente nuevamente.'
    : null;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {errorMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <FaCircleExclamation />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Exclusivity Alert Banner */}
        <div style={{
          padding: '0.65rem 0.85rem',
          borderRadius: '6px',
          backgroundColor: 'rgba(0, 59, 112, 0.08)',
          borderLeft: '4px solid #003B70',
          fontSize: '0.78rem',
          color: '#003B70',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <FaCircleInfo />
          <span>El registro público está habilitado exclusivamente para usuarios con rol <strong>Cliente</strong> (Estudiantes, Docentes y Administrativos UAGRM).</span>
        </div>

        {/* Responsive 2-Column Grid for Split Panel Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.75rem',
        }}>
          {/* Row 1: Nombres, Apellidos, CI */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Nombres *
            </label>
            <input
              type="text"
              placeholder="Ej. María René"
              {...register('nombre')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: errors.nombre ? '1px solid #DC2626' : '1px solid #CBD5E1',
                fontSize: '0.85rem',
              }}
            />
            {errors.nombre && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.nombre.message}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Apellidos *
            </label>
            <input
              type="text"
              placeholder="Ej. Vargas Ruiz"
              {...register('apellido')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: errors.apellido ? '1px solid #DC2626' : '1px solid #CBD5E1',
                fontSize: '0.85rem',
              }}
            />
            {errors.apellido && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.apellido.message}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Cédula de Identidad (C.I.) *
            </label>
            <input
              type="text"
              placeholder="8392014 SC"
              {...register('ci')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: errors.ci ? '1px solid #DC2626' : '1px solid #CBD5E1',
                fontSize: '0.85rem',
              }}
            />
            {errors.ci && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.ci.message}</span>}
          </div>

          {/* Row 2: R.U., Tipo de Usuario, Teléfono */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Reg. Universitario (R.U.) *
            </label>
            <input
              type="text"
              placeholder="219084721"
              {...register('registro_universitario')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: errors.registro_universitario ? '1px solid #DC2626' : '1px solid #CBD5E1',
                fontSize: '0.85rem',
              }}
            />
            {errors.registro_universitario && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.registro_universitario.message}</span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Tipo de Usuario UAGRM
            </label>
            <select
              {...register('tipo_usuario')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="estudiante">Estudiante Universitario</option>
              <option value="docente">Docente UAGRM</option>
              <option value="administrativo">Administrativo UAGRM</option>
              <option value="particular">Comunidad Particular</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Teléfono / WhatsApp
            </label>
            <input
              type="text"
              placeholder="71029384"
              {...register('telefono')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Row 3: Email, Contraseña, Confirmar Contraseña */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Correo Electrónico *
            </label>
            <input
              type="email"
              placeholder="estudiante@uagrm.edu.bo"
              {...register('email')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: errors.email ? '1px solid #DC2626' : '1px solid #CBD5E1',
                fontSize: '0.85rem',
              }}
            />
            {errors.email && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.email.message}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Contraseña *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: errors.password ? '1px solid #DC2626' : '1px solid #CBD5E1',
                fontSize: '0.85rem',
              }}
            />
            {errors.password && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.password.message}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#1E293B', marginBottom: '0.25rem' }}>
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password_confirmation')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: errors.password_confirmation ? '1px solid #DC2626' : '1px solid #CBD5E1',
                fontSize: '0.85rem',
              }}
            />
            {errors.password_confirmation && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.password_confirmation.message}</span>
            )}
          </div>
        </div>

        {/* Checkbox de Términos y Condiciones */}
        <div style={{
          padding: '0.75rem',
          borderRadius: '8px',
          border: errors.acepta_terminos ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
          background: errors.acepta_terminos ? '#FEF2F2' : '#F8FAFC',
          marginTop: '0.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
            <input
              type="checkbox"
              id="acepta_terminos"
              {...register('acepta_terminos')}
              style={{ marginTop: '0.2rem', cursor: 'pointer', width: '16px', height: '16px', accentColor: '#003B70' }}
            />
            <label htmlFor="acepta_terminos" style={{ fontSize: '0.82rem', color: '#334155', cursor: 'pointer', lineHeight: 1.4 }}>
              He leído y acepto los{' '}
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#003B70',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.82rem',
                }}
              >
                <FaFileContract style={{ marginRight: '0.2rem' }} />
                Términos y Condiciones
              </button>{' '}
              de uso del sistema del Gimnasio D.U.B.S. UAGRM.
            </label>
          </div>
          {errors.acepta_terminos && (
            <span style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block', fontWeight: 600 }}>
              {errors.acepta_terminos.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            marginTop: '0.5rem',
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #990000 0%, #7A0000 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1,
            boxShadow: '0 4px 12px rgba(153, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {isPending ? (
            <>
              <FaSpinner className="animate-spin" /> Registrando Cliente...
            </>
          ) : (
            <>
              <FaIdCard /> Completar Registro Cliente
            </>
          )}
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem' }}>
          ¿Ya tienes cuenta registrada?{' '}
          <Link to="/login" style={{ color: '#003B70', fontWeight: 700, textDecoration: 'none' }}>
            Iniciar Sesión
          </Link>
        </div>
      </form>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => setValue('acepta_terminos', true, { shouldValidate: true })}
      />
    </>
  );
};

export default RegisterForm;

