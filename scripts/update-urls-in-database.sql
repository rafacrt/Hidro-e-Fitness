-- Script para atualizar URLs antigos do Supabase Storage no banco de dados
-- Execute este script se você já tiver dados importados com URLs antigos

-- Atualizar avatar_url na tabela profiles
UPDATE public.profiles 
SET avatar_url = REPLACE(
  avatar_url, 
  'https://supabase.app.rajo.com.br/storage/v1/object/public/avatars/', 
  '/storage/avatars/'
)
WHERE avatar_url LIKE 'https://supabase.app.rajo.com.br/storage/v1/object/public/avatars/%';

-- Atualizar avatar_url na tabela users (se existir)
UPDATE public.users 
SET avatar_url = REPLACE(
  avatar_url, 
  'https://supabase.app.rajo.com.br/storage/v1/object/public/avatars/', 
  '/storage/avatars/'
)
WHERE avatar_url LIKE 'https://supabase.app.rajo.com.br/storage/v1/object/public/avatars/%';

-- Atualizar logo_url na tabela academy_settings
UPDATE public.academy_settings 
SET logo_url = REPLACE(
  logo_url, 
  'https://supabase.app.rajo.com.br/storage/v1/object/public/logos/', 
  '/storage/logos/system/'
)
WHERE logo_url LIKE 'https://supabase.app.rajo.com.br/storage/v1/object/public/logos/%';

-- Verificar os resultados
SELECT 'profiles' as tabela, COUNT(*) as total_registros, 
       COUNT(CASE WHEN avatar_url LIKE '/storage/avatars/%' THEN 1 END) as urls_locais,
       COUNT(CASE WHEN avatar_url LIKE 'https://supabase%' THEN 1 END) as urls_supabase
FROM public.profiles
WHERE avatar_url IS NOT NULL

UNION ALL

SELECT 'users' as tabela, COUNT(*) as total_registros,
       COUNT(CASE WHEN avatar_url LIKE '/storage/avatars/%' THEN 1 END) as urls_locais,
       COUNT(CASE WHEN avatar_url LIKE 'https://supabase%' THEN 1 END) as urls_supabase
FROM public.users
WHERE avatar_url IS NOT NULL

UNION ALL

SELECT 'academy_settings' as tabela, COUNT(*) as total_registros,
       COUNT(CASE WHEN logo_url LIKE '/storage/logos/%' THEN 1 END) as urls_locais,
       COUNT(CASE WHEN logo_url LIKE 'https://supabase%' THEN 1 END) as urls_supabase
FROM public.academy_settings
WHERE logo_url IS NOT NULL;