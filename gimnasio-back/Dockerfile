# ==========================================
# Stage 1: Dependency Installation & Optimizations
# ==========================================
FROM composer:2.7 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --ignore-platform-reqs

# ==========================================
# Stage 2: Final Production Runtime Image
# ==========================================
FROM php:8.4-fpm-alpine AS runner
WORKDIR /var/www/html

# Instalación de herramientas de sistema, Nginx, Supervisor y extensiones nativas
RUN apk add --no-cache \
    nginx \
    supervisor \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    fcgi \
    $PHPIZE_DEPS \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql zip pcntl bcmath opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /tmp/pear \
    && apk del $PHPIZE_DEPS

# Configurar directorios para Nginx y Supervisor
RUN mkdir -p /var/log/supervisor /run/nginx /etc/supervisor/conf.d

# Copia de configuraciones
COPY docker/php.ini $PHP_INI_DIR/conf.d/99-custom.ini
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copia de dependencias de Composer y código fuente
COPY --from=vendor /app/vendor /var/www/html/vendor
COPY . /var/www/html

# Ajuste de permisos iniciales
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/ping || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

