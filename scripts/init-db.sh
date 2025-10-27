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

# Adiciona db_data como source adicional no Hasura
echo "📊 Adding db_data as Hasura source..."
curl -s -X POST \
  "http://hasura:8080/v1/metadata" \
  -H "X-Hasura-Admin-Secret: ${HASURA_ADMIN_SECRET}" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"pg_add_source\",
    \"args\": {
      \"name\": \"db_data\",
      \"configuration\": {
        \"connection_info\": {
          \"database_url\": \"postgres://${DB_DATA_USER}:${DB_DATA_PASSWORD}@${DB_DATA_HOST}:5432/${DB_DATA_NAME}\"
        }
      }
    }
  }" > /dev/null 2>&1 || echo "  ℹ️  db_data source already exists"

# Rastreia tabelas do db_system (source: default)
echo "🔄 Tracking tables in db_system (default source)..."
for table in users academy_settings; do
  echo "📊 Tracking table: $table"
  curl -s -X POST \
    "http://hasura:8080/v1/metadata" \
    -H "X-Hasura-Admin-Secret: ${HASURA_ADMIN_SECRET}" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"pg_track_table\",\"args\":{\"source\":\"default\",\"table\":{\"schema\":\"public\",\"name\":\"$table\"}}}" \
    > /dev/null 2>&1 || echo "  ℹ️  Table $table already tracked or not found"
done

# Rastreia tabelas do db_data (source: db_data)
echo "🔄 Tracking tables in db_data..."
for table in profiles students instructors modalities classes enrollments payments payment_methods equipments maintenance_schedules plans student_plans attendance; do
  echo "📊 Tracking table: $table"
  curl -s -X POST \
    "http://hasura:8080/v1/metadata" \
    -H "X-Hasura-Admin-Secret: ${HASURA_ADMIN_SECRET}" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"pg_track_table\",\"args\":{\"source\":\"db_data\",\"table\":{\"schema\":\"public\",\"name\":\"$table\"}}}" \
    > /dev/null 2>&1 || echo "  ℹ️  Table $table already tracked or not found"
done

echo "✅ All tables tracked in Hasura!"
echo "🚀 Hasura initialization complete!"
