#!/bin/bash
set -e

BACKUP_DIR="/backups/data"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/data_$TIMESTAMP.json"

echo "📦 Creating JSON backup of db_data..."

mkdir -p "$BACKUP_DIR"

# Exporta cada tabela como JSON
PGPASSWORD="${DB_DATA_PASSWORD}" psql -h db_data -U "${DB_DATA_USER}" -d "${DB_DATA_NAME}" -t -A -F"," <<'EOF' > "$BACKUP_FILE"
\o
SELECT json_build_object(
  'backup_date', now(),
  'database', 'db_data',
  'tables', json_build_object(
    'students', (SELECT json_agg(row_to_json(t)) FROM public.students t),
    'instructors', (SELECT json_agg(row_to_json(t)) FROM public.instructors t),
    'modalities', (SELECT json_agg(row_to_json(t)) FROM public.modalities t),
    'classes', (SELECT json_agg(row_to_json(t)) FROM public.classes t),
    'enrollments', (SELECT json_agg(row_to_json(t)) FROM public.enrollments t),
    'payments', (SELECT json_agg(row_to_json(t)) FROM public.payments t),
    'payment_methods', (SELECT json_agg(row_to_json(t)) FROM public.payment_methods t),
    'equipments', (SELECT json_agg(row_to_json(t)) FROM public.equipments t),
    'maintenance_schedules', (SELECT json_agg(row_to_json(t)) FROM public.maintenance_schedules t),
    'plans', (SELECT json_agg(row_to_json(t)) FROM public.plans t),
    'student_plans', (SELECT json_agg(row_to_json(t)) FROM public.student_plans t),
    'attendance', (SELECT json_agg(row_to_json(t)) FROM public.attendance t),
    'profiles', (SELECT json_agg(row_to_json(t)) FROM public.profiles t)
  )
);
EOF

# Comprime
gzip "$BACKUP_FILE"

echo "✅ Backup created: ${BACKUP_FILE}.gz"

# Mantém apenas as últimas 3 versões
ls -t "$BACKUP_DIR"/data_*.json.gz | tail -n +4 | xargs -r rm
echo "🧹 Kept last 3 backups only"
