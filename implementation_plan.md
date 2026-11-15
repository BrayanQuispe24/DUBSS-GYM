# Plan de Implementación: Contenerización Docker para Producción (Backend, Frontend y Microservicio IA)

## 1. Contexto y Objetivos

El sistema **DUBSS-GYM (FitGo!)** está compuesto por tres subsistemas desacoplados que deben ser desplegados en entornos de producción con alta disponibilidad, seguridad, aislamiento y reproducibilidad:
1. **Backend Core (`gimnasio-back`)**: API RESTful en **Laravel 11 / PHP 8.3-8.4** conectada a **PostgreSQL 16** y **Redis**.
2. **Frontend SPA (`gimnasio-front`)**: Cliente web de alto rendimiento en **React 19 / Vite / TypeScript / Tailwind CSS**.
3. **Microservicio de IA (`gimnasio-ia`)**: Servicio en **Python 3.12 / FastAPI** con **MediaPipe Pose**, OpenCV headless y **Google Gemini API**.

El objetivo es proveer la infraestructura de contenedores para producción mediante **Dockerfiles multi-etapa (Multi-Stage Builds)** optimizados para tamaño y seguridad, archivos de configuración de producción (Nginx, Supervisor, PHP, Gunicorn/Uvicorn), plantillas de variables de entorno y orquestación con **Docker Compose** (con opción de Gateway Nginx para enrutamiento unificado idéntico a AWS CloudFront/ALB).

---

## 2. Propuesta Técnica Detallada por Componente

### A. Backend Core (`gimnasio-back`)
* **Base Image**: `php:8.3-fpm-alpine` o `php:8.4-fpm-alpine`.
* **Estrategia Multi-Etapa**:
  * **Stage 1 (Vendor/Composer)**: Imagen `composer:2.7` para instalar dependencias de producción (`composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction`).
  * **Stage 2 (Production Runner)**: Alpine minimalista con extensiones nativas requeridas (`pdo_pgsql`, `pgsql`, `zip`, `bcmath`, `pcntl`, `opcache`, `redis`).
* **Servidor Web y Procesos**:
  * Para producción desacoplada y contenerizada de forma robusta, se implementará un contenedor unificado con **Nginx + PHP-FPM** gestionado por **Supervisor** (o compatible con despliegues directos en Fargate/ECS, VPS o Docker Compose sin depender de Nginx externo obligatorio para servir estáticos).
  * Incluye configuración optimizada de OPcache para PHP 8.3/8.4 en producción (`opcache.validate_timestamps=0`, `opcache.memory_consumption=256`).
* **Script de Entrada (`entrypoint.sh`)**:
  * Ajuste de permisos de `storage` y `bootstrap/cache` para usuario no-root `www-data` / `appuser`.
  * Optimización de Laravel al iniciar (`php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`).
  * Ejecución condicional de migraciones si la variable `RUN_MIGRATIONS=true`.
* **Archivos a crear**:
  * `gimnasio-back/Dockerfile`
  * `gimnasio-back/.dockerignore`
  * `gimnasio-back/docker/nginx.conf`
  * `gimnasio-back/docker/php.ini`
  * `gimnasio-back/docker/supervisord.conf`
  * `gimnasio-back/docker/entrypoint.sh`

---

### B. Frontend SPA (`gimnasio-front`)
* **Base Image**: `node:22-alpine` (compilación) + `nginx:1.27-alpine` (runtime).
* **Estrategia Multi-Etapa**:
  * **Stage 1 (Builder)**: Instalación limpia con `npm ci`, inyección de variable de entorno `VITE_API_URL` vía `--build-arg`, y compilación de producción con `npm run build`.
  * **Stage 2 (Runner)**: Servidor Nginx ultra-ligero (< 30 MB) con los artefactos estáticos compilados en `/usr/share/nginx/html`.
* **Configuración Nginx (`nginx.conf`)**:
  * Enrutamiento SPA con fallback (`try_files $uri $uri/ /index.html;`) para no romper el enrutamiento de React Router.
  * Compresión Gzip activada para JS, CSS, JSON, SVG y fuentes.
  * Cabeceras de caché agresivo para assets inmutables (`/assets/` con `Cache-Control: public, max-age=31536000, immutable`).
  * Cabeceras de seguridad corporativa (*Enterprise Security Headers*): `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`.
* **Archivos a crear**:
  * `gimnasio-front/Dockerfile`
  * `gimnasio-front/.dockerignore`
  * `gimnasio-front/nginx.conf`

---

### C. Microservicio de IA (`gimnasio-ia`)
* **Base Image**: `python:3.12-slim`.
* **Estrategia Multi-Etapa**:
  * **Stage 1 (Builder)**: Instalación de `build-essential` y generación de wheels/dependencias en `/root/.local`.
  * **Stage 2 (Runner)**: Imagen slim con librerías de sistema indispensables para OpenCV headless y MediaPipe (`libgl1`, `libglib2.0-0`, `curl`), usuario de sistema no-root `appuser (UID 1001)`, copiado de dependencias precompiladas y código fuente.
* **Ejecución y Healthcheck**:
  * Servidor ASGI: `uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 2`.
  * Endpoint de verificación nativo: `GET /health` (`curl -f http://localhost:8001/health || exit 1`).
* **Archivos a crear**:
  * `gimnasio-ia/Dockerfile`
  * `gimnasio-ia/.dockerignore`

---

### D. Orquestación y Producción Integrada (Raíz del Proyecto)
* **`docker-compose.prod.yml`**: Orquestación integral de producción con los siguientes servicios:
  1. `postgres`: PostgreSQL 16 Alpine con almacenamiento persistente montado en volumen Docker (`postgres_data`), red interna segura y healthcheck `pg_isready`.
  2. `redis`: Redis 7 Alpine con almacenamiento persistente (`redis_data`), autenticación opcional por contraseña y healthcheck `redis-cli ping`.
  3. `backend`: Contenedor Laravel (`gimnasio-back`) escuchando en puerto interno `8000` (o expuesto), dependiente de Postgres y Redis saludables.
  4. `ia-service`: Contenedor FastAPI (`gimnasio-ia`) escuchando en puerto `8001`, con healthcheck y reinicio automático.
  5. `frontend`: Contenedor React / Nginx (`gimnasio-front`) escuchando en puerto `80` (o `3000`).
  6. `gateway` *(Opcional / Recomendado)*: Proxy inverso Nginx frontal en el puerto `80`/`443` que unifica el dominio:
     - `/` ➔ Redirige al frontend.
     - `/api/` ➔ Redirige al backend Laravel.
     - `/api/v1/ia/` ➔ Redirige al microservicio de IA.
     *(Elimina por completo problemas de CORS y replica exactamente la topología AWS ALB descrita en el Capítulo 6).*
* **Plantilla de Entorno**: `.env.production.example` en la raíz con todas las variables requeridas por los tres subsistemas estructuradas y documentadas.
* **Guía de Despliegue**: `DEPLOYMENT_GUIDE.md` con los comandos de arranque, ejecución de migraciones, generación de claves y verificación de estado.

---

## 3. Plan de Verificación

1. **Sintaxis y Linter de Dockerfiles**:
   - Verificar la coherencia de cada directiva (`FROM`, `COPY`, `RUN`, `USER`, `EXPOSE`, `HEALTHCHECK`).
2. **Prueba de Build de Contenedores**:
   - Construcción de imagen de Frontend: `docker build -t dubss-front:prod ./gimnasio-front`.
   - Construcción de imagen de Microservicio IA: `docker build -t dubss-ia:prod ./gimnasio-ia`.
   - Construcción de imagen de Backend Laravel: `docker build -t dubss-back:prod ./gimnasio-back`.
3. **Validación de `docker compose config`**:
   - Ejecutar `docker compose -f docker-compose.prod.yml config` para certificar que el archivo YAML es sintácticamente válido y mapea correctamente los volúmenes, redes y variables.
4. **Validación de Healthchecks**:
   - Comprobar que los endpoints de salud (`/health` en IA, `/ping` o `/api/health` en Backend, HTTP 200 en Frontend) respondan satisfactoriamente.

---

## 4. Decisiones Confirmadas por el Usuario

1. **Topología de Red y Exposición**:
   - Se implementará un **Gateway Nginx frontal unificado** (expone puerto 80) que enruta de manera transparente:
     - `/` ➔ Frontend React SPA (`frontend:80`)
     - `/api/` ➔ Backend Core Laravel (`backend:8000`)
     - `/api/v1/ia/` ➔ Microservicio IA FastAPI (`ia-service:8001`)
   - Se eliminan por completo los problemas de CORS entre orígenes y se replica la arquitectura perimetral del AWS ALB.
2. **Terminación SSL/TLS**:
   - Modo HTTP base directo (puerto 80) optimizado para operar detrás de un balanceador externo, Cloudflare, Nginx Proxy Manager o AWS ALB (con terminación SSL perimetral).

---

## 5. Próximo Paso
Esperando la confirmación/aprobación final del usuario para proceder con la generación de todos los archivos Docker y de orquestación.
