# Guía de Despliegue en Producción con Docker: DUBSS-GYM (FitGo!)

Esta guía describe el procedimiento formal para construir, aprovisionar y desplegar la plataforma completa **DUBSS-GYM** en cualquier entorno de producción (servidor VPS, máquina local o instancia cloud en AWS EC2 / DigitalOcean) utilizando Docker y Docker Compose.

---

## 1. Arquitectura del Despliegue

El despliegue está orquestado en una red privada virtual (`dubss_network`) con 6 servicios contenerizados:

```
[ Cliente / Internet ]
         │ (Puerto 80)
         ▼
┌────────────────────────────────────────┐
│  Gateway Nginx (Reverse Proxy)        │
│  - /             ──► Frontend React    │
│  - /api/         ──► Backend Laravel   │
│  - /storage/     ──► Laravel Storage   │
│  - /api/v1/ia/   ──► Microservicio IA  │
└──────────────────┬─────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│  Frontend  │ │  Backend   │ │ Micro-IA   │
│  React 19  │ │ Laravel 11 │ │  FastAPI   │
│ (Nginx :80)│ │ (FPM:8000) │ │ (Uvicorn)  │
└────────────┘ └─────┬──────┘ └─────┬──────┘
                     │              │
             ┌───────┴──────┐       │
             ▼              ▼       ▼
       ┌───────────┐  ┌───────────┐
       │PostgreSQL │  │  Redis 7  │
       │    16     │  │ (Caché &  │
       │ (Persist) │  │  Colas)   │
       └───────────┘  └───────────┘
```

---

## 2. Requisitos Previos

- **Docker Engine** versión 24.0 o superior.
- **Docker Compose** plugin v2.20 o superior.
- Puertos libres en el host: `80` (o el puerto configurado en `PORT` dentro de `.env`).

---

## 3. Despliegue Paso a Paso

### Paso 1: Variables de Entorno (Carga Automática Desacoplada)

El despliegue está configurado para **leer automáticamente los archivos `.env` de cada subsistema**:
- **Backend**: Carga automáticamente las variables de `gimnasio-back/.env` (claves de Laravel, base de datos, credenciales de Gmail, n8n y Telegram).
- **Microservicio IA**: Carga automáticamente las variables de `gimnasio-ia/.env` (incluyendo `GEMINI_API_KEY`).
- **PostgreSQL**: Inicializa el usuario y contraseña leyendo las mismas variables `DB_USERNAME` y `DB_PASSWORD` de `gimnasio-back/.env`.

> [!NOTE]
> No es obligatorio crear un archivo `.env` en la raíz. Solo si deseas cambiar el puerto frontal del Gateway (por defecto `8080`), puedes crear un `.env` en la raíz con `PORT=8080`.

### Paso 2: Construir e Iniciar los Contenedores

Ejecuta el comando de compilación multi-etapa y arranque en segundo plano:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

> **Nota:** La primera construcción tomará unos minutos mientras descarga las imágenes base de Alpine/Slim y compila los paquetes de Node.js, PHP y Python.

### Paso 3: Verificar el Estado de Salud (*Healthchecks*)

Comprueba que todos los contenedores reporten estado `healthy`:

```bash
docker compose -f docker-compose.prod.yml ps
```

Deberás ver una salida similar a:
```
NAME              IMAGE                     COMMAND                  SERVICE      STATUS
dubss-gateway     nginx:1.27-alpine         "/docker-entrypoint.…"   gateway      running
dubss-frontend    dubss-gym-frontend        "/docker-entrypoint.…"   frontend     running (healthy)
dubss-backend     dubss-gym-backend         "/usr/local/bin/entr…"   backend      running (healthy)
dubss-ia          dubss-gym-ia-service      "uvicorn app.main:ap…"   ia-service   running (healthy)
dubss-postgres    postgres:16-alpine        "docker-entrypoint.s…"   postgres     running (healthy)
dubss-redis       redis:7-alpine            "docker-entrypoint.s…"   redis        running (healthy)
```

### Paso 4: Carga Inicial de Datos Deportivos (Seeders)

Si es la primera instalación y deseas inicializar los roles, usuarios administradores y el catálogo de más de 800 ejercicios categorizados, ejecuta:

```bash
docker compose -f docker-compose.prod.yml exec backend php artisan db:seed --force
```

---

## 4. Endpoints y Verificación del Gateway

Una vez en marcha, puedes validar directamente desde el navegador o mediante `curl`:

| Recurso | URL | Comportamiento Esperado |
| :--- | :--- | :--- |
| **Frontend Web** | `http://localhost/` | Carga interactiva de la SPA en React 19. |
| **Healthcheck Backend** | `http://localhost/api/health` o `http://localhost/ping` | Retorna `200 OK` / `pong`. |
| **Healthcheck Micro-IA** | `http://localhost/api/v1/ia/health` | Retorna `{"status": "ok", "service": "DUBSS-GYM IA Microservice"}`. |
| **OpenAPI Docs IA** | `http://localhost/api/v1/ia/openapi.json` | Especificación Swagger de los endpoints de IA. |

---

## 5. Comandos Útiles de Mantenimiento

### Ver registros en tiempo real (*logs*):
```bash
# Todos los servicios
docker compose -f docker-compose.prod.yml logs -f

# Solo Backend Laravel
docker compose -f docker-compose.prod.yml logs -f backend

# Solo Microservicio de IA
docker compose -f docker-compose.prod.yml logs -f ia-service
```

### Ejecutar comandos Artisan dentro del contenedor:
```bash
# Limpiar y regenerar cachés
docker compose -f docker-compose.prod.yml exec backend php artisan optimize:clear
docker compose -f docker-compose.prod.yml exec backend php artisan optimize

# Crear enlace simbólico de almacenamiento si es necesario
docker compose -f docker-compose.prod.yml exec backend php artisan storage:link
```

### Respaldo de Base de Datos PostgreSQL:
```bash
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres gimnasio_db > backup_gimnasio_$(date +%Y%m%d).sql
```

### Detener los servicios:
```bash
# Detener sin eliminar volúmenes
docker compose -f docker-compose.prod.yml down

# Detener eliminando volúmenes (¡ATENCIÓN: BORRA LA BASE DE DATOS!)
docker compose -f docker-compose.prod.yml down -v
```

