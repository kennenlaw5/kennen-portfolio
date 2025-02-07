#!/bin/sh
set -e

# Start Nginx in the background and keep it there
nginx -g 'daemon off;' &
nginx_pid=$!

# Start PHP-FPM with strace
exec strace -f -o /var/log/php-fpm_strace.log php-fpm

# This part should ideally never be reached, but it's a safeguard
wait "$nginx_pid"