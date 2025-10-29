# 🔧 Como Rastrear Tabelas no Hasura Após Deploy

Após o deploy no Coolify, você precisa rastrear as tabelas do Hasura manualmente para que o sistema funcione.

## 📋 Opção 1: Via Console do Hasura (Mais Fácil)

### 1. Acesse o Console do Hasura

No seu navegador, vá para:
```
https://seu-dominio.com:8080
```

### 2. Faça Login

Use o **Admin Secret** que está nas variáveis de ambiente:
```
d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4
```

### 3. Rastreie as Tabelas

1. Clique em **"Data"** no menu superior
2. Clique em **"default"** (sua fonte de dados)
3. Clique em **"Public"** (schema)
4. Você verá uma lista de **"Untracked tables"** (tabelas não rastreadas)
5. Clique em **"Track All"** para rastrear todas de uma vez

**OU** rastreie uma por uma clicando em **"Track"** ao lado de cada tabela:
- students
- plans
- modalities
- student_plans
- payments
- users
- academy_settings
- classes
- instructors
- attendance
- payment_methods

### 4. Crie os Relacionamentos

Após rastrear, vá em cada tabela e crie os relacionamentos:

**Na tabela `plans`:**
- Relationship Name: `modality`
- Type: Object Relationship
- Reference: modalities (modality_id → id)

**Na tabela `student_plans`:**
- Relationship Name: `plan`
- Type: Object Relationship
- Reference: plans (plan_id → id)

- Relationship Name: `student`
- Type: Object Relationship
- Reference: students (student_id → id)

**Na tabela `students`:**
- Relationship Name: `student_plans`
- Type: Array Relationship
- Reference: student_plans (id → student_id)

- Relationship Name: `payments`
- Type: Array Relationship
- Reference: payments (id → student_id)

**Na tabela `payments`:**
- Relationship Name: `student`
- Type: Object Relationship
- Reference: students (student_id → id)

---

## 📋 Opção 2: Via API (Usando curl)

Se você tiver acesso SSH ao servidor, pode executar estes comandos:

```bash
# 1. Rastrear todas as tabelas
ADMIN_SECRET="d7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4"
HASURA_URL="http://localhost:8080"

# Rastrear tabelas principais
for table in students plans modalities student_plans payments users academy_settings classes instructors attendance payment_methods; do
  curl -X POST ${HASURA_URL}/v1/metadata \
    -H "Content-Type: application/json" \
    -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
    -d "{\"type\":\"pg_track_table\",\"args\":{\"source\":\"default\",\"table\":{\"schema\":\"public\",\"name\":\"${table}\"}}}"
  echo "✓ Tracked: ${table}"
done

# 2. Criar relacionamentos
# plans → modality
curl -X POST ${HASURA_URL}/v1/metadata \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
  -d '{"type":"pg_create_object_relationship","args":{"source":"default","table":{"schema":"public","name":"plans"},"name":"modality","using":{"manual_configuration":{"remote_table":{"schema":"public","name":"modalities"},"column_mapping":{"modality_id":"id"}}}}}'

# student_plans → plan
curl -X POST ${HASURA_URL}/v1/metadata \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
  -d '{"type":"pg_create_object_relationship","args":{"source":"default","table":{"schema":"public","name":"student_plans"},"name":"plan","using":{"manual_configuration":{"remote_table":{"schema":"public","name":"plans"},"column_mapping":{"plan_id":"id"}}}}}'

# student_plans → student
curl -X POST ${HASURA_URL}/v1/metadata \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
  -d '{"type":"pg_create_object_relationship","args":{"source":"default","table":{"schema":"public","name":"student_plans"},"name":"student","using":{"manual_configuration":{"remote_table":{"schema":"public","name":"students"},"column_mapping":{"student_id":"id"}}}}}'

# students → student_plans (array)
curl -X POST ${HASURA_URL}/v1/metadata \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
  -d '{"type":"pg_create_array_relationship","args":{"source":"default","table":{"schema":"public","name":"students"},"name":"student_plans","using":{"manual_configuration":{"remote_table":{"schema":"public","name":"student_plans"},"column_mapping":{"id":"student_id"}}}}}'

# students → payments (array)
curl -X POST ${HASURA_URL}/v1/metadata \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
  -d '{"type":"pg_create_array_relationship","args":{"source":"default","table":{"schema":"public","name":"students"},"name":"payments","using":{"manual_configuration":{"remote_table":{"schema":"public","name":"payments"},"column_mapping":{"id":"student_id"}}}}}'

# payments → student
curl -X POST ${HASURA_URL}/v1/metadata \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
  -d '{"type":"pg_create_object_relationship","args":{"source":"default","table":{"schema":"public","name":"payments"},"name":"student","using":{"manual_configuration":{"remote_table":{"schema":"public","name":"students"},"column_mapping":{"student_id":"id"}}}}}'

echo "✅ Todas as tabelas rastreadas e relacionamentos criados!"
```

---

## ✅ Verificação

Após rastrear as tabelas, vá para a aplicação e:

1. Faça login com: `academiahidrofitness86@gmail.com` / `ferdinando50`
2. Clique em **"Alunos"**
3. Você deve ver os **169 alunos** listados
4. Clique em um aluno para ver os detalhes e planos

Se os alunos aparecerem, está tudo funcionando! 🎉

---

## ⚠️ Troubleshooting

### Erro: "field 'students' not found in type: 'query_root'"
**Solução:** Você não rastreou as tabelas. Siga os passos acima.

### Erro: "students aparecem mas sem planos"
**Solução:** Você não criou os relacionamentos. Execute a Opção 2 ou crie manualmente no console.

### Erro: "Nenhum aluno encontrado"
**Solução:** Verifique se o banco de dados foi inicializado corretamente. Veja os logs do container `db`.
