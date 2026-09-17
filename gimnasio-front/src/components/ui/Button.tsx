// src/components/ui/Button.tsx
import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'lg';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) => {
  const baseClass = 'btn';
  let variantClass = 'btn-secondary';
  if (variant === 'accent') variantClass = 'btn-accent';
  if (variant === 'outline') variantClass = 'btn-outline';
  if (variant === 'lg') variantClass += ' btn-lg';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
