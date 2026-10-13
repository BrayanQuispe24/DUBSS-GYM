from typing import List
from fastapi import APIRouter, Body
from pydantic import BaseModel
from app.schemas.expert_schemas import (
    PerfilUsuarioInput,
    EjercicioCatalogoItem,
    RecomendacionRutinaResponse,
)
from app.services.rule_engine.expert_system import RuleEngineExpertSystem

router = APIRouter()
expert_system = RuleEngineExpertSystem()

class RecomendacionRutinaPayload(BaseModel):
    perfil: PerfilUsuarioInput
    catalogo: List[EjercicioCatalogoItem]

@router.post(
    "/recomendaciones/rutina",
    response_model=RecomendacionRutinaResponse,
    summary="Generar rutina personalizada basada en reglas deterministas (ACSM/NSCA)",
)
def recomendar_rutina_personalizada(
    payload: RecomendacionRutinaPayload = Body(...),
):
    rutina = expert_system.generar_rutina(payload.perfil, payload.catalogo)
    return rutina
