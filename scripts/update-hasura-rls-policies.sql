-- Script para atualizar políticas RLS do Hasura para usar roles admin/user
-- Este script padroniza as políticas para funcionar com o novo sistema de autenticação local

-- Remover políticas antigas que usam 'authenticated' (do Supabase)
DROP POLICY IF EXISTS "Allow authenticated users to read data" ON students;
DROP POLICY IF EXISTS "Allow authenticated users to read data" ON instructors;
DROP POLICY IF EXISTS "Allow authenticated users to read data" ON modalities;
DROP POLICY IF EXISTS "Allow authenticated users to read data" ON classes;
DROP POLICY IF EXISTS "Allow authenticated users to modify data" ON students;
DROP POLICY IF EXISTS "Allow authenticated users to modify data" ON instructors;
DROP POLICY IF EXISTS "Allow authenticated users to modify data" ON modalities;
DROP POLICY IF EXISTS "Allow authenticated users to modify data" ON classes;
DROP POLICY IF EXISTS "Allow authenticated users to manage attendance" ON attendance;
DROP POLICY IF EXISTS "Authenticated users can manage students." ON students;
DROP POLICY IF EXISTS "Authenticated users can manage instructors." ON instructors;
DROP POLICY IF EXISTS "Authenticated users can manage modalities." ON modalities;
DROP POLICY IF EXISTS "Authenticated users can manage classes." ON classes;
DROP POLICY IF EXISTS "Authenticated users can manage enrollments." ON enrollments;
DROP POLICY IF EXISTS "Authenticated users can manage payments." ON payments;
DROP POLICY IF EXISTS "Authenticated users can manage equipments." ON equipments;
DROP POLICY IF EXISTS "Authenticated users can manage maintenance." ON maintenance_schedules;
DROP POLICY IF EXISTS "Authenticated users can manage plans." ON plans;
DROP POLICY IF EXISTS "Authenticated users can manage student plans." ON student_plans;

-- Habilitar RLS em todas as tabelas principais
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS PARA TABELA USERS
-- ========================================

-- Admins podem ver todos os usuários, users só podem ver a si mesmos
CREATE POLICY "users_select_policy" ON public.users
FOR SELECT USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
  OR 
  id::text = current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id'
);

-- Admins podem inserir usuários, users não podem
CREATE POLICY "users_insert_policy" ON public.users
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- Admins podem atualizar qualquer usuário, users só podem atualizar a si mesmos
CREATE POLICY "users_update_policy" ON public.users
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
  OR 
  id::text = current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id'
);

-- Apenas admins podem deletar usuários
CREATE POLICY "users_delete_policy" ON public.users
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- ========================================
-- POLÍTICAS PARA TABELA PROFILES
-- ========================================

-- Todos podem ver perfis (informações públicas)
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (true);

-- Admins podem inserir perfis, users podem inserir apenas o próprio
CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
  OR 
  id::text = current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id'
);

-- Admins podem atualizar qualquer perfil, users só o próprio
CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
  OR 
  id::text = current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id'
);

-- Apenas admins podem deletar perfis
CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- ========================================
-- POLÍTICAS PARA DADOS OPERACIONAIS
-- ========================================

-- Para tabelas operacionais (students, instructors, modalities, classes, etc.)
-- Admins têm acesso total, users têm acesso de leitura

-- STUDENTS
CREATE POLICY "students_select_policy" ON public.students
FOR SELECT USING (true); -- Todos podem ver alunos

CREATE POLICY "students_insert_policy" ON public.students
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "students_update_policy" ON public.students
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "students_delete_policy" ON public.students
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- INSTRUCTORS
CREATE POLICY "instructors_select_policy" ON public.instructors
FOR SELECT USING (true);

CREATE POLICY "instructors_insert_policy" ON public.instructors
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "instructors_update_policy" ON public.instructors
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "instructors_delete_policy" ON public.instructors
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- MODALITIES
CREATE POLICY "modalities_select_policy" ON public.modalities
FOR SELECT USING (true);

CREATE POLICY "modalities_insert_policy" ON public.modalities
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "modalities_update_policy" ON public.modalities
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "modalities_delete_policy" ON public.modalities
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- CLASSES
CREATE POLICY "classes_select_policy" ON public.classes
FOR SELECT USING (true);

CREATE POLICY "classes_insert_policy" ON public.classes
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "classes_update_policy" ON public.classes
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "classes_delete_policy" ON public.classes
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- ENROLLMENTS
CREATE POLICY "enrollments_select_policy" ON public.enrollments
FOR SELECT USING (true);

CREATE POLICY "enrollments_insert_policy" ON public.enrollments
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "enrollments_update_policy" ON public.enrollments
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "enrollments_delete_policy" ON public.enrollments
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- PAYMENTS
CREATE POLICY "payments_select_policy" ON public.payments
FOR SELECT USING (true);

CREATE POLICY "payments_insert_policy" ON public.payments
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "payments_update_policy" ON public.payments
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "payments_delete_policy" ON public.payments
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- EQUIPMENTS
CREATE POLICY "equipments_select_policy" ON public.equipments
FOR SELECT USING (true);

CREATE POLICY "equipments_insert_policy" ON public.equipments
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "equipments_update_policy" ON public.equipments
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "equipments_delete_policy" ON public.equipments
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- MAINTENANCE_SCHEDULES
CREATE POLICY "maintenance_schedules_select_policy" ON public.maintenance_schedules
FOR SELECT USING (true);

CREATE POLICY "maintenance_schedules_insert_policy" ON public.maintenance_schedules
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "maintenance_schedules_update_policy" ON public.maintenance_schedules
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "maintenance_schedules_delete_policy" ON public.maintenance_schedules
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- PLANS
CREATE POLICY "plans_select_policy" ON public.plans
FOR SELECT USING (true);

CREATE POLICY "plans_insert_policy" ON public.plans
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "plans_update_policy" ON public.plans
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "plans_delete_policy" ON public.plans
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- STUDENT_PLANS
CREATE POLICY "student_plans_select_policy" ON public.student_plans
FOR SELECT USING (true);

CREATE POLICY "student_plans_insert_policy" ON public.student_plans
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "student_plans_update_policy" ON public.student_plans
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "student_plans_delete_policy" ON public.student_plans
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- ATTENDANCE
CREATE POLICY "attendance_select_policy" ON public.attendance
FOR SELECT USING (true);

CREATE POLICY "attendance_insert_policy" ON public.attendance
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "attendance_update_policy" ON public.attendance
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "attendance_delete_policy" ON public.attendance
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- REPORTS
CREATE POLICY "reports_select_policy" ON public.reports
FOR SELECT USING (true);

CREATE POLICY "reports_insert_policy" ON public.reports
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "reports_update_policy" ON public.reports
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "reports_delete_policy" ON public.reports
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- ACADEMY_SETTINGS
CREATE POLICY "academy_settings_select_policy" ON public.academy_settings
FOR SELECT USING (true); -- Todos podem ver configurações da academia

CREATE POLICY "academy_settings_insert_policy" ON public.academy_settings
FOR INSERT WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "academy_settings_update_policy" ON public.academy_settings
FOR UPDATE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

CREATE POLICY "academy_settings_delete_policy" ON public.academy_settings
FOR DELETE USING (
  current_setting('request.jwt.claims', true)::json->>'x-hasura-default-role' = 'admin'
);

-- ========================================
-- VERIFICAÇÃO DAS POLÍTICAS
-- ========================================

-- Query para verificar todas as políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;