#!/bin/sh
set -e

# Clear Laravel's configuration cache
php artisan config:clear
php artisan cache:clear

# Start Nginx in the background and keep it there
nginx -g 'daemon off;' &
nginx_pid=$!

# Start PHP-FPM (and pass control to it)
exec "$@"

# This part should ideally never be reached, but it's a safeguard
wait "$nginx_pid"