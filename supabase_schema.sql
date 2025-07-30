-- Tabela de Perfis (complementa a tabela auth.users do Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT,
  updated_at TIMESTAMPTZ
);

-- Tabela de Alunos
CREATE TABLE students (
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

-- Tabela de Professores/Instrutores
CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    specialties JSONB,
    availability JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Modalidades
CREATE TABLE modalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Turmas
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    modality_id UUID REFERENCES modalities(id) ON DELETE SET NULL,
    instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week TEXT[] NOT NULL,
    location TEXT,
    max_students INT,
    status TEXT DEFAULT 'ativa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Matrículas (associa Alunos a Turmas)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, class_id)
);

-- Tabela de Pagamentos/Transações
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL, -- 'receita' ou 'despesa'
    due_date DATE NOT NULL,
    paid_at DATE,
    category TEXT,
    payment_method TEXT,
    status TEXT DEFAULT 'pendente', -- 'pago', 'pendente', 'vencido'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Equipamentos
CREATE TABLE equipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    location TEXT,
    brand TEXT,
    model TEXT,
    serial_number TEXT,
    installation_date DATE,
    status TEXT DEFAULT 'operacional', -- 'operacional', 'manutencao', 'quebrado'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Agendamentos de Manutenção
CREATE TABLE maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipments(id) ON DELETE CASCADE,
    type TEXT, -- 'preventiva', 'corretiva', 'emergencial'
    priority TEXT DEFAULT 'baixa',
    description TEXT,
    scheduled_date DATE,
    responsible TEXT,
    cost NUMERIC(10, 2),
    status TEXT DEFAULT 'agendada', -- 'agendada', 'em_andamento', 'concluida', 'cancelada'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Relatórios
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    times_generated INT DEFAULT 0,
    last_generated_at TIMESTAMPTZ
);

-- Tabela para Configurações Gerais da Academia
CREATE TABLE academy_settings (
  id INT PRIMARY KEY DEFAULT 1, -- Garante que haverá apenas uma linha
  name TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Inserir dados de exemplo iniciais
INSERT INTO academy_settings (name) VALUES ('Hidro Fitness');

-- Função para criar um perfil para cada novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando um novo usuário se cadastra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS (Row-Level Security) para as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
-- Exemplo: Permitir que usuários autenticados leiam tudo
CREATE POLICY "Allow authenticated users to read data" ON students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read data" ON instructors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read data" ON modalities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read data" ON classes FOR SELECT TO authenticated USING (true);

-- Permitir que usuários autenticados modifiquem dados (exemplo mais restritivo seria melhor em produção)
CREATE POLICY "Allow authenticated users to modify data" ON students FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify data" ON instructors FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify data" ON modalities FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify data" ON classes FOR ALL TO authenticated USING (true);


-- Configuração do Storage para Avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' );
