#!/bin/bash

# Track all tables in Hasura
HASURA_ENDPOINT="http://localhost:8080"
ADMIN_SECRET="${HASURA_ADMIN_SECRET:-myadminsecretkey}"

echo "Tracking tables in Hasura..."

# Array of all tables
tables=(
  "students"
  "plans"
  "modalities"
  "student_plans"
  "payments"
  "users"
  "academy_settings"
  "classes"
  "instructors"
  "attendance"
  "profiles"
  "payment_methods"
  "equipment"
  "maintenance"
)

for table in "${tables[@]}"; do
  echo "Tracking table: $table"

  curl -X POST \
    -H "Content-Type: application/json" \
    -H "x-hasura-admin-secret: $ADMIN_SECRET" \
    -d "{
      \"type\": \"pg_track_table\",
      \"args\": {
        \"source\": \"default\",
        \"table\": {
          \"schema\": \"public\",
          \"name\": \"$table\"
        }
      }
    }" \
    "$HASURA_ENDPOINT/v1/metadata"

  echo ""
done

echo "Done! All tables tracked."
