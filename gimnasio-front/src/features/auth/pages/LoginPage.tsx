// src/features/auth/pages/LoginPage.tsx
import React from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Acceda a la plataforma del Gimnasio Universitario D.U.B.S."
      variant="split"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
