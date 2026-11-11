// src/types/index.ts
import type { PublicDisciplinaHorario } from '@/features/landing/types/landing.types';

export type GymServiceCategory = string;

export interface GymServiceItem {
  id: string;
  disciplinaId?: number;
  title: string;
  category: GymServiceCategory;
  categoryLabel: string;
  description: string;
  schedule: string;
  horarios?: PublicDisciplinaHorario[];
  instructor: string;
  capacity: string;
  cuposDisponibles?: number;
  cuposTotal?: number;
  image: string;
  tags: string[];
  studentPrice: string;
  docentPrice: string;
  defaultPlanId?: number;
}

export interface CroquisSpot {
  id: string;
  type: string;
  status: 'available' | 'occupied' | 'reserved' | 'selected' | 'disabled' | 'out-of-service';
  rate: string;
}

export type UserRoleType = 'cliente' | 'administrador' | 'recepcionista' | 'instructor';

export interface UserRoleInfo {
  id: UserRoleType;
  title: string;
  badge: string;
  description: string;
  capabilities: string[];
}
