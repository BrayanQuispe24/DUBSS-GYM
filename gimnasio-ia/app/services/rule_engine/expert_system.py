import random
from typing import List, Dict, Any, Tuple
from app.schemas.expert_schemas import (
    PerfilUsuarioInput,
    EjercicioCatalogoItem,
    EjercicioAsignado,
    EjercicioAlternativa,
    DiaRutina,
    RecomendacionRutinaResponse,
)

class RuleEngineExpertSystem:
    """Motor de Reglas Experto basado en principios ACSM / NSCA con selección variada y adaptativa."""

    def generar_rutina(
        self,
        perfil: PerfilUsuarioInput,
        catalogo: List[EjercicioCatalogoItem],
    ) -> RecomendacionRutinaResponse:
        reglas_aplicadas = []
        observaciones = []

        # 1. Normalización de Equipamiento
        equip_user = set(e.strip().lower() for e in perfil.equipamiento_disponible)
        if not equip_user:
            equip_user = {"peso corporal", "general"}
            reglas_aplicadas.append("REGLA_EQUIPAMIENTO_DEFAULT: Sin equipamiento especificado, se utiliza Peso Corporal por defecto.")
        else:
            equip_user.add("peso corporal")
            equip_user.add("general")
            reglas_aplicadas.append(f"REGLA_FILTRO_EQUIPAMIENTO: Se filtraron ejercicios compatibles con {list(perfil.equipamiento_disponible)}.")

        # 2. Filtro de Candidatos por Equipamiento y Nivel
        candidatos_validos = []
        for ej in catalogo:
            eq_ej = (ej.equipamiento or "general").strip().lower()
            lvl_ej = (ej.nivel_dificultad or "general").strip().lower()

            # Compatibilidad de equipamiento
            es_compatible_eq = any(eq in eq_ej or eq_ej in eq for eq in equip_user)
            if not es_compatible_eq and "mancuerna" in eq_ej and "mancuerna" in equip_user:
                es_compatible_eq = True
            if not es_compatible_eq and "barra" in eq_ej and "barra" in equip_user:
                es_compatible_eq = True

            # Compatibilidad de nivel
            es_compatible_lvl = True
            if perfil.nivel_experiencia == "PRINCIPIANTE":
                if "avanzado" in lvl_ej or "experto" in lvl_ej:
                    es_compatible_lvl = False

            if es_compatible_eq and es_compatible_lvl:
                candidatos_validos.append(ej)

        reglas_aplicadas.append(
            f"REGLA_FILTRO_CANDIDATOS: Se seleccionaron {len(candidatos_validos)} ejercicios compatibles de un total de {len(catalogo)}."
        )

        # 3. Ajustes por Restricciones Declaradas y Postura
        restricciones_lower = [r.lower() for r in perfil.restricciones_declaradas]
        candidatos_filtrados = []
        for ej in candidatos_validos:
            desc_text = (ej.nombre + " " + " ".join(ej.grupos_musculares_primarios)).lower()
            excluir = False
            for restr in restricciones_lower:
                if restr in desc_text or ("rodilla" in restr and "cuádriceps" in desc_text):
                    excluir = True
                    break
            if not excluir:
                candidatos_filtrados.append(ej)

        if len(candidatos_filtrados) < len(candidatos_validos):
            reglas_aplicadas.append("REGLA_EXCLUSION_RESTRICCIONES: Se excluyeron ejercicios incompatibles con restricciones declaradas.")

        # Inspección Postural Complementaria
        asimetria_hombros = False
        if perfil.metricas_corporales and perfil.metricas_corporales.inclinacion_hombros_grados:
            if perfil.metricas_corporales.inclinacion_hombros_grados > 3.0:
                asimetria_hombros = True
                observaciones.append(
                    f"Atención Postural: Se detectó inclinación de hombros de {perfil.metricas_corporales.inclinacion_hombros_grados}°. El sistema prioriza el trabajo unilateral con mancuernas/poleas para evitar descompensaciones."
                )
                reglas_aplicadas.append("REGLA_ADAPTACION_POSTURAL_UNILATERAL: Priorización de ejercicios unilaterales debido a asimetría geométrica de hombros.")

        # 4. Parámetros de Volumen e Intensidad (ACSM / NSCA)
        series, reps, descanso, prescripcion_extra = self._determinar_volumen_intensidad(perfil.objetivo)
        reglas_aplicadas.append(
            f"REGLA_PARAMETROS_ACSM: Objetivo {perfil.objetivo} -> {series} series, {reps} reps, {descanso}s descanso ({prescripcion_extra})."
        )

        # 5. Estructura de Distribución Semanal Dinámica (Splits Especializados)
        dias_rutina = self._construir_dias_semana(
            perfil.objetivo,
            perfil.dias_disponibles,
            candidatos_filtrados,
            series,
            reps,
            descanso,
            prescripcion_extra,
            asimetria_hombros,
            reglas_aplicadas,
        )

        # 6. Construcción de Justificación
        justificacion = self._generar_texto_justificacion(perfil, reglas_aplicadas, observaciones)

        return RecomendacionRutinaResponse(
            rutina_nombre=f"Rutina Personalizada IA - {perfil.objetivo} ({perfil.dias_disponibles} días/sem)",
            objetivo=perfil.objetivo,
            nivel=perfil.nivel_experiencia,
            dias_semana=dias_rutina,
            reglas_aplicadas=reglas_aplicadas,
            justificacion_detallada=justificacion,
            observaciones=observaciones,
        )

    def _determinar_volumen_intensidad(self, objetivo: str) -> Tuple[int, str, int, str]:
        obj = objetivo.upper()
        if obj == "HIPERTROFIA":
            return (4, "8 - 12", 90, "RIR 1-2, Tempo 3-0-1-0 con control excéntrico")
        elif obj == "FUERZA":
            return (4, "3 - 6", 150, "RIR 2-3, Cargas elevadas y fase concéntrica explosiva")
        elif obj == "RESISTENCIA":
            return (3, "15 - 20", 45, "RIR 0-1, Densidad alta y pausas breves")
        else:  # ACONDICIONAMIENTO
            return (3, "12 - 15", 60, "Ritmo continuo, enfoque metabólico y cadencia fluida")

    def _construir_dias_semana(
        self,
        objetivo: str,
        dias: int,
        candidatos: List[EjercicioCatalogoItem],
        series: int,
        reps: str,
        descanso: int,
        prescripcion_extra: str,
        asimetria_hombros: bool,
        reglas_aplicadas: List[str],
    ) -> List[DiaRutina]:
        obj = objetivo.upper()
        resultado_dias = []

        # MATRIZ DE SPLITS DIFERENCIADA POR OBJETIVO Y DÍAS
        enfoques = self._obtener_enfoques_por_objetivo(obj, dias)
        reglas_aplicadas.append(f"REGLA_SPLIT_ESPECIALIZADO: Split diseñado específicamente para '{obj}' en frecuencia {dias} días.")

        # Mantener seguimiento global de ejercicios usados para evitar repeticiones excesivas entre días
        usados_global_ids = set()

        for i, (label, nombre_dia, musculos) in enumerate(enfoques):
            ejercicios_dia = self._seleccionar_ejercicios_para_musculos(
                candidatos,
                musculos,
                series,
                reps,
                descanso,
                prescripcion_extra,
                obj,
                asimetria_hombros,
                usados_global_ids,
            )

            # Registrar los ejercicios asignados para rotación
            for ej in ejercicios_dia:
                usados_global_ids.add(ej.id_ejercicio)

            resultado_dias.append(
                DiaRutina(
                    dia_numero=i + 1,
                    nombre_dia=nombre_dia,
                    enfoque_muscular=", ".join(musculos[:3]),
                    ejercicios=ejercicios_dia,
                )
            )

        return resultado_dias

    def _obtener_enfoques_por_objetivo(self, objetivo: str, dias: int) -> List[Tuple[str, str, List[str]]]:
        """Devuelve nombres y grupos musculares según el objetivo atlético y frecuencia semanal."""
        obj = (objetivo or "").strip().upper()
        if obj == "ACONDICIONAMIENTO":
            if dias <= 3:
                plantilla = [
                    ("Día 1", "Circuito Metabólico Total & Kettlebell", ["Pecho", "Cuádriceps", "Abdominales", "Hombros", "Espalda Media"]),
                    ("Día 2", "Capacidad Cardiorrespiratoria & Core", ["Dorsales", "Isquiotibiales", "Abdominales", "Bíceps", "Tríceps"]),
                    ("Día 3", "Resistencia Dinámica & Tren Inferior", ["Glúteos", "Cuádriceps", "Hombros", "Pecho", "Pantorrillas"]),
                ]
            elif dias == 4:
                plantilla = [
                    ("Día 1", "Acondicionamiento Funcional Empuje", ["Pecho", "Hombros", "Tríceps", "Abdominales"]),
                    ("Día 2", "Complejos Metabólicos Tracción", ["Dorsales", "Bíceps", "Espalda Media", "Pantorrillas"]),
                    ("Día 3", "Potencia & Resistencia de Pierna", ["Cuádriceps", "Glúteos", "Isquiotibiales", "Abdominales"]),
                    ("Día 4", "Fullbody HIIT & Estabilidad Central", ["Pecho", "Dorsales", "Hombros", "Abdominales"]),
                ]
            else:
                plantilla = [
                    ("Día 1", "Circuito Metabólico Superior A", ["Pecho", "Hombros", "Abdominales"]),
                    ("Día 2", "Resistencia Dinámica Inferior A", ["Cuádriceps", "Glúteos", "Pantorrillas"]),
                    ("Día 3", "Intervalos Funcionales & Core", ["Dorsales", "Espalda Media", "Abdominales"]),
                    ("Día 4", "Circuito Metabólico Superior B", ["Hombros", "Bíceps", "Tríceps"]),
                    ("Día 5", "Potencia de Cadena Posterior", ["Isquiotibiales", "Glúteos", "Abdominales"]),
                    ("Día 6", "Fullbody Cross-Conditioning", ["Pecho", "Dorsales", "Cuádriceps"]),
                ]
        elif obj == "FUERZA":
            if dias <= 3:
                plantilla = [
                    ("Día 1", "Fuerza Básicos de Empuje (Bench Focus)", ["Pecho", "Hombros", "Tríceps", "Abdominales"]),
                    ("Día 2", "Fuerza Tracción & Cadena Posterior", ["Dorsales", "Espalda Media", "Isquiotibiales", "Bíceps"]),
                    ("Día 3", "Fuerza de Sentadilla & Unilateral", ["Cuádriceps", "Glúteos", "Pantorrillas", "Abdominales"]),
                ]
            elif dias == 4:
                plantilla = [
                    ("Día 1", "Fuerza Torso Pesado (Press Banca & Remo)", ["Pecho", "Dorsales", "Hombros"]),
                    ("Día 2", "Fuerza Pierna Pesada (Sentadilla & Glúteos)", ["Cuádriceps", "Glúteos", "Pantorrillas"]),
                    ("Día 3", "Fuerza Vertical & Tracción (Militar & Pull)", ["Hombros", "Espalda Media", "Bíceps", "Tríceps"]),
                    ("Día 4", "Fuerza Cadena Posterior (Deadlift Focus)", ["Isquiotibiales", "Glúteos", "Dorsales", "Abdominales"]),
                ]
            else:
                plantilla = [
                    ("Día 1", "Heavy Push A (Pecho)", ["Pecho", "Hombros", "Tríceps"]),
                    ("Día 2", "Heavy Pull A (Espalda)", ["Dorsales", "Espalda Media", "Bíceps"]),
                    ("Día 3", "Heavy Squat (Pierna)", ["Cuádriceps", "Glúteos", "Pantorrillas"]),
                    ("Día 4", "Heavy Overhead (Deltoides)", ["Hombros", "Tríceps", "Pecho"]),
                    ("Día 5", "Heavy Deadlift (Cadena Posterior)", ["Isquiotibiales", "Dorsales", "Abdominales"]),
                    ("Día 6", "Fuerza Unilateral & Soporte", ["Cuádriceps", "Bíceps", "Glúteos"]),
                ]
        elif obj == "RESISTENCIA":
            if dias <= 3:
                plantilla = [
                    ("Día 1", "Resistencia de Alta Densidad Tren Superior", ["Pecho", "Dorsales", "Hombros", "Bíceps"]),
                    ("Día 2", "Resistencia Muscular Tren Inferior", ["Cuádriceps", "Isquiotibiales", "Glúteos", "Pantorrillas"]),
                    ("Día 3", "Resistencia Funcional & Acondicionamiento Core", ["Pecho", "Dorsales", "Abdominales", "Hombros"]),
                ]
            elif dias == 4:
                plantilla = [
                    ("Día 1", "Resistencia Empuje & Tracción Superior", ["Pecho", "Dorsales", "Tríceps"]),
                    ("Día 2", "Resistencia Tren Inferior & Isometría", ["Cuádriceps", "Isquiotibiales", "Glúteos"]),
                    ("Día 3", "Resistencia Hombros & Brazos", ["Hombros", "Bíceps", "Tríceps", "Abdominales"]),
                    ("Día 4", "Resistencia Metabólica Fullbody", ["Pecho", "Dorsales", "Piernas", "Core"]),
                ]
            else:
                plantilla = [
                    ("Día 1", "Resistencia Tren Superior A", ["Pecho", "Hombros", "Tríceps"]),
                    ("Día 2", "Resistencia Pierna A", ["Cuádriceps", "Pantorrillas", "Glúteos"]),
                    ("Día 3", "Resistencia Tracción & Dorsales", ["Dorsales", "Bíceps", "Abdominales"]),
                    ("Día 4", "Resistencia Tren Superior B", ["Hombros", "Pecho", "Espalda Media"]),
                    ("Día 5", "Resistencia Cadena Posterior B", ["Isquiotibiales", "Glúteos", "Abdominales"]),
                    ("Día 6", "Resistencia Metabólica Total", ["Pecho", "Cuádriceps", "Dorsales"]),
                ]
        else:  # HIPERTROFIA (Default)
            if dias <= 3:
                plantilla = [
                    ("Día 1", "Hipertrofia Empuje & Cuádriceps (Push Focus)", ["Pecho", "Hombros", "Tríceps", "Cuádriceps"]),
                    ("Día 2", "Hipertrofia Tracción & Cadena Posterior (Pull Focus)", ["Dorsales", "Espalda Media", "Bíceps", "Isquiotibiales"]),
                    ("Día 3", "Estímulo Hipertrófico Antagonista & Pierna", ["Pecho", "Dorsales", "Glúteos", "Abdominales"]),
                ]
            elif dias == 4:
                plantilla = [
                    ("Día 1", "Torso Hipertrofia A (Pecho & Espalda)", ["Pecho", "Dorsales", "Hombros", "Tríceps"]),
                    ("Día 2", "Pierna Hipertrofia A (Enfoque Cuádriceps)", ["Cuádriceps", "Isquiotibiales", "Glúteos", "Pantorrillas"]),
                    ("Día 3", "Torso Hipertrofia B (Deltoides & Brazos)", ["Hombros", "Bíceps", "Tríceps", "Espalda Media"]),
                    ("Día 4", "Pierna Hipertrofia B (Enfoque Isquios & Glúteos)", ["Isquiotibiales", "Glúteos", "Cuádriceps", "Abdominales"]),
                ]
            else:
                plantilla = [
                    ("Día 1", "Hipertrofia Pecho & Tríceps", ["Pecho", "Tríceps", "Hombros"]),
                    ("Día 2", "Hipertrofia Espalda & Bíceps", ["Dorsales", "Espalda Media", "Bíceps"]),
                    ("Día 3", "Hipertrofia Cuádriceps & Pantorrillas", ["Cuádriceps", "Pantorrillas", "Abdominales"]),
                    ("Día 4", "Hipertrofia Deltoides & Trapecios", ["Hombros", "Espalda Media", "Tríceps"]),
                    ("Día 5", "Hipertrofia Isquiotibiales & Glúteos", ["Isquiotibiales", "Glúteos", "Abdominales"]),
                    ("Día 6", "Hipertrofia Brazos & Core de Soporte", ["Bíceps", "Tríceps", "Abdominales"]),
                ]

        return plantilla[:min(dias, len(plantilla))]

    def _evaluar_idoneidad_ejercicio(
        self,
        ej: EjercicioCatalogoItem,
        objetivo: str,
        asimetria_hombros: bool,
    ) -> float:
        """Asigna un puntaje de idoneidad al ejercicio según el objetivo biomecánico."""
        score = 10.0
        mecanica = (ej.mecanica or "").lower()
        equip = (ej.equipamiento or "").lower()
        nombre = ej.nombre.lower()

        # 1. Ponderación Compuesto vs Aislamiento
        if "compuesto" in mecanica:
            if objetivo == "FUERZA":
                score += 15.0
            elif objetivo == "HIPERTROFIA":
                score += 10.0
            else:
                score += 6.0
        elif "aislamiento" in mecanica:
            if objetivo == "HIPERTROFIA":
                score += 8.0
            elif objetivo == "RESISTENCIA":
                score += 7.0
            elif objetivo == "FUERZA":
                score -= 3.0

        # 2. Ponderación por Equipamiento vs Objetivo
        if objetivo == "ACONDICIONAMIENTO":
            if any(e in equip for e in ["peso corporal", "kettlebell", "mancuerna", "banda"]):
                score += 10.0
            if "barra" in equip and "compuesto" not in mecanica:
                score -= 4.0
        elif objetivo == "FUERZA":
            if any(e in equip for e in ["barra", "mancuerna", "maquina"]):
                score += 10.0
        elif objetivo == "RESISTENCIA":
            if any(e in equip for e in ["peso corporal", "polea", "mancuerna", "banda"]):
                score += 8.0

        # 3. Adaptación Postural Unilateral (si hay asimetría de hombros)
        if asimetria_hombros:
            if any(u in nombre for u in ["unilateral", "mancuerna", "a un brazo", "una mano", "polea"]):
                score += 14.0
            elif "barra" in equip:
                score -= 6.0

        # Agregar pequeño componente aleatorio para romper empates y dar variedad
        score += random.uniform(0.5, 3.5)

        return score

    def _seleccionar_ejercicios_para_musculos(
        self,
        candidatos: List[EjercicioCatalogoItem],
        musculos_objetivo: List[str],
        series: int,
        reps: str,
        descanso: int,
        prescripcion_extra: str,
        objetivo: str,
        asimetria_hombros: bool,
        usados_previos: set,
    ) -> List[EjercicioAsignado]:
        asignados = []
        usados_dia_ids = set()

        orden = 1
        for musculo in musculos_objetivo:
            # Buscar candidatos primarios
            coincidencias = [
                ej for ej in candidatos
                if ej.id not in usados_dia_ids and any(musculo.lower() in m.lower() for m in ej.grupos_musculares_primarios)
            ]

            if not coincidencias:
                # Buscar en secundarios
                coincidencias = [
                    ej for ej in candidatos
                    if ej.id not in usados_dia_ids and any(musculo.lower() in m.lower() for m in ej.grupos_musculares_secundarios)
                ]

            if coincidencias:
                # Calificar y ordenar candidatos por afinidad al objetivo
                coincidencias_calificadas = [
                    (self._evaluar_idoneidad_ejercicio(ej, objetivo, asimetria_hombros) - (4.0 if ej.id in usados_previos else 0.0), ej)
                    for ej in coincidencias
                ]
                coincidencias_calificadas.sort(key=lambda x: x[0], reverse=True)

                # Tomar los 3 mejores y elegir mediante muestreo ponderado para máxima variedad sin perder calidad
                top_candidatos = [item[1] for item in coincidencias_calificadas[:3]]
                pesos = [max(item[0], 1.0) for item in coincidencias_calificadas[:3]]

                seleccionado = random.choices(top_candidatos, weights=pesos, k=1)[0]
                usados_dia_ids.add(seleccionado.id)

                # Alternativas
                alt_items = [
                    EjercicioAlternativa(id=alt.id, nombre=alt.nombre, equipamiento=alt.equipamiento)
                    for alt in top_candidatos if alt.id != seleccionado.id
                ][:2]

                obs = f"Enfoque en {musculo}."
                if seleccionado.mecanica:
                    obs += f" Patrón {seleccionado.mecanica}."
                if prescripcion_extra:
                    obs += f" ({prescripcion_extra})"

                asignados.append(
                    EjercicioAsignado(
                        id_ejercicio=seleccionado.id,
                        nombre=seleccionado.nombre,
                        series=series,
                        repeticiones=reps,
                        descanso_segundos=descanso,
                        orden=orden,
                        observaciones=obs,
                        alternativas=alt_items,
                    )
                )
                orden += 1
                if orden > 6:
                    break

        return asignados

    def _generar_texto_justificacion(
        self,
        perfil: PerfilUsuarioInput,
        reglas: List[str],
        observaciones: List[str],
    ) -> str:
        lines = []
        lines.append(f"### Justificación del Sistema Experto para {perfil.objetivo}")
        lines.append(f"- **Nivel de Experiencia**: {perfil.nivel_experiencia}")
        lines.append(f"- **Días Semanales**: {perfil.dias_disponibles} días")
        lines.append(f"- **Equipamiento Seleccionado**: {', '.join(perfil.equipamiento_disponible) if perfil.equipamiento_disponible else 'Peso corporal'}")
        lines.append("\n**Reglas Aplicadas:**")
        for r in reglas:
            lines.append(f"- `{r}`")

        if observaciones:
            lines.append("\n**Observaciones Especiales:**")
            for obs in observaciones:
                lines.append(f"- {obs}")

        return "\n".join(lines)

