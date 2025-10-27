#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: restore-db.sh <backup-file.sql.gz>"
  echo ""
  echo "Available backups:"
  ls -lh /app/storage/backups/*.sql.gz 2>/dev/null || echo "  No backups found"
  exit 1
fi

BACKUP_FILE="$1"

echo "⚠️  WARNING: This will REPLACE all data in the database!"
echo "📁 Backup file: $BACKUP_FILE"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Restore cancelled"
  exit 0
fi

echo "🔄 Restoring database from backup..."

# Descompacta e restaura
if [[ "$BACKUP_FILE" == *.gz ]]; then
  gunzip -c "$BACKUP_FILE" | PGPASSWORD="${DB_PASSWORD}" psql \
    -h "${DB_HOST}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}"
else
  PGPASSWORD="${DB_PASSWORD}" psql \
    -h "${DB_HOST}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    < "$BACKUP_FILE"
fi

echo "✅ Database restored successfully!"
