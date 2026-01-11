#!/bin/sh

set -e

echo "Starting AgriPadi application..."

# Wait for database to be ready (if using external DB)
# sleep 5

# Check if database needs to be initialized
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "Creating fresh SQLite database..."
    touch /var/www/html/database/database.sqlite
    chmod 664 /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite

    # Run migrations for fresh database
    echo "Running database migrations (fresh database)..."
    php artisan migrate --force --no-interaction
else
    echo "Database file exists, running pending migrations..."
    # Only run new migrations, won't fail if tables exist
    php artisan migrate --force --no-interaction 2>&1 | grep -v "already exists" || true
fi

# Run Laravel optimizations
echo "Running Laravel optimizations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link if not exists
if [ ! -L /var/www/html/public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link
fi

# Set proper permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/database

chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/database

# Start supervisord
echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
