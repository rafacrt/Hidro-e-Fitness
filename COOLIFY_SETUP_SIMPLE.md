# Configuração Simples no Coolify - 1 Banco Único

## 🎯 Arquitetura Simplificada

Sistema voltou para **1 banco PostgreSQL único** que contém TODAS as tabelas:
- ✅ Mais simples de gerenciar
- ✅ Menos pontos de falha
- ✅ Mais fácil de fazer backup
- ✅ Funciona como no desenvolvimento local

---

## 🔐 Variáveis de Ambiente

Configure estas variáveis no Coolify:

```bash
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=suaSenhaSeguraAqui123
POSTGRES_DB=hidrofitness

# Hasura
HASURA_ADMIN_SECRET=d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4

# JWT
JWT_SECRET=9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```

**IMPORTANTE:** Use uma senha forte para `POSTGRES_PASSWORD`. Pode ser qualquer senha, não precisa ser hexadecimal.

---

## 🗑️ ANTES de Deploy: Deletar Volumes Antigos

1. No Coolify, vá em **Storage → Volumes**
2. Delete TODOS os volumes relacionados ao projeto:
   - Qualquer volume com "db" no nome
   - Qualquer volume com "data" no nome
   - Qualquer volume com "system" no nome
3. **Deixe apenas** o volume de backup (se houver)

---

## 🚀 Processo de Deploy

1. **Configure as variáveis** acima no Coolify
2. **Delete todos os volumes** (passo anterior)
3. **Reload Compose File**
4. **Redeploy**

---

## 📊 O Que Acontece no Deploy

```
Container db →
  ├─ Cria volume novo: db_data
  ├─ PostgreSQL inicia
  ├─ Executa db/init-prod/01_schema.sql → Cria TODAS as tabelas
  ├─ Executa db/init-prod/02_seed_data.sql → Insere modalidades e profiles
  ├─ Executa db/init-prod/03_students_data.sql → Insere 193 estudantes
  ├─ Executa db/init-prod/04_plans_data.sql → Insere 72 planos
  └─ Executa db/init-prod/05_admin_user.sql → Cria admin

Container hasura →
  ├─ Aguarda db ficar healthy
  └─ Conecta ao banco único

Container app →
  ├─ Aguarda db e hasura
  ├─ Executa scripts/init-db.sh
  ├─ Rastreia todas as tabelas no Hasura
  └─ Inicia Next.js
```

---

## ✅ Verificação Pós-Deploy

Nos logs do Coolify, você deve ver:

**db:**
```
database system is ready to accept connections
```

**hasura:**
```
successfully acquired the sourced metadata lock
```

**app:**
```
✅ All tables tracked in Hasura!
🚀 Hasura initialization complete!
✓ Ready in XXXms
```

---

## 🔑 Login Inicial

Após o deploy:
- **Email**: `admin@hidrofitness.com`
- **Senha**: `admin123`

⚠️ **Altere a senha** após o primeiro login!

---

## 📋 Dados Importados Automaticamente

O sistema importa automaticamente:
- ✅ **193 estudantes** com informações completas
- ✅ **72 planos** de diferentes modalidades
- ✅ **13 modalidades** ativas (Natação, Hidroginástica, Zumba, etc)
- ✅ **Histórico de pagamentos** e matrículas
- ✅ **1 usuário admin** pronto para uso

---

## ⚠️ Troubleshooting

### Erro: "password authentication failed"
- **Causa**: Volume antigo com senha diferente
- **Solução**: Delete TODOS os volumes e redeploy

### Erro: "database already exists"
- **Causa**: Volume não foi deletado
- **Solução**: Delete o volume `db_data` e redeploy

### Erro: "Failed to connect to Hasura"
- **Causa**: Variável `HASURA_ADMIN_SECRET` errada ou não configurada
- **Solução**: Verifique se a variável está correta no Coolify

### Hasura não rastreia tabelas
- **Causa**: `HASURA_ADMIN_SECRET` diferente entre Hasura e App
- **Solução**: Certifique-se que a mesma variável está configurada

---

## 💾 Backup Manual

Para fazer backup do banco:

```bash
# No container do Coolify
docker exec <container-id> pg_dump -U postgres hidrofitness > backup.sql
```

Para restaurar:

```bash
docker exec -i <container-id> psql -U postgres hidrofitness < backup.sql
```

---

## 🎉 Pronto!

Arquitetura simplificada = menos problemas!

Se tudo correr bem, você verá seus **193 alunos** importados automaticamente na primeira inicialização.
