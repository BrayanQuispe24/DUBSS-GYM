# Transcripción Organizada y Relaciones del Diagrama de Base de Datos

> **Nota:** Transcripción estructurada a partir del diagrama entidad-relación del sistema de gimnasio. Se ordenaron los campos (poniendo la clave primaria `id` al inicio y las claves foráneas al final), se agruparon las tablas por módulos funcionales y se añadieron explícitamente las relaciones y llaves foráneas (`FK`) identificadas en el diagrama.

---

## 1. Módulo de Seguridad y Usuarios

### `roles`
- `id` (PK)
- `nombre`
- `estado`

### `permisos`
- `id` (PK)
- `nombre`
- `estado`

### `rol_permiso` (Tabla pivote N:M entre Roles y Permisos)
- `id` (PK)
- `id_rol` (FK -> `roles.id`)
- `id_permiso` (FK -> `permisos.id`)

### `usuarios`
- `id` (PK)
- `codigo`
- `nombre`
- `apellido`
- `estado`
- `ci`
- `celular`
- `correo_electronico`
- `fecha_registro`
- `contrasenia`
- `id_rol` (FK -> `roles.id`)

---

## 2. Módulo de Historial Médico y Salud

### `historiales`
- `id` (PK)
- `fecha_apertura`
- `observaciones_generales`
- `grupo_sanguineo`
- `sexo`
- `fecha_nacimiento`
- `domicilio`
- `celular_emergencia`
- `id_usuario` (FK -> `usuarios.id`)

### `detalle_historial` (Relación de composición / seguimiento periódico)
- `id` (PK)
- `peso`
- `altura`
- `imc`
- `porcentaje_grasa`
- `masa_muscular`
- `presion`
- `fecha_registro`
- `id_historial` (FK -> `historiales.id`)

### `antecedentes`
- `id` (PK)
- `observaciones`
- `tiene_enfermedades_cardiovasculares`
- `detalle_enfermedades_cardiovasculares`
- `se_realizo_intervencion_cardiovascular`
- `detalle_intervencion_cardiovascular`
- `tiene_hipertension_arterial`
- `detalle_hipertension_arterial`
- `tiene_enfermedades_pulmonares`
- `detalle_enfermedades_pulmonares`
- `tiene_diabetes`
- `detalle_diabetes`
- `tiene_enfermedades_osteoarticulares`
- `detalle_enfermedades_osteoarticulares`
- `tiene_enfermedades_neurologicas`
- `detalle_enfermedades_neurologicas`
- `tiene_convulsiones`
- `detalle_convulsiones`
- `tiene_intervencion_quirurgica`
- `detalle_intervencion_quirurgica`
- `sufrio_fracturas_oseas`
- `detalle_fracturas_oseas`
- `sufrio_algun_sintoma_durante_deporte`
- `detalle_sintomas_durante_deporte`
- `tiene_lesiones`
- `detalle_lesiones`
- `tiene_alergias`
- `detalle_alergias`
- `id_historial` (FK -> `historiales.id`)

---

## 3. Módulo de Solicitudes, Documentos y Pagos

### `tipo_documentos`
- `id` (PK)
- `nombre`
- `descripcion`

### `documentos`
- `id` (PK)
- `archivo_url`
- `id_tipo_documento` (FK -> `tipo_documentos.id`)
- `id_usuario` (FK -> `usuarios.id`)

### `formulario_solicitud`
- `id` (PK)
- `numero_formulario`
- `estado`
- `fecha_registro`
- `id_disciplina` (FK -> `disciplinas.id`)
- `id_usuario` (FK -> `usuarios.id`)

### `boleta_pago`
- `id` (PK)
- `numero_boleta`
- `fecha_pago`
- `monto`
- `metodo_pago`
- `concepto`
- `estado`
- `comprobante_url`
- `id_formulario` (FK -> `formulario_solicitud.id`)

---

## 4. Módulo de Disciplinas, Horarios, Tarifas e Inscripciones

### `horarios`
- `id` (PK)
- `hora_inicio`
- `hora_fin`

### `disciplinas`
- `id` (PK)
- `nombre`
- `cantidad_cupos`

### `disciplina_horario` (Tabla pivote N:M entre Disciplinas y Horarios)
- `id` (PK)
- `cupo_maximo`
- `estado`
- `id_horario` (FK -> `horarios.id`)
- `id_disciplina` (FK -> `disciplinas.id`)

### `tarifas`
- `id` (PK)
- `nombre`
- `precio`
- `fecha_inicio`
- `fecha_fin`
- `estado`

### `planes`
- `id` (PK)
- `nombre`
- `descripcion`
- `duracion_dias`
- `estado`
- `id_tarifa` (FK -> `tarifas.id`)

### `boleta_inscripcion`
- `id` (PK)
- `numero_boleta`
- `fecha_inscripcion`
- `fecha_inicio`
- `fecha_fin`
- `monto`
- `estado`
- `disciplina`
- `hora_inicio`
- `hora_salida`
- `id_tarifa` (FK -> `tarifas.id`)
- `id_usuario` (FK -> `usuarios.id`)

### `registro_entrada_salida`
- `id` (PK)
- `fecha_hora`
- `tipo`
- `id_boleta_inscripcion` (FK -> `boleta_inscripcion.id`)
- `id_usuario` (FK -> `usuarios.id`)

---

## 5. Módulo de Nutrición y Entrenamiento

### `plan_alimentacion`
- `id` (PK)
- `nombre`
- `objetivo`
- `fecha_inicio`
- `fecha_fin`
- `observacion`
- `estado`
- `id_usuario` (FK -> `usuarios.id`)

### `detalle_plan_alimentacion`
- `id` (PK)
- `dia_semana`
- `tipo_comida`
- `alimento`
- `cantidad`
- `unidad`
- `hora`
- `observacion`
- `id_plan_alimentacion` (FK -> `plan_alimentacion.id`)

### `plan_entrenamientos`
- `id` (PK)
- `nombre`
- `objetivo`
- `fecha_inicio`
- `fecha_fin`
- `estado`
- `observacion`
- `id_usuario` (FK -> `usuarios.id`)

### `rutinas`
- `id` (PK)
- `nombre`
- `descripcion`
- `nivel`
- `estado`

### `plan_entrenamiento_rutina` (Tabla pivote N:M entre Plan de Entrenamientos y Rutinas)
- `id` (PK)
- `dia_semana`
- `id_plan_entrenamiento` (FK -> `plan_entrenamientos.id`)
- `id_rutina` (FK -> `rutinas.id`)

### `tipo_ejercicio`
- `id` (PK)
- `nombre`
- `estado`

### `ejercicios`
- `id` (PK)
- `nombre`
- `descripcion`
- `id_tipo_ejercicio` (FK -> `tipo_ejercicio.id`)

### `rutina_ejercicio` (Tabla pivote / detalle N:M entre Rutinas y Ejercicios)
- `id` (PK)
- `series`
- `repeticiones`
- `peso`
- `duracion_segundos`
- `descanso_segundos`
- `orden`
- `observacion`
- `id_ejercicio` (FK -> `ejercicios.id`)
- `id_rutina` (FK -> `rutinas.id`)

### `grupo_muscular`
- `id` (PK)
- `nombre`
- `descripcion`

### `ejercicio_grupo_muscular` (Tabla pivote N:M entre Ejercicios y Grupo Muscular)
- `id` (PK)
- `tipo_participacion`
- `observacion`
- `id_ejercicio` (FK -> `ejercicios.id`)
- `id_grupo_muscular` (FK -> `grupo_muscular.id`)

---

## 6. Módulo de Inventario, Equipos y Mantenimiento

### `ambientes`
- `id` (PK)
- `nombre`
- `descripcion`
- `estado`

### `marcas`
- `id` (PK)
- `nombre`
- `estado`

### `tipo_equipo`
- `id` (PK)
- `nombre`
- `descripcion`
- `estado`

### `equipos`
- `id` (PK)
- `codigo`
- `nombre`
- `modelo`
- `fecha_adquisicion`
- `precio_compra`
- `estado`
- `cantidad`
- `id_ambiente` (FK -> `ambientes.id`)
- `id_marca` (FK -> `marcas.id`)
- `id_tipo_equipo` (FK -> `tipo_equipo.id`)

### `mantenimientos`
- `id` (PK)
- `tipo`
- `fecha_inicio`
- `fecha_fin`
- `descripcion`
- `costo`
- `estado`
- `proximo_mantenimiento`
- `observacion`
- `id_equipo` (FK -> `equipos.id`)

### `tipo_movimiento`
- `id` (PK)
- `nombre`
- `descripcion`

### `movimiento_inventario`
- `id` (PK)
- `fecha_hora`
- `motivo`
- `observacion`
- `cantidad`
- `id_tipo_movimiento` (FK -> `tipo_movimiento.id`)
- `id_equipo` (FK -> `equipos.id`)
- `id_usuario` (FK -> `usuarios.id`)

---

## Resumen de Correcciones y Mejoras Aplicadas

1. **Ordenamiento de Campos:** Se estandarizó el orden colocando el campo clave primaria (`id` / PK) al principio de cada tabla y las claves foráneas (`FK`) al final.
2. **Corrección de Errores Tipográficos:**
   - En `detalle_plan_alimentacion`: Se corrigió el nombre de la llave foránea `id_plan_implementacion` a `id_plan_alimentacion`.
   - En `grupo_muscular`: Se eliminó el campo duplicado `- id`.
   - En `registro_entrada_salida`: Se estandarizó el nombre del encabezado a minúsculas (`registro_entrada_salida`).
3. **Agrupación por Módulos:** Se organizaron las 27 tablas en 6 módulos lógicos del sistema (Seguridad, Salud, Solicitudes/Pagos, Inscripciones, Nutrición/Entrenamiento e Inventario/Mantenimiento).
4. **Claridad de Relaciones:** Se especificó en cada llave foránea la tabla y campo de destino `(FK -> tabla.id)` y se identificaron explícitamente las tablas pivote para relaciones N:M.
