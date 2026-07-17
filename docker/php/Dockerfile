FROM php:8.5-fpm-bookworm AS development

WORKDIR /var/www

# Install system dependencies
RUN apt-get -y -qq update
RUN apt-get upgrade -y
RUN apt-get install -y --no-install-recommends \
    libzip-dev \
    zip \
    unzip \
    curl \
    git \
    gnupg2

RUN pecl channel-update pecl.php.net

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip

# Install the latest Composer 2 release without allowing a future major upgrade.
ENV COMPOSER_ALLOW_SUPERUSER=1
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Node.js and Yarn
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn@1.22.22

#Cleanup
RUN apt-get autoremove -y && apt-get clean && apt-get autoclean && rm -rf /var/lib/apt/lists/*

#Check Versions
RUN php -v
RUN php -m
RUN composer --version
RUN node -v
RUN yarn --version
RUN npm -v

# Expose port 9000
EXPOSE 9000

# --- Production Stage ---
#
FROM php:8.5-fpm-bookworm AS production

WORKDIR /var/www

RUN mkdir -p /usr/share/man/man1

# Install system dependencies (minimal set, including git)
RUN apt-get -y -qq update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        libzip-dev \
        zip \
        unzip \
        curl \
        git \
        gnupg2 \
        libpq-dev \
        procps \
        nginx

RUN rm -f /etc/nginx/sites-enabled/default

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip pdo_pgsql

# Get Composer (using multi-stage build)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy necessary files
COPY . .

# Install PHP dependencies (production only)
RUN composer install --optimize-autoloader --no-dev

# Install Node.js, npm, and Yarn
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn@1.22.22

# Install frontend dependencies and build assets using Yarn
RUN yarn install --frozen-lockfile --non-interactive && yarn prod

# Set permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 775 /var/www/storage

RUN touch /var/log/php_errors.log && \
    chown www-data:www-data /var/log/php_errors.log && \
    touch /var/log/php-fpm_errors.log && \
    chown www-data:www-data /var/log/php-fpm_errors.log && \
    touch /var/log/laravel_startup.log && \
    chown www-data:www-data /var/log/laravel_startup.log

COPY docker/php/fpm.ini /usr/local/etc/php/conf.d/fpm.ini
COPY docker/php/php.ini /usr/local/etc/php/conf.d/php.ini
COPY docker/nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf

# Expose port 9000 for PHP-FPM
EXPOSE 9000
EXPOSE 80

RUN touch /var/log/laravel_startup.log && chown www-data:www-data /var/log/laravel_startup.log

# Use entrypoint script
COPY docker/php/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
