-- Migração de presenças do formato legado (student_id + class_id + date + status)
-- Este script pressupõe que os dados antigos tenham sido carregados em public.legacy_attendance
-- Estrutura esperada de public.legacy_attendance:
--   id uuid (opcional), student_id uuid, class_id uuid, date date, status text ('presente'|'ausente'|'justificado'),
--   notes text, created_at timestamptz
--
-- Passos para importar dados antigos:
-- 1) Exporte suas presenças antigas para CSV (colunas: student_id,class_id,date,status,notes,created_at)
-- 2) Copie o arquivo CSV para dentro do container db_data (ex.: /tmp/legacy_attendance.csv)
-- 3) No psql do db_data, execute:
--    CREATE TABLE IF NOT EXISTS public.legacy_attendance(
--      student_id uuid NOT NULL,
--      class_id uuid NOT NULL,
--      date date NOT NULL,
--      status text NOT NULL,
--      notes text,
--      created_at timestamptz
--    );
--    \copy public.legacy_attendance(student_id, class_id, date, status, notes, created_at) FROM '/tmp/legacy_attendance.csv' WITH (FORMAT csv, HEADER true);
-- 4) Este arquivo (20_migrate_legacy_attendance.sql) cuidará de:
--    - Criar matrículas (enrollments) para cada par (student_id, class_id) ausente
--    - Inserir presenças na nova tabela public.attendance vinculadas a enrollment_id
--

-- 1) Garante a existência da tabela de staging caso deseje inserir manualmente antes
CREATE TABLE IF NOT EXISTS public.legacy_attendance (
  student_id uuid NOT NULL,
  class_id uuid NOT NULL,
  date date NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamptz
);

-- 2) Cria/garante as matrículas para cada par único (student_id, class_id) presente na staging
WITH pairs AS (
  SELECT DISTINCT la.student_id, la.class_id
  FROM public.legacy_attendance la
)
INSERT INTO public.enrollments (id, student_id, class_id, status, enrolled_at, updated_at)
SELECT gen_random_uuid(), p.student_id, p.class_id, 'ativo', COALESCE(min_la_created_at, now()), now()
FROM (
  SELECT p.student_id, p.class_id,
         (SELECT MIN(created_at) FROM public.legacy_attendance la2 WHERE la2.student_id = p.student_id AND la2.class_id = p.class_id) AS min_la_created_at
  FROM pairs p
) p
LEFT JOIN public.enrollments e
  ON e.student_id = p.student_id AND e.class_id = p.class_id
WHERE e.id IS NULL;

-- 3) Migra as presenças, mantendo status em PT-BR e vinculando ao enrollment_id
INSERT INTO public.attendance (id, enrollment_id, session_date, attended_at, status, notes, created_at, updated_at)
SELECT gen_random_uuid(), e.id, la.date::date,
       COALESCE(la.created_at, now()),
       CASE la.status
         WHEN 'presente' THEN 'presente'
         WHEN 'ausente' THEN 'ausente'
         WHEN 'justificado' THEN 'justificado'
         ELSE 'presente'
       END,
       la.notes,
       COALESCE(la.created_at, now()),
       now()
FROM public.legacy_attendance la
JOIN public.enrollments e
  ON e.student_id = la.student_id AND e.class_id = la.class_id
ON CONFLICT ON CONSTRAINT uq_attendance_per_day DO NOTHING;

-- Observação: ON CONFLICT evita duplicidade por (enrollment_id, session_date), deixando a migração idempotente.