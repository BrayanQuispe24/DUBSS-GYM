// src/types/index.ts
export type GymServiceCategory = 'boxeo' | 'kickboxing' | 'baile' | 'funcional' | 'aparatos';

export interface GymServiceItem {
  id: string;
  title: string;
  category: GymServiceCategory;
  categoryLabel: string;
  description: string;
  schedule: string;
  instructor: string;
  capacity: string;
  image: string;
  tags: string[];
  studentPrice: string;
  docentPrice: string;
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
