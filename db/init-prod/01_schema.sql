-- Schema consolidado: TODAS as tabelas em um único banco
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- SISTEMA: Users e Academy Settings
-- =========================================

CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password_hash text,
    full_name text,
    avatar_url text,
    role text DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.academy_settings (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- =========================================
-- DADOS: Todas as tabelas transacionais
-- =========================================

CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS public.instructors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE,
    phone text,
    specialties jsonb,
    availability jsonb,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.modalities (
    id TEXT PRIMARY KEY,
    name text NOT NULL,
    description text,
    type text,
    status text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.classes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    modality_id uuid,
    instructor_id uuid,
    day_of_week text,
    start_time time,
    end_time time,
    capacity integer,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enrollments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid,
    class_id uuid,
    enrollment_date timestamptz DEFAULT now(),
    status text
);

CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    student_id text,
    amount numeric,
    payment_date timestamptz,
    payment_method text,
    status text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_methods (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.equipments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    quantity integer,
    condition text,
    last_maintenance timestamptz,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_id uuid,
    scheduled_date timestamptz,
    completed_date timestamptz,
    notes text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name text NOT NULL,
    modality_id text,
    price numeric,
    recurrence text,
    benefits jsonb,
    status text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.student_plans (
    id TEXT PRIMARY KEY,
    student_id text,
    plan_id text,
    start_date date,
    end_date date,
    status text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid,
    class_id uuid,
    attendance_date timestamptz DEFAULT now(),
    status text
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY,
    full_name text,
    avatar_url text,
    role text,
    created_at timestamptz DEFAULT now()
);
