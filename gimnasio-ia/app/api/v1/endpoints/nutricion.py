import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.nutricion_schemas import (
    PerfilNutricionalInput,
    RecomendacionNutricionalResponse,
)
from app.services.nutricion.gemini_nutrition_service import GeminiNutritionService

router = APIRouter()
nutrition_service = GeminiNutritionService()
logger = logging.getLogger(__name__)

@router.post(
    "/nutricion/recomendar-plan",
    response_model=RecomendacionNutricionalResponse,
    summary="Generar plan de alimentación personalizado con Google Gemini 2.5 Flash",
    description="Calcula TMB, gasto energético, distribución de macronutrientes y prescribe comidas detalladas adaptadas al perfil biológico y presupuesto.",
)
def recomendar_plan_alimentacion(perfil: PerfilNutricionalInput):
    try:
        resultado = nutrition_service.generar_plan(perfil)
        return resultado
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(re)
        )
    except Exception as e:
        logger.error(f"Error al recomendar plan nutricional con Gemini: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ocurrió un error al procesar la recomendación con IA: {str(e)}"
        )
