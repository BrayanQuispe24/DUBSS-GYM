// src/components/ui/Badge.tsx
import React from 'react';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  return (
    <span className={`gym-card-badge ${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
