# Guía Paso a Paso: Despliegue en Producción con Docker y Nginx Proxy Manager (NPM)

Esta guía documenta el procedimiento completo para desplegar la plataforma **DUBSS-GYM (FitGo!)** en un servidor de producción y exponerla mediante **Nginx Proxy Manager (NPM)** con certificados SSL automáticos (Let's Encrypt).

---

## Diagrama de Flujo del Tráfico

```
[ Internet / Clientes ]
          │ (HTTPS :443 / SSL Let's Encrypt)
          ▼
┌───────────────────────────────────────────────┐
│          Nginx Proxy Manager (NPM)            │
│  - Terminación SSL                            │
│  - Redirección HTTP -> HTTPS                  │
│  - Reenvía el tráfico a: 172.17.0.1:8080      │
└───────────────────────┬───────────────────────┘
                        │ (HTTP :8080)
                        ▼
┌───────────────────────────────────────────────┐
│        Gateway Nginx (dubss-gateway)          │
│  - /           ──► Frontend React 19          │
│  - /api/       ──► Backend Laravel 11         │
│  - /storage/   ──► Laravel Storage            │
│  - /api/v1/ia/ ──► Microservicio IA FastAPI   │
└───────────────────────┬───────────────────────┘
                        │ (Red dubss_network)
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
  ┌────────────┐ ┌────────────┐ ┌────────────┐
  │  Frontend  │ │  Backend   │ │ Micro-IA   │
  │  React 19  │ │ Laravel 11 │ │  FastAPI   │
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

## Paso 1: Variables de Entorno (Carga Automática Desacoplada)

El sistema está configurado para **leer directamente los archivos `.env` de cada proyecto**, por lo que **no necesitas configurar ningún archivo `.env` en la raíz**:

1. **Backend (`gimnasio-back/.env`)**:
   - Docker lee automáticamente tu `APP_KEY`, tus credenciales de Gmail (`MAIL_*`), el token de Telegram y `N8N_API_KEY`.
   - La base de datos PostgreSQL toma automáticamente la contraseña configurada en `DB_PASSWORD`.
   - Docker reescribe de forma transparente `DB_HOST=postgres` y `REDIS_HOST=redis` para la comunicación interna.

2. **Microservicio de IA (`gimnasio-ia/.env`)**:
   - Docker lee automáticamente tu `GEMINI_API_KEY` y `GEMINI_MODEL`.
   - Docker reescribe el host a `0.0.0.0` para aceptar peticiones internas desde el Gateway.

> [!TIP]
> Si deseas cambiar el puerto en el que escucha el Gateway (por defecto **8080** para Nginx Proxy Manager), puedes crear un archivo `.env` opcional en la raíz con:
> ```env
> PORT=8080
> ```

---

## Paso 2: Construir y Levantar los Contenedores

Ejecuta el comando de compilación multi-etapa y arranque en segundo plano:

```bash
docker compose up -d --build
```

Comprueba el estado de salud (*Healthchecks*) de todos los servicios:

```bash
docker compose ps
```

Todos los servicios deben mostrar el estado `running (healthy)`:
- `dubss-gateway` (escuchando en `0.0.0.0:8080->80/tcp`)
- `dubss-frontend`
- `dubss-backend`
- `dubss-ia`
- `dubss-postgres`
- `dubss-redis`

---

## Paso 3: Carga Inicial de Datos (Seeders)

Las migraciones de tablas se aplican automáticamente en el arranque. Para poblar los roles, permisos, usuarios administradores y el catálogo de más de 800 ejercicios con esquemas biomecánicos, corre:

```bash
docker compose exec backend php artisan db:seed --force
```

---

## Paso 4: Obtener la IP para Nginx Proxy Manager

Nginx Proxy Manager necesita saber a qué dirección IP reenviar el tráfico en el puerto `8080`:

* **Opción A (NPM en el mismo servidor / VPS):**
  Usa la IP del gateway del puente de Docker:
  ```text
  172.17.0.1
  ```
  *(O la dirección IP local de tu servidor en la red privada).*

* **Opción B (NPM comparte la red Docker `dubss_network`):**
  Usa directamente el nombre del contenedor:
  ```text
  dubss-gateway
  ```

---

## Paso 5: Configuración en Nginx Proxy Manager (NPM)

Ingresa a la interfaz de administración de NPM (usualmente `http://TU_IP:81`), dirígete a:
**Hosts** ➔ **Proxy Hosts** ➔ **Add Proxy Host**

### 1. Pestaña: **Details**
* **Domain Names**: Escribe tu dominio (ej: `gym.tudominio.com`) y presiona la tecla **Enter** para fijarlo.
* **Scheme**: `http`
* **Forward Hostname / IP**: `172.17.0.1` (o la IP de tu servidor)
* **Forward Port**: `8080`
* **Access List**: `Publicly Accessible`
* Activa las siguientes casillas:
  * [x] **Block Common Exploits**
  * [x] **Websockets Support**
  * [ ] *Cache Assets (Déjalo desactivado, Nginx del frontend ya lo gestiona)*

### 2. Pestaña: **SSL**
* **SSL Certificate**: Selecciona **"Request a new SSL Certificate"** (Let's Encrypt).
* Activa las siguientes opciones:
  * [x] **Force SSL** (Garantiza redirección automática de HTTP a HTTPS).
  * [x] **HTTP/2 Support** (Acelera la entrega de recursos concurrentes).
  * [x] **HSTS Enabled** (Protocolo de transporte estricto contra intermediarios).
* Ingresa tu correo electrónico y marca la casilla:
  * [x] **I Agree to the Let's Encrypt Terms and Conditions**

### 3. Pestaña: **Custom Locations**
* **Dejar vacía.** No agregues ninguna regla. El contenedor `dubss-gateway` ya se encarga del enrutamiento granular de `/`, `/api/`, `/storage/` y `/api/v1/ia/`.

Presiona **Save**.

---

## Paso 6: Verificación de Funcionamiento

Abre tu navegador e ingresa a tu dominio:

```text
https://gym.tudominio.com
```

### Lista de comprobaciones:
1. **Certificado SSL válido:** El navegador debe mostrar el candado de seguridad activo (`https://`).
2. **Carga del Frontend:** Debe renderizarse la aplicación web React 19 sin errores de consola.
3. **Autenticación (API Laravel):** Intenta iniciar sesión con un usuario; la petición a `/api/login` debe procesarse correctamente sin bloqueos de CORS.
4. **Almacenamiento de archivos:** Comprueba que las imágenes subidas o comprobantes en `/storage/...` sean accesibles.
5. **Microservicio de IA:** Verifica la respuesta del estado de salud del motor de IA en:
   ```text
   https://gym.tudominio.com/api/v1/ia/health
   ```
   Debe devolver:
   ```json
   {
     "status": "ok",
     "service": "DUBSS-GYM IA Microservice",
     "version": "1.0.0"
   }
   ```

---

## Comandos Útiles de Mantenimiento

### Inspeccionar registros en tiempo real:
```bash
# Todos los servicios
docker compose logs -f

# Solo Backend Laravel
docker compose logs -f backend

# Solo Microservicio IA
docker compose logs -f ia-service
```

### Limpiar y recargar optimizaciones de Laravel:
```bash
docker compose exec backend php artisan optimize:clear
docker compose exec backend php artisan optimize
```

### Respaldo de Base de Datos PostgreSQL:
```bash
docker compose exec postgres pg_dump -U postgres gimnasio_db > backup_$(date +%F).sql
```

