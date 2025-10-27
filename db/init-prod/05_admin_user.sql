-- Admin user e academy settings
INSERT INTO public.academy_settings (id, name)
SELECT 1, 'Hidro Fitness'
WHERE NOT EXISTS (SELECT 1 FROM public.academy_settings WHERE id = 1);

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
