
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];
type Enrollment = Database['public']['Tables']['enrollments']['Row'];
type Student = Database['public']['Tables']['students']['Row'];


const classFormSchema = z.object({
  name: z.string().min(3, 'O nome da turma deve ter pelo menos 3 caracteres.'),
  modality_id: z.string({ required_error: 'Selecione uma modalidade.' }),
  instructor_id: z.string().optional(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido.'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido.'),
  days_of_week: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Você deve selecionar pelo menos um dia da semana.',
  }),
  location: z.string().optional(),
  max_students: z.coerce.number().min(1, 'A turma deve ter pelo menos 1 vaga.'),
  status: z.enum(['ativa', 'inativa', 'lotada']).default('ativa'),
});

const enrollStudentSchema = z.object({
  student_id: z.string({ required_error: 'Selecione um aluno.' }),
  class_id: z.string({ required_error: 'Selecione uma turma.' }),
});

const enrollStudentsSchema = z.object({
  class_id: z.string(),
  student_ids: z.array(z.string()),
});

export async function getClasses(): Promise<(ClassRow & { instructors: Pick<Instructor, 'name'> | null } & { modalities: Pick<Modality, 'name'> | null })[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        instructors ( name ),
        modalities ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar as turmas.');
    }

    return data;
  } catch (error) {
    console.error('Unexpected Error:', error);
    return [];
  }
}

export async function addClass(formData: unknown) {
  const parsedData = classFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('classes').insert([
      {
        name: parsedData.data.name,
        modality_id: parsedData.data.modality_id,
        instructor_id: parsedData.data.instructor_id || null,
        start_time: parsedData.data.start_time,
        end_time: parsedData.data.end_time,
        days_of_week: parsedData.data.days_of_week,
        location: parsedData.data.location || null,
        max_students: parsedData.data.max_students,
        status: parsedData.data.status,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao cadastrar turma: ${error.message}` };
    }

    revalidatePath('/turmas');
    return { success: true, message: 'Turma cadastrada com sucesso!' };
  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function updateClass(id: string, formData: unknown) {
    const parsedData = classFormSchema.safeParse(formData);

    if (!parsedData.success) {
        return {
        success: false,
        message: 'Dados do formulário inválidos.',
        errors: parsedData.error.flatten().fieldErrors,
        };
    }
    
    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
        .from('classes')
        .update({
            name: parsedData.data.name,
            modality_id: parsedData.data.modality_id,
            instructor_id: parsedData.data.instructor_id,
            start_time: parsedData.data.start_time,
            end_time: parsedData.data.end_time,
            days_of_week: parsedData.data.days_of_week,
            location: parsedData.data.location,
            max_students: parsedData.data.max_students,
            status: parsedData.data.status,
        })
        .eq('id', id);

        if (error) {
        console.error('Supabase Error:', error);
        return { success: false, message: `Erro ao atualizar turma: ${error.message}` };
        }

        revalidatePath('/turmas');
        return { success: true, message: 'Turma atualizada com sucesso!' };

    } catch (error) {
        console.error('Unexpected Error:', error);
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}


export async function deleteClass(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('classes').delete().eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao excluir turma: ${error.message}` };
    }

    revalidatePath('/turmas');
    return { success: true, message: 'Turma excluída com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function getInstructorsForForm(): Promise<{ id: string, name: string }[]> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.from('instructors').select('id, name');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching instructors for form:", error);
        return [];
    }
}

export async function getModalitiesForForm(): Promise<{ id: string, name: string }[]> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.from('modalities').select('id, name');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching modalities for form:", error);
        return [];
    }
}

export async function enrollStudents(formData: unknown) {
  const parsedData = enrollStudentsSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Dados inválidos.' };
  }

  const { class_id, student_ids } = parsedData.data;
  if (student_ids.length === 0) {
    return { success: true, message: 'Nenhum aluno selecionado para matricular.' };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const enrollments = student_ids.map(student_id => ({
      class_id,
      student_id,
    }));

    const { error } = await supabase.from('enrollments').insert(enrollments);

    if (error) {
      if (error.code === '23505') { // unique_violation
        return { success: false, message: 'Um ou mais alunos selecionados já estão matriculados nesta turma.' };
      }
      throw error;
    }
    
    revalidatePath('/turmas');
    return { success: true, message: `${student_ids.length} aluno(s) matriculado(s) com sucesso!` };

  } catch (error: any) {
    console.error('Enrollment Error:', error);
    return { success: false, message: `Erro ao matricular alunos: ${error.message}` };
  }
}

export async function unenrollStudents(class_id: string, student_ids: string[]) {
    if (student_ids.length === 0) {
    return { success: true, message: 'Nenhum aluno selecionado para desmatricular.' };
  }
  
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('class_id', class_id)
        .in('student_id', student_ids);

     if (error) {
      throw error;
    }
    
    revalidatePath('/turmas');
    return { success: true, message: `${student_ids.length} aluno(s) desmatriculado(s) com sucesso!` };
  } catch (error: any) {
    console.error('Unenrollment Error:', error);
    return { success: false, message: `Erro ao desmatricular alunos: ${error.message}` };
  }
}

export async function getEnrollments(): Promise<Enrollment[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('enrollments')
      .select('*');

    if (error) {
      console.error('Supabase Error fetching enrollments:', error);
      throw new Error('Não foi possível buscar as matrículas.');
    }

    return data;
  } catch (error) {
    console.error('Unexpected Error fetching enrollments:', error);
    return [];
  }
}

export async function getEnrolledStudents(classId: string): Promise<Pick<Student, 'id' | 'name'>[]> {
  if (!classId) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('enrollments')
      .select('students (id, name)')
      .eq('class_id', classId);

    if (error) {
      console.error('Error fetching enrolled students:', error);
      return [];
    }

    // A estrutura do retorno é [{ students: { id, name } }, ...]
    // Precisamos extrair o objeto student de cada item.
    return data.map(item => item.students).filter((student): student is Pick<Student, 'id' | 'name'> => student !== null);

  } catch (error) {
    console.error('Unexpected error fetching enrolled students:', error);
    return [];
  }
}
