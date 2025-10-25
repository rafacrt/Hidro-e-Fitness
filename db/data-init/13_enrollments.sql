-- Enrollments: vincula alunos a turmas
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  class_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'ativo', -- ativo | inativo | lista_espera | cancelado
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_class FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE,
  CONSTRAINT uq_enrollment UNIQUE (student_id, class_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments (student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON public.enrollments (class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments (status);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_enrollments_updated_at'
  ) THEN
    -- reutiliza a função public.set_updated_at() já criada nos outros scripts
    CREATE TRIGGER set_enrollments_updated_at
    BEFORE UPDATE ON public.enrollments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;