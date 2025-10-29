# 🔧 Variáveis de Ambiente - Coolify

## ✅ Configure APENAS Estas Variáveis

**Não precisa deletar nada!** Apenas adicione/atualize estas 5 variáveis:

### 1. POSTGRES_USER
```
postgres
```

### 2. POSTGRES_PASSWORD
```
suaSenhaSeguraAqui123
```
*(Escolha qualquer senha forte - pode ser a mesma que você já tinha em DB_DATA_PASSWORD)*

### 3. POSTGRES_DB
```
hidrofitness
```

### 4. HASURA_ADMIN_SECRET
```
d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4
```
*(Se você já tem essa variável, MANTENHA o valor que já está lá)*

### 5. JWT_SECRET
```
9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```
*(Se você já tem essa variável, MANTENHA o valor que já está lá)*

---

## ⚠️ Variáveis Antigas (Podem Ficar)

Estas variáveis **não vão ser usadas** no novo docker-compose, então não tem problema ficarem lá:

- DB_SYSTEM_USER (ignorada)
- DB_SYSTEM_PASSWORD (ignorada)
- DB_SYSTEM_NAME (ignorada)
- DB_DATA_USER (ignorada)
- DB_DATA_PASSWORD (ignorada)
- DB_DATA_NAME (ignorada)
- HASURA_GRAPHQL_JWT_SECRET (ignorada)

O docker-compose.prod.yml novo **só lê as variáveis POSTGRES_***, então as antigas ficam sem efeito.

---

## 📋 Checklist Rápido

- [ ] POSTGRES_USER = `postgres`
- [ ] POSTGRES_PASSWORD = `[sua senha]`
- [ ] POSTGRES_DB = `hidrofitness`
- [ ] HASURA_ADMIN_SECRET = `[mantenha o existente ou use o valor acima]`
- [ ] JWT_SECRET = `[mantenha o existente ou use o valor acima]`

---

## 🚀 Depois de Configurar

1. **Reload Compose File** no Coolify
2. **Delete TODOS os volumes** (Storage → Volumes)
3. **Redeploy**

Pronto! 🎉
