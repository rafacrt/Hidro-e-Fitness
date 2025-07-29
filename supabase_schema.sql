-- supabase_schema.sql
-- Este script configura o banco de dados PostgreSQL no Supabase,
-- incluindo tabelas, relacionamentos e políticas de segurança (RLS).
--
-- Como usar:
-- 1. Vá para o seu projeto no painel do Supabase.
-- 2. Navegue até o "SQL Editor".
-- 3. Clique em "+ New query".
-- 4. Copie e cole TODO o conteúdo deste arquivo no editor.
-- 5. Clique em "RUN" para executar o script.

-- 1. Habilitar a extensão pgcrypto para usar gen_random_uuid() se necessário
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tabela de Perfis (Profiles)
-- Armazena dados públicos dos usuários, estendendo a tabela `auth.users`.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user'
);
-- Garante que a tabela `profiles` seja acessível para leitura por todos.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Função para criar um perfil automaticamente quando um novo usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função handle_new_user a cada novo usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. Tabela de Alunos (Students)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    cpf TEXT UNIQUE,
    birth_date DATE NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    is_whatsapp BOOLEAN DEFAULT false,
    cep TEXT,
    street TEXT,
    "number" TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    responsible_name TEXT,
    responsible_phone TEXT,
    medical_observations TEXT,
    status TEXT DEFAULT 'ativo'
);
-- Políticas de Segurança para a tabela `students`
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage students." ON public.students
    FOR ALL USING (auth.role() = 'authenticated');


-- 4. Configuração do Supabase Storage (Buckets)
-- Cria um bucket chamado 'avatars' para fotos de perfil.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso para o bucket 'avatars'
-- Permite que todos vejam os avatares (são públicos)
CREATE POLICY "Avatar images are publicly accessible."
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'avatars' );

-- Permite que usuários autenticados enviem seus próprios avatares
CREATE POLICY "Anyone can upload an avatar."
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK ( bucket_id = 'avatars' );

-- Permite que usuários autenticados atualizem seus próprios avatares
CREATE POLICY "Anyone can update their own avatar."
    ON storage.objects FOR UPDATE
    TO authenticated
    USING ( auth.uid() = owner );


-- Fim do Script
-- A estrutura básica está pronta. Outras tabelas como turmas, modalidades, etc.,
-- podem ser adicionadas seguindo este mesmo padrão.
