-- Drop e recriar student_plans para garantir compatibilidade com INTEGER IDs
DROP TABLE IF EXISTS public.student_plans CASCADE;

-- Create Student Plans Table (many-to-many relationship)
-- Usando INTEGER para compatibilidade com students.id e plans.id
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

-- Policies for Student Plans
DROP POLICY IF EXISTS "Authenticated users can manage student plans." ON public.student_plans;
CREATE POLICY "Authenticated users can manage student plans." ON public.student_plans FOR ALL USING (auth.role() = 'authenticated');
