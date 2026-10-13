from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.pose_schemas import MetricasCorporalesGeometricas

class PerfilUsuarioInput(BaseModel):
    id_usuario: Optional[int] = None
    edad: Optional[int] = Field(None, ge=10, le=100)
    objetivo: str = Field("HIPERTROFIA", description="HIPERTROFIA, FUERZA, RESISTENCIA, ACONDICIONAMIENTO")
    nivel_experiencia: str = Field("PRINCIPIANTE", description="PRINCIPIANTE, INTERMEDIO, AVANZADO")
    dias_disponibles: int = Field(3, ge=1, le=7)
    duracion_sesion_min: int = Field(60, ge=20, le=180)
    equipamiento_disponible: List[str] = Field(default_factory=list)
    restricciones_declaradas: List[str] = Field(default_factory=list)
    metricas_corporales: Optional[MetricasCorporalesGeometricas] = None

class EjercicioCatalogoItem(BaseModel):
    id: int
    nombre: str
    equipamiento: Optional[str] = None
    nivel_dificultad: Optional[str] = None
    mecanica: Optional[str] = None
    patron_movimiento: Optional[str] = None
    grupos_musculares_primarios: List[str] = Field(default_factory=list)
    grupos_musculares_secundarios: List[str] = Field(default_factory=list)

class EjercicioAlternativa(BaseModel):
    id: int
    nombre: str
    equipamiento: Optional[str] = None

class EjercicioAsignado(BaseModel):
    id_ejercicio: int
    nombre: str
    series: int
    repeticiones: str
    descanso_segundos: int
    orden: int
    observaciones: str
    alternativas: List[EjercicioAlternativa] = Field(default_factory=list)

class DiaRutina(BaseModel):
    dia_numero: int
    nombre_dia: str
    enfoque_muscular: str
    ejercicios: List[EjercicioAsignado]

class RecomendacionRutinaResponse(BaseModel):
    rutina_nombre: str
    objetivo: str
    nivel: str
    dias_semana: List[DiaRutina]
    reglas_aplicadas: List[str]
    justificacion_detallada: str
    observaciones: List[str]
