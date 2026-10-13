from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LandmarkPoint(BaseModel):
    id: int
    name: str
    x: float
    y: float
    z: float
    visibility: float

class MetricasCorporalesGeometricas(BaseModel):
    inclinacion_hombros_grados: Optional[float] = Field(None, description="Diferencia angular entre hombro izquierdo y derecho")
    diferencia_vertical_hombros_px: Optional[float] = Field(None, description="Diferencia vertical entre hombros")
    inclinacion_cadera_grados: Optional[float] = Field(None, description="Diferencia angular entre cadera izquierda y derecha")
    alineacion_sagital_oreja_hombro_cadera: Optional[float] = Field(None, description="Ángulo de alineación lateral de perfil")
    simetria_espalda_score: Optional[float] = Field(None, description="Puntaje de simetría de puntos posteriores (0-100)")
    extremidades_inferiores_alineacion: Optional[str] = Field(None, description="Estimación geométrica visual de extremidades inferiores")

class AnalisisImagenResultado(BaseModel):
    vista: str  # 'frontal', 'perfil', 'espalda'
    detectado: bool
    calidad: str  # 'EXCELENTE', 'ACEPTABLE', 'INSUFFICIENT'
    confianza_promedio: float
    landmarks: List[LandmarkPoint] = []
    mensaje: Optional[str] = None

class AnalisisCorporalResponse(BaseModel):
    calidad_global: str  # 'EXCELENTE', 'ACEPTABLE', 'INSUFFICIENT'
    confianza_promedio_global: float
    metricas: MetricasCorporalesGeometricas
    analisis_vistas: Dict[str, AnalisisImagenResultado]
    version_procesamiento: str = "v1.0"
    observaciones: List[str] = []
