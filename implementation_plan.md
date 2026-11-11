# Plan de Implementación: Resumen Compacto en Tarjeta y Vista Completa en Modal

## 1. Causa y Requerimiento
- **Situación Actual**: Al guardarse la receta completa en `observacion`, la tarjeta en el listado de planes muestra todo el bloque de texto (ingredientes, pasos de cocina, sustitutos), saturando visualmente la tarjeta con un scroll excesivo.
- **Solicitud del Usuario**: *"En la tarjeta mostrar un resumen, cuando se le dé a abrir se verá la información completa"*.

---

## 2. Modificaciones Propuestas

### A. Frontend: Simplificar Tarjeta en `PlanAlimentacionPage.tsx`
- **Archivo**: [PlanAlimentacionPage.tsx](file:///c:/Users/brayan/Documents/Chamba/Taller%20de%20grado/DUBSS-GYM/gimnasio-front/src/features/nutricion/pages/PlanAlimentacionPage.tsx)
- **Cambios**:
  1. **Comidas Prescritas en Tarjeta**:
     - Mantener solo la cabecera compacta: Tiempo de comida (`Desayuno`, `Almuerzo`...) y aporte en calorías (`736 kcal`).
     - Título del plato en negrita (`Gachas de Avena Energéticas con Huevo y Plátano`).
     - Si hay macros disponibles, mostrar únicamente una píldora corta: `P: 29g | C: 115g | G: 18g`.
     - **Ocultar** de la tarjeta la lista de ingredientes, preparación y sustitutos (evitando la saturación visual).
  2. **Remover el acordeón duplicado de estrategia** de la tarjeta para mantenerla limpia y compacta.
  3. **Botón de Acción Principal**:
     - Botón destacado y estilizado: **"Abrir Plan Completo"** con `<FaEye />`.
     - Al hacer clic, abre `PlanAlimentacionDetailModal.tsx` donde se muestra la ficha técnica completa (estrategia clínica de Gemini, ingredientes con cantidades exactas, pasos de preparación y sustitutos).

---

## 3. Plan de Verificación
1. Compilar el frontend con `npm run build` para garantizar cero errores.
2. Refrescar la página en el navegador.
3. Validar que las tarjetas queden limpias, compactas y legibles con únicamente el resumen del plato, calorías y macros.
4. Hacer clic en **"Abrir Plan Completo"** y confirmar que el modal muestre toda la receta exhaustiva.
