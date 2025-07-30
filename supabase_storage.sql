-- POLÍTICAS DE ACESSO PARA O BUCKET 'avatars'
-- Este bucket armazena as fotos de perfil dos usuários.

-- 1. Permite acesso público de leitura (SELECT)
-- Qualquer pessoa pode visualizar os avatares, mesmo sem estar logada.
-- Isso é necessário para que as imagens possam ser exibidas publicamente na aplicação.
CREATE POLICY "Public Read Access for Avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 2. Permite que usuários autenticados façam upload (INSERT) de seus próprios avatares
-- A política verifica se o `uid()` do usuário logado corresponde ao primeiro segmento do nome do arquivo.
-- Exemplo de nome de arquivo: 0bf3f45b-7221-492c-a698-4a6f8a84c2a3-1678886400000.png
CREATE POLICY "Authenticated User Can Upload Avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid );

-- 3. Permite que usuários autenticados atualizem (UPDATE) seus próprios avatares
CREATE POLICY "Authenticated User Can Update Avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid );

-- 4. Permite que usuários autenticados excluam (DELETE) seus próprios avatares
CREATE POLICY "Authenticated User Can Delete Avatar"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid );


-- POLÍTICAS DE ACESSO PARA O BUCKET 'logos'
-- Este bucket armazena o logo da academia.

-- 1. Permite acesso público de leitura (SELECT) para o logo
CREATE POLICY "Public Read Access for Logos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'logos' );

-- 2. Permite que qualquer usuário autenticado faça upload (INSERT) de um novo logo
-- Como o logo é um recurso global da academia, qualquer usuário logado com acesso
-- à página de configurações pode alterá-lo.
CREATE POLICY "Authenticated User Can Upload Logo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'logos' );

-- 3. Permite que qualquer usuário autenticado atualize (UPDATE) o logo
CREATE POLICY "Authenticated User Can Update Logo"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'logos' );

-- 4. Permite que qualquer usuário autenticado exclua (DELETE) o logo
CREATE POLICY "Authenticated User Can Delete Logo"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'logos' );
