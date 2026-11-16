import axios from 'axios';

export interface PerfilNutricionalInput {
  edad: number;
  sexo: string; // 'masculino' | 'femenino'
  peso_kg: number;
  altura_cm: number;
  nivel_actividad: string; // 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'muy_intenso'
  objetivo: string; // 'perdida_grasa' | 'aumento_masa_muscular' | 'mantenimiento' | 'definicion' | 'rendimiento'
  comidas_al_dia: number;
  restricciones: string[];
  alimentos_no_deseados: string[];
  presupuesto: string; // 'economico' | 'estandar' | 'flexible'
  observaciones_adicionales?: string;
}

export interface ComidaPlan {
  tipo_comida: string;
  horario_sugerido: string;
  plato_nombre: string;
  calorias: number;
  proteinas_g: number;
  carbohidratos_g: number;
  grasas_g: number;
  ingredientes: string[];
  instrucciones_preparacion: string;
  sustitutos_accesibles: string[];
}

export interface MacronutrientesTotales {
  proteinas_g: number;
  carbohidratos_g: number;
  grasas_g: number;
}

export interface RecomendacionNutricionalResponse {
  calorias_diarias_recomendadas: number;
  tasa_metabolica_basal_estimada: number;
  gasto_energetico_total: number;
  macronutrientes_totales: MacronutrientesTotales;
  resumen_estrategia: string;
  hidratacion_recomendada_litros: number;
  consejos_clave: string[];
  comidas: ComidaPlan[];
}

const IA_API_BASE_URL =
  import.meta.env.VITE_IA_URL ||
  (import.meta.env.PROD ? '/api/v1/ia' : 'http://127.0.0.1:8001/api/v1');

export const iaNutricionService = {
  generarRecomendacion: async (
    perfil: PerfilNutricionalInput
  ): Promise<RecomendacionNutricionalResponse> => {
    const response = await axios.post<RecomendacionNutricionalResponse>(
      `${IA_API_BASE_URL}/nutricion/recomendar-plan`,
      perfil,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 segundos para permitir generación con LLM
      }
    );
    return response.data;
  },
};
