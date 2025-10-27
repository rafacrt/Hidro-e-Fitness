#!/bin/bash
set -e

echo "🔄 Initializing database schema..."
echo "📊 Database connection info:"
echo "  Host: ${DB_HOST}"
echo "  User: ${DB_USER}"
echo "  Database: ${DB_NAME}"
echo "  Password: ${DB_PASSWORD:0:10}... (length: ${#DB_PASSWORD})"

# Espera o DB estar pronto com logs melhores
attempt=0
max_attempts=30
until PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -c '\q' 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ Failed to connect to database after $max_attempts attempts"
    echo "💡 Troubleshooting:"
    echo "  1. Check if DB_PASSWORD matches the password set in the database"
    echo "  2. Check if DB_USER exists in the database"
    echo "  3. Check if DB_NAME database exists"
    echo "  4. Try deleting the postgres volume and redeploying"
    exit 1
  fi
  echo "⏳ Waiting for database to be ready... (attempt $attempt/$max_attempts)"
  sleep 2
done

echo "✅ Database is ready!"

# Executa os scripts de inicialização em ordem
echo "📋 Running schema migrations..."

# 01 - Extensions
PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" <<'EOF'
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EOF

# 02 - Schema
PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" <<'EOF'
-- Base Users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    full_name text,
    avatar_url text,
    role text DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    role text,
    updated_at timestamptz,
    PRIMARY KEY (id)
);

-- Students
CREATE TABLE IF NOT EXISTS public.students (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    cpf text UNIQUE,
    birth_date date,
    email text,
    phone text,
    is_whatsapp boolean,
    cep text,
    street text,
    "number" text,
    complement text,
    neighborhood text,
    city text,
    state text,
    responsible_name text,
    responsible_phone text,
    medical_observations text,
    status text,
    created_at timestamptz DEFAULT now()
);

-- Instructors
CREATE TABLE IF NOT EXISTS public.instructors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE,
    phone text,
    specialties jsonb,
    availability jsonb,
    created_at timestamptz DEFAULT now()
);

-- Modalities
CREATE TABLE IF NOT EXISTS public.modalities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric,
    created_at timestamptz DEFAULT now()
);

-- Classes
CREATE TABLE IF NOT EXISTS public.classes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text,
    modality_id uuid REFERENCES public.modalities(id) ON DELETE SET NULL,
    instructor_id uuid REFERENCES public.instructors(id) ON DELETE SET NULL,
    start_time time,
    end_time time,
    days_of_week text[],
    location text,
    max_students integer,
    status text,
    created_at timestamptz DEFAULT now()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    enrollment_date date DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
    enrollment_id uuid REFERENCES public.enrollments(id) ON DELETE SET NULL,
    description text NOT NULL,
    amount numeric NOT NULL,
    type text NOT NULL,
    due_date date NOT NULL,
    paid_at timestamptz,
    category text,
    payment_method text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Equipments
CREATE TABLE IF NOT EXISTS public.equipments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    category text,
    location text,
    brand text,
    model text,
    serial_number text,
    installation_date date,
    status text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Maintenance Schedules
CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_id uuid NOT NULL REFERENCES public.equipments(id) ON DELETE CASCADE,
    type text NOT NULL,
    priority text,
    description text,
    scheduled_date date,
    completion_date date,
    responsible text,
    cost numeric,
    status text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Plans
CREATE TABLE IF NOT EXISTS public.plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    modality_id uuid REFERENCES public.modalities(id) ON DELETE SET NULL,
    price numeric NOT NULL,
    recurrence text NOT NULL,
    benefits text[],
    status text DEFAULT 'ativo',
    created_at timestamptz DEFAULT now()
);

-- Student Plans
CREATE TABLE IF NOT EXISTS public.student_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    plan_id uuid NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    start_date date DEFAULT now(),
    end_date date,
    created_at timestamptz DEFAULT now(),
    UNIQUE(student_id, plan_id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS public.attendance (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    date date NOT NULL DEFAULT CURRENT_DATE,
    status text NOT NULL,
    created_at timestamptz DEFAULT now()
);
EOF

# 03 - Alter users (password_hash nullable para migração)
PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" <<'EOF'
-- Permitir password_hash nulo temporariamente para migração
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;
EOF

# 04 - Academy Settings
PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" <<'EOF'
-- Academy Settings table
CREATE TABLE IF NOT EXISTS public.academy_settings (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed inicial
INSERT INTO public.academy_settings (id, name)
SELECT 1, 'Hidro Fitness'
WHERE NOT EXISTS (SELECT 1 FROM public.academy_settings WHERE id = 1);

-- Criar ou atualizar usuário admin padrão
INSERT INTO public.users (email, password_hash, full_name, role)
VALUES (
  'admin@hidrofitness.com',
  '$2a$10$AHozTx7OFYZM9nJa8.lbo.K6XaDOyxGJk/.YjubAndcDqP5nbodDa',
  'Administrador',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;
EOF

echo "✅ Schema migrations completed!"
echo "👤 Admin user created:"
echo "   Email: admin@hidrofitness.com"
echo "   Password: admin123"
echo "   ⚠️  Change password after first login!"

# Rastrear tabelas no Hasura
echo "🔄 Tracking tables in Hasura..."

# Espera Hasura estar pronto
until curl -s -f "http://hasura:8080/healthz" > /dev/null 2>&1; do
  echo "⏳ Waiting for Hasura to be ready..."
  sleep 2
done

echo "✅ Hasura is ready!"

# Rastreia todas as tabelas
for table in users profiles students instructors modalities classes enrollments payments payment_methods equipments maintenance_schedules plans student_plans attendance academy_settings; do
  echo "📊 Tracking table: $table"
  curl -s -X POST \
    "http://hasura:8080/v1/metadata" \
    -H "X-Hasura-Admin-Secret: ${HASURA_ADMIN_SECRET}" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"pg_track_table\",\"args\":{\"source\":\"default\",\"table\":{\"schema\":\"public\",\"name\":\"$table\"}}}" \
    > /dev/null 2>&1 || echo "  ℹ️  Table $table already tracked or not found"
done

echo "✅ All tables tracked in Hasura!"
echo "🚀 Database initialization complete!"
