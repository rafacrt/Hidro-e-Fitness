# 🚀 Guia de Deploy - Dokploy

## Problema Atual
O deploy está falhando porque as variáveis de ambiente não estão configuradas no Dokploy.

**Erro**: `dependency failed to start: container hidro-e-fitness-hidroo-z9kpzy-db-1 is unhealthy`

## Solução

### 1. Configurar Variáveis de Ambiente no Dokploy

Acesse o painel do Dokploy e vá em **Settings > Environment Variables**. Adicione as seguintes variáveis:

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SuaSenhaSeguraAqui123!
POSTGRES_DB=hidrofitness

# Hasura
HASURA_ADMIN_SECRET=sua-chave-admin-secreta-aqui
HASURA_GRAPHQL_JWT_SECRET={"type":"HS256","key":"sua-chave-jwt-muito-segura-com-pelo-menos-32-caracteres"}

# Application
JWT_SECRET=9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```

### 2. Gerar Senhas Seguras

**Para POSTGRES_PASSWORD** (exemplo):
```bash
openssl rand -base64 32
# Resultado: Qv9tS3aJ5pR8wX2mN6cB4yL1fT7eZ0hD
```

**Para HASURA_ADMIN_SECRET** (exemplo):
```bash
openssl rand -hex 32
# Resultado: d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4
```

**Para JWT_SECRET** (use o mesmo valor):
```bash
openssl rand -hex 32
# Resultado: 9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```

### 3. Configurar HASURA_GRAPHQL_JWT_SECRET

Importante: Use a **mesma chave** do `JWT_SECRET` dentro do JSON:

```json
{"type":"HS256","key":"9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1"}
```

### 4. Exemplo de Configuração Completa

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Qv9tS3aJ5pR8wX2mN6cB4yL1fT7eZ0hD
POSTGRES_DB=hidrofitness
HASURA_ADMIN_SECRET=d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4
HASURA_GRAPHQL_JWT_SECRET={"type":"HS256","key":"9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1"}
JWT_SECRET=9c3f2d1e7b8a6c5d4f3e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1
```

### 5. Após Configurar

1. Salve as variáveis no Dokploy
2. Faça um novo deploy
3. Aguarde os containers iniciarem (pode levar 1-2 minutos)
4. Verifique os logs para confirmar que está tudo OK

### 6. Inicializar o Banco de Dados

Após o primeiro deploy bem-sucedido, você precisará:

1. **Popular o banco com o schema do Hasura**:
   - Acesse o console do Hasura (se habilitado) ou use migrations
   - Aplique as tabelas e relações necessárias

2. **Criar usuário admin**:
```sql
INSERT INTO users (id, email, password, role)
VALUES (
  gen_random_uuid(),
  'admin@hidrofitness.com',
  '$2a$10$...',  -- Hash bcrypt da senha 'admin123'
  'admin'
);
```

## Troubleshooting

### Container DB unhealthy
- Verifique se as variáveis `POSTGRES_*` estão configuradas
- Aguarde 30-60 segundos para o healthcheck passar
- Verifique os logs: `docker logs hidro-e-fitness-db-1`

### Hasura não conecta
- Confirme que `HASURA_ADMIN_SECRET` está configurado
- Verifique se `HASURA_GRAPHQL_JWT_SECRET` está no formato JSON correto
- Verifique os logs: `docker logs hidro-e-fitness-hasura-1`

### App não inicia
- Confirme que `JWT_SECRET` está configurado
- Verifique se o build foi concluído com sucesso
- Verifique os logs: `docker logs hidro-e-fitness-app-1`

## Portas Expostas

- **App**: Porta configurada no Dokploy (geralmente 9002)
- **Hasura**: Porta 8080 (interna, não exposta publicamente)
- **PostgreSQL**: Porta 5432 (interna, não exposta publicamente)

## Segurança

⚠️ **IMPORTANTE**:
- NUNCA commite as variáveis de produção no Git
- Use senhas diferentes para cada ambiente (dev/prod)
- Mantenha o `HASURA_ADMIN_SECRET` em segredo
- Configure CORS e rate limiting no Hasura para produção
