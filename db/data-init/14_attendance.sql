-- Attendance: presenças vinculadas à matrícula (enrollment)
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL,
  session_date date NOT NULL DEFAULT CURRENT_DATE, -- data da aula/sessão
  attended_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'presente', -- presente | ausente | justificado
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_attendance_enrollment FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE,
  CONSTRAINT uq_attendance_per_day UNIQUE (enrollment_id, session_date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_enrollment ON public.attendance (enrollment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session_date ON public.attendance (session_date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance (status);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_attendance_updated_at'
  ) THEN
    -- reutiliza a função public.set_updated_at() existente
    CREATE TRIGGER set_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;