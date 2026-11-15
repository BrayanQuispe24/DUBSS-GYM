#!/bin/sh
set -e

echo "[DUBSS-GYM] Inicializando contenedor de Backend..."

# Asegurar directorios requeridos en storage
mkdir -p /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

# Permisos para el usuario del servidor web
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Crear enlace simbólico de storage si no existe
if [ ! -L /var/www/html/public/storage ]; then
    echo "[DUBSS-GYM] Creando storage:link..."
    php artisan storage:link --no-interaction || true
fi

# Descubrir paquetes y optimizar configuraciones
echo "[DUBSS-GYM] Registrando paquetes de Laravel..."
php artisan package:discover --ansi || true

# Caché de optimización de Laravel para producción
if [ "$APP_ENV" = "production" ]; then
    echo "[DUBSS-GYM] Optimizando configuraciones y rutas de Laravel..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Migraciones condicionales en arranque
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "[DUBSS-GYM] Ejecutando migraciones de base de datos..."
    php artisan migrate --force --no-interaction || true
fi

echo "[DUBSS-GYM] Backend listo. Iniciando servicios con Supervisor..."
exec "$@"

