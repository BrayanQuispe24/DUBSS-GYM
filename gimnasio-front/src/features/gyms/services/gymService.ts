// src/features/gyms/services/gymService.ts
import api from '@/services/api';
import type { GymServiceItem, CroquisSpot } from '@/types';

const MOCK_SERVICES: GymServiceItem[] = [
  {
    id: '1',
    title: 'Gimnasio & Musculación (Aparatos)',
    category: 'aparatos',
    categoryLabel: 'Aparatos & Pesas',
    description: 'Área equipada con máquinas selectorizadas, racks de potencia, mancuernas olímpicas y zona cardio.',
    schedule: 'Lun - Sáb: 06:00 - 22:00',
    instructor: 'Coaches UAGRM de Turno',
    capacity: '80 personas simultáneas',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    tags: ['Aparatos Selectorizados', 'Racks Olímpico', 'Cardio', 'Supervisión'],
    studentPrice: 'Bs. 50 / mes',
    docentPrice: 'Bs. 80 / mes',
  },
  {
    id: '2',
    title: 'Boxeo Universitario',
    category: 'boxeo',
    categoryLabel: 'Boxeo',
    description: 'Entrenamiento de técnica de puño, trabajo de sacos, manoplas, sparring supervisado y acondicionamiento.',
    schedule: 'Lun, Mié, Vie: 16:00 - 18:00 / 18:00 - 20:00',
    instructor: 'Entrenador Lic. Roberto Siles',
    capacity: '25 cupos por turno',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
    tags: ['Ring Oficial', 'Sacos de Cuero', 'Pera Loca', 'Técnica'],
    studentPrice: 'Bs. 60 / mes',
    docentPrice: 'Bs. 90 / mes',
  },
  {
    id: '3',
    title: 'Kick Boxing',
    category: 'kickboxing',
    categoryLabel: 'Kick Boxing',
    description: 'Disciplina de combate que combina técnicas de boxeo y patadas. Alta quema calórica y defensa personal.',
    schedule: 'Mar, Jue, Sáb: 17:00 - 19:00',
    instructor: 'Coach Prof. Marco Aguilera',
    capacity: '20 cupos por turno',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Pats & Escudos', 'Resistencia', 'Combate', 'Coordinación'],
    studentPrice: 'Bs. 60 / mes',
    docentPrice: 'Bs. 90 / mes',
  },
  {
    id: '4',
    title: 'Baile & Ritmo Universitario',
    category: 'baile',
    categoryLabel: 'Baile & Zumba',
    description: 'Clases dinámicas de ritmoterapia, zumba, ritmos latinos y cardio dance para todas las edades.',
    schedule: 'Lun a Vie: 19:00 - 20:30',
    instructor: 'Inst. Valeria Vargas',
    capacity: '40 personas por sesión',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    tags: ['Zumba Fitness', 'Ritmos Latinos', 'Salón Espejado', 'Audio Pro'],
    studentPrice: 'Bs. 45 / mes',
    docentPrice: 'Bs. 75 / mes',
  },
  {
    id: '5',
    title: 'Entrenamiento Funcional',
    category: 'funcional',
    categoryLabel: 'Funcional & TRX',
    description: 'Rutinas de alta intensidad en circuitos con kettlebells, cuerdas de batalla, balones y TRX.',
    schedule: 'Lun a Sáb: 07:00 - 09:00 / 18:30 - 20:00',
    instructor: 'Lic. Fernando Gutiérrez',
    capacity: '30 cupos por turno',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Circuito HIIT', 'TRX Suspension', 'Kettlebells', 'Cuerdas'],
    studentPrice: 'Bs. 55 / mes',
    docentPrice: 'Bs. 85 / mes',
  },
];

const MOCK_CROQUIS_SPOTS: CroquisSpot[] = [
  { id: 'A-01', type: 'Ring de Boxeo & Kick Boxing', status: 'available', rate: 'Ring Universitario' },
  { id: 'A-02', type: 'Salón de Baile Espejado', status: 'occupied', rate: 'Clase Zumba 19:00' },
  { id: 'A-03', type: 'Circuito Funcional TRX', status: 'available', rate: 'Zona Funcional' },
  { id: 'A-04', type: 'Rack de Sentadillas #1', status: 'selected', rate: 'Área Aparatos' },
  { id: 'A-05', type: 'Prensa Olímpica 45º', status: 'occupied', rate: 'En uso' },
  { id: 'A-06', type: 'Polea Doble Crossover', status: 'available', rate: 'Área Aparatos' },
  { id: 'B-01', type: 'Área de Sacos de Boxeo', status: 'available', rate: 'Boxeo Zone' },
  { id: 'B-02', type: 'Bicicleta Cardio Spinning #1', status: 'reserved', rate: 'Reservado' },
  { id: 'B-03', type: 'Cinta de Correr Cardio', status: 'occupied', rate: 'En uso' },
  { id: 'B-04', type: 'Banco Plano Olímpico', status: 'available', rate: 'Musculación' },
  { id: 'B-05', type: 'Mancuernas 2-40kg', status: 'available', rate: 'Musculación' },
  { id: 'B-06', type: 'Estación Kicking Pads', status: 'out-of-service', rate: 'Mantenimiento' },
];

export const getGymServices = async (categoryFilter?: string): Promise<GymServiceItem[]> => {
  try {
    const response = await api.get<GymServiceItem[]>('/services', { params: { category: categoryFilter } });
    return response.data;
  } catch {
    if (!categoryFilter || categoryFilter === 'all') return MOCK_SERVICES;
    return MOCK_SERVICES.filter(s => s.category === categoryFilter);
  }
};

export const getGymCroquis = async (): Promise<CroquisSpot[]> => {
  try {
    const response = await api.get<CroquisSpot[]>('/gyms/croquis');
    return response.data;
  } catch {
    return MOCK_CROQUIS_SPOTS;
  }
};
