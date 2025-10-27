#!/bin/bash
set -e

echo "🔄 Initializing Hasura metadata..."

# Espera Hasura estar pronto
echo "⏳ Waiting for Hasura to be ready..."
attempt=0
max_attempts=60
until curl -s -f "http://hasura:8080/healthz" > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ Failed to connect to Hasura after $max_attempts attempts"
    exit 1
  fi
  echo "⏳ Waiting for Hasura... (attempt $attempt/$max_attempts)"
  sleep 2
done

echo "✅ Hasura is ready!"

# Rastreia todas as tabelas
echo "🔄 Tracking all tables..."
for table in users academy_settings students instructors modalities classes enrollments payments payment_methods equipments maintenance_schedules plans student_plans attendance profiles; do
  echo "📊 Tracking table: $table"
  curl -s -X POST \
    "http://hasura:8080/v1/metadata" \
    -H "X-Hasura-Admin-Secret: ${HASURA_ADMIN_SECRET}" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"pg_track_table\",\"args\":{\"source\":\"default\",\"table\":{\"schema\":\"public\",\"name\":\"$table\"}}}" \
    > /dev/null 2>&1 || echo "  ℹ️  Table $table already tracked or not found"
done

echo "✅ All tables tracked in Hasura!"
echo "🚀 Hasura initialization complete!"
