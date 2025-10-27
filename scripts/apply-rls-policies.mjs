import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'hidrofitness',
  user: 'postgres',
  password: 'postgres'
};

async function applyRLSPolicies() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');
    
    // Ler o arquivo SQL
    const sqlPath = join(__dirname, 'update-hasura-rls-policies.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Aplicando políticas RLS...');
    
    // Executar o script SQL
    await client.query(sqlContent);
    
    console.log('✅ Políticas RLS aplicadas com sucesso!');
    
    // Verificar as políticas criadas
    console.log('\n📋 Verificando políticas criadas:');
    const result = await client.query(`
      SELECT 
          tablename,
          policyname,
          cmd,
          CASE 
            WHEN qual IS NOT NULL THEN 'USING: ' || qual
            WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
            ELSE 'N/A'
          END as condition
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `);
    
    const policiesByTable = {};
    result.rows.forEach(row => {
      if (!policiesByTable[row.tablename]) {
        policiesByTable[row.tablename] = [];
      }
      policiesByTable[row.tablename].push({
        policy: row.policyname,
        command: row.cmd,
        condition: row.condition
      });
    });
    
    Object.entries(policiesByTable).forEach(([table, policies]) => {
      console.log(`\n🔒 Tabela: ${table}`);
      policies.forEach(policy => {
        console.log(`  - ${policy.policy} (${policy.command})`);
      });
    });
    
    console.log(`\n📊 Total de políticas criadas: ${result.rows.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao aplicar políticas RLS:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyRLSPolicies();