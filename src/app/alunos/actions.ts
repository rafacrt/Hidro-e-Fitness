
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';
import { validateCPF } from '@/lib/utils';

type Student = Database['public']['Tables']['students']['Row'];

const studentFormSchema = z
  .object({
    name: z.string().min(1, 'O nome é obrigatório.'),
    cpf: z.string().optional().refine((val) => val ? validateCPF(val) : true, { message: "CPF inválido." }),
    birthDate: z.date().optional(),
    email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
    phone: z.string().optional(),
    isWhatsApp: z.boolean().default(false),
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    responsibleName: z.string().optional(),
    responsiblePhone: z.string().optional(),
    medicalObservations: z.string().optional(),
    status: z.enum(['ativo', 'inativo']).default('ativo'),
  })
  .refine(
    (data) => {
      if (data.birthDate) {
        const today = new Date();
        const birthDate = new Date(data.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          return !!data.responsibleName && !!data.responsiblePhone;
        }
      }
      return true;
    },
    {
      message: 'Nome e telefone do responsável são obrigatórios para menores de 18 anos.',
      path: ['responsibleName'],
    }
  );

export async function addStudent(formData: unknown) {
  const parsedData = studentFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const cleanCpf = parsedData.data.cpf?.replace(/\D/g, '') || null;

    const { error } = await supabase
      .from('students')
      .insert([
        {
          name: parsedData.data.name,
          cpf: cleanCpf,
          birth_date: parsedData.data.birthDate?.toISOString(),
          email: parsedData.data.email,
          phone: parsedData.data.phone?.replace(/\D/g, ''),
          is_whatsapp: parsedData.data.isWhatsApp,
          cep: parsedData.data.cep?.replace(/\D/g, ''),
          street: parsedData.data.street,
          number: parsedData.data.number,
          complement: parsedData.data.complement,
          neighborhood: parsedData.data.neighborhood,
          city: parsedData.data.city,
          state: parsedData.data.state,
          responsible_name: parsedData.data.responsibleName,
          responsible_phone: parsedData.data.responsiblePhone?.replace(/\D/g, ''),
          medical_observations: parsedData.data.medicalObservations,
          status: 'ativo',
        },
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      if (error.code === '23505' && error.message.includes('students_cpf_key')) {
        return { success: false, message: 'Já existe um aluno cadastrado com este CPF.' };
      }
      return { success: false, message: `Erro ao cadastrar aluno: ${error.message}` };
    }

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno cadastrado com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function updateStudent(id: string, formData: unknown) {
  const parsedData = studentFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  
  try {
    const supabase = await createSupabaseServerClient();
    const cleanCpf = parsedData.data.cpf?.replace(/\D/g, '') || null;

    const { error } = await supabase
      .from('students')
      .update({
        name: parsedData.data.name,
        cpf: cleanCpf,
        birth_date: parsedData.data.birthDate?.toISOString(),
        email: parsedData.data.email,
        phone: parsedData.data.phone?.replace(/\D/g, ''),
        is_whatsapp: parsedData.data.isWhatsApp,
        cep: parsedData.data.cep?.replace(/\D/g, ''),
        street: parsedData.data.street,
        number: parsedData.data.number,
        complement: parsedData.data.complement,
        neighborhood: parsedData.data.neighborhood,
        city: parsedData.data.city,
        state: parsedData.data.state,
        responsible_name: parsedData.data.responsibleName,
        responsible_phone: parsedData.data.responsiblePhone?.replace(/\D/g, ''),
        medical_observations: parsedData.data.medicalObservations,
        status: parsedData.data.status,
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      if (error.code === '23505' && error.message.includes('students_cpf_key')) {
        return { success: false, message: 'Já existe um aluno cadastrado com este CPF.' };
      }
      return { success: false, message: `Erro ao atualizar aluno: ${error.message}` };
    }

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno atualizado com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function deleteStudent(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('students').delete().eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao excluir aluno: ${error.message}` };
    }

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno excluído com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}


export async function getStudents(): Promise<Student[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar os alunos.');
    }

    return data;
  } catch (error) {
    console.error('Unexpected Error:', error);
    return [];
  }
}

export type HistoryEvent = {
  date: string;
  type: 'enrollment' | 'payment' | 'attendance';
  title: string;
  description: string;
};

export async function getStudentHistory(studentId: string): Promise<HistoryEvent[]> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`created_at, classes ( name )`)
        .eq('student_id', studentId);

    const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select(`created_at, description, status, amount`)
        .eq('student_id', studentId);
        
    const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select(`created_at, status, classes ( name )`)
        .eq('student_id', studentId);

    if (enrollmentsError || paymentsError || attendanceError) {
        console.error({ enrollmentsError, paymentsError, attendanceError });
        throw new Error("Erro ao buscar histórico do aluno.");
    }
    
    const history: HistoryEvent[] = [];

    enrollments.forEach(e => {
        history.push({
            date: e.created_at,
            type: 'enrollment',
            title: `Matrícula realizada`,
            description: `Aluno matriculado na turma "${e.classes?.name}".`,
        });
    });

    payments.forEach(p => {
        history.push({
            date: p.created_at,
            type: 'payment',
            title: p.status === 'pago' ? `Pagamento Realizado` : `Cobrança Gerada`,
            description: `${p.description} - R$ ${p.amount}`,
        });
    });

    attendance.forEach(a => {
        history.push({
            date: a.created_at,
            type: 'attendance',
            title: a.status === 'presente' ? `Presença Registrada` : `Falta Registrada`,
            description: `Status de ${a.status} na turma "${a.classes?.name}".`,
        });
    });
    
    // Adiciona o evento de cadastro do aluno
    const { data: student, error: studentError } = await supabase.from('students').select('created_at').eq('id', studentId).single();
    if (student) {
      history.push({
        date: student.created_at,
        type: 'enrollment',
        title: 'Cadastro Realizado',
        description: 'Aluno cadastrado no sistema.',
      });
    }

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error('Unexpected Error in getStudentHistory:', error);
    return [];
  }
}
