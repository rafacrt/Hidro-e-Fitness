
-- Habilita a extensão pgcrypto se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Habilita o RLS (Row Level Security) para todas as tabelas
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM public;

-- Tabela de Perfis de Usuários
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    role text,
    updated_at timestamptz
);
COMMENT ON TABLE public.profiles IS 'Armazena dados de perfil para usuários autenticados.';
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de perfis
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Gatilho para manter a tabela de perfis sincronizada com a de usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', 'admin'); -- Define 'admin' como padrão
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Armazenamento de Avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
COMMENT ON TABLE storage.buckets IS 'Armazena as fotos de perfil dos usuários e alunos.';

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS public.students (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    cpf text,
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
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.students IS 'Armazena os dados cadastrais dos alunos.';
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.students;
CREATE POLICY "Enable read access for authenticated users" ON public.students FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.students;
CREATE POLICY "Enable insert for authenticated users" ON public.students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.students;
CREATE POLICY "Enable update for authenticated users" ON public.students FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.students;
CREATE POLICY "Enable delete for authenticated users" ON public.students FOR DELETE USING (auth.role() = 'authenticated');


-- Tabela de Modalidades
CREATE TABLE IF NOT EXISTS public.modalities (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.modalities IS 'Modalidades oferecidas pela academia (Natação, Hidroginástica, etc).';
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.modalities;
CREATE POLICY "Enable read access for authenticated users" ON public.modalities FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.modalities;
CREATE POLICY "Enable insert for authenticated users" ON public.modalities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.modalities;
CREATE POLICY "Enable update for authenticated users" ON public.modalities FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.modalities;
CREATE POLICY "Enable delete for authenticated users" ON public.modalities FOR DELETE USING (auth.role() = 'authenticated');


-- Tabela de Professores
CREATE TABLE IF NOT EXISTS public.instructors (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text,
    phone text,
    specialties jsonb,
    availability jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.instructors IS 'Dados dos professores/instrutores da academia.';
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.instructors;
CREATE POLICY "Enable read access for authenticated users" ON public.instructors FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.instructors;
CREATE POLICY "Enable insert for authenticated users" ON public.instructors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.instructors;
CREATE POLICY "Enable update for authenticated users" ON public.instructors FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.instructors;
CREATE POLICY "Enable delete for authenticated users" ON public.instructors FOR DELETE USING (auth.role() = 'authenticated');


-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS public.classes (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text,
    modality_id uuid REFERENCES public.modalities(id) ON DELETE SET NULL,
    instructor_id uuid REFERENCES public.instructors(id) ON DELETE SET NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    days_of_week text[] NOT NULL,
    location text,
    max_students integer,
    status text,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.classes IS 'Armazena as informações das turmas.';
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.classes;
CREATE POLICY "Enable read access for authenticated users" ON public.classes FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.classes;
CREATE POLICY "Enable insert for authenticated users" ON public.classes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.classes;
CREATE POLICY "Enable update for authenticated users" ON public.classes FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.classes;
CREATE POLICY "Enable delete for authenticated users" ON public.classes FOR DELETE USING (auth.role() = 'authenticated');


-- Tabela de Matrículas (associativa entre alunos e turmas)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    enrollment_date date NOT NULL DEFAULT CURRENT_DATE
);
COMMENT ON TABLE public.enrollments IS 'Relaciona os alunos matriculados em cada turma.';
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.enrollments;
CREATE POLICY "Enable read access for authenticated users" ON public.enrollments FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.enrollments;
CREATE POLICY "Enable insert for authenticated users" ON public.enrollments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.enrollments;
CREATE POLICY "Enable update for authenticated users" ON public.enrollments FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.enrollments;
CREATE POLICY "Enable delete for authenticated users" ON public.enrollments FOR DELETE USING (auth.role() = 'authenticated');


-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    description text NOT NULL,
    amount numeric NOT NULL,
    type text NOT NULL, -- 'receita' ou 'despesa'
    due_date date NOT NULL,
    paid_at date,
    category text,
    payment_method text,
    status text NOT NULL, -- 'pago', 'pendente', 'vencido'
    student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
    class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.payments IS 'Registra todas as transações financeiras.';
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.payments;
CREATE POLICY "Enable read access for authenticated users" ON public.payments FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.payments;
CREATE POLICY "Enable insert for authenticated users" ON public.payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.payments;
CREATE POLICY "Enable update for authenticated users" ON public.payments FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.payments;
CREATE POLICY "Enable delete for authenticated users" ON public.payments FOR DELETE USING (auth.role() = 'authenticated');

-- Inserir dados de exemplo na tabela de pagamentos
-- Limpa a tabela antes de inserir para evitar duplicatas em re-execuções
TRUNCATE public.payments RESTART IDENTITY;

-- Inserir pagamentos de exemplo
INSERT INTO public.payments (description, amount, type, due_date, paid_at, category, payment_method, status) VALUES
('Mensalidade - Maria Silva', 180.00, 'receita', '2024-07-10', '2024-07-09', 'Mensalidades', 'PIX', 'pago'),
('Salário - Prof. Ana Costa', 2500.00, 'despesa', '2024-07-05', '2024-07-05', 'Salários', 'Transferência', 'pago'),
('Mensalidade - João Pedro', 160.00, 'receita', '2024-07-15', NULL, 'Mensalidades', 'Boleto', 'pendente'),
('Aluguel', 4500.00, 'despesa', '2024-07-08', NULL, 'Aluguel', 'Boleto', 'vencido'),
('Venda de Touca', 25.00, 'receita', '2024-07-20', '2024-07-20', 'Vendas de Produtos', 'Dinheiro', 'pago'),
('Conta de Luz', 850.00, 'despesa', '2024-07-25', NULL, 'Contas', 'Boleto', 'pendente'),
('Mensalidade - Carlos Lima', 220.00, 'receita', '2024-06-20', NULL, 'Mensalidades', 'Cartão de Crédito', 'vencido');
