-- Make users.password_hash nullable to allow migration of accounts without known passwords
ALTER TABLE IF EXISTS public.users
  ALTER COLUMN password_hash DROP NOT NULL;