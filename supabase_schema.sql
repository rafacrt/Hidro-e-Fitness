-- supabase_schema.sql
-- Este script configura o banco de dados e o armazenamento para o sistema Hidro Fitness no Supabase.
-- Para executar:
-- 1. Vá para o seu projeto no Supabase.
-- 2. Navegue até o "SQL Editor".
-- 3. Clique em "+ New query".
-- 4. Copie e cole todo o conteúdo deste arquivo.
-- 5. Clique em "RUN".

-- ==== EXTENSÕES (se necessário) ====
-- CREATE EXTENSION IF NOT EXISTS moddatetime;

-- ==== TABELAS ====

-- Tabela de Perfis (Usuários do sistema)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Armazena perfis dos usuários do sistema (administradores, recepção, etc.).';

-- Tabela de Alunos
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
COMMENT ON TABLE public.students IS 'Cadastro central de todos os alunos da academia.';

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS public.instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    specialties TEXT[],
    availability TEXT[],
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.instructors IS 'Cadastro dos professores e suas especialidades.';

-- Tabela de Modalidades
CREATE TABLE IF NOT EXISTS public.modalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT, -- Ex: Aquática, Coletiva, Individual
    max_students INTEGER,
    duration_minutes INTEGER,
    status TEXT DEFAULT 'ativa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.modalities IS 'Modalidades de aulas oferecidas pela academia.';

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    modality_id UUID REFERENCES public.modalities(id),
    instructor_id UUID REFERENCES public.instructors(id),
    start_time TIME,
    end_time TIME,
    days_of_week TEXT[], -- Ex: ['seg', 'qua', 'sex']
    location TEXT, -- Ex: Piscina 1, Piscina 2
    max_students INTEGER,
    status TEXT DEFAULT 'ativa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.classes IS 'Turmas específicas com horários e professores.';

-- Tabela de Matrículas (associação Aluno-Turma)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT NOW(),
    status TEXT DEFAULT 'ativa', -- ativa, inativa, cancelada
    UNIQUE(student_id, class_id)
);
COMMENT ON TABLE public.enrollments IS 'Associa um aluno a uma turma.';


-- ==== STORAGE (BUCKETS) ====

-- Bucket para avatares de usuários
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

COMMENT ON BUCKET avatars IS 'Armazena as fotos de perfil dos usuários e alunos.';


-- ==== POLÍTICAS DE ACESSO (ROW LEVEL SECURITY - RLS) ====

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes antes de criar novas para evitar erros
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can manage students." ON public.students;
DROP POLICY IF EXISTS "Authenticated users can manage instructors." ON public.instructors;
DROP POLICY IF EXISTS "Authenticated users can manage modalities." ON public.modalities;
DROP POLICY IF EXISTS "Authenticated users can manage classes." ON public.classes;
DROP POLICY IF EXISTS "Authenticated users can manage enrollments." ON public.enrollments;
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own avatar." ON storage.objects;

-- Políticas para a tabela 'profiles'
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para as outras tabelas (acesso total para usuários autenticados)
-- ATENÇÃO: Em um ambiente de produção real, você deve criar regras mais granulares.
-- Por exemplo, apenas administradores podem criar turmas.
CREATE POLICY "Authenticated users can manage students." ON public.students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage instructors." ON public.instructors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage modalities." ON public.modalities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage classes." ON public.classes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage enrollments." ON public.enrollments FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para o Storage 'avatars'
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can update their own avatar." ON storage.objects FOR UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');


-- ==== TRIGGERS ====

-- Função para criar um perfil automaticamente ao criar um novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que chama a função acima
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==== DADOS INICIAIS (Opcional) ====
-- Você pode adicionar aqui dados iniciais, como modalidades padrão.
INSERT INTO public.modalities (name, description, type, max_students, duration_minutes, status)
VALUES
  ('Natação Adulto', 'Aulas de natação para adultos, do iniciante ao avançado.', 'Aquática', 15, 60, 'ativa'),
  ('Hidroginástica', 'Exercícios aeróbicos de baixo impacto na piscina.', 'Aquática', 20, 50, 'ativa'),
  ('Natação Infantil', 'Aprendizado lúdico de natação para crianças.', 'Aquática', 10, 45, 'ativa')
ON CONFLICT (name) DO NOTHING;


-- Fim do script.
SELECT 'Script executado com sucesso!' AS result;
