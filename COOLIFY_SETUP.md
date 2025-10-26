# Configuração no Coolify

Este documento contém as instruções para configurar corretamente as variáveis de ambiente no Coolify.

## ⚠️ Problemas Comuns

### Erro: "Invalid JWK: key size too small; should be atleast 32 characters"
**Causa**: JWT_SECRET com menos de 32 caracteres
**Solução**: Use a variável JWT_SECRET abaixo (64 caracteres)

### Erro: "password authentication failed for user postgres"
**Causa**: Credenciais do banco de dados incorretas
**Solução**: Verifique as variáveis DB_USER, DB_PASSWORD e DB_NAME

---

## 📋 Variáveis de Ambiente Obrigatórias

Configure estas variáveis na seção **Environment Variables** do Coolify:

### 1. Banco de Dados

```bash
DB_USER=postgres
DB_PASSWORD=SuaSenhaSeguraAqui123!@#
DB_NAME=hidrofitness
```

⚠️ **IMPORTANTE**:
- Use a mesma senha que você configurou ao criar o banco no Coolify
- Se não tem certeza, pode redefinir o banco e criar novos valores

### 2. Hasura Admin Secret

```bash
HASURA_ADMIN_SECRET=d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4
```

### 3. JWT Secret (CRÍTICO!)

```bash
JWT_SECRET=9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```

⚠️ **MUITO IMPORTANTE**:
- O JWT_SECRET **DEVE TER NO MÍNIMO 32 CARACTERES**
- Use EXATAMENTE o valor acima ou gere um novo com 64+ caracteres
- **NÃO** adicione a variável `HASURA_GRAPHQL_JWT_SECRET` - ela é gerada automaticamente pelo docker-compose

---

## 🔐 Como Gerar Novos Secrets

Se preferir gerar seus próprios valores aleatórios:

### No Linux/Mac/Git Bash:
```bash
# Para JWT_SECRET (64 caracteres hexadecimais)
openssl rand -hex 32

# Para HASURA_ADMIN_SECRET (64 caracteres hexadecimais)
openssl rand -hex 32
```

### No PowerShell (Windows):
```powershell
# Para JWT_SECRET (64 caracteres)
-join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})

# Para HASURA_ADMIN_SECRET (64 caracteres)
-join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})
```

### Online:
Acesse: https://www.random.org/strings/
- Configurações:
  - Length: 64
  - Characters: Hexadecimal
  - Count: 1

---

## ✅ Checklist de Configuração

Antes de fazer o Redeploy, verifique:

- [ ] `DB_USER` está definido
- [ ] `DB_PASSWORD` está definido e corresponde ao banco criado
- [ ] `DB_NAME` está definido (geralmente `hidrofitness`)
- [ ] `HASURA_ADMIN_SECRET` tem 64 caracteres
- [ ] `JWT_SECRET` tem **NO MÍNIMO 32 caracteres** (recomendado 64)
- [ ] **NÃO existe** a variável `HASURA_GRAPHQL_JWT_SECRET` (será criada automaticamente)

---

## 🚀 Após Configurar

1. Salve todas as variáveis de ambiente no Coolify
2. Clique em **"Redeploy"**
3. Aguarde o build e inicialização dos containers
4. Verifique os logs:
   - Hasura deve mostrar: `"jwt_secret":[{"type":"HS256"...}]` ✅
   - App deve mostrar: `✓ Ready in XXXms` ✅
   - Database não deve ter erros de autenticação ✅

---

## 🔍 Verificação dos Logs

### Logs do Hasura (deve aparecer):
```json
"jwt_secret":[{"type":"HS256","key":"<JWK REDACTED>"}]
```

### Logs do App (deve aparecer):
```
✓ Ready in 873ms
```

### ❌ Erros que NÃO devem aparecer:
- ❌ `not enough input`
- ❌ `Invalid JWK: key size too small`
- ❌ `password authentication failed`

---

## 📞 Suporte

Se continuar com problemas:
1. Verifique se as variáveis estão exatamente como neste documento
2. Faça um Redeploy limpo
3. Verifique os logs do Hasura e Database separadamente
4. Compare com o arquivo `.env.production.example` do repositório
