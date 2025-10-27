# Passo a Passo - Coolify (SEM perder dados)

## 1. Ajustar usuário no Postgres (via terminal do container)

1. No Coolify, vá até o serviço **Postgres**
2. Clique em **Terminal** ou **Logs** → **Terminal**
3. Execute: `psql -U postgres -d hidro_fitness_db`
4. Cole e execute o conteúdo do arquivo `scripts/coolify-db-setup.sql`
5. Digite `\q` para sair do psql

## 2. Configurar Environment Variables

1. Vá para **Project Settings** → **Environment Variables**
2. Adicione/atualize as variáveis do arquivo `scripts/coolify-envs.txt`
3. **Salve** as alterações

## 3. Rastrear tabela no Hasura (via terminal ou interface)

**Opção A - Via terminal do Hasura:**
```bash
curl -X POST http://localhost:8080/v1/metadata \
  -H "X-Hasura-Admin-Secret: d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4" \
  -H "Content-Type: application/json" \
  -d '{"type":"pg_track_table","args":{"source":"default","table":{"schema":"public","name":"academy_settings"}}}'
```

**Opção B - Via interface do Hasura:**
1. Acesse a interface do Hasura no Coolify
2. Vá em **Data** → **public** → **Untracked tables**
3. Clique em **Track** na tabela `academy_settings`

## 4. Reimplantar serviços (ordem importante)

1. **Hasura** - Restart/Redeploy primeiro
2. **App** - Restart/Redeploy depois

## 5. Testar

- Acesse a URL do seu app no Coolify
- Teste as páginas `/login` e `/auth/forgot-password`
- Verifique se o logo aparece (fallback para /logo/logo.png se necessário)

---

**IMPORTANTE:** Esta abordagem mantém todos os seus dados de alunos, professores, turmas, etc. intactos!