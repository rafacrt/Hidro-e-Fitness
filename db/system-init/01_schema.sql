-- Sistema: Usuários e configurações
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password_hash text,
    full_name text,
    avatar_url text,
    role text DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);

-- Academy Settings
CREATE TABLE IF NOT EXISTS public.academy_settings (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed academy settings
INSERT INTO public.academy_settings (id, name)
SELECT 1, 'Hidro Fitness'
WHERE NOT EXISTS (SELECT 1 FROM public.academy_settings WHERE id = 1);

-- Seed admin user
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
