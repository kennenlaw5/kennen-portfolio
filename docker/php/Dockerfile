FROM php:8.4-fpm

WORKDIR /var/www

RUN echo "Docerfile is running"
# Install system dependenciesRUN apt-get -y -qq update
RUN apt-get -y -qq update
RUN apt-get upgrade -y
RUN apt-get install -y --no-install-recommends \
    libzip-dev \
    zip \
    unzip \
    curl \
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
