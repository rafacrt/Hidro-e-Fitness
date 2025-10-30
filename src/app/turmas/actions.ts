
'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
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
    const client = getGraphQLServerClient();
    const query = `
      query GetClasses {
        classes(order_by: { created_at: desc }) {
          id
          name
          modality_id
          instructor_id
          start_time
          end_time
          days_of_week
          location
          max_students
          status
          created_at
        }
      }
    `;
    const data = await client.request(query);
    return data.classes as any[];
  } catch (error) {
    console.error('GraphQL Error:', error);
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
    const client = getGraphQLServerClient();
    const mutation = `
      mutation InsertClass($object: classes_insert_input!) {
        insert_classes_one(object: $object) { id }
      }
    `;
    await client.request(mutation, {
      object: {
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
    });

    revalidatePath('/turmas');
    return { success: true, message: 'Turma cadastrada com sucesso!' };
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    const msg = error?.message || 'Falha ao cadastrar turma';
    return { success: false, message: `Erro ao cadastrar turma: ${msg}` };
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
    const client = getGraphQLServerClient();
    const mutation = `
      mutation UpdateClass($id: uuid!, $changes: classes_set_input!) {
        update_classes_by_pk(pk_columns: { id: $id }, _set: $changes) { id }
      }
    `;
    await client.request(mutation, {
      id,
      changes: {
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
    });

    revalidatePath('/turmas');
    return { success: true, message: 'Turma atualizada com sucesso!' };

  } catch (error: any) {
    console.error('GraphQL Error:', error);
    const msg = error?.message || 'Falha ao atualizar turma';
    return { success: false, message: `Erro ao atualizar turma: ${msg}` };
  }
}


export async function deleteClass(id: string) {
  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation DeleteClass($id: uuid!) {
        delete_classes_by_pk(id: $id) { id }
      }
    `;
    await client.request(mutation, { id });

    revalidatePath('/turmas');
    return { success: true, message: 'Turma excluída com sucesso!' };

  } catch (error: any) {
    console.error('GraphQL Error:', error);
    const msg = error?.message || 'Falha ao excluir turma';
    return { success: false, message: `Erro ao excluir turma: ${msg}` };
  }
}

export async function getInstructorsForForm(): Promise<{ id: string, name: string }[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetInstructors {
        instructors { id, name }
      }
    `;
    const data = await client.request(query);
    return data.instructors as { id: string; name: string }[];
  } catch (error) {
    console.error('GraphQL Error fetching instructors for form:', error);
    return [];
  }
}

export async function getModalitiesForForm(): Promise<{ id: string, name: string }[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetModalities {
        modalities { id, name }
      }
    `;
    const data = await client.request(query);
    return data.modalities as { id: string; name: string }[];
  } catch (error) {
    console.error('GraphQL Error fetching modalities for form:', error);
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
    const client = getGraphQLServerClient();
    const enrollments = student_ids.map(student_id => ({ class_id, student_id }));
    const mutation = `
      mutation EnrollStudents($objects: [enrollments_insert_input!]!) {
        insert_enrollments(objects: $objects) { affected_rows }
      }
    `;
    await client.request(mutation, { objects: enrollments });
    
    revalidatePath('/turmas');
    return { success: true, message: `${student_ids.length} aluno(s) matriculado(s) com sucesso!` };

  } catch (error: any) {
    const msg = error?.message || '';
    if (msg.includes('enrollments') && msg.toLowerCase().includes('unique')) {
      return { success: false, message: 'Um ou mais alunos selecionados já estão matriculados nesta turma.' };
    }
    console.error('Enrollment Error:', error);
    return { success: false, message: `Erro ao matricular alunos: ${msg || 'Falha na requisição GraphQL'}` };
  }
}

export async function unenrollStudents(class_id: string, student_ids: string[]) {
  if (student_ids.length === 0) {
    return { success: true, message: 'Nenhum aluno selecionado para desmatricular.' };
  }
  
  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation Unenroll($classId: uuid!, $studentIds: [uuid!]!) {
        delete_enrollments(where: { class_id: { _eq: $classId }, student_id: { _in: $studentIds } }) { affected_rows }
      }
    `;
    await client.request(mutation, { classId: class_id, studentIds: student_ids });
    
    revalidatePath('/turmas');
    return { success: true, message: `${student_ids.length} aluno(s) desmatriculado(s) com sucesso!` };
  } catch (error: any) {
    console.error('Unenrollment Error:', error);
    const msg = error?.message || 'Falha na requisição GraphQL';
    return { success: false, message: `Erro ao desmatricular alunos: ${msg}` };
  }
}

export async function getEnrollments(): Promise<Enrollment[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetEnrollments {
        enrollments { id, student_id, class_id, created_at }
      }
    `;
    const data = await client.request(query);
    return data.enrollments as Enrollment[];
  } catch (error) {
    console.error('GraphQL Error fetching enrollments:', error);
    return [];
  }
}

export async function getEnrolledStudents(classId: string): Promise<Pick<Student, 'id' | 'name'>[]> {
  if (!classId) return [];
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetEnrolledStudents($classId: uuid!) {
        enrollments(where: { class_id: { _eq: $classId } }) {
          students { id, name }
        }
      }
    `;
    const data = await client.request(query, { classId });
    return (data.enrollments || [])
      .map((item: any) => item.students as { id: string; name: string } | null)
      .filter((student: any) => student !== null) as Pick<Student, 'id' | 'name'>[];
  } catch (error) {
    console.error('Unexpected error fetching enrolled students:', error);
    return [];
  }
}
