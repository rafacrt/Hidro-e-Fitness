#!/bin/bash
set -e

echo "🔧 Fixing admin user password..."

PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" <<'EOF'
-- Deletar usuário admin antigo
DELETE FROM public.users WHERE email = 'admin@hidrofitness.com';

-- Criar com hash correto
INSERT INTO public.users (email, password_hash, full_name, role)
VALUES (
  'admin@hidrofitness.com',
  '$2a$10$AHozTx7OFYZM9nJa8.lbo.K6XaDOyxGJk/.YjubAndcDqP5nbodDa',
  'Administrador',
  'admin'
);
EOF

echo "✅ Admin password fixed!"
echo "📧 Email: admin@hidrofitness.com"
echo "🔑 Password: admin123"
