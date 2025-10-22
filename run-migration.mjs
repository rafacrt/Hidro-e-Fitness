import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gestao.hidroefitness.com.br';
const supabaseKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1Mzc0NDY4MCwiZXhwIjo0OTA5NDE4MjgwLCJyb2xlIjoiYW5vbiJ9.Adsq8AWsK6OsDIgIfR469z60u8zvtSqwg-ww6I3--_0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🔄 Aplicando migration para criar tabela student_plans...\n');

  // Primeiro, vamos verificar o tipo de dados das tabelas
  console.log('📊 Verificando estrutura das tabelas...');

  const { data: studentsCheck, error: studentsError } = await supabase
    .from('students')
    .select('id')
    .limit(1);

  if (studentsError) {
    console.error('❌ Erro ao verificar tabela students:', studentsError);
    return;
  }

  const { data: plansCheck, error: plansError } = await supabase
    .from('plans')
    .select('id')
    .limit(1);

  if (plansError) {
    console.error('❌ Erro ao verificar tabela plans:', plansError);
    return;
  }

  console.log('✅ Tabelas students e plans encontradas\n');

  // Tentar criar a tabela via raw SQL
  // Como o Supabase client não tem método direto para executar DDL,
  // vamos usar a API REST do PostgREST

  console.log('📝 Você precisa executar o SQL manualmente no Supabase Studio:');
  console.log('');
  console.log('URL: https://gestao.hidroefitness.com.br');
  console.log('User: ka1JQ1061ESXYOxd');
  console.log('Password: S9r0H9jAol9y9OEed8jcWZJA9TsE352H');
  console.log('');
  console.log('Vá em: SQL Editor → New Query → Cole o SQL abaixo → Run');
  console.log('');
  console.log('═'.repeat(80));
  console.log(`
-- Drop e recriar student_plans com INTEGER IDs
DROP TABLE IF EXISTS public.student_plans CASCADE;

-- Create Student Plans Table usando INTEGER
CREATE TABLE public.student_plans (
    id serial PRIMARY KEY,
    student_id integer NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    plan_id integer NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    start_date date DEFAULT now(),
    end_date date,
    created_at timestamptz DEFAULT now(),
    UNIQUE(student_id, plan_id)
);

ALTER TABLE public.student_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage student plans." ON public.student_plans;
CREATE POLICY "Authenticated users can manage student plans." ON public.student_plans FOR ALL USING (auth.role() = 'authenticated');
  `);
  console.log('═'.repeat(80));
  console.log('');
}

applyMigration();
