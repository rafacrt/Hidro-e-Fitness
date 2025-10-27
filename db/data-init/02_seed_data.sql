-- =========================================
-- SEED DATA - Dados de Produção Migrados
-- =========================================

-- Modalities
INSERT INTO "public"."modalities" ("id", "created_at", "name", "description", "type", "status") VALUES
('1', '2025-08-12 02:02:31.568317+00', 'NATAÇÃO BEBE AVANÇADO', '', null, 'Ativa'),
('2', '2025-08-12 14:30:02.607198+00', 'NATAÇÃO ADULTO', '', null, 'Ativa'),
('5', '2025-08-13 10:42:08.658393+00', 'NATAÇÃO INFANTIL', '5 A 8 ANOS', null, 'Ativa'),
('6', '2025-08-14 09:50:09.357905+00', 'ZUMBA', 'AULAS DE RITMOS', null, 'Ativa'),
('7', '2025-08-14 09:52:38.272289+00', 'NATAÇÃO BEBE', '1 A 3 ANOS', null, 'Ativa'),
('10', '2025-09-02 14:07:17.819757+00', 'HIDROGINÁSTICA TERCEIRA IDADE', '', null, 'Ativa'),
('11', '2025-09-02 14:07:31.558509+00', 'HIDROGINÁSTICA', '', null, 'Ativa'),
('14', '2025-09-15 21:22:01.38772+00', 'Natação', 'Aulas de natação para todos os níveis', null, 'Ativa'),
('15', '2025-09-15 21:22:01.38772+00', 'Hidroginástica', 'Exercícios aquáticos de baixo impacto', null, 'Ativa'),
('16', '2025-09-15 21:22:01.38772+00', 'Aqua Aeróbica', 'Aeróbica na água', null, 'Ativa'),
('17', '2025-09-15 21:22:01.38772+00', 'Natação Infantil', 'Aulas de natação para crianças', null, 'Ativa'),
('18', '2025-09-15 21:22:01.38772+00', 'Polo Aquático', 'Esporte aquático em equipe', null, 'Ativa'),
('32', '2025-09-15 21:46:09.609107+00', 'Hidroterapia', 'Terapia aquática para reabilitação', null, 'Ativa')
ON CONFLICT (id) DO NOTHING;

-- Profiles (ligados aos users do db_system)
INSERT INTO "public"."profiles" ("id", "full_name", "avatar_url", "role") VALUES
('480bd3ca-1809-44d1-8855-8dc2957f695c', 'Rafael Medeiros', 'https://supabase.app.rajo.com.br/storage/v1/object/public/avatars/480bd3ca-1809-44d1-8855-8dc2957f695c-0.38845846306873355.jpg', 'Desenvolvedor')
ON CONFLICT (id) DO NOTHING;
