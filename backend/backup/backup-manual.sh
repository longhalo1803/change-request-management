#!/bin/bash

# Manual MySQL Backup Script
# Backs up MySQL database on-demand
# Usage: ./backup-manual.sh

set -e

# Configuration
BACKUP_DIR="/backup"
DB_HOST="${DB_HOST:-mysql}"
DB_PORT="${DB_PORT:-3306}"
DB_USERNAME="${DB_USERNAME:-cr_user}"
DB_PASSWORD="${DB_PASSWORD:-cr_password}"
DB_NAME="${DB_DATABASE:-cr_management}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mysql_backup_manual_${TIMESTAMP}.sql.gz"

# Log file
LOG_FILE="$BACKUP_DIR/backup.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_message "🔄 Starting manual database backup..."

# Check if database is accessible
if ! mysqladmin -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" ping &> /dev/null; then
    log_message "❌ Database is not accessible at $DB_HOST:$DB_PORT"
    exit 1
fi

# Perform backup
if mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_message "✅ Manual backup completed successfully"
    log_message "   Location: $BACKUP_FILE"
    log_message "   Size: $FILE_SIZE"
else
    log_message "❌ Manual backup failed!"
    exit 1
fi
