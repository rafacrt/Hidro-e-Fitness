
-- Habilita a extensão pgcrypto se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Habilita a RLS (Row-Level Security) para todas as tabelas
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM public;

-- Tabela de Perfis de Usuários (profiles)
-- Armazena dados públicos dos usuários do sistema.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Armazena os perfis dos usuários do sistema (administradores, professores, etc.).';

-- Políticas de Segurança para a Tabela 'profiles'
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Função para criar um perfil automaticamente ao criar um novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função handle_new_user a cada novo usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Tabela de Alunos (students)
-- Armazena os dados cadastrais dos alunos da academia.
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cpf TEXT UNIQUE,
    birth_date DATE,
    email TEXT UNIQUE,
    phone TEXT,
    is_whatsapp BOOLEAN DEFAULT false,
    cep TEXT,
    street TEXT,
    number TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    responsible_name TEXT,
    responsible_phone TEXT,
    medical_observations TEXT,
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.students IS 'Armazena os dados cadastrais dos alunos da academia.';

-- Políticas de Segurança para a Tabela 'students'
DROP POLICY IF EXISTS "Authenticated users can manage students." ON public.students;
CREATE POLICY "Authenticated users can manage students." ON public.students
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- Tabela de Professores (instructors)
-- Armazena os dados dos professores e suas especialidades.
CREATE TABLE IF NOT EXISTS public.instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    specialties JSONB,
    availability JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.instructors IS 'Armazena os dados dos professores da academia.';

-- Políticas de Segurança para a Tabela 'instructors'
DROP POLICY IF EXISTS "Authenticated users can manage instructors." ON public.instructors;
CREATE POLICY "Authenticated users can manage instructors." ON public.instructors
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- Tabela de Modalidades (modalities)
-- Armazena as modalidades oferecidas pela academia (Natação, Hidroginástica, etc.).
CREATE TABLE IF NOT EXISTS public.modalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.modalities IS 'Modalidades oferecidas pela academia.';

-- Políticas de Segurança para a Tabela 'modalities'
DROP POLICY IF EXISTS "Authenticated users can manage modalities." ON public.modalities;
CREATE POLICY "Authenticated users can manage modalities." ON public.modalities
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- Tabela de Turmas (classes)
-- Armazena as informações das turmas, como horários e professores.
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    modality_id UUID REFERENCES public.modalities(id) ON DELETE SET NULL,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
    start_time TIME,
    end_time TIME,
    days_of_week TEXT[],
    max_students INT,
    location TEXT,
    status TEXT DEFAULT 'ativa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.classes IS 'Informações sobre as turmas da academia.';

-- Políticas de Segurança para a Tabela 'classes'
DROP POLICY IF EXISTS "Authenticated users can manage classes." ON public.classes;
CREATE POLICY "Authenticated users can manage classes." ON public.classes
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- Tabela de Matrículas (enrollments)
-- Tabela de associação entre alunos e turmas.
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, class_id)
);
COMMENT ON TABLE public.enrollments IS 'Associa alunos às turmas.';

-- Políticas de Segurança para a Tabela 'enrollments'
DROP POLICY IF EXISTS "Authenticated users can manage enrollments." ON public.enrollments;
CREATE POLICY "Authenticated users can manage enrollments." ON public.enrollments
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
    

-- Tabela de Pagamentos (payments)
-- Armazena todas as transações financeiras (receitas e despesas).
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL, -- 'receita' ou 'despesa'
    category TEXT,
    payment_method TEXT,
    due_date DATE,
    paid_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pendente', -- 'pendente', 'pago', 'vencido'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.payments IS 'Registros de todas as transações financeiras.';

-- Políticas de Segurança para a Tabela 'payments'
DROP POLICY IF EXISTS "Authenticated users can manage payments." ON public.payments;
CREATE POLICY "Authenticated users can manage payments." ON public.payments
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- Storage Buckets
-- Bucket para avatares de usuários
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Políticas de Segurança para o Bucket 'avatars'
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
CREATE POLICY "Anyone can upload an avatar." ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
CREATE POLICY "Users can update their own avatar." ON storage.objects
    FOR UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');
