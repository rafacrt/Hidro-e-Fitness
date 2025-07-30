-- Tabela de Perfis de Usuários
-- Armazena dados públicos dos usuários, estendendo a tabela auth.users.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT,
    updated_at TIMESTAMPTZ
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tabela de Alunos
-- Armazena informações detalhadas sobre os alunos da academia.
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cpf TEXT UNIQUE,
    birth_date DATE,
    email TEXT UNIQUE,
    phone TEXT,
    is_whatsapp BOOLEAN,
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
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage students." ON public.students;
CREATE POLICY "Authenticated users can manage students." ON public.students FOR ALL USING (auth.role() = 'authenticated');

-- Tabela de Professores
-- Armazena informações sobre os instrutores.
CREATE TABLE IF NOT EXISTS public.instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    specialties JSON,
    availability JSON,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage instructors." ON public.instructors;
CREATE POLICY "Authenticated users can manage instructors." ON public.instructors FOR ALL USING (auth.role() = 'authenticated');

-- Tabela de Modalidades
-- Armazena as diferentes modalidades oferecidas.
CREATE TABLE IF NOT EXISTS public.modalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage modalities." ON public.modalities;
CREATE POLICY "Authenticated users can manage modalities." ON public.modalities FOR ALL USING (auth.role() = 'authenticated');

-- Tabela de Turmas
-- Armazena informações sobre as turmas.
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    modality_id UUID REFERENCES public.modalities(id),
    instructor_id UUID REFERENCES public.instructors(id),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week TEXT[] NOT NULL,
    location TEXT,
    max_students INT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage classes." ON public.classes;
CREATE POLICY "Authenticated users can manage classes." ON public.classes FOR ALL USING (auth.role() = 'authenticated');


-- Tabela de Matrículas
-- Associa alunos a turmas.
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT now()
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage enrollments." ON public.enrollments;
CREATE POLICY "Authenticated users can manage enrollments." ON public.enrollments FOR ALL USING (auth.role() = 'authenticated');


-- Tabela de Pagamentos
-- Armazena todas as transações financeiras.
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL, -- 'receita' ou 'despesa'
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    category TEXT,
    payment_method TEXT,
    status TEXT NOT NULL, -- 'pago', 'pendente', 'vencido'
    student_id UUID REFERENCES public.students(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage payments." ON public.payments;
CREATE POLICY "Authenticated users can manage payments." ON public.payments FOR ALL USING (auth.role() = 'authenticated');

-- Tabela de Equipamentos
CREATE TABLE IF NOT EXISTS public.equipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    serial_number TEXT,
    installation_date DATE NOT NULL,
    status TEXT NOT NULL, -- 'operacional', 'manutencao', 'quebrado'
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage equipments." ON public.equipments;
CREATE POLICY "Authenticated users can manage equipments." ON public.equipments FOR ALL USING (auth.role() = 'authenticated');

-- Tabela de Agendamentos de Manutenção
CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID NOT NULL REFERENCES public.equipments(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'preventiva', 'corretiva', 'emergencial'
    priority TEXT NOT NULL, -- 'baixa', 'media', 'alta', 'urgente'
    description TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    responsible TEXT,
    cost NUMERIC,
    status TEXT NOT NULL, -- 'agendada', 'em_andamento', 'concluida', 'cancelada'
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage maintenance schedules." ON public.maintenance_schedules;
CREATE POLICY "Authenticated users can manage maintenance schedules." ON public.maintenance_schedules FOR ALL USING (auth.role() = 'authenticated');

-- Tabela de Relatórios
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    times_generated INT DEFAULT 0,
    last_generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage reports." ON public.reports;
CREATE POLICY "Authenticated users can manage reports." ON public.reports FOR ALL USING (auth.role() = 'authenticated');


-- Storage Bucket para Avatares
-- O bucket deve ser criado manualmente no dashboard do Supabase.
-- As políticas de segurança para o bucket devem ser configuradas para permitir
-- uploads por usuários autenticados e leitura pública.
-- Exemplo de política para upload (a ser inserida na UI do Supabase):
-- (bucket_id = 'avatars' AND auth.role() = 'authenticated')

-- Populando dados iniciais para relatórios (apenas para exemplo)
INSERT INTO public.reports (name, description, category, times_generated, last_generated_at)
VALUES 
('Relatório Financeiro Mensal', 'Receitas, despesas e lucro líquido do mês', 'Financeiro', 45, now() - interval '1 day'),
('Frequência por Modalidade', 'Análise de presença dos alunos por atividade', 'Frequência', 32, now() - interval '2 days'),
('Performance dos Professores', 'Avaliação e estatísticas dos instrutores', 'Performance', 28, now() - interval '3 days'),
('Cadastro de Novos Alunos', 'Relatório de matrículas e crescimento', 'Alunos', 21, now() - interval '4 days')
ON CONFLICT (name) DO NOTHING;
