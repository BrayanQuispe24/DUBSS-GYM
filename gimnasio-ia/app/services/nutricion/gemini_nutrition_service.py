import os
import json
import logging
from typing import Optional
from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.config import settings
from app.schemas.nutricion_schemas import (
    PerfilNutricionalInput,
    RecomendacionNutricionalResponse,
)

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Eres un Nutricionista Deportivo y Clínico de élite con certificación ISSN (International Society of Sports Nutrition) y ACSM.
Tu misión es diseñar planes de alimentación personalizados, altamente estructurados y basados en evidencia científica para usuarios de gimnasio universitario.

Principios de Prescripción:
1. Cálculo Energético:
   - Determina la Tasa Metabólica Basal (TMB) mediante la fórmula de Mifflin-St Jeor.
   - Aplica el factor de actividad para obtener el Gasto Energético Total (GET).
   - Ajusta calorías según el objetivo:
     * 'perdida_grasa': déficit calórico moderado (300 a 500 kcal).
     * 'aumento_masa_muscular': superávit controlado (250 a 400 kcal) con alta síntesis proteica.
     * 'definicion': déficit moderado conservando masa magra (proteína 2.0-2.2 g/kg).
     * 'mantenimiento': balance isocalórico para rendimiento.
2. Macronutrientes:
   - Proteínas: 1.6 a 2.2 g/kg de peso corporal según el objetivo.
   - Grasas: 0.8 a 1.2 g/kg (20% - 30% del total calórico), priorizando mono y poliinsaturadas.
   - Carbohidratos: el resto calórico para soporte glucolítico en entrenamiento.
3. Cantidad de Comidas:
   - Debes prescribir EXACTAMENTE el número de comidas indicado en el perfil del usuario (comidas_al_dia).
4. Restricciones y Gustos:
   - Respeta estrictamente cualquier alergia, intolerancia (sin lactosa, gluten, etc.) y excluye los alimentos no deseados.
5. Contexto Económico y Disponibilidad Local:
   - Si el presupuesto es 'economico', prioriza alimentos de la canasta básica accesible (huevos, pechuga de pollo, avena, arroz, camote, papa, plátano, palta, lentejas, queso criollo bajo en grasa, frutas de temporada).
   - Brinda opciones de sustitutos accesibles para cada comida.

Debes responder ÚNICAMENTE respetando el esquema JSON especificado.
"""

class GeminiNutritionService:
    def __init__(self):
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"

    def _get_client(self) -> genai.Client:
        api_key = (settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")).strip().strip('"').strip("'")
        if not api_key or api_key == "tu_api_key_aqui":
            try:
                from app.config import ENV_FILE
                if ENV_FILE.exists():
                    with open(ENV_FILE, "r", encoding="utf-8") as f:
                        for line in f:
                            clean_line = line.strip()
                            if clean_line.startswith("GEMINI_API_KEY="):
                                api_key = clean_line.split("=", 1)[1].strip().strip('"').strip("'")
                                break
            except Exception as e:
                logger.warning(f"No se pudo leer ENV_FILE directamente: {e}")

        if not api_key or api_key == "tu_api_key_aqui":
            raise ValueError(
                "La clave GEMINI_API_KEY no ha sido configurada. "
                "Por favor añade tu API key en el archivo 'gimnasio-ia/.env'."
            )
        return genai.Client(api_key=api_key, http_options={"api_version": "v1beta"})

    def generar_plan(self, perfil: PerfilNutricionalInput) -> RecomendacionNutricionalResponse:
        client = self._get_client()

        user_content = f"""{SYSTEM_PROMPT}

Por favor elabora un plan nutricional completo para el siguiente perfil:
- Edad: {perfil.edad} años
- Sexo biológico: {perfil.sexo}
- Peso actual: {perfil.peso_kg} kg
- Altura: {perfil.altura_cm} cm
- Nivel de actividad diaria: {perfil.nivel_actividad}
- Objetivo principal: {perfil.objetivo}
- Comidas prescritas al día: {perfil.comidas_al_dia} comidas
- Restricciones/Alergias médicas: {', '.join(perfil.restricciones) if perfil.restricciones else 'Ninguna'}
- Alimentos a evitar: {', '.join(perfil.alimentos_no_deseados) if perfil.alimentos_no_deseados else 'Ninguno'}
- Enfoque de presupuesto: {perfil.presupuesto}
- Notas u observaciones adicionales: {perfil.observaciones_adicionales or 'Ninguna'}
"""

        try:
            config_kwargs = {
                "response_mime_type": "application/json",
                "response_schema": RecomendacionNutricionalResponse,
                "temperature": 0.2,
            }
            if hasattr(types, "ThinkingConfig") and "2.5" in (self.model_name or ""):
                config_kwargs["thinking_config"] = types.ThinkingConfig(thinking_budget=0)

            response = client.models.generate_content(
                model=self.model_name,
                contents=user_content,
                config=types.GenerateContentConfig(**config_kwargs),
            )

            # Si el SDK ya parseó la respuesta contra el schema de Pydantic
            if getattr(response, "parsed", None) and isinstance(response.parsed, RecomendacionNutricionalResponse):
                return response.parsed

            # Si viene como texto JSON en response.text
            if response.text:
                return RecomendacionNutricionalResponse.model_validate_json(response.text)

            raise RuntimeError("Gemini no devolvió contenido en la respuesta.")

        except APIError as e:
            logger.error(f"Error de la API de Google Gemini: {e}")
            raise RuntimeError(f"Error en el servicio de Google Gemini: {e.message or str(e)}")
        except Exception as e:
            logger.error(f"Excepción al generar plan nutricional: {e}")
            raise
