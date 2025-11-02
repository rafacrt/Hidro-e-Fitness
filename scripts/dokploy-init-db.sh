#!/bin/bash
# Script para inicializar o banco de dados no ambiente Dokploy
# Executa os scripts SQL de inicialização dentro do container do banco de dados

echo "Inicializando banco de dados no Dokploy..."

# Nome do container - ajuste conforme necessário
CONTAINER_NAME=$(docker ps | grep -E 'postgres.*hidro' | awk '{print $1}')
DB_USER="postgres"
DB_NAME="hidrofitness"

if [ -z "$CONTAINER_NAME" ]; then
  echo "Erro: Container do PostgreSQL não encontrado!"
  exit 1
fi

echo "Container encontrado: $CONTAINER_NAME"

# Espera o banco estar pronto
echo "Aguardando o banco de dados ficar disponível..."
docker exec $CONTAINER_NAME pg_isready -U $DB_USER -d $DB_NAME -t 30

# Executa os scripts de inicialização
echo "Executando scripts de inicialização..."

# Schema principal
echo "Criando schema..."
cat ./db/init-prod/01_schema.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados iniciais
echo "Inserindo dados iniciais..."
cat ./db/init-prod/02_seed_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Configurações da academia
echo "Criando tabela academy_settings..."
cat << EOF | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME
CREATE TABLE IF NOT EXISTS public.academy_settings (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.academy_settings (id, name)
SELECT 1, 'Hidro Fitness'
WHERE NOT EXISTS (SELECT 1 FROM public.academy_settings WHERE id = 1);
EOF

# Dados de alunos
echo "Inserindo dados de alunos..."
cat ./db/init-prod/03_students_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados de planos
echo "Inserindo dados de planos..."
cat ./db/init-prod/04_plans_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados de planos de alunos
echo "Inserindo dados de planos de alunos..."
cat ./db/init-prod/05_student_plans_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados de pagamentos
echo "Inserindo dados de pagamentos..."
cat ./db/init-prod/06_payments_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Usuário admin
echo "Criando usuário admin..."
cat ./db/init-prod/07_admin_user.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

echo "Inicialização do banco de dados concluída!"