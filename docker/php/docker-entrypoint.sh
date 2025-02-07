#!/bin/sh
set -e

# Wait for the database to be available (Robustness)
echo "Waiting for database connection..."

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "Database connection established."

# Check if migrations need to be run
if php artisan migrate:status | grep -q 'No migrations'; then
  echo "No migrations to run."
else
  echo "Running migrations..."
  php artisan migrate --force --database=pgsql
fi

# Clear and cache configuration (AFTER migrations)
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== Listing processes AFTER artisan commands ==="
ps aux

# Start PHP-FPM
exec "$@"