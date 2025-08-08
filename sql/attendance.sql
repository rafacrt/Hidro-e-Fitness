
-- Tabela para registrar a frequência dos alunos nas aulas
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('presente', 'ausente', 'justificado')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para otimizar consultas
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);

-- Habilitar RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Allow authenticated users to manage attendance" 
ON attendance 
FOR ALL 
TO authenticated 
USING (true);
