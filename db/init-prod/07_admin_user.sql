-- Admin users e academy settings
INSERT INTO public.academy_settings (id, name)
SELECT 1, 'Hidro Fitness'
WHERE NOT EXISTS (SELECT 1 FROM public.academy_settings WHERE id = 1);

-- Admin principal
INSERT INTO public.users (email, password_hash, full_name, role)
VALUES (
  'admin@hidrofitness.com',
  '$2a$10$AHozTx7OFYZM9nJa8.lbo.K6XaDOyxGJk/.YjubAndcDqP5nbodDa',
  'Administrador',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Janaina
INSERT INTO public.users (email, password_hash, full_name, role)
VALUES (
  'academiahidrofitness86@gmail.com',
  '$2a$10$JBjtResDEYaar9FTnmDC0ejfuohfPEUy6H3n5/zrxa2RzfJAp8vUO',
  'Janaina',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
