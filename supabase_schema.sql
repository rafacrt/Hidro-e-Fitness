-- Hidro Fitness - Supabase Schema
-- Versão: 1.0
--
-- INSTRUÇÕES:
-- 1. Vá para o seu projeto no painel do Supabase.
-- 2. Navegue até a seção "SQL Editor".
-- 3. Clique em "+ New query".
-- 4. Copie TODO o conteúdo deste arquivo e cole no editor.
-- 5. Clique em "RUN" para executar o script e criar todas as tabelas e configurações.

-- 1. Tabela de Perfis de Usuários (Pública)
-- Esta tabela armazena dados públicos dos usuários, estendendo a tabela auth.users.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'Recepção'
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';

-- Garante que um perfil seja criado automaticamente para cada novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', 'Recepção');
    -- Define o primeiro usuário como Desenvolvedor
    IF (SELECT count(*) FROM auth.users) = 1 THEN
        UPDATE public.profiles SET role = 'Desenvolvedor' WHERE id = new.id;
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria o trigger que chama a função acima quando um novo usuário se cadastra
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Tabela de Alunos
CREATE TABLE IF NOT EXISTS public.students (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    birth_date DATE,
    email TEXT,
    phone VARCHAR(20),
    is_whatsapp BOOLEAN DEFAULT TRUE,
    cep VARCHAR(9),
    street TEXT,
    "number" VARCHAR(10),
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state VARCHAR(2),
    responsible_name TEXT,
    responsible_phone VARCHAR(20),
    medical_observations TEXT,
    status VARCHAR(10) DEFAULT 'Ativo' -- Ativo, Inativo
);
COMMENT ON TABLE public.students IS 'Stores information about the students.';


-- 3. Tabela de Professores
CREATE TABLE IF NOT EXISTS public.instructors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone VARCHAR(20),
    specialties TEXT[], -- Array de especialidades
    availability TEXT[], -- Array de dias da semana
    status VARCHAR(10) DEFAULT 'Ativo' -- Ativo, Inativo
);
COMMENT ON TABLE public.instructors IS 'Stores information about the instructors.';


-- 4. Tabela de Modalidades
CREATE TABLE IF NOT EXISTS public.modalities (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    "type" VARCHAR(20), -- Aquática, Coletiva, Individual
    status VARCHAR(10) DEFAULT 'Ativa' -- Ativa, Inativa
);
COMMENT ON TABLE public.modalities IS 'Stores the types of classes offered.';


-- 5. Tabela de Turmas
CREATE TABLE IF NOT EXISTS public.classes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    modality_id INTEGER REFERENCES public.modalities(id),
    instructor_id INTEGER REFERENCES public.instructors(id),
    start_time TIME,
    end_time TIME,
    days_of_week TEXT[], -- Array de dias: 'Segunda', 'Terça', etc.
    location TEXT, -- 'Piscina 1', 'Piscina 2', etc.
    max_students INTEGER,
    monthly_fee NUMERIC(10, 2),
    status VARCHAR(20) DEFAULT 'Ativa' -- Ativa, Inativa, Lotada
);
COMMENT ON TABLE public.classes IS 'Stores class schedules and details.';


-- 6. Tabela de Matrículas (tabela de junção entre alunos e turmas)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    student_id INTEGER REFERENCES public.students(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES public.classes(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Ativa', -- Ativa, Cancelada
    UNIQUE (student_id, class_id)
);
COMMENT ON TABLE public.enrollments IS 'Links students to the classes they are enrolled in.';


-- 7. Tabela de Pagamentos/Transações
CREATE TABLE IF NOT EXISTS public.payments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    student_id INTEGER REFERENCES public.students(id),
    enrollment_id INTEGER REFERENCES public.enrollments(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    payment_method VARCHAR(50), -- PIX, Cartão de Crédito, etc.
    status VARCHAR(20) DEFAULT 'Pendente', -- Pendente, Pago, Vencido, Cancelado
    description TEXT
);
COMMENT ON TABLE public.payments IS 'Tracks all financial transactions.';


-- 8. Tabela de Frequência
CREATE TABLE IF NOT EXISTS public.attendance (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    enrollment_id INTEGER REFERENCES public.enrollments(id) ON DELETE CASCADE,
    class_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- Presente, Ausente, Justificado
    notes TEXT,
    UNIQUE (enrollment_id, class_date)
);
COMMENT ON TABLE public.attendance IS 'Records student attendance for each class.';


-- 9. Tabela de Equipamentos
CREATE TABLE IF NOT EXISTS public.equipment (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    category TEXT,
    location TEXT,
    brand TEXT,
    model TEXT,
    serial_number TEXT,
    purchase_date DATE,
    status VARCHAR(50) DEFAULT 'Operacional' -- Operacional, Manutenção, Quebrado
);
COMMENT ON TABLE public.equipment IS 'List of all academy equipment.';


-- 10. Tabela de Manutenções
CREATE TABLE IF NOT EXISTS public.maintenance (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    equipment_id INTEGER REFERENCES public.equipment(id),
    "type" VARCHAR(50), -- Preventiva, Corretiva, Emergencial
    description TEXT NOT NULL,
    scheduled_date DATE,
    completion_date DATE,
    responsible TEXT,
    cost NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'Agendada' -- Agendada, Em Andamento, Concluída, Cancelada
);
COMMENT ON TABLE public.maintenance IS 'Tracks maintenance activities for equipment.';


-- Configuração do Storage (Bucket para imagens)
-- Cria um bucket chamado 'assets' para armazenar imagens de perfil e logos.
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Acesso (Row Level Security - RLS)
-- Habilita RLS em todas as tabelas para garantir a segurança dos dados.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso para a tabela 'profiles'
-- Permite que usuários leiam todos os perfis.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (TRUE);
-- Permite que usuários atualizem seus próprios perfis.
CREATE POLICY "Users can update their own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Políticas Gerais para outras tabelas
-- Apenas um exemplo, ajuste conforme as regras de negócio da sua aplicação.
-- Aqui, estamos permitindo que qualquer usuário autenticado possa ler todas as informações.
-- E que usuários com perfil 'Administrador' ou 'Desenvolvedor' possam fazer tudo.
CREATE POLICY "Allow read access to all authenticated users" ON public.students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.students FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );

CREATE POLICY "Allow read access to all authenticated users" ON public.instructors FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.instructors FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );

CREATE POLICY "Allow read access to all authenticated users" ON public.modalities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.modalities FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );

CREATE POLICY "Allow read access to all authenticated users" ON public.classes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.classes FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );

-- Repita o padrão acima para as outras tabelas (enrollments, payments, attendance, etc.)
-- Exemplo para payments:
CREATE POLICY "Allow read access to all authenticated users" ON public.payments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.payments FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );

CREATE POLICY "Allow read access to all authenticated users" ON public.enrollments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.enrollments FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );

CREATE POLICY "Allow read access to all authenticated users" ON public.attendance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.attendance FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );

CREATE POLICY "Allow read access to all authenticated users" ON public.equipment FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.equipment FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );

CREATE POLICY "Allow read access to all authenticated users" ON public.maintenance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for Admins and Developers" ON public.maintenance FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Administrador', 'Desenvolvedor') );


-- Políticas de Acesso para o Storage (Bucket 'assets')
-- Permite que usuários autenticados visualizem arquivos.
CREATE POLICY "Authenticated users can view assets." ON storage.objects
    FOR SELECT USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Permite que usuários autenticados insiram arquivos.
CREATE POLICY "Authenticated users can upload assets." ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Permite que usuários atualizem seus próprios arquivos.
CREATE POLICY "Users can update their own assets." ON storage.objects
    FOR UPDATE USING (bucket_id = 'assets' AND auth.uid() = owner);

-- Permite que usuários deletem seus próprios arquivos.
CREATE POLICY "Users can delete their own assets." ON storage.objects
    FOR DELETE USING (bucket_id = 'assets' AND auth.uid() = owner);

-- Fim do Script
-- Script concluído com sucesso!
