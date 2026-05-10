#!/bin/bash

# Daily MySQL Backup Script
# Backs up MySQL database to backup directory
# Designed to run via cron: 0 2 * * * /path/to/backend/backup/backup-daily.sh

set -e

# Configuration
BACKUP_DIR="/backup"
DB_HOST="${DB_HOST:-mysql}"
DB_PORT="${DB_PORT:-3306}"
DB_USERNAME="${DB_USERNAME:-cr_user}"
DB_PASSWORD="${DB_PASSWORD:-cr_password}"
DB_NAME="${DB_DATABASE:-cr_management}"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mysql_backup_${TIMESTAMP}.sql.gz"

# Log file
LOG_FILE="$BACKUP_DIR/backup.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Perform backup
log_message "Starting daily database backup..."

if mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_message "✅ Backup completed successfully: $BACKUP_FILE ($FILE_SIZE)"
else
    log_message "❌ Backup failed!"
    exit 1
fi

# Clean up old backups (older than RETENTION_DAYS)
log_message "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "mysql_backup_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "mysql_backup_*.sql.gz" | wc -l)
log_message "Backup cleanup complete. $BACKUP_COUNT backup(s) retained."

log_message "Daily backup finished successfully"
