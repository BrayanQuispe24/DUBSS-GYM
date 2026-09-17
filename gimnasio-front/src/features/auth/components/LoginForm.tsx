// src/features/auth/components/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FaCircleExclamation, FaUser, FaLock, FaSpinner, FaRightToBracket, FaUserPlus } from 'react-icons/fa6';
import type { LoginCredentials } from '../types/auth.types';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Ingrese su correo electrónico o Registro Universitario (R.U.)'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    const credentials: LoginCredentials = {
      identifier: data.identifier ?? '',
      password: data.password ?? '',
    };
    login(credentials);
  };

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Credenciales incorrectas. Verifique sus datos e intente de nuevo.'
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1E293B', marginBottom: '0.35rem' }}>
          Correo o Registro Universitario (R.U.)
        </label>
        <div style={{ position: 'relative' }}>
          <FaUser style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748B',
            fontSize: '0.9rem',
          }} />
          <input
            type="text"
            placeholder="ejemplo@uagrm.edu.bo o 218000000"
            {...register('identifier')}
            style={{
              width: '100%',
              padding: '0.65rem 0.75rem 0.65rem 2.25rem',
              borderRadius: '8px',
              border: errors.identifier ? '1px solid #DC2626' : '1px solid #CBD5E1',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
          />
        </div>
        {errors.identifier && (
          <span style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
            {errors.identifier.message}
          </span>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1E293B', marginBottom: '0.35rem' }}>
          Contraseña
        </label>
        <div style={{ position: 'relative' }}>
          <FaLock style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748B',
            fontSize: '0.9rem',
          }} />
          <input
            type="password"
            placeholder="••••••••"
            {...register('password')}
            style={{
              width: '100%',
              padding: '0.65rem 0.75rem 0.65rem 2.25rem',
              borderRadius: '8px',
              border: errors.password ? '1px solid #DC2626' : '1px solid #CBD5E1',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
          />
        </div>
        {errors.password && (
          <span style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
            {errors.password.message}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#475569' }}>
          <input type="checkbox" style={{ accentColor: '#003B70' }} />
          Recordar sesión
        </label>
        <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Por favor contacte a Soporte Técnico D.U.B.S.'); }} style={{ color: '#003B70', fontWeight: 600, textDecoration: 'none' }}>
          ¿Olvidó su contraseña?
        </a>
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
          color: '#FFFFFF',
          border: 'none',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
          boxShadow: '0 4px 12px rgba(0, 59, 112, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease',
        }}
      >
        {isPending ? (
          <>
            <FaSpinner className="animate-spin" /> Validando credenciales...
          </>
        ) : (
          <>
            <FaRightToBracket /> Iniciar Sesión
          </>
        )}
      </button>

      {/* Public Client Registration Banner */}
      <div style={{
        marginTop: '0.5rem',
        padding: '0.85rem',
        borderRadius: '8px',
        backgroundColor: '#F8FAFC',
        border: '1px dashed #CBD5E1',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.35rem' }}>
          ¿Eres estudiante, docente o administrativo UAGRM?
        </div>
        <Link
          to="/register"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#990000',
            fontWeight: 700,
            fontSize: '0.88rem',
            textDecoration: 'none',
          }}
        >
          <FaUserPlus /> Crear Cuenta de Cliente UAGRM
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;

