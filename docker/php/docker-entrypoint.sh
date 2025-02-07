#!/bin/sh
set -e

# --- Enhanced Debugging ---
echo "=== Environment Variables ==="
printenv

echo "=== Current Working Directory ==="
pwd

echo "=== Files in /var/www ==="
ls -la /var/www

echo "=== Files in /usr/local/etc/php/conf.d ==="  # Check for custom .ini files
ls -la /usr/local/etc/php/conf.d

echo "=== PHP-FPM Version ==="
php-fpm -v

echo "=== PHP Version ==="  #Check php version.
php -v

echo "=== Listing processes BEFORE artisan commands ==="
ps aux

# Run database migrations
php artisan migrate --force

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== Listing processes AFTER artisan commands ==="
ps aux

echo "=== Checking PHP-FPM config ==="
php-fpm -tt # Double 't' for more verbose testing

# Start PHP-FPM
exec "$@"