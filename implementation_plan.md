# Plan de Implementación: Incorporación Autónoma de Base de Datos de Ejercicios (Opción A)

## 1. Diagnóstico y Decisión
- **Problema previo**: La carpeta `EJERCICIOS/free-exercise-db` funcionaba como un repositorio Git anidado sin configuración `.gitmodules`. Esto provocaba la advertencia `(modified content)` en Git y dejaba la carpeta vacía en cualquier clonación fresca del proyecto.
- **Decisión del usuario**: Opción A — Desvincular el `.git` interno e incorporar la base de datos de ejercicios (imágenes y `dist/exercises.json`) directamente al repositorio de control de versiones `DUBSS-GYM`.
- **Beneficio**: El proyecto se vuelve 100% autosuficiente y portátil para la defensa de grado. Cualquier clonación incluirá de inmediato el dataset y las imágenes necesarias para `EjercicioSeeder`.

---

## 2. Pasos Técnicos de Ejecución

1. **Eliminar el `.git` interno del submódulo**:
   - Eliminar `EJERCICIOS/free-exercise-db/.git` (directorio oculto de control de versiones ajeno).
   - Eliminar `EJERCICIOS/free-exercise-db/.gitignore` si no es necesario o dejarlo para `.DS_Store`.
2. **Desindexar el puntero gitlink previo**:
   - `git rm --cached EJERCICIOS/free-exercise-db` en el repositorio principal para desvincular el modo `160000` (submódulo).
3. **Indexar los archivos reales**:
   - Agregar la carpeta completa `EJERCICIOS/free-exercise-db` a Git (`dist/exercises.json`, `exercises/`, etc.).
4. **Verificación**:
   - Ejecutar `git status` para confirmar que se agregan como archivos normales y que no existe ningún error de submódulo.
5. **Commit y Push**:
   - Crear commit: `feat(ejercicios): incorporar dataset de ejercicios e imagenes al repositorio`
   - Realizar `git push origin main`.
