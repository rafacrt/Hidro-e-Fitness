
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';
import { validateCPF } from '@/lib/utils';
import { getPlans } from '../modalidades/actions';

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
    class_id: z.string().optional(), // Para matrícula rápida em turma
    plan_ids: z.array(z.string()).optional(), // Para vincular planos
    payment_method: z.string().optional(), // Para pagamento inicial
    initial_payment_amount: z.string().optional(), // Valor do pagamento inicial (como string R$ 123,45)
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

  const { data: studentData } = parsedData;

  try {
    const supabase = await createSupabaseServerClient();
    const cleanCpf = studentData.cpf?.replace(/\D/g, '') || null;

    // 1. Cadastrar o Aluno
    const { data: newStudent, error } = await supabase
      .from('students')
      .insert([
        {
          name: studentData.name,
          cpf: cleanCpf,
          birth_date: studentData.birthDate?.toISOString(),
          email: studentData.email,
          phone: studentData.phone?.replace(/\D/g, ''),
          is_whatsapp: studentData.isWhatsApp,
          cep: studentData.cep?.replace(/\D/g, ''),
          street: studentData.street,
          number: studentData.number,
          complement: studentData.complement,
          neighborhood: studentData.neighborhood,
          city: studentData.city,
          state: studentData.state,
          responsible_name: studentData.responsibleName,
          responsible_phone: studentData.responsiblePhone?.replace(/\D/g, ''),
          medical_observations: studentData.medicalObservations,
          status: 'ativo',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      if (error.code === '23505' && error.message.includes('students_cpf_key')) {
        return { success: false, message: 'Já existe um aluno cadastrado com este CPF.' };
      }
      return { success: false, message: `Erro ao cadastrar aluno: ${error.message}` };
    }

    let message = 'Aluno cadastrado com sucesso!';
    
    // 2. Matricular em Turma (se selecionado)
    if (studentData.class_id && newStudent) {
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          student_id: newStudent.id,
          class_id: studentData.class_id,
        });

      if (enrollmentError) {
         return { success: false, message: `Aluno cadastrado, mas falha ao matricular na turma: ${enrollmentError.message}` };
      }
      message += ' e matriculado na turma!';
    }

    // 3. Vincular Planos (se selecionado)
    if (studentData.plan_ids && studentData.plan_ids.length > 0 && newStudent) {
      const studentPlans = studentData.plan_ids.map(plan_id => ({
        student_id: newStudent.id,
        plan_id: plan_id,
      }));
      const { error: planError } = await supabase.from('student_plans').insert(studentPlans);

      if (planError) {
        return { success: false, message: `Aluno cadastrado, mas falha ao vincular plano: ${planError.message}` };
      }
      message += ` Vinculado a ${studentData.plan_ids.length} plano(s).`;
    }

    // 4. Registrar Pagamento Inicial (se preenchido)
    if (studentData.initial_payment_amount && studentData.payment_method && newStudent) {
      const amountAsNumber = Number(studentData.initial_payment_amount.replace('R$', '').replace(/\./g, '').replace(',', '.'));
      if (!isNaN(amountAsNumber) && amountAsNumber > 0) {
        const { error: paymentError } = await supabase.from('payments').insert({
          student_id: newStudent.id,
          description: `Pagamento Inicial - Matrícula`,
          amount: amountAsNumber,
          due_date: new Date().toISOString().split('T')[0],
          status: 'pago',
          paid_at: new Date().toISOString(),
          payment_method: studentData.payment_method,
          type: 'receita',
          category: 'Matrículas',
        });

        if (paymentError) {
          return { success: false, message: `Aluno cadastrado, mas falha ao registrar pagamento: ${paymentError.message}` };
        }
        message += ' Pagamento inicial registrado.';
      }
    }

    revalidatePath('/alunos');
    revalidatePath('/turmas');
    revalidatePath('/financeiro');
    return { success: true, message };

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

export async function getStudentPlans(studentId: string): Promise<Array<{ id: string; name: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('student_plans')
    .select('plan_id, plans!inner(id, name)')
    .eq('student_id', studentId);

  if (error) {
    console.error('Error fetching student plans:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  // Retorna os planos completos
  return data
    .map(item => item.plans as { id: string; name: string })
    .filter(plan => plan && plan.id && plan.name);
}

export async function updateStudentPlans(studentId: string, planIds: string[]) {
  const supabase = await createSupabaseServerClient();
  
  // 1. Delete all existing plans for the student
  const { error: deleteError } = await supabase
    .from('student_plans')
    .delete()
    .eq('student_id', studentId);

  if (deleteError) {
    console.error('Error deleting student plans:', deleteError);
    return { success: false, message: 'Falha ao remover planos antigos.' };
  }

  // 2. Insert new plans if any are provided
  if (planIds.length > 0) {
    const newPlans = planIds.map(plan_id => ({
      student_id: studentId,
      plan_id: plan_id,
    }));
    
    const { error: insertError } = await supabase
      .from('student_plans')
      .insert(newPlans);

    if (insertError) {
      console.error('Error inserting new student plans:', insertError);
      return { success: false, message: 'Falha ao adicionar novos planos.' };
    }
  }

  revalidatePath('/alunos');
  return { success: true, message: 'Planos do aluno atualizados com sucesso!' };
}
    

    