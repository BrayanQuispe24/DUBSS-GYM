// src/features/landing/utils/disciplinaVisuals.ts
import { Activity, Dumbbell, Flame, Music, Shield, Sparkles, type LucideIcon } from 'lucide-react';
import type { PublicDisciplina, PublicDisciplinaHorario, PublicPlan } from '../types/landing.types';

export interface DisciplinaVisualMeta {
  slug: string;
  categoryLabel: string;
  description: string;
  image: string;
  tags: string[];
  icon: LucideIcon;
  instructorLabel: string;
}

const DEFAULT_META: Omit<DisciplinaVisualMeta, 'slug' | 'categoryLabel'> = {
  description: 'Entrenamiento supervisado por instructores del Gimnasio Universitario D.U.B.S. UAGRM.',
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  tags: ['Supervisión DUBS', 'Acceso QR', 'Comunidad UAGRM'],
  icon: Activity,
  instructorLabel: 'Instructores D.U.B.S. UAGRM',
};

export const normalizeSlug = (nombre: string): string =>
  nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const getDisciplinaVisualMeta = (nombre: string): DisciplinaVisualMeta => {
  const lower = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (lower.includes('kick')) {
    return {
      slug: normalizeSlug(nombre),
      categoryLabel: 'Kick Boxing',
      description: 'Disciplina de combate que combina técnicas de boxeo y patadas. Alta quema calórica y defensa personal.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      tags: ['Pats & Escudos', 'Resistencia', 'Combate', 'Coordinación'],
      icon: Activity,
      instructorLabel: 'Instructores de Artes Marciales DUBS',
    };
  }

  if (lower.includes('boxeo') || lower.includes('box')) {
    return {
      slug: normalizeSlug(nombre),
      categoryLabel: 'Boxeo',
      description: 'Entrenamiento de técnica de puño, trabajo de sacos, manoplas, sparring supervisado y acondicionamiento.',
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
      tags: ['Ring Universitario', 'Sacos de Cuero', 'Técnica', 'Cardio'],
      icon: Shield,
      instructorLabel: 'Instructores de Boxeo DUBS',
    };
  }

  if (lower.includes('jiu') || lower.includes('judo') || lower.includes('karate')) {
    return {
      slug: normalizeSlug(nombre),
      categoryLabel: 'Artes Marciales',
      description: 'Técnicas de agarre, control, defensa personal y acondicionamiento físico sobre tatami reglamentario.',
      image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80',
      tags: ['Tatami', 'Técnica & Control', 'Defensa Personal'],
      icon: Shield,
      instructorLabel: 'Instructores de Tatami DUBS',
    };
  }

  if (lower.includes('baile') || lower.includes('zumba') || lower.includes('ritmo')) {
    return {
      slug: normalizeSlug(nombre),
      categoryLabel: 'Baile & Zumba',
      description: 'Clases dinámicas de ritmoterapia, zumba, ritmos latinos y cardio dance para la comunidad universitaria.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      tags: ['Zumba Fitness', 'Ritmos Latinos', 'Cardio Dance'],
      icon: Music,
      instructorLabel: 'Instructores de Ritmos DUBS',
    };
  }

  if (lower.includes('funcional') || lower.includes('cross') || lower.includes('hiit')) {
    return {
      slug: normalizeSlug(nombre),
      categoryLabel: 'Funcional',
      description: 'Rutinas de alta intensidad en circuitos con kettlebells, cuerdas de batalla, balones medicinales y TRX.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      tags: ['Circuito HIIT', 'TRX', 'Kettlebells', 'Resistencia'],
      icon: Flame,
      instructorLabel: 'Instructores Funcional DUBS',
    };
  }

  if (lower.includes('aparato') || lower.includes('muscul') || lower.includes('pesa') || lower.includes('gimnasio')) {
    return {
      slug: normalizeSlug(nombre),
      categoryLabel: 'Aparatos & Pesas',
      description: 'Área equipada con máquinas selectorizadas, racks de potencia, mancuernas olímpicas y zona cardio.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      tags: ['Aparatos Selectorizados', 'Pesas Libres', 'Cardio', 'Supervisión'],
      icon: Dumbbell,
      instructorLabel: 'Coaches de Sala DUBS',
    };
  }

  return {
    slug: normalizeSlug(nombre),
    categoryLabel: nombre,
    ...DEFAULT_META,
    icon: Sparkles,
  };
};

export const formatTimeHHMM = (timeStr?: string): string => {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
};

export const formatHorarioLabel = (h: PublicDisciplinaHorario): string => {
  const inicio = formatTimeHHMM(h.hora_inicio);
  const fin = formatTimeHHMM(h.hora_fin);
  return `${h.dia_semana}: ${inicio} - ${fin}`;
};

export const formatScheduleSummary = (disciplina: PublicDisciplina): string => {
  if (!disciplina.horarios || disciplina.horarios.length === 0) {
    return 'Horarios por confirmar en recepción';
  }
  if (disciplina.horarios.length === 1) {
    return formatHorarioLabel(disciplina.horarios[0]);
  }
  const first = formatHorarioLabel(disciplina.horarios[0]);
  return `${first} (+${disciplina.horarios.length - 1} turnos)`;
};

export const getPlanPriceSummary = (planes: PublicPlan[]) => {
  if (!planes || planes.length === 0) {
    return {
      primaryPriceLabel: 'Tarifa DUBS',
      secondaryPriceLabel: 'Consultar planes vigentes',
      defaultPlan: null as PublicPlan | null,
    };
  }

  const sorted = [...planes].sort((a, b) => a.tarifa.precio - b.tarifa.precio);
  const minPlan = sorted[0];
  const maxPlan = sorted[sorted.length - 1];

  const primaryPriceLabel = `Desde Bs. ${minPlan.tarifa.precio}`;
  const secondaryPriceLabel =
    sorted.length > 1 && maxPlan.tarifa.precio !== minPlan.tarifa.precio
      ? `Hasta Bs. ${maxPlan.tarifa.precio} (${maxPlan.nombre})`
      : `${minPlan.nombre} (${minPlan.duracion_dias} días)`;

  return {
    primaryPriceLabel,
    secondaryPriceLabel,
    defaultPlan: minPlan,
  };
};
