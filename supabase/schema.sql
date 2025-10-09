-- Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    role text,
    updated_at timestamptz,
    PRIMARY KEY (id)
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Policies for Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger for new user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create Students Table
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
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
-- Policies for Students
DROP POLICY IF EXISTS "Authenticated users can manage students." ON public.students;
CREATE POLICY "Authenticated users can manage students." ON public.students FOR ALL USING (auth.role() = 'authenticated');

-- Create Instructors Table
CREATE TABLE IF NOT EXISTS public.instructors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE,
    phone text,
    specialties jsonb,
    availability jsonb,
    created_at timestamptz DEFAULT now()
);
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
-- Policies for Instructors
DROP POLICY IF EXISTS "Authenticated users can manage instructors." ON public.instructors;
CREATE POLICY "Authenticated users can manage instructors." ON public.instructors FOR ALL USING (auth.role() = 'authenticated');

-- Create Modalities Table
CREATE TABLE IF NOT EXISTS public.modalities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric,
    created_at timestamptz DEFAULT now()
);
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
-- Policies for Modalities
DROP POLICY IF EXISTS "Authenticated users can manage modalities." ON public.modalities;
CREATE POLICY "Authenticated users can manage modalities." ON public.modalities FOR ALL USING (auth.role() = 'authenticated');

-- Create Classes Table
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
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
-- Policies for Classes
DROP POLICY IF EXISTS "Authenticated users can manage classes." ON public.classes;
CREATE POLICY "Authenticated users can manage classes." ON public.classes FOR ALL USING (auth.role() = 'authenticated');

-- Create Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    enrollment_date date DEFAULT now()
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
-- Policies for Enrollments
DROP POLICY IF EXISTS "Authenticated users can manage enrollments." ON public.enrollments;
CREATE POLICY "Authenticated users can manage enrollments." ON public.enrollments FOR ALL USING (auth.role() = 'authenticated');

-- Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
    enrollment_id uuid REFERENCES public.enrollments(id) ON DELETE SET NULL,
    description text NOT NULL,
    amount numeric NOT NULL,
    type text NOT NULL, -- 'receita' or 'despesa'
    due_date date NOT NULL,
    paid_at timestamptz,
    category text,
    payment_method text,
    status text NOT NULL, -- 'pago', 'pendente', 'vencido'
    created_at timestamptz DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
-- Policies for Payments
DROP POLICY IF EXISTS "Authenticated users can manage payments." ON public.payments;
CREATE POLICY "Authenticated users can manage payments." ON public.payments FOR ALL USING (auth.role() = 'authenticated');

-- Create Equipments Table
CREATE TABLE IF NOT EXISTS public.equipments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    category text,
    location text,
    brand text,
    model text,
    serial_number text,
    installation_date date,
    status text NOT NULL, -- 'operacional', 'manutencao', 'quebrado'
    created_at timestamptz DEFAULT now()
);
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;
-- Policies for Equipments
DROP POLICY IF EXISTS "Authenticated users can manage equipments." ON public.equipments;
CREATE POLICY "Authenticated users can manage equipments." ON public.equipments FOR ALL USING (auth.role() = 'authenticated');

-- Create Maintenance Schedules Table
CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_id uuid NOT NULL REFERENCES public.equipments(id) ON DELETE CASCADE,
    type text NOT NULL, -- 'preventiva', 'corretiva', 'emergencial'
    priority text, -- 'baixa', 'media', 'alta', 'urgente'
    description text,
    scheduled_date date,
    completion_date date,
    responsible text,
    cost numeric,
    status text NOT NULL, -- 'agendada', 'em_andamento', 'concluida', 'cancelada'
    created_at timestamptz DEFAULT now()
);
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;
-- Policies for Maintenance Schedules
DROP POLICY IF EXISTS "Authenticated users can manage maintenance." ON public.maintenance_schedules;
CREATE POLICY "Authenticated users can manage maintenance." ON public.maintenance_schedules FOR ALL USING (auth.role() = 'authenticated');

-- Create Storage Buckets
-- Bucket for Avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
  
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can update their own avatar." ON storage.objects;
CREATE POLICY "Anyone can update their own avatar." ON storage.objects
  FOR UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');

-- Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    modality_id uuid REFERENCES public.modalities(id) ON DELETE SET NULL,
    price numeric NOT NULL,
    recurrence text NOT NULL, -- 'mensal', 'trimestral', 'semestral', 'anual'
    benefits text[],
    status text DEFAULT 'ativo', -- 'ativo', 'inativo'
    created_at timestamptz DEFAULT now()
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
-- Policies for Plans
DROP POLICY IF EXISTS "Authenticated users can manage plans." ON public.plans;
CREATE POLICY "Authenticated users can manage plans." ON public.plans FOR ALL USING (auth.role() = 'authenticated');

-- Create Student Plans Table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.student_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    plan_id uuid NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    start_date date DEFAULT now(),
    end_date date,
    created_at timestamptz DEFAULT now(),
    UNIQUE(student_id, plan_id)
);
ALTER TABLE public.student_plans ENABLE ROW LEVEL SECURITY;
-- Policies for Student Plans
DROP POLICY IF EXISTS "Authenticated users can manage student plans." ON public.student_plans;
CREATE POLICY "Authenticated users can manage student plans." ON public.student_plans FOR ALL USING (auth.role() = 'authenticated');
