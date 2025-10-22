BEGIN;

INSERT INTO public.profiles (id, full_name, avatar_url, role) VALUES
  ('07827a3b-75e4-47b3-a15a-b26121d3e873', 'Teste', NULL, 'user'),
  ('480bd3ca-1809-44d1-8855-8dc2957f695c', 'Rafael Medeiros', 'https://supabase.app.rajo.com.br/storage/v1/object/public/avatars/480bd3ca-1809-44d1-8855-8dc2957f695c-0.38845846306873355.jpg', 'Desenvolvedor'),
  ('d811be5b-bd9d-41bb-b3a1-20ec43a95418', 'Janaina', NULL, 'user')
ON CONFLICT (id) DO UPDATE SET
  full_name=EXCLUDED.full_name,
  avatar_url=EXCLUDED.avatar_url,
  role=EXCLUDED.role;

COMMIT;