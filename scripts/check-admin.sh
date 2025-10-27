#!/bin/bash

echo "🔍 Checking admin user in database..."

PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" <<'EOF'
SELECT
  email,
  role,
  password_hash,
  created_at
FROM public.users
WHERE email = 'admin@hidrofitness.com';
EOF

echo ""
echo "📊 Total users in database:"
PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT COUNT(*) FROM public.users;"
