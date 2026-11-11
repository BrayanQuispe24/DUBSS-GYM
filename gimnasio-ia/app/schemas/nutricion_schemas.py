from typing import List, Optional
from pydantic import BaseModel, Field

class PerfilNutricionalInput(BaseModel):
    edad: int = Field(..., ge=12, le=100, description="Edad del usuario en años")
    sexo: str = Field(..., description="Sexo biológico: 'masculino' o 'femenino'")
    peso_kg: float = Field(..., ge=30.0, le=300.0, description="Peso corporal actual en kilogramos")
    altura_cm: float = Field(..., ge=100.0, le=250.0, description="Altura en centímetros")
    nivel_actividad: str = Field(
        default="moderado",
        description="Nivel de actividad: 'sedentario', 'ligero', 'moderado', 'intenso', 'muy_intenso'"
    )
    objetivo: str = Field(
        default="mantenimiento",
        description="Objetivo: 'perdida_grasa', 'aumento_masa_muscular', 'mantenimiento', 'definicion', 'rendimiento'"
    )
    comidas_al_dia: int = Field(default=4, ge=3, le=6, description="Cantidad de comidas prescritas (3 a 6)")
    restricciones: List[str] = Field(
        default_factory=list,
        description="Alergias o condiciones médicas (ej: 'sin_lactosa', 'vegetariano', 'celiaco', 'diabetes')"
    )
    alimentos_no_deseados: List[str] = Field(
        default_factory=list,
        description="Alimentos específicos que el usuario prefiere no consumir"
    )
    presupuesto: str = Field(
        default="economico",
        description="Tipo de presupuesto: 'economico', 'estandar', 'flexible'"
    )
    observaciones_adicionales: Optional[str] = Field(
        default=None,
        description="Detalles adicionales, gustos o notas clínicas"
    )

class ComidaPlan(BaseModel):
    tipo_comida: str = Field(..., description="Ej: 'Desayuno', 'Media Mañana', 'Almuerzo', 'Merienda', 'Cena'")
    horario_sugerido: str = Field(..., description="Horario sugerido de ingesta, ej: '08:00 AM'")
    plato_nombre: str = Field(..., description="Nombre descriptivo y apetecible del plato")
    calorias: int = Field(..., description="Aporte energético estimado en kcal")
    proteinas_g: float = Field(..., description="Gramos de proteína")
    carbohidratos_g: float = Field(..., description="Gramos de carbohidratos")
    grasas_g: float = Field(..., description="Gramos de grasas saludables")
    ingredientes: List[str] = Field(..., description="Lista de ingredientes con porciones prácticas")
    instrucciones_preparacion: str = Field(..., description="Instrucción de preparación clara y concisa")
    sustitutos_accesibles: List[str] = Field(
        default_factory=list,
        description="Opciones de sustitución con alimentos de fácil acceso"
    )

class MacronutrientesTotales(BaseModel):
    proteinas_g: float = Field(..., description="Total diario de proteínas en gramos")
    carbohidratos_g: float = Field(..., description="Total diario de carbohidratos en gramos")
    grasas_g: float = Field(..., description="Total diario de grasas en gramos")

class RecomendacionNutricionalResponse(BaseModel):
    calorias_diarias_recomendadas: int = Field(..., description="Meta calórica total diaria recomendada (kcal)")
    tasa_metabolica_basal_estimada: int = Field(..., description="TMB estimada según Mifflin-St Jeor / Harris-Benedict")
    gasto_energetico_total: int = Field(..., description="GET diario estimado según nivel de actividad")
    macronutrientes_totales: MacronutrientesTotales = Field(..., description="Distribución de macronutrientes totales diarios")
    resumen_estrategia: str = Field(..., description="Explicación concisa de la estrategia nutricional adoptada")
    hidratacion_recomendada_litros: float = Field(..., description="Ingesta de agua recomendada al día en litros")
    consejos_clave: List[str] = Field(..., description="Recomendaciones y buenas prácticas para maximizar adherencia")
    comidas: List[ComidaPlan] = Field(..., description="Desglose detallado de cada comida prescrita")
