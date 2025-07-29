// Script para testar conexão com Supabase
// Execute: node scripts/test-supabase.js

require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🧪 === TESTE DE CONEXÃO SUPABASE ===\n');
  
  // Verificar variáveis de ambiente
  console.log('📋 Verificando variáveis de ambiente:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Definida' : '❌ Não definida');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Definida' : '❌ Não definida');
  console.log('NEXT_PUBLIC_DEV_MODE:', process.env.NEXT_PUBLIC_DEV_MODE);
  console.log('');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('❌ Variáveis de ambiente do Supabase não configuradas!');
    console.log('📝 Configure no arquivo .env.local:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima');
    return;
  }
  
  try {
    // Importar Supabase (simulando o que a aplicação faz)
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log('🔗 Testando conexão com Supabase...');
    
    // Teste 1: Verificar se a conexão funciona
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message);
      
      if (error.message.includes('relation "profiles" does not exist')) {
        console.log('📋 A tabela "profiles" não existe. Execute o script SQL primeiro.');
      }
    } else {
      console.log('✅ Conexão com Supabase estabelecida!');
    }
    
    // Teste 2: Verificar tabelas existentes
    console.log('\n📊 Verificando estrutura do banco...');
    
    const tables = ['profiles', 'students', 'instructors', 'classes'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Tabela "${table}": ${error.message}`);
        } else {
          console.log(`✅ Tabela "${table}": OK`);
        }
      } catch (err) {
        console.log(`❌ Tabela "${table}": ${err.message}`);
      }
    }
    
    // Teste 3: Verificar usuários cadastrados
    console.log('\n👥 Verificando usuários cadastrados:');
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) {
        console.log('❌ Erro ao buscar profiles:', error.message);
      } else {
        console.log(`✅ ${profiles.length} usuário(s) encontrado(s):`);
        profiles.forEach(profile => {
          console.log(`  - ${profile.full_name} (${profile.role})`);
        });
      }
    } catch (err) {
      console.log('❌ Erro ao verificar usuários:', err.message);
    }
    
    console.log('\n🎯 === FIM DO TESTE ===');
    
  } catch (error) {
    console.log('💥 Erro ao importar Supabase:', error.message);
    console.log('📦 Execute: npm install @supabase/supabase-js');
  }
}

testSupabaseConnection();