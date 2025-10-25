# Hasura: Permissões sugeridas para a fonte "appdata"

Este guia lista papéis/roles sugeridos e como configurar permissões básicas no Hasura para as tabelas públicas da fonte de dados "appdata" (hf_data_db).

Observação importante:
- Estas permissões são sugestões para um ponto de partida. Ajuste de acordo com o fluxo real de trabalho, JWT/claims que o app emite e requisitos de negócio.
- Se você já usa JWT com a claim de role (ex.: `x-hasura-role`) e IDs do usuário (ex.: `x-hasura-user-id`), siga as seções de "Regra por role" abaixo.

Papéis sugeridos (exemplos):
- admin: acesso total de leitura e escrita.
- gestor: acesso amplo para visualizar e atualizar dados operacionais (alunos, matrículas, pagamentos, presença), mas sem metadados do Hasura.
- instrutor: pode consultar presença, turmas e alunos de suas turmas; pode marcar presença.
- atendente: pode consultar e atualizar dados básicos de alunos e pagamentos.
- public: somente leitura restrita (se necessário) ou nenhum acesso.

Tabelas e escopos de acesso típicos:
- students: admin, gestor, atendente: SELECT/INSERT/UPDATE; instrutor: SELECT; public: nenhum acesso.
- classes: admin, gestor: SELECT/INSERT/UPDATE; instrutor: SELECT; public: SELECT (opcional; exibir grade pública).
- enrollments: admin, gestor: SELECT/INSERT/UPDATE; instrutor: SELECT; atendente: SELECT; public: nenhum.
- attendance: admin, gestor: SELECT/INSERT/UPDATE; instrutor: SELECT/INSERT/UPDATE; atendente: SELECT; public: nenhum.
- payments: admin, gestor, atendente: SELECT/INSERT/UPDATE; instrutor/public: nenhum.

Como configurar no Hasura Console (fonte appdata):
1) Acesse o Console do Hasura (http://SEU-HOST:8080/console) e selecione a fonte de dados "appdata".
2) Para cada tabela, entre na aba "Permissions".
3) Adicione o role desejado (ex.: `instrutor`) e defina:
   - Select permissions: habilite colunas permitidas e, se necessário, defina um filtro (ex.: apenas registros relacionados ao `x-hasura-user-id`).
   - Insert/Update/Delete: defina colunas permitidas e filtros de autorização.
4) Salve as permissões.

Exemplo de regras (base genérica, sem filtros por proprietário):
- attendance (instrutor):
  - Select: todas as colunas.
  - Insert: colunas `enrollment_id`, `session_date`, `status`, `notes`.
  - Update: colunas `status`, `notes`.
  - Delete: desabilitado.
- students (atendente):
  - Select: todas as colunas.
  - Insert: `full_name`, `email`, `phone`, `birth_date`, `status`.
  - Update: `full_name`, `email`, `phone`, `birth_date`, `status`.
- payments (atendente):
  - Select: todas as colunas.
  - Insert: `student_id`, `amount`, `currency`, `method`, `status`, `reference_month`, `due_date`, `notes`.
  - Update: `amount`, `method`, `status`, `due_date`, `notes`.

Se você possui claims JWT (ex.: proprietário da turma ou do registro):
- Filtros comuns (exemplos):
  - classes: { owner_id: { _eq: X-Hasura-User-Id } }
  - enrollments: { class: { owner_id: { _eq: X-Hasura-User-Id } } }
  - attendance: { enrollment: { class: { owner_id: { _eq: X-Hasura-User-Id } } } }

Boas práticas:
- Use colunas `created_at`/`updated_at` para auditoria básica.
- Prefira permitir apenas o mínimo necessário por role.
- Defina filtros de linha (Row-level) sempre que possível.
- Teste com tokens JWT diferentes para garantir que a experiência de cada papel está correta.

Próximos passos:
- Definir o mapeamento exato de roles do seu JWT para `x-hasura-role` e quaisquer outras claims (id do usuário, ids de turmas).
- Se desejar, posso automatizar as permissões via serviço de inicialização (semelhante ao `hasura-init`), aplicando um metadata JSON com todos os roles e regras acima. Para isso, confirme quais roles/claims você usa hoje no app.