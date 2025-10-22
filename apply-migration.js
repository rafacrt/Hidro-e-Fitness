const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gestao.hidroefitness.com.br';
const supabaseKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1Mzc0NDY4MCwiZXhwIjo0OTA5NDE4MjgwLCJyb2xlIjoiYW5vbiJ9.Adsq8AWsK6OsDIgIfR469z60u8zvtSqwg-ww6I3--_0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('Aplicando migration...');

  const sql = `
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
  `;

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('Erro ao aplicar migration:', error);
  } else {
    console.log('Migration aplicada com sucesso!');
  }
}

applyMigration();
