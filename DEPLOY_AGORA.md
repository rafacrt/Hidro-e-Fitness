# 🚀 DEPLOY AGORA - Guia Rápido

## ✅ O Que Foi Feito

Sistema foi **SIMPLIFICADO** de 2 bancos para **1 banco único**:

- ✅ Todos os 169 alunos prontos para importar (backup convertido)
- ✅ Todos os 69 planos prontos
- ✅ Todas as 13 modalidades prontas
- ✅ Arquitetura igual ao desenvolvimento local (mais simples)
- ✅ Sem problemas de volume entre 2 bancos
- ✅ Admin users criados automaticamente (admin + Janaina)

---

## 🔧 PASSO A PASSO NO COOLIFY

### 1️⃣ Deletar TODOS os Volumes

No Coolify, vá em **Storage → Volumes** e delete:
- ❌ Qualquer volume com "db" no nome
- ❌ Qualquer volume com "data" no nome
- ❌ Qualquer volume com "system" no nome
- ❌ TODOS os volumes do projeto

**IMPORTANTE:** Deletar tudo mesmo! Volumes antigos causam erro de senha.

---

### 2️⃣ Configurar Variáveis de Ambiente

Delete as variáveis antigas e configure APENAS estas:

```bash
# PostgreSQL (1 banco só)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=suaSenhaAqui123
POSTGRES_DB=hidrofitness

# Hasura
HASURA_ADMIN_SECRET=d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4

# JWT
JWT_SECRET=9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```

**Deletar estas variáveis** (se existirem):
- ❌ DB_SYSTEM_USER
- ❌ DB_SYSTEM_PASSWORD
- ❌ DB_SYSTEM_NAME
- ❌ DB_DATA_USER
- ❌ DB_DATA_PASSWORD
- ❌ DB_DATA_NAME
- ❌ HASURA_GRAPHQL_JWT_SECRET

---

### 3️⃣ Reload Compose File

No Coolify, clique em:
**"Reload Compose File"** ou **"Recarregar Arquivo Compose"**

Isso é **OBRIGATÓRIO** para o Coolify ler a nova estrutura!

---

### 4️⃣ Redeploy

Clique em **"Redeploy"** e aguarde 2-3 minutos.

---

## 📊 O Que Vai Acontecer

```
1. Container db inicia
2. PostgreSQL cria banco "hidrofitness"
3. Executa db/init-prod/01_schema.sql → Cria TODAS as tabelas
4. Executa db/init-prod/02_seed_data.sql → 13 modalidades
5. Executa db/init-prod/03_students_data.sql → 169 alunos (backup)
6. Executa db/init-prod/04_plans_data.sql → 69 planos
7. Executa db/init-prod/05_student_plans_data.sql → associações
8. Executa db/init-prod/06_payments_data.sql → 2 pagamentos
9. Executa db/init-prod/07_admin_user.sql → admin + Janaina
10. Container hasura conecta ao banco
11. Container app inicia
12. Sistema pronto! 🎉
```

---

## ✅ Verificação nos Logs

### Logs do **db**:
```
database system is ready to accept connections
```

### Logs do **hasura**:
```
successfully acquired the sourced metadata lock
```

### Logs do **app**:
```
Starting application initialization...
Starting Next.js application...
   ▲ Next.js 15.3.3
   - Local:        http://localhost:9002
 ✓ Ready in XXXms
```

---

## 🔑 Login Após Deploy

**Admin:**
- **Email**: `admin@hidrofitness.com`
- **Senha**: `admin123`

**Janaina:**
- **Email**: `academiahidrofitness86@gmail.com`
- **Senha**: `ferdinando50`

⚠️ **IMPORTANTE:** Altere a senha do admin após primeiro login!

---

## 🎉 Resultado Final

Ao entrar em **"Alunos"**, você verá:
- ✅ **169 estudantes** listados automaticamente (backup importado)
- ✅ Todos com CPF, telefone, endereço completos
- ✅ **69 planos** disponíveis
- ✅ **13 modalidades** configuradas
- ✅ Histórico de pagamentos importado (2 registros)

**IMPORTANTE:** Após o deploy, você precisará:
1. Acessar o console do Hasura (porta 8080)
2. Rastrear as tabelas manualmente OU
3. Executar o script de tracking que está em `track_tables.ps1`

---

## ⚠️ Se Der Erro

### Erro: "password authentication failed"
**Solução:** Você não deletou TODOS os volumes. Delete tudo e redeploy.

### Erro: "database already exists"
**Solução:** Volume antigo ainda existe. Delete e redeploy.

### Erro: "relation does not exist"
**Solução:** Scripts de inicialização não rodaram. Delete volume e redeploy.

---

## 📝 Resumo das Mudanças

**ANTES (não funcionou):**
- 2 bancos separados (db_system + db_data)
- Muitas variáveis de ambiente
- Problemas de volume persistente
- Complexo de debugar

**AGORA (simplificado):**
- ✅ 1 banco único (igual desenvolvimento local)
- ✅ Poucas variáveis de ambiente
- ✅ Mais fácil de gerenciar
- ✅ Menos pontos de falha

---

## 🚀 PRONTO PARA DEPLOY!

Siga os 4 passos acima e seu sistema estará no ar com todos os dados importados automaticamente!
