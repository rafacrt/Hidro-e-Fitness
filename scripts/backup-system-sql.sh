#!/bin/bash
set -e

BACKUP_DIR="/backups/system"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/system_$TIMESTAMP.sql"

echo "📦 Creating SQL backup of db_system..."

mkdir -p "$BACKUP_DIR"

# Faz dump SQL completo
PGPASSWORD="${DB_SYSTEM_PASSWORD}" pg_dump \
  -h db_system \
  -U "${DB_SYSTEM_USER}" \
  -d "${DB_SYSTEM_NAME}" \
  --clean \
  --if-exists \
  > "$BACKUP_FILE"

# Comprime
gzip "$BACKUP_FILE"

echo "✅ Backup created: ${BACKUP_FILE}.gz"

# Mantém apenas as últimas 3 versões
ls -t "$BACKUP_DIR"/system_*.sql.gz | tail -n +4 | xargs -r rm
echo "🧹 Kept last 3 backups only"
