-- Academy Settings table (single-row config)
CREATE TABLE IF NOT EXISTS public.academy_settings (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed initial row if not exists
INSERT INTO public.academy_settings (id, name)
SELECT 1, 'Hidro Fitness'
WHERE NOT EXISTS (SELECT 1 FROM public.academy_settings WHERE id = 1);