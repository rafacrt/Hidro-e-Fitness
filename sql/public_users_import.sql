BEGIN;

INSERT INTO public.users (id, email, password_hash, full_name, avatar_url, role, created_at) VALUES
  ('d811be5b-bd9d-41bb-b3a1-20ec43a95418','janaina@hidro.com','$2a$10$vxLhNUV/NRI71snHy7b9vuZ8QVMxnUCu//D9pmtSEqOSuZjGqo/UO','Janaina',NULL,'user','2025-07-31 11:32:05.682489+00'),
  ('480bd3ca-1809-44d1-8855-8dc2957f695c','tecnorafa12@gmail.com','$2a$10$zLTtIgzAyEQug7YDQpRJyeAsPoRhkWhA5B/tnr2zcS9lasyO82qZy','Rafael Medeiros','/storage/avatars/480bd3ca-1809-44d1-8855-8dc2957f695c/480bd3ca-1809-44d1-8855-8dc2957f695c-0.38845846306873355.jpg','Desenvolvedor','2025-07-29 02:51:09.159563+00'),
  ('07827a3b-75e4-47b3-a15a-b26121d3e873','banda_c4_rafa@yahoo.com.br','$2a$10$s1CRSmPWuXpwrMKY856JF.huRJetPymGJBY5ZVnjWCKyPbVF4nnTW','Teste',NULL,'user','2025-07-30 23:57:29.73709+00')
ON CONFLICT (id) DO UPDATE SET
  email=EXCLUDED.email,
  password_hash=EXCLUDED.password_hash,
  full_name=EXCLUDED.full_name,
  avatar_url=EXCLUDED.avatar_url,
  role=EXCLUDED.role;

COMMIT;