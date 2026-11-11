from fastapi import APIRouter
from app.api.v1.endpoints import pose, expert, nutricion

api_router = APIRouter()
api_router.include_router(pose.router, tags=["Análisis Corporal (MediaPipe)"])
api_router.include_router(expert.router, tags=["Sistema Experto (Recomendación de Rutinas)"])
api_router.include_router(nutricion.router, tags=["Nutrición & Alimentación (Gemini IA)"])
