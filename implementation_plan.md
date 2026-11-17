# Plan de Implementación: Módulo de Auditoría y Bitácora del Sistema (DUBSS-GYM)

---

## 1. Contexto, Necesidad y Objetivos

En una plataforma de misión crítica como **DUBSS-GYM (FitGo!)**, que gestiona pagos, carnets de acceso físico con QR, planes de salud biomecánica con IA y roles institucionales, la **trazabilidad y la inmutabilidad de los datos** son obligatorias para auditorías forenses, control interno de la **D.U.B.S. - UAGRM** y prevención de fraudes.

### Objetivos Específicos:
1. **Registro Append-Only (Solo Inserción):** Ningún usuario (ni siquiera el administrador) podrá alterar, editar o eliminar registros de la bitácora.
2. **Auditoría Automática de Modelos Eloquent:** Capturar automáticamente cambios en tablas clave (`usuarios`, `boletas_pago`, `boletas_inscripcion`, `tarifas`, `planes`, `equipos`, `roles`, `permisos`).
3. **Auditoría de Eventos del Sistema:** Registrar inicios/cierres de sesión, intentos fallidos de autenticación, escaneos QR en garita y ejecuciones del motor de IA.
4. **Almacenamiento Eficiente con JSONB (PostgreSQL 16):** Almacenar los estados `old_values` y `new_values` en formato binario indexable para comparaciones instantáneas.
5. **Interfaz de Consulta Enterprise SaaS:** Tabla de alta densidad con filtros combinados, visualizador comparativo de cambios (*Diff Viewer*) y exportación a Excel / PDF.

---

## 2. Librerías y Dependencias Seleccionadas

### 2.1. Backend (Laravel 11 / PHP 8.4)

| Librería / Componente | Versión | Rol en la Arquitectura | Justificación Técnica |
| :--- | :---: | :--- | :--- |
| **`owen-it/laravel-auditing`** | `^14.0` | **Motor Central de Auditoría** | Es el estándar de oro en Laravel para auditorías de base de datos. Se integra mediante el trait `Auditable` en los modelos Eloquent sin acoplar lógica en los controladores. Captura automáticamente usuario, IP, User-Agent, URL, evento (`created`, `updated`, `deleted`, `restored`) y diferencias campo por campo. |
| **Eloquent Observers & Custom Events** | Nativo | **Auditoría de Eventos No-Modelo** | Para registrar eventos fuera de Eloquent (inicios de sesión vía Sanctum, intentos fallidos, escaneos de garita en `ValidarAccesoQRAction`), se utilizará un servicio desacoplado `AuditLoggerService` que despacha registros a la misma tabla `audits`. |
| **PostgreSQL JSONB & GIN Index** | Nativo | **Persistencia de Diferencias** | Almacena los valores anteriores y nuevos sin requerir migraciones complejas ante cambios en los esquemas de datos. Permite búsquedas forenses directas mediante operadores JSON (`@>`, `?`, `->>`). |
| **Laravel StreamedResponse** | Nativo | **Exportación Forense CSV/Excel** | Exportación de cientos de miles de registros de bitácora por *streaming* directo con uso de memoria constante (< 10 MB RAM). |

> [!NOTE]
> **¿Por qué `owen-it/laravel-auditing` frente a `spatie/laravel-activitylog`?**  
> `spatie/laravel-activitylog` está orientado a timelines sociales o muros de actividad tipo "Juan comentó en una foto". En contraste, `owen-it/laravel-auditing` está concebido para **auditoría estricta de cumplimiento corporativo y financiero**, capturando de forma nativa la matriz de cambios (`old` vs `new`) con menor consumo de recursos.

---

### 2.2. Frontend (React 19 / TypeScript / Vite)

Aprovechando la infraestructura ya instalada en `gimnasio-front/package.json`, se mantendrá el principio de **cero inflado de dependencias**:

| Librería | Versión Instalada | Rol en la Interfaz |
| :--- | :---: | :--- |
| **`@tanstack/react-table`** | `^8.21.3` (Instalada) | Gestión de la tabla de auditoría: ordenamiento por columnas, paginación del servidor, control de visibilidad de columnas y selección de filas. |
| **`@tanstack/react-query`** | `^5.102.8` (Instalada) | Caché de registros de auditoría, sincronización de filtros en URL y revalidación en segundo plano. |
| **`exceljs`** | `^4.4.0` (Instalada) | Generación y descarga directa de libros de auditoría en formato Excel `.xlsx` con encabezados corporativos institucionales. |
| **`@react-pdf/renderer`** | `^4.9.0` (Instalada) | Generación de actas de auditoría e informes técnicos oficiales en PDF para la D.U.B.S. |
| **`lucide-react` / `react-icons`** | `^1.46.0` / `^5.7.0` (Instaladas) | Badges e iconografía de severidad y tipos de eventos (`CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `ALERT`). |
| **`AuditDiffViewer` (Componente Nativo a medida)** | Código Propio (Ligero) | Componente visual que compara el objeto `old_values` contra `new_values`, resaltando en rojo las propiedades eliminadas o modificadas y en verde los nuevos valores asignados, sin necesidad de librerías externas pesadas. |

---

## 3. Arquitectura de Base de Datos y Persistencia

### Migración de la Tabla `audits` (PostgreSQL)

```sql
CREATE TABLE audits (
    id BIGSERIAL PRIMARY KEY,
    user_type VARCHAR(255) NULL,
    user_id BIGINT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    event VARCHAR(50) NOT NULL,            -- 'created', 'updated', 'deleted', 'login', 'logout', 'failed_attempt', 'qr_denied'
    auditable_type VARCHAR(255) NULL,      -- 'App\Models\BoletaPago', 'App\Models\Usuario', etc.
    auditable_id BIGINT NULL,
    old_values JSONB NULL,                 -- Valores antes de la mutación
    new_values JSONB NULL,                 -- Valores posteriores a la mutación
    url TEXT NULL,                         -- Endpoint o URL desde donde se ejecutó
    ip_address VARCHAR(45) NULL,           -- Dirección IP del cliente
    user_agent TEXT NULL,                  -- Navegador / Cliente HTTP
    tags VARCHAR(255) NULL,                -- 'seguridad', 'finanzas', 'acceso_qr', 'ia_motor'
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Alta Velocidad para Consultas Forenses:
CREATE INDEX idx_audits_auditable ON audits (auditable_type, auditable_id);
CREATE INDEX idx_audits_user_event ON audits (user_id, event);
CREATE INDEX idx_audits_created_at ON audits (created_at DESC);
CREATE INDEX idx_audits_tags ON audits (tags);
CREATE INDEX idx_audits_old_values_gin ON audits USING GIN (old_values);
CREATE INDEX idx_audits_new_values_gin ON audits USING GIN (new_values);
```

---

## 4. Modelos a Auditar en la Fase 1

Se incorporará la interfaz `OwenIt\Auditing\Contracts\Auditable` y el trait `OwenIt\Auditing\Auditable` en los siguientes modelos centrales:

1. **Seguridad y Accesos:** `Usuario`, `Rol`, `Permiso`.
2. **Financiero y Trámites:** `BoletaPago`, `BoletaInscripcion`, `Tarifa`, `Plan`, `FormularioSolicitud`.
3. **Control Físico e Inventario:** `RegistroEntradaSalida`, `Equipo`, `Mantenimiento`, `MovimientoInventario`.
4. **Salud y Deporte:** `Historial`, `PlanEntrenamiento`, `PlanAlimentacion`.

> [!TIP]
> **Protección de Datos Sensibles:**  
> Se configurará `$auditExclude` para que las columnas confidenciales (tales como `password`, `remember_token`, tokens de Telegram o firmas HMAC) nunca queden expuestas en texto claro dentro de la bitácora.

---

## 5. Diseño de Interfaz de Usuario (Enterprise SaaS)

Siguiendo las directrices del **Enterprise Design System (Boxed-Sharpness, `rounded-sm`, 0-waste)**:

### 5.1. Ubicación en la Navegación
* **Ruta:** `/dashboard/auditoria`
* **Acceso RBAC:** Exclusivo para usuarios con rol `administrador` o con el permiso `auditoria.ver`.
* **Ubicación en Sidebar:** Bajo el grupo "Seguridad y Sistema", junto a *Roles y Permisos*.

### 5.2. Estructura de Pantalla en Dos Pestañas (Tabs over Modals)
* **Tab 1: Bitácora de Operaciones (Audit Trail):**
  - **Barra de Filtros:**
    - Rango de fechas (*Desde / Hasta* con accesos rápidos: Hoy, Últimos 7 días, Este mes).
    - Selector de Módulo / Tabla (*Usuarios, Boletas de Pago, Carnets QR, Inventario*).
    - Selector de Tipo de Acción (*Todos, Creación, Actualización, Eliminación, Inicios de Sesión*).
    - Campo de Búsqueda rápida por nombre de usuario, C.I., ID o IP.
  - **Tabla de Alta Densidad (Desktop):**
    - Columnas: `Fecha/Hora`, `Usuario Responsable`, `Rol`, `Acción/Evento`, `Módulo Afectado`, `ID Registro`, `IP / Dispositivo`, `Acciones`.
    - Paginación server-side con tamaños de 15, 25, 50 y 100 filas.
  - **Drawer Lateral Desplegable (Detalle de Auditoría):**
    - Se despliega desde la derecha al hacer clic en una fila.
    - Muestra la ficha completa del usuario, la URL de la petición, el navegador y el visor de cambios:
      - **Visor Diff:** Tabla comparativa columna por columna resaltando los campos que variaron con insignias de color (*Rojo: Valor Anterior* vs *Verde: Valor Nuevo*).
* **Tab 2: Analítica de Trazabilidad y Seguridad (BI):**
  - Gráfico de volumen de mutaciones por día (Apache ECharts).
  - Top de usuarios con más operaciones realizadas.
  - Alertas de seguridad (intentos de inicio de sesión fallidos o intentos de uso de QR alterados).

---

## 6. Plan de Verificación y Pruebas

| Fase de Prueba | Procedimiento | Criterio de Éxito |
| :--- | :--- | :--- |
| **1. Prueba Unitaria Backend** | Modificar un registro en `Usuario` o `BoletaPago` mediante un test de Pest/PHPUnit. | Se genera automáticamente una fila en `audits` con los campos modificados en `old_values` y `new_values`. |
| **2. Prueba de Seguridad (Exclusión)** | Actualizar la contraseña de un usuario. | El hash de la contraseña **no** debe aparecer en el JSON de auditoría. |
| **3. Prueba de Eventos Custom** | Simular un inicio de sesión fallido y un escaneo QR rechazado. | El evento queda guardado con tag `seguridad` y los detalles del fallo. |
| **4. Prueba de Inmutabilidad** | Intentar ejecutar un `DELETE` o `UPDATE` contra la tabla `audits` vía API. | La API responde con `405 Method Not Allowed` o `403 Forbidden` (no existen endpoints de mutación). |
| **5. Prueba de Rendimiento UI** | Cargar 5,000 registros de prueba y aplicar filtros combinados. | La respuesta del endpoint `/api/audits` debe ser menor a 200 ms gracias a los índices compuestos y GIN. |
| **6. Prueba de Exportación** | Descargar el reporte en Excel y PDF con un rango de 500 filas. | Archivo generado con formato limpio y sin agotar memoria PHP. |

---

## 7. Preguntas Abiertas para el Usuario

1. **Políticas de Retención de Logs:** ¿Deseas que los registros de bitácora se conserven indefinidamente en la base de datos o que se programe una tarea automática (*Cron / Task Scheduler*) para archivar registros mayores a 1 o 2 años?
2. **Alertas en Tiempo Real:** ¿Te gustaría que ante eventos de alta criticidad (ej. intentos de manipulación de firmas QR o múltiples logins fallidos) el sistema envíe una notificación inmediata al Bot de Telegram de los administradores?
