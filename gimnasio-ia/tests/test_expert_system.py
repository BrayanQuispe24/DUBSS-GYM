import pytest
from app.schemas.expert_schemas import PerfilUsuarioInput, EjercicioCatalogoItem
from app.schemas.pose_schemas import (
    AnalisisImagenResultado,
    LandmarkPoint,
)
from app.services.pose_estimator import PoseEstimatorService
from app.services.rule_engine.expert_system import RuleEngineExpertSystem

def test_rule_engine_hipertrofia_principiante():
    system = RuleEngineExpertSystem()

    perfil = PerfilUsuarioInput(
        id_usuario=1,
        edad=25,
        objetivo="HIPERTROFIA",
        nivel_experiencia="PRINCIPIANTE",
        dias_disponibles=3,
        duracion_sesion_min=60,
        equipamiento_disponible=["Mancuerna", "Barra", "Peso corporal"],
        restricciones_declaradas=[],
    )

    catalogo = [
        EjercicioCatalogoItem(
            id=1,
            nombre="Press de banca con mancuernas",
            equipamiento="Mancuerna",
            nivel_dificultad="Principiante",
            mecanica="Compuesto",
            patron_movimiento="Empuje",
            grupos_musculares_primarios=["Pecho"],
            grupos_musculares_secundarios=["Tríceps", "Hombros"],
        ),
        EjercicioCatalogoItem(
            id=2,
            nombre="Sentadilla con barra",
            equipamiento="Barra",
            nivel_dificultad="Principiante",
            mecanica="Compuesto",
            patron_movimiento="Empuje",
            grupos_musculares_primarios=["Cuádriceps"],
            grupos_musculares_secundarios=["Glúteos"],
        ),
        EjercicioCatalogoItem(
            id=3,
            nombre="Jalón al pecho en polea alta",
            equipamiento="Polea",
            nivel_dificultad="Principiante",
            mecanica="Compuesto",
            patron_movimiento="Tracción",
            grupos_musculares_primarios=["Dorsales"],
            grupos_musculares_secundarios=["Bíceps"],
        ),
    ]

    rutina = system.generar_rutina(perfil, catalogo)

    assert rutina.objetivo == "HIPERTROFIA"
    assert rutina.nivel == "PRINCIPIANTE"
    assert len(rutina.dias_semana) == 3
    assert "REGLA_PARAMETROS_ACSM: Objetivo HIPERTROFIA -> 4 series, 8 - 12 reps, 90s descanso." in rutina.reglas_aplicadas
    # Se debe haber filtrado la polea ya que no figuraba en equipamiento disponible
    nombres_asignados = [ej.nombre for dia in rutina.dias_semana for ej in dia.ejercicios]
    assert "Jalón al pecho en polea alta" not in nombres_asignados

def test_pose_estimator_metricas_globales():
    pose_service = PoseEstimatorService()

    # Synthetic landmarks frontal
    lms_front = [
        LandmarkPoint(id=11, name="LEFT_SHOULDER", x=0.4, y=0.3, z=0.0, visibility=0.9),
        LandmarkPoint(id=12, name="RIGHT_SHOULDER", x=0.6, y=0.3, z=0.0, visibility=0.9),
        LandmarkPoint(id=23, name="LEFT_HIP", x=0.42, y=0.6, z=0.0, visibility=0.9),
        LandmarkPoint(id=24, name="RIGHT_HIP", x=0.58, y=0.6, z=0.0, visibility=0.9),
    ]

    res_front = AnalisisImagenResultado(
        vista="frontal",
        detectado=True,
        calidad="EXCELENTE",
        confianza_promedio=0.9,
        landmarks=lms_front,
    )
    res_side = AnalisisImagenResultado(
        vista="perfil",
        detectado=True,
        calidad="EXCELENTE",
        confianza_promedio=0.9,
        landmarks=[],
    )
    res_back = AnalisisImagenResultado(
        vista="espalda",
        detectado=True,
        calidad="EXCELENTE",
        confianza_promedio=0.9,
        landmarks=lms_front,
    )

    resultado = pose_service.calcular_metricas_globales(res_front, res_side, res_back)

    assert resultado.calidad_global == "EXCELENTE"
    assert resultado.metricas.inclinacion_hombros_grados == 0.0
    assert len(resultado.observaciones) >= 1
