#!/bin/sh
set -e

# Install procps (provides the 'ps' command) - TEMPORARY, for debugging
apt-get update -y && apt-get install -y --no-install-recommends procps

# --- DEBUGGING: Output environment variables and working directory ---
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
echo "=== PHP Version ==="
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
php-fpm -tt

# Start PHP-FPM --  We will NOT use exec "$@" here.  We'll start it explicitly.
php-fpm