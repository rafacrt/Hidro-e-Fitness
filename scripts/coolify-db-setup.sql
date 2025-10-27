-- Script para ajustar credenciais no Postgres do Coolify SEM perder dados
-- Execute estes comandos no terminal do container Postgres no Coolify

-- 1. Criar/alterar o usuário hf_app com a nova senha
CREATE USER hf_app WITH PASSWORD 'P@ssw0rd2024!HF_Secure';

-- Se o usuário já existir, use ALTER ao invés de CREATE:
-- ALTER USER hf_app WITH PASSWORD 'P@ssw0rd2024!HF_Secure';

-- 2. Conceder todas as permissões necessárias
GRANT ALL PRIVILEGES ON DATABASE hidro_fitness_db TO hf_app;
GRANT ALL PRIVILEGES ON SCHEMA public TO hf_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hf_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hf_app;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO hf_app;

-- 3. Garantir permissões futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO hf_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO hf_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO hf_app;

-- 4. Verificar se a tabela academy_settings existe
SELECT * FROM academy_settings LIMIT 1;

-- 5. Se não existir, criar e inserir dados iniciais:
-- CREATE TABLE IF NOT EXISTS academy_settings (
--     id INTEGER PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     logo_url TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT single_row CHECK (id = 1)
-- );
-- 
-- INSERT INTO academy_settings (id, name, logo_url) 
-- VALUES (1, 'Hidro Fitness', null) 
-- ON CONFLICT (id) DO NOTHING;