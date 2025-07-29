-- supabase_schema.sql
-- Este script configura o esquema do banco de dados para o projeto Hidro Fitness no Supabase.
--
-- Para executar:
-- 1. Vá para o seu projeto no painel do Supabase.
-- 2. Navegue até o "SQL Editor".
-- 3. Clique em "+ New query".
-- 4. Copie e cole todo o conteúdo deste arquivo.
-- 5. Clique em "RUN".
--
-- O script é idempotente, o que significa que pode ser executado várias vezes sem causar erros.

-- 1. CRIAÇÃO DE TABELAS
-- ========================

-- Tabela de Perfis (Usuários do Sistema)
-- Armazena informações adicionais dos usuários autenticados (auth.users).
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user'
);
COMMENT ON TABLE profiles IS 'Tabela de perfis para usuários do sistema.';

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  birth_date DATE,
  email TEXT,
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
  status TEXT DEFAULT 'ativo'
);
COMMENT ON TABLE students IS 'Armazena os dados cadastrais dos alunos.';

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS instructor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialties TEXT[], -- Array de textos para especialidades
  availability TEXT[] -- Array de textos para dias disponíveis
);
COMMENT ON TABLE instructor IS 'Cadastro dos professores e suas especialidades.';

-- Tabela de Modalidades
CREATE TABLE IF NOT EXISTS modalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT, -- Ex: Aquática, Coletiva, Individual
  status TEXT DEFAULT 'ativa'
);
COMMENT ON TABLE modalities IS 'Modalidades de aulas oferecidas pela academia.';

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  modality_id UUID REFERENCES modalities(id),
  instructor_id UUID REFERENCES instructor(id),
  start_time TIME,
  end_time TIME,
  days_of_week TEXT[], -- Ex: {'seg', 'qua', 'sex'}
  location TEXT, -- Ex: Piscina 1, Piscina 2
  max_students INT,
  status TEXT DEFAULT 'ativa'
);
COMMENT ON TABLE classes IS 'Informações sobre as turmas, horários e professores.';

-- Tabela de Matrículas (tabela de junção)
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'ativa',
  UNIQUE(student_id, class_id)
);
COMMENT ON TABLE enrollments IS 'Relaciona quais alunos estão matriculados em quais turmas.';


-- 2. CONFIGURAÇÃO DO STORAGE
-- =============================

-- Criação do Bucket para avatares
-- As políticas de acesso são definidas na seção 4.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. FUNÇÕES E TRIGGERS (AUTOMAÇÃO)
-- ==================================

-- Função para criar um perfil automaticamente ao criar um novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que chama a função acima após a criação de um usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. POLÍTICAS DE ACESSO (ROW LEVEL SECURITY - RLS)
-- =================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor ENABLE ROW LEVEL SECURITY;
ALTER TABLE modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela 'profiles'
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para as demais tabelas (Permitir acesso total para usuários autenticados)
-- Esta é uma configuração inicial. Refine as regras conforme a necessidade de perfis (admin, recepção).
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.students;
CREATE POLICY "Allow all access to authenticated users" ON public.students
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.instructor;
CREATE POLICY "Allow all access to authenticated users" ON public.instructor
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.modalities;
CREATE POLICY "Allow all access to authenticated users" ON public.modalities
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.classes;
CREATE POLICY "Allow all access to authenticated users" ON public.classes
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.enrollments;
CREATE POLICY "Allow all access to authenticated users" ON public.enrollments
  FOR ALL USING (auth.role() = 'authenticated');


-- Políticas para o Storage (Bucket 'avatars')
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
CREATE POLICY "Users can update their own avatar." ON storage.objects
  FOR UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');

-- Fim do script.
