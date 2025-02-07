#!/bin/sh
set -e

# Run database migrations (IMPORTANT: in production, use --force with caution!)
php artisan migrate --force

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM
exec "$@"