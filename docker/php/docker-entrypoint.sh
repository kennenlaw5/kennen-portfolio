# #!/bin/sh
# set -e

# # Wait for the database to be available
# echo "Waiting for database connection..."

# while ! nc -z "$DB_HOST" "$DB_PORT"; do
#   sleep 1
# done

# echo "Database connection established."

# # Check if migrations need to be run
# if php artisan migrate:status | grep -q 'No migrations'; then
#   echo "No migrations to run."
# else
#   echo "Running migrations..."
#   php artisan migrate --force
# fi

# # Clear and cache configuration
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

# echo "=== Listing processes AFTER artisan commands ==="
# ps aux

# # Start Nginx in the background and keep it there
# nginx -g 'daemon off;' &
# nginx_pid=$!

# # Start PHP-FPM (and pass control to it)
# exec "$@"

# # This part should ideally never be reached, but it's a safeguard
# wait "$nginx_pid"

#!/bin/sh
set -e

# Start Nginx in the background and keep it there
nginx -g 'daemon off;' &
nginx_pid=$!

# Start PHP-FPM (and pass control to it)
exec "$@"

# This part should ideally never be reached, but it's a safeguard
wait "$nginx_pid"