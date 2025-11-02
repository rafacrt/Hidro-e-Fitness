# Script para inicializar o banco de dados no ambiente Dokploy (Windows)
# Executa os scripts SQL de inicialização dentro do container do banco de dados

Write-Host "Inicializando banco de dados no Dokploy..." -ForegroundColor Green

# Detecta o container automaticamente
$CONTAINER_NAME = (docker ps | Select-String -Pattern "postgres.*hidro").ToString().Split()[0]
$DB_USER = "postgres"
$DB_NAME = "hidrofitness"

if (-not $CONTAINER_NAME) {
    Write-Host "Erro: Container do PostgreSQL não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "Container encontrado: $CONTAINER_NAME" -ForegroundColor Cyan

# Espera o banco estar pronto
Write-Host "Aguardando o banco de dados ficar disponível..." -ForegroundColor Yellow
docker exec $CONTAINER_NAME pg_isready -U $DB_USER -d $DB_NAME -t 30

# Executa os scripts de inicialização
Write-Host "Executando scripts de inicialização..." -ForegroundColor Yellow

# Schema principal
Write-Host "Criando schema..." -ForegroundColor Cyan
Get-Content .\db\init-prod\01_schema.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados iniciais
Write-Host "Inserindo dados iniciais..." -ForegroundColor Cyan
Get-Content .\db\init-prod\02_seed_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Configurações da academia
Write-Host "Criando tabela academy_settings..." -ForegroundColor Cyan
$academySettingsSQL = @"
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
"@

$academySettingsSQL | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados de alunos
Write-Host "Inserindo dados de alunos..." -ForegroundColor Cyan
Get-Content .\db\init-prod\03_students_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados de planos
Write-Host "Inserindo dados de planos..." -ForegroundColor Cyan
Get-Content .\db\init-prod\04_plans_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados de planos de alunos
Write-Host "Inserindo dados de planos de alunos..." -ForegroundColor Cyan
Get-Content .\db\init-prod\05_student_plans_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Dados de pagamentos
Write-Host "Inserindo dados de pagamentos..." -ForegroundColor Cyan
Get-Content .\db\init-prod\06_payments_data.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

# Usuário admin
Write-Host "Criando usuário admin..." -ForegroundColor Cyan
Get-Content .\db\init-prod\07_admin_user.sql | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

Write-Host "Inicialização do banco de dados concluída!" -ForegroundColor Green