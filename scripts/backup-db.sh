#!/bin/bash
set -e

BACKUP_DIR="/app/storage/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/hidrofitness_$TIMESTAMP.sql"

echo "📦 Creating database backup..."

# Cria diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Faz dump do banco
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h "${DB_HOST}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --clean \
  --if-exists \
  > "$BACKUP_FILE"

# Comprime o backup
gzip "$BACKUP_FILE"

echo "✅ Backup created: ${BACKUP_FILE}.gz"

# Remove backups com mais de 7 dias
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
echo "🧹 Old backups cleaned (kept last 7 days)"
