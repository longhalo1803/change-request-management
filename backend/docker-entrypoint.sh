#!/bin/sh
set -e

echo "🚀 Starting CR Management Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until node -e "
const mysql = require('mysql2/promise');
mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
}).then(() => {
  console.log('✅ Database is ready');
  process.exit(0);
}).catch((err) => {
  console.log('⏳ Database not ready yet, retrying...');
  process.exit(1);
});
" 2>/dev/null; do
  sleep 2
done

# Run migrations
echo "📦 Running database migrations..."
npm run migration:run || echo "⚠️  Migration failed or no pending migrations"

# Start the application
echo "✅ Starting application on port ${PORT:-3000}..."
exec node dist/server.js
