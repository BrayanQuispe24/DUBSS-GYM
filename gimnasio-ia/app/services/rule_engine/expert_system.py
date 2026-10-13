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
    """Motor de Reglas Experto basado en principios ACSM / NSCA."""

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
        if perfil.metricas_corporales and perfil.metricas_corporales.inclinacion_hombros_grados:
            if perfil.metricas_corporales.inclinacion_hombros_grados > 3.0:
                observaciones.append(
                    f"Atención Postural: Se detectó inclinación de hombros de {perfil.metricas_corporales.inclinacion_hombros_grados}°. El sistema prioriza el trabajo unilateral con mancuernas/poleas para evitar descompensaciones."
                )
                reglas_aplicadas.append("REGLA_ADAPTACION_POSTURAL_UNILATERAL: Priorización de ejercicios unilaterales debido a asimetría geométrica de hombros.")

        # 4. Parámetros de Volumen e Intensidad (ACSM / NSCA)
        series, reps, descanso = self._determinar_volumen_intensidad(perfil.objetivo)
        reglas_aplicadas.append(
            f"REGLA_PARAMETROS_ACSM: Objetivo {perfil.objetivo} -> {series} series, {reps} reps, {descanso}s descanso."
        )

        # 5. Estructura de Distribución Semanal (Splits)
        dias_rutina = self._construir_dias_semana(
            perfil.dias_disponibles,
            candidatos_filtrados,
            series,
            reps,
            descanso,
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

    def _determinar_volumen_intensidad(self, objetivo: str) -> Tuple[int, str, int]:
        obj = objetivo.upper()
        if obj == "HIPERTROFIA":
            return (4, "8 - 12", 90)
        elif obj == "FUERZA":
            return (4, "3 - 6", 150)
        elif obj == "RESISTENCIA":
            return (3, "15 - 20", 45)
        else:  # ACONDICIONAMIENTO
            return (3, "12 - 15", 60)

    def _construir_dias_semana(
        self,
        dias: int,
        candidatos: List[EjercicioCatalogoItem],
        series: int,
        reps: str,
        descanso: int,
        reglas_aplicadas: List[str],
    ) -> List[DiaRutina]:
        resultado_dias = []

        if dias <= 3:
            reglas_aplicadas.append("REGLA_DISTRIBUCION_SPLIT: Selección de Split Fullbody (Cuerpo Completo) para óptima frecuencia de entrenamiento.")
            enfoques = [
                ("Día 1", "Fullbody A - Enfoque Pecho & Cuádriceps", ["Pecho", "Cuádriceps", "Espalda Media", "Hombros", "Abdominales"]),
                ("Día 2", "Fullbody B - Enfoque Dorsales & Isquiotibiales", ["Dorsales", "Isquiotibiales", "Bíceps", "Tríceps", "Pantorrillas"]),
                ("Día 3", "Fullbody C - Enfoque Hombros & Glúteos", ["Hombros", "Glúteos", "Pecho", "Dorsales", "Abdominales"]),
            ]
            for i in range(min(dias, len(enfoques))):
                label, nombre_dia, musculos = enfoques[i]
                ejercicios_dia = self._seleccionar_ejercicios_para_musculos(candidatos, musculos, series, reps, descanso)
                resultado_dias.append(
                    DiaRutina(
                        dia_numero=i + 1,
                        nombre_dia=nombre_dia,
                        enfoque_muscular=", ".join(musculos[:3]),
                        ejercicios=ejercicios_dia,
                    )
                )
        elif dias == 4:
            reglas_aplicadas.append("REGLA_DISTRIBUCION_SPLIT: Selección de Split Torso / Pierna (Upper / Lower) de 4 días.")
            enfoques = [
                ("Día 1", "Torso A (Push/Pull)", ["Pecho", "Dorsales", "Hombros", "Tríceps"]),
                ("Día 2", "Pierna A (Cuádriceps)", ["Cuádriceps", "Isquiotibiales", "Glúteos", "Pantorrillas", "Abdominales"]),
                ("Día 3", "Torso B (Pull/Push)", ["Dorsales", "Pecho", "Hombros", "Bíceps"]),
                ("Día 4", "Pierna B (Cadena Posterior)", ["Isquiotibiales", "Glúteos", "Cuádriceps", "Pantorrillas", "Abdominales"]),
            ]
            for i in range(4):
                label, nombre_dia, musculos = enfoques[i]
                ejercicios_dia = self._seleccionar_ejercicios_para_musculos(candidatos, musculos, series, reps, descanso)
                resultado_dias.append(
                    DiaRutina(
                        dia_numero=i + 1,
                        nombre_dia=nombre_dia,
                        enfoque_muscular=", ".join(musculos[:3]),
                        ejercicios=ejercicios_dia,
                    )
                )
        else:  # 5-7 Días
            reglas_aplicadas.append("REGLA_DISTRIBUCION_SPLIT: Selección de Split Push / Pull / Legs (Empuje / Jalón / Pierna) de alta frecuencia.")
            enfoques = [
                ("Día 1", "Empuje (Push A)", ["Pecho", "Hombros", "Tríceps"]),
                ("Día 2", "Jalón (Pull A)", ["Dorsales", "Espalda Media", "Bíceps", "Antebrazos"]),
                ("Día 3", "Pierna (Legs A)", ["Cuádriceps", "Isquiotibiales", "Glúteos", "Pantorrillas"]),
                ("Día 4", "Empuje (Push B)", ["Hombros", "Pecho", "Tríceps"]),
                ("Día 5", "Jalón (Pull B)", ["Dorsales", "Trapecios", "Bíceps"]),
                ("Día 6", "Pierna (Legs B)", ["Isquiotibiales", "Glúteos", "Cuádriceps", "Pantorrillas"]),
            ]
            for i in range(min(dias, len(enfoques))):
                label, nombre_dia, musculos = enfoques[i]
                ejercicios_dia = self._seleccionar_ejercicios_para_musculos(candidatos, musculos, series, reps, descanso)
                resultado_dias.append(
                    DiaRutina(
                        dia_numero=i + 1,
                        nombre_dia=nombre_dia,
                        enfoque_muscular=", ".join(musculos[:3]),
                        ejercicios=ejercicios_dia,
                    )
                )

        return resultado_dias

    def _seleccionar_ejercicios_para_musculos(
        self,
        candidatos: List[EjercicioCatalogoItem],
        musculos_objetivo: List[str],
        series: int,
        reps: str,
        descanso: int,
    ) -> List[EjercicioAsignado]:
        asignados = []
        usados_ids = set()

        orden = 1
        for musculo in musculos_objetivo:
            # Buscar candidato primario
            coincidencias = [
                ej for ej in candidatos
                if ej.id not in usados_ids and any(musculo.lower() in m.lower() for m in ej.grupos_musculares_primarios)
            ]

            if not coincidencias:
                # Buscar en secundarios
                coincidencias = [
                    ej for ej in candidatos
                    if ej.id not in usados_ids and any(musculo.lower() in m.lower() for m in ej.grupos_musculares_secundarios)
                ]

            if coincidencias:
                # Priorizar compuestos primero
                coincidencias.sort(key=lambda x: 0 if (x.mecanica and "compuesto" in x.mecanica.lower()) else 1)
                seleccionado = coincidencias[0]
                usados_ids.add(seleccionado.id)

                # Buscar alternativas
                alt_items = [
                    EjercicioAlternativa(id=alt.id, nombre=alt.nombre, equipamiento=alt.equipamiento)
                    for alt in coincidencias[1:3]
                ]

                obs = f"Ejercicio enfocado en {musculo}."
                if seleccionado.mecanica:
                    obs += f" Patrón {seleccionado.mecanica}."

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
