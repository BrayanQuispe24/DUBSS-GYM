// src/features/auth/pages/RegisterPage.tsx
import React from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Registro Público de Cliente"
      subtitle="Exclusivo para Estudiantes, Docentes y Administrativos UAGRM"
      variant="split"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
