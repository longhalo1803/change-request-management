#!/bin/bash

# MySQL Backup Restore Script
# Restores MySQL database from a backup file
# Usage: ./restore.sh <backup_file>

set -e

# Configuration
DB_HOST="${DB_HOST:-mysql}"
DB_PORT="${DB_PORT:-3306}"
DB_USERNAME="${DB_USERNAME:-cr_user}"
DB_PASSWORD="${DB_PASSWORD:-cr_password}"
DB_NAME="${DB_DATABASE:-cr_management}"

# Log file
LOG_FILE="/backup/restore.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Validate arguments
if [ -z "$1" ]; then
    log_message "❌ Usage: ./restore.sh <backup_file>"
    log_message "Example: ./restore.sh /backup/mysql_backup_20240101_020000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Validate backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log_message "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

log_message "🔄 Starting database restore from: $BACKUP_FILE"

# Check if database is accessible
if ! mysqladmin -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" ping &> /dev/null; then
    log_message "❌ Database is not accessible at $DB_HOST:$DB_PORT"
    exit 1
fi

# Confirm before restoring
read -p "⚠️  This will drop and recreate the '$DB_NAME' database. Continue? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
    log_message "Restore cancelled by user"
    exit 0
fi

# Perform restore
log_message "Dropping existing database (if exists)..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "DROP DATABASE IF EXISTS $DB_NAME;"

log_message "Creating new database..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

log_message "Restoring data from backup..."
if gunzip -c "$BACKUP_FILE" | mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME"; then
    log_message "✅ Database restore completed successfully"
    log_message "   Database: $DB_NAME"
    log_message "   Source: $BACKUP_FILE"
else
    log_message "❌ Database restore failed!"
    exit 1
fi
