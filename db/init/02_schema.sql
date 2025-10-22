-- Base Users table (replaces Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    full_name text,
    avatar_url text,
    role text DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);

-- Profiles referencing our users
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

-- Payment Methods (referenced in code)
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