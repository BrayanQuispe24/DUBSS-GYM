// src/features/gyms/services/gymService.ts
import api from '@/services/api';
import type { GymServiceItem, CroquisSpot } from '@/types';
import { getPublicLandingData } from '@/features/landing/services/landingService';
import {
  formatScheduleSummary,
  getDisciplinaVisualMeta,
  getPlanPriceSummary,
} from '@/features/landing/utils/disciplinaVisuals';
import type { PublicDisciplina, PublicPlan } from '@/features/landing/types/landing.types';

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

export const mapDisciplinaToGymService = (
  disciplina: PublicDisciplina,
  planes: PublicPlan[]
): GymServiceItem => {
  const meta = getDisciplinaVisualMeta(disciplina.nombre);
  const priceSummary = getPlanPriceSummary(planes);
  const cuposTotal = disciplina.cantidad_cupos || 0;
  const cuposDisp = disciplina.total_cupos_disponibles ?? cuposTotal;

  return {
    id: String(disciplina.id),
    disciplinaId: disciplina.id,
    title: disciplina.nombre,
    category: meta.slug,
    categoryLabel: meta.categoryLabel,
    description: meta.description,
    schedule: formatScheduleSummary(disciplina),
    horarios: disciplina.horarios,
    instructor: meta.instructorLabel,
    capacity: `${cuposDisp} disponibles / ${cuposTotal} cupos`,
    cuposDisponibles: cuposDisp,
    cuposTotal,
    image: meta.image,
    tags: meta.tags,
    studentPrice: priceSummary.primaryPriceLabel,
    docentPrice: priceSummary.secondaryPriceLabel,
    defaultPlanId: priceSummary.defaultPlan?.id,
  };
};

export const getGymServices = async (categoryFilter?: string): Promise<GymServiceItem[]> => {
  try {
    const landingData = await getPublicLandingData();
    const mapped = landingData.disciplinas.map((d) =>
      mapDisciplinaToGymService(d, landingData.planes)
    );

    if (!categoryFilter || categoryFilter === 'all') {
      return mapped;
    }

    return mapped.filter((item) => item.category === categoryFilter);
  } catch {
    if (!categoryFilter || categoryFilter === 'all') return MOCK_SERVICES;
    return MOCK_SERVICES.filter((s) => s.category === categoryFilter);
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
