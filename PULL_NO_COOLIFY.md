# 🔄 PULL NO COOLIFY - URGENTE!

## ❌ Problema Identificado nos Logs

O Coolify está usando o **docker-compose.prod.yml ANTIGO** (com db_system e db_data).

Você vê nos logs:
- `db_system-rgww8884c4g084gsc8g00800` ❌
- `db_data-rgww8884c4g084gsc8g00800` ❌

Mas deveria aparecer:
- `db-rgww8884c4g084gsc8g00800` ✅

---

## ✅ Solução: Fazer PULL no Coolify

### PASSO 1: Ir para Configuration

No Coolify, clique na aba **"Configuration"** (ao lado de Logs)

### PASSO 2: Fazer Pull do Git

Procure o botão **"Pull Latest Commit"** ou **"Reload Sources"** ou similar.

Isso vai fazer o Coolify baixar o novo `docker-compose.prod.yml` que acabei de enviar para o GitHub.

### PASSO 3: Depois do Pull

1. **Delete TODOS os volumes** (Storage → Volumes)
   - Vai aparecer algo como:
     - `rgww8884c4g084gsc8g00800_db-system-data` ❌ DELETE
     - `rgww8884c4g084gsc8g00800_db-data-data` ❌ DELETE
     - Qualquer outro volume com "db" no nome ❌ DELETE

2. **Redeploy**

---

## 🎯 O Que Vai Mudar

**ANTES (nos seus logs agora):**
```
hasura-rgww8884c4g084gsc8g00800
db_system-rgww8884c4g084gsc8g00800  ❌ erro de senha
db_data-rgww8884c4g084gsc8g00800    ❌ skipping initialization
backup_data-rgww8884c4g084gsc8g00800
backup_system-rgww8884c4g084gsc8g00800
app-rgww8884c4g084gsc8g00800
```

**DEPOIS (após pull + redeploy):**
```
db-rgww8884c4g084gsc8g00800         ✅ banco único
hasura-rgww8884c4g084gsc8g00800     ✅ conecta no db
app-rgww8884c4g084gsc8g00800        ✅ rastreia tabelas
```

**Sem backup_data e backup_system!** Eles não existem mais no novo docker-compose.

---

## 📸 Onde Encontrar o Pull

Procure no Coolify por:
- **"Pull Latest Commit"**
- **"Reload Sources"**
- **"Fetch Latest"**
- **"Update from Repository"**

Geralmente fica na aba **Configuration** ou perto do nome do repositório GitHub.

---

## ⚠️ IMPORTANTE

Sem fazer o PULL, o Coolify vai continuar usando os arquivos antigos que estão no cache dele, mesmo que você tenha feito "Reload Compose File".

O **Reload Compose File** só relê o arquivo que já está no servidor do Coolify.

O **Pull** baixa a versão nova do GitHub!

---

## 🚀 Ordem Correta

1. ✅ **Pull Latest Commit** (baixar código novo do GitHub)
2. ✅ **Delete todos os volumes**
3. ✅ **Redeploy**

Depois disso, os logs vão mostrar **db** em vez de **db_system** e **db_data**! 🎉
