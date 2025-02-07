FROM php:8.4-fpm AS development

WORKDIR /var/www

RUN echo "Docerfile is running"
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

# Install Composer

#Composer
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && php composer-setup.php \
    php -r "unlink('composer-setup.php');" && mv composer.phar /usr/local/bin/composer

#Yarn/NPM
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt install -y nodejs
RUN npm install -g npm
RUN npm install -g yarn

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
FROM php:8.4-fpm AS production

WORKDIR /var/www

RUN mkdir -p /usr/share/man/man1mkdir -p /usr/share/man/man1

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

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip pdo_pgsql

# Get Composer (using multi-stage build)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy necessary files
COPY . .

# Install PHP dependencies (production only)
RUN composer install --optimize-autoloader --no-dev

# Install Node.js, npm, and Yarn
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm \
    && npm install -g yarn

# Install frontend dependencies and build assets using Yarn
RUN yarn install && yarn prod

# Set permissions
RUN chown -R www-data:www-data /var/www

COPY docker/php/fpm.ini /usr/local/etc/php/conf.d/fpm.ini
COPY docker/php/php.ini /usr/local/etc/php/conf.d/php.ini
COPY docker/nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf

# Expose port 9000 for PHP-FPM
EXPOSE 9000
EXPOSE 80

# Use entrypoint script
COPY docker/php/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
