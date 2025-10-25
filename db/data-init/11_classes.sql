-- Classes table (operational)
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  modality text, -- e.g. "Hidro", "Musculação"
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  capacity int CHECK (capacity IS NULL OR capacity >= 0),
  status text NOT NULL DEFAULT 'ativa', -- ativa | inativa
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_name ON public.classes (name);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_classes_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION public.set_updated_at()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      NEW.updated_at := now();
      RETURN NEW;
    END;$$;

    CREATE TRIGGER set_classes_updated_at
    BEFORE UPDATE ON public.classes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;