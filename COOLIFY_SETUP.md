# Configuração no Coolify - Arquitetura 2 Bancos

Este documento contém as instruções para configurar corretamente as variáveis de ambiente no Coolify com a nova arquitetura de 2 bancos de dados separados.

## 🏗️ Arquitetura

O sistema agora usa **2 bancos de dados PostgreSQL separados**:

### 📊 db_system (Banco de Sistema)
- **Conteúdo**: users, academy_settings
- **Backup**: Semanal (domingos às 3h) em formato SQL
- **Retenção**: Últimas 3 versões
- **Volume**: `db_system_data`

### 📈 db_data (Banco de Dados Transacionais)
- **Conteúdo**: students, instructors, modalities, classes, enrollments, payments, payment_methods, equipments, maintenance_schedules, plans, student_plans, attendance, profiles
- **Backup**: Diário (às 3h) em formato JSON
- **Retenção**: Últimas 3 versões
- **Volume**: `db_data_data`

---

## 📋 Variáveis de Ambiente Obrigatórias

Configure estas variáveis na seção **Environment Variables** do Coolify:

### 1. Banco de Sistema (db_system)

```bash
DB_SYSTEM_USER=postgres
DB_SYSTEM_PASSWORD=SuaSenhaSeguraAqui123!@#
DB_SYSTEM_NAME=hidro_system
```

### 2. Banco de Dados (db_data)

```bash
DB_DATA_USER=postgres
DB_DATA_PASSWORD=OutraSenhaSeguraAqui456!@#
DB_DATA_NAME=hidro_data
```

### 3. Hasura Admin Secret

```bash
HASURA_ADMIN_SECRET=d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4
```

### 4. JWT Secret (CRÍTICO!)

```bash
JWT_SECRET=9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```

⚠️ **MUITO IMPORTANTE**:
- O JWT_SECRET **DEVE TER NO MÍNIMO 32 CARACTERES**
- Use EXATAMENTE o valor acima ou gere um novo com 64+ caracteres
- **NÃO** adicione a variável `HASURA_GRAPHQL_JWT_SECRET` - ela é gerada automaticamente pelo docker-compose

---

## ⚠️ Problemas Comuns

### Erro: "Invalid JWK: key size too small; should be atleast 32 characters"
**Causa**: JWT_SECRET com menos de 32 caracteres
**Solução**: Use a variável JWT_SECRET acima (64 caracteres)

### Erro: "password authentication failed for user postgres"
**Causa**: Credenciais do banco de dados incorretas
**Solução**: Verifique as variáveis DB_SYSTEM_* e DB_DATA_*

### ⚠️ CRÍTICO - Primeiro Deploy com 2 Bancos

Se você está migrando de 1 banco para 2 bancos:

**Opção A - Deploy Limpo (Recomendado):**
1. No Coolify, vá em **Storage → Volumes**
2. Delete os volumes antigos: `db_data`, `postgres_data` (se existirem)
3. Configure as novas variáveis de ambiente (DB_SYSTEM_* e DB_DATA_*)
4. Clique em **Reload Compose File** (importante!)
5. Redeploy
6. Os 2 novos volumes serão criados automaticamente: `db_system_data` e `db_data_data`

**Opção B - Migrar Dados Manualmente:**
1. Faça backup do banco antigo
2. Delete volume antigo
3. Deploy com 2 bancos novos
4. Restaure os dados manualmente nas tabelas corretas

---

## 🔐 Como Gerar Novos Secrets

Se preferir gerar seus próprios valores aleatórios:

### No Linux/Mac/Git Bash:
```bash
# Para JWT_SECRET (64 caracteres hexadecimais)
openssl rand -hex 32

# Para HASURA_ADMIN_SECRET (64 caracteres hexadecimais)
openssl rand -hex 32

# Para DB_SYSTEM_PASSWORD
openssl rand -base64 32

# Para DB_DATA_PASSWORD
openssl rand -base64 32
```

### No PowerShell (Windows):
```powershell
# Para JWT_SECRET (64 caracteres)
-join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})

# Para HASURA_ADMIN_SECRET (64 caracteres)
-join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})

# Para senhas do banco
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

---

## ✅ Checklist de Configuração

Antes de fazer o Redeploy, verifique:

### Banco de Sistema (db_system)
- [ ] `DB_SYSTEM_USER` está definido
- [ ] `DB_SYSTEM_PASSWORD` está definido
- [ ] `DB_SYSTEM_NAME` está definido (sugestão: `hidro_system`)

### Banco de Dados (db_data)
- [ ] `DB_DATA_USER` está definido
- [ ] `DB_DATA_PASSWORD` está definido
- [ ] `DB_DATA_NAME` está definido (sugestão: `hidro_data`)

### Secrets
- [ ] `HASURA_ADMIN_SECRET` tem 64 caracteres
- [ ] `JWT_SECRET` tem **NO MÍNIMO 32 caracteres** (recomendado 64)
- [ ] **NÃO existe** a variável `HASURA_GRAPHQL_JWT_SECRET` (será criada automaticamente)

### Coolify
- [ ] Clicou em **"Reload Compose File"** (IMPORTANTE para reconhecer os novos serviços)
- [ ] Volumes antigos deletados (se for primeiro deploy com 2 bancos)

---

## 🚀 Processo de Deploy

1. **Configure as variáveis de ambiente** com os valores acima
2. **Delete volumes antigos** (se existirem): `db_data`, `postgres_data`
3. **Clique em "Reload Compose File"** (muito importante!)
4. **Clique em "Redeploy"**
5. Aguarde o build e inicialização dos containers
6. Verifique os logs

---

## 🔍 Verificação dos Logs

### Logs do Hasura (deve aparecer):
```json
"jwt_secret":[{"type":"HS256","key":"<JWK REDACTED>"}]
```

### Logs do App (deve aparecer):
```
🔄 Initializing Hasura metadata...
⏳ Waiting for Hasura to be ready...
✅ Hasura is ready!
📊 Adding db_data as Hasura source...
🔄 Tracking tables in db_system (default source)...
📊 Tracking table: users
📊 Tracking table: academy_settings
🔄 Tracking tables in db_data...
📊 Tracking table: profiles
📊 Tracking table: students
...
✅ All tables tracked in Hasura!
🚀 Hasura initialization complete!
🌐 Starting Next.js application...
✓ Ready in XXXms
```

### Logs do backup_data (deve aparecer diariamente às 3h):
```
📅 Daily JSON backup service started. Will run at 3 AM
```

### Logs do backup_system (deve aparecer aos domingos às 3h):
```
📅 Weekly SQL backup service started. Will run on Sundays at 3 AM
```

### ❌ Erros que NÃO devem aparecer:
- ❌ `not enough input`
- ❌ `Invalid JWK: key size too small`
- ❌ `password authentication failed`
- ❌ `relation does not exist`

---

## 💾 Backups

### Backup Automático do db_data (Diário)
- **Formato**: JSON
- **Frequência**: Todos os dias às 3h da manhã
- **Retenção**: Últimas 3 versões
- **Localização**: `/app/storage/backups/data/`
- **Arquivo**: `data_YYYYMMDD_HHMMSS.json.gz`

### Backup Automático do db_system (Semanal)
- **Formato**: SQL
- **Frequência**: Domingos às 3h da manhã
- **Retenção**: Últimas 3 versões
- **Localização**: `/app/storage/backups/system/`
- **Arquivo**: `system_YYYYMMDD_HHMMSS.sql.gz`

### Como Acessar os Backups

No Coolify, acesse o container do app:
```bash
# Listar backups de dados
ls -lh /app/storage/backups/data/

# Listar backups de sistema
ls -lh /app/storage/backups/system/

# Copiar backup para sua máquina local
docker cp <container_name>:/app/storage/backups/data/data_20250127_030000.json.gz ./
```

---

## 🔑 Credenciais Padrão

Após o primeiro deploy, o sistema cria automaticamente um usuário admin:

- **Email**: admin@hidrofitness.com
- **Senha**: admin123

⚠️ **ALTERE A SENHA** após o primeiro login!

---

## 📞 Suporte

Se continuar com problemas:

1. Verifique se as variáveis estão exatamente como neste documento
2. Confirme que clicou em **"Reload Compose File"** antes do Redeploy
3. Verifique os logs do db_system, db_data, hasura, app, backup_data e backup_system separadamente
4. Certifique-se de que deletou os volumes antigos antes do primeiro deploy com 2 bancos
5. Confirme que os 2 novos volumes foram criados: `db_system_data` e `db_data_data`
