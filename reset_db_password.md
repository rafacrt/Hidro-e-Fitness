# 🔥 RESET COMPLETO DO BANCO - SOLUÇÃO DEFINITIVA

## ❌ Problema Identificado nos Seus Logs

```
FATAL: password authentication failed for user "postgres"
FATAL: role "root" does not exist
```

**Causa:** O volume PostgreSQL tem uma **senha antiga gravada** que não bate com POSTGRES_PASSWORD atual.

---

## ✅ SOLUÇÃO DEFINITIVA: Deletar Volume pelo SSH

O Coolify não está deletando o volume de verdade. Você precisa deletar **manualmente via SSH**.

### PASSO 1: Conectar no servidor via SSH

```bash
ssh usuario@seu-servidor.com
```

### PASSO 2: Parar os containers do projeto

```bash
# Listar os containers
docker ps | grep hidro

# Parar TODOS os containers relacionados
docker stop $(docker ps -q --filter "name=hidro")
```

Ou no Coolify, clique em **"Stop"** no projeto.

### PASSO 3: Deletar o volume do banco

```bash
# Listar volumes para encontrar o nome exato
docker volume ls | grep db

# Você vai ver algo como:
# rgww8884c4g084gsc8g00800_db-data
# ou
# rgww8884c4g084gsc8g00800_db_data

# DELETAR o volume (ATENÇÃO: apaga tudo!)
docker volume rm rgww8884c4g084gsc8g00800_db-data

# Se der erro de "volume in use", force:
docker volume rm -f rgww8884c4g084gsc8g00800_db-data
```

⚠️ **IMPORTANTE:** Isso vai apagar o banco completamente, mas você tem todos os dados de backup em `db/init-prod/` que serão reimportados!

### PASSO 4: Verificar variáveis no Coolify

Certifique-se que estas 5 variáveis estão configuradas:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=HidroFitness2025Seguro
POSTGRES_DB=hidrofitness
HASURA_ADMIN_SECRET=d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4
JWT_SECRET=9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```

**POSTGRES_PASSWORD pode ser qualquer senha forte sem caracteres especiais.**

### PASSO 5: Redeploy no Coolify

Agora clique em **"Redeploy"** no Coolify.

---

## 🎯 O Que Vai Acontecer Agora

1. ✅ Container `db` inicia
2. ✅ PostgreSQL vê volume VAZIO
3. ✅ Cria role "postgres" com senha correta do POSTGRES_PASSWORD
4. ✅ Cria banco "hidrofitness"
5. ✅ Executa TODOS os scripts em `db/init-prod/`:
   - 01_schema.sql → Cria tabelas
   - 02_seed_data.sql → 13 modalidades
   - 03_students_data.sql → **193 alunos** ✅
   - 04_plans_data.sql → 72 planos
   - 05_admin_user.sql → admin@hidrofitness.com
6. ✅ Hasura conecta com sucesso
7. ✅ App rastreia tabelas
8. ✅ Sistema funcionando! 🎉

---

## 📊 Logs Corretos (após fix)

### db:
```
PostgreSQL init process complete; ready for start up.
LOG:  database system is ready to accept connections
```

### hasura:
```
successfully acquired the sourced metadata lock
```

### app:
```
✅ Hasura is ready!
🔄 Tracking all tables...
✅ Table students tracked successfully
✅ Table plans tracked successfully
✅ All tables tracked in Hasura!
🚀 Hasura initialization complete!
```

---

## ⚠️ Alternativa (se não tiver acesso SSH)

Se você **não consegue** acessar o servidor SSH:

### Opção 1: Usar a senha antiga

Tente configurar POSTGRES_PASSWORD com a senha antiga que estava em DB_DATA_PASSWORD:

```
POSTGRES_PASSWORD=daed3a69e7e8446698c6bcaa3b51be44600b40652d2f75c11ed8e2391b329396
```

⚠️ **PROBLEMA:** O banco vai ter estrutura antiga, não a nova!

### Opção 2: Pedir ao suporte do Coolify

Entre no terminal do servidor pelo próprio Coolify e execute os comandos do PASSO 3 acima.

---

## 🔑 Comandos Exatos para Copiar

**No SSH do servidor:**

```bash
# Parar containers
docker stop $(docker ps -q --filter "name=hidro")

# Ver volumes
docker volume ls | grep db

# Deletar volume (substitua pelo nome real)
docker volume rm rgww8884c4g084gsc8g00800_db-data

# Se der erro "in use", force
docker volume rm -f rgww8884c4g084gsc8g00800_db-data
```

---

## ✅ Checklist Final

- [ ] Conectei no servidor SSH
- [ ] Parei os containers
- [ ] Deletei o volume do banco
- [ ] Confirmei que POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB estão configurados
- [ ] Fiz Redeploy no Coolify
- [ ] Aguardei 2-3 minutos
- [ ] Verifiquei logs do `db` → "ready to accept connections"
- [ ] Verifiquei logs do `app` → "All tables tracked"
- [ ] Fiz login com admin@hidrofitness.com / admin123
- [ ] Vi os 193 alunos na lista! 🎉

---

## 🚀 VOCÊ TEM ACESSO SSH?

Me avise se você consegue conectar no servidor via SSH que eu monto o comando EXATO com o nome correto do volume!
